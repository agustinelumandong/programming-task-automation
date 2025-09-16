#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { createHash } = require('crypto');

class ChallengeGenerator {
  constructor(config) {
    this.config = config;
    this.outputDir = config.outputDir || './generated';
  }

  async loadChallenges(configPath) {
    try {
      const data = await fs.readFile(configPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Failed to load challenges from ${configPath}:`, error.message);
      process.exit(1);
    }
  }

  async loadTemplate(templatePath, templateName) {
    try {
      const fullPath = path.join(templatePath, `${templateName}.md`);
      return await fs.readFile(fullPath, 'utf8');
    } catch (error) {
      console.error(`Failed to load template ${templateName}:`, error.message);
      process.exit(1);
    }
  }

  selectChallenge(challenges, challengeId) {
    if (challengeId) {
      const challenge = challenges.find(c => c.id === challengeId);
      if (!challenge) {
        console.error(`Challenge with ID ${challengeId} not found`);
        process.exit(1);
      }
      return challenge;
    }

    // Select random challenge weighted by difficulty and last used date
    const now = new Date();
    const weights = challenges.map(challenge => {
      const daysSinceLastUsed = challenge.lastUsed 
        ? Math.floor((now - new Date(challenge.lastUsed)) / (1000 * 60 * 60 * 24))
        : 365; // If never used, treat as 365 days ago
      
      // Higher weight for challenges not used recently
      const timeWeight = Math.min(daysSinceLastUsed / 30, 5); // Max weight of 5
      const difficultyWeight = challenge.difficulty === 'easy' ? 1.5 : 
                              challenge.difficulty === 'medium' ? 1.2 : 1.0;
      
      return timeWeight * difficultyWeight;
    });

    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < challenges.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return challenges[i];
      }
    }
    
    return challenges[0]; // Fallback
  }

  generateChallengeId(challenge, date) {
    const dateStr = date.toISOString().split('T')[0];
    const hash = createHash('md5').update(challenge.title + dateStr).digest('hex').substring(0, 8);
    return `challenge-${dateStr}-${hash}`;
  }

  async generateIssueContent(challenge, challengeData, templatesPath) {
    const issueTemplate = await this.loadTemplate(templatesPath, 'issue-body');
    
    // Replace template variables
    const issueBody = issueTemplate
      .replace(/\{\{challenge\.title\}\}/g, challenge.title)
      .replace(/\{\{challenge\.description\}\}/g, challenge.description)
      .replace(/\{\{challenge\.example\}\}/g, challenge.example)
      .replace(/\{\{challenge\.difficulty\}\}/g, challenge.difficulty)
      .replace(/\{\{challenge\.category\}\}/g, challenge.category)
      .replace(/\{\{challenge\.hints\}\}/g, challenge.hints?.join('\n') || '')
      .replace(/\{\{challengeData\.id\}\}/g, challengeData.id)
      .replace(/\{\{challengeData\.date\}\}/g, challengeData.date)
      .replace(/\{\{challengeData\.solutionTemplates\}\}/g, this.generateSolutionTemplates(challenge));

    const issueTitle = `🧠 Daily Challenge (${challengeData.date}): ${challenge.title}`;
    const issueLabels = [
      'daily-challenge',
      'programming',
      challenge.difficulty,
      challenge.category,
      challengeData.date
    ].join('\n');

    return { issueBody, issueTitle, issueLabels };
  }

  generateSolutionTemplates(challenge) {
    const languages = ['python', 'javascript', 'java', 'cpp'];
    const templates = {
      python: `def solve_challenge():\n    """\n    ${challenge.description}\n    \n    Example: ${challenge.example}\n    """\n    # Your implementation here\n    pass`,
      javascript: `function solveChallenge() {\n    /**\n     * ${challenge.description}\n     * \n     * Example: ${challenge.example}\n     */\n    // Your implementation here\n}`,
      java: `public class Solution {\n    /**\n     * ${challenge.description}\n     * \n     * Example: ${challenge.example}\n     */\n    public static void solveChallenge() {\n        // Your implementation here\n    }\n}`,
      cpp: `#include <iostream>\nusing namespace std;\n\n/**\n * ${challenge.description}\n * \n * Example: ${challenge.example}\n */\nvoid solveChallenge() {\n    // Your implementation here\n}`
    };

    return languages.map(lang => {
      return `### ${lang.charAt(0).toUpperCase() + lang.slice(1)} Solution\n\`\`\`${lang}\n${templates[lang]}\n\`\`\``;
    }).join('\n\n');
  }

  async generateEmailContent(challenge, challengeData, templatesPath, issueUrl) {
    const emailTemplate = await this.loadTemplate(templatesPath, 'email-body');
    
    const emailBody = emailTemplate
      .replace(/\{\{challenge\.title\}\}/g, challenge.title)
      .replace(/\{\{challenge\.description\}\}/g, challenge.description)
      .replace(/\{\{challenge\.example\}\}/g, challenge.example)
      .replace(/\{\{challengeData\.date\}\}/g, challengeData.date)
      .replace(/\{\{issueUrl\}\}/g, issueUrl || '#');

    const emailSubject = `🧠 Daily Programming Challenge - ${challenge.title}`;

    return { emailBody, emailSubject };
  }

  async generateDiscordContent(challenge, challengeData, issueUrl) {
    return [
      '🧠 **New Daily Programming Challenge!**',
      `**${challenge.title}**`,
      '',
      challenge.description,
      '',
      `**Difficulty:** ${challenge.difficulty}`,
      `**Category:** ${challenge.category}`,
      '',
      `🔗 Solve it here: ${issueUrl || '#'}`
    ].join('\n');
  }

  async ensureOutputDir() {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
    } catch (error) {
      console.error(`Failed to create output directory: ${error.message}`);
      process.exit(1);
    }
  }

  async saveOutput(filename, content) {
    const filepath = path.join(this.outputDir, filename);
    try {
      await fs.writeFile(filepath, content, 'utf8');
      console.log(`✅ Generated: ${filename}`);
    } catch (error) {
      console.error(`❌ Failed to save ${filename}: ${error.message}`);
      process.exit(1);
    }
  }

  async run() {
    await this.ensureOutputDir();
    
    const challenges = await this.loadChallenges(this.config.challengesPath);
    const selectedChallenge = this.selectChallenge(challenges.challenges, this.config.challengeId);
    
    const date = new Date();
    const challengeData = {
      id: this.generateChallengeId(selectedChallenge, date),
      date: date.toISOString().split('T')[0],
      timestamp: date.toISOString(),
      challenge: selectedChallenge
    };

    // Generate all content
    const { issueBody, issueTitle, issueLabels } = await this.generateIssueContent(
      selectedChallenge, challengeData, this.config.templatesPath
    );

    const { emailBody, emailSubject } = await this.generateEmailContent(
      selectedChallenge, challengeData, this.config.templatesPath
    );

    const discordMessage = await this.generateDiscordContent(selectedChallenge, challengeData);

    // Save all generated content
    await Promise.all([
      this.saveOutput('challenge-data.json', JSON.stringify(challengeData, null, 2)),
      this.saveOutput('issue-body.md', issueBody),
      this.saveOutput('issue-title.txt', issueTitle),
      this.saveOutput('issue-labels.txt', issueLabels),
      this.saveOutput('email-body.html', emailBody),
      this.saveOutput('email-subject.txt', emailSubject),
      this.saveOutput('discord-message.txt', discordMessage)
    ]);

    // Output GitHub Actions outputs
    if (process.env.GITHUB_OUTPUT) {
      const outputs = [
        `challenge-data=${JSON.stringify(challengeData)}`,
        `challenge-id=${challengeData.id}`,
        `challenge-date=${challengeData.date}`,
        `issue-body=${this.outputDir}/issue-body.md`
      ];
      
      await fs.appendFile(process.env.GITHUB_OUTPUT, outputs.join('\n') + '\n');
    }

    console.log(`🎯 Generated challenge: ${selectedChallenge.title} (${challengeData.id})`);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const config = {};

args.forEach(arg => {
  if (arg.startsWith('--config=')) {
    config.challengesPath = arg.split('=')[1];
  } else if (arg.startsWith('--templates=')) {
    config.templatesPath = arg.split('=')[1];
  } else if (arg.startsWith('--challenge-id=')) {
    config.challengeId = arg.split('=')[1];
  } else if (arg.startsWith('--output-dir=')) {
    config.outputDir = arg.split('=')[1];
  }
});

// Validate required arguments
if (!config.challengesPath || !config.templatesPath) {
  console.error('Usage: node generate-challenge.js --config=<path> --templates=<path> [--challenge-id=<id>] [--output-dir=<path>]');
  process.exit(1);
}

// Run the generator
const generator = new ChallengeGenerator(config);
generator.run().catch(error => {
  console.error('❌ Challenge generation failed:', error.message);
  process.exit(1);
});
