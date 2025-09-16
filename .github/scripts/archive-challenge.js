#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

class ChallengeArchiver {
  constructor(options) {
    this.challengeDataPath = options.challengeData;
    this.issueUrl = options.issueUrl;
    this.issueNumber = options.issueNumber;
    this.archiveDir = 'archive';
    this.statsDir = 'stats';
  }

  async ensureDirectories() {
    await fs.mkdir(this.archiveDir, { recursive: true });
    await fs.mkdir(this.statsDir, { recursive: true });
  }

  async loadChallengeData() {
    try {
      const data = await fs.readFile(this.challengeDataPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Failed to load challenge data: ${error.message}`);
      process.exit(1);
    }
  }

  async archiveChallenge(challengeData) {
    const date = challengeData.date;
    const challengeArchiveDir = path.join(this.archiveDir, date);
    
    await fs.mkdir(challengeArchiveDir, { recursive: true });

    // Create archive metadata
    const archiveMetadata = {
      id: challengeData.id,
      date: challengeData.date,
      timestamp: challengeData.timestamp,
      challenge: challengeData.challenge,
      issue: {
        url: this.issueUrl,
        number: this.issueNumber
      },
      archived_at: new Date().toISOString()
    };

    // Save archive files
    const archiveFiles = [
      { name: 'metadata.json', content: JSON.stringify(archiveMetadata, null, 2) },
      { name: 'challenge.md', content: this.generateMarkdownSummary(challengeData) },
      { name: 'issue-url.txt', content: this.issueUrl || '' }
    ];

    await Promise.all(
      archiveFiles.map(file => 
        fs.writeFile(path.join(challengeArchiveDir, file.name), file.content, 'utf8')
      )
    );

    console.log(`📁 Archived challenge to: ${challengeArchiveDir}`);
    return challengeArchiveDir;
  }

  generateMarkdownSummary(challengeData) {
    const challenge = challengeData.challenge;
    
    return [
      `# ${challenge.title}`,
      '',
      `**Date:** ${challengeData.date}`,
      `**Challenge ID:** ${challengeData.id}`,
      `**Difficulty:** ${challenge.difficulty}`,
      `**Category:** ${challenge.category}`,
      `**Issue:** [#${this.issueNumber}](${this.issueUrl})`,
      '',
      '## Description',
      '',
      challenge.description,
      '',
      '## Example',
      '',
      challenge.example || 'No example provided',
      '',
      ...(challenge.hints && challenge.hints.length > 0 ? [
        '## Hints',
        '',
        ...challenge.hints.map(hint => `- ${hint}`),
        ''
      ] : []),
      '## Solution Templates',
      '',
      'See the GitHub issue for language-specific solution templates.',
      '',
      '---',
      '',
      `*Archived on ${new Date().toISOString()}*`
    ].join('\n');
  }

  async updateChallengeIndex() {
    const indexPath = path.join(this.archiveDir, 'index.json');
    
    let index = { challenges: [], last_updated: null };
    
    try {
      const existingIndex = await fs.readFile(indexPath, 'utf8');
      index = JSON.parse(existingIndex);
    } catch (error) {
      // Index doesn't exist yet, which is fine
    }

    const challengeData = await this.loadChallengeData();
    
    // Add new challenge to index
    const indexEntry = {
      id: challengeData.id,
      date: challengeData.date,
      title: challengeData.challenge.title,
      difficulty: challengeData.challenge.difficulty,
      category: challengeData.challenge.category,
      issue_url: this.issueUrl,
      issue_number: this.issueNumber
    };

    // Remove any existing entry with the same ID (shouldn't happen, but just in case)
    index.challenges = index.challenges.filter(c => c.id !== challengeData.id);
    
    // Add new entry and sort by date (newest first)
    index.challenges.push(indexEntry);
    index.challenges.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    index.last_updated = new Date().toISOString();

    await fs.writeFile(indexPath, JSON.stringify(index, null, 2), 'utf8');
    console.log(`📋 Updated challenge index: ${index.challenges.length} total challenges`);
  }

  async updateStatistics() {
    const statsPath = path.join(this.statsDir, 'challenge-stats.json');
    
    let stats = {
      total_challenges: 0,
      challenges_by_difficulty: { easy: 0, medium: 0, hard: 0 },
      challenges_by_category: {},
      last_challenge_date: null,
      last_updated: null
    };

    try {
      const existingStats = await fs.readFile(statsPath, 'utf8');
      stats = JSON.parse(existingStats);
    } catch (error) {
      // Stats don't exist yet, which is fine
    }

    const challengeData = await this.loadChallengeData();
    const challenge = challengeData.challenge;

    // Update statistics
    stats.total_challenges += 1;
    stats.challenges_by_difficulty[challenge.difficulty] += 1;
    
    if (!stats.challenges_by_category[challenge.category]) {
      stats.challenges_by_category[challenge.category] = 0;
    }
    stats.challenges_by_category[challenge.category] += 1;
    
    stats.last_challenge_date = challengeData.date;
    stats.last_updated = new Date().toISOString();

    await fs.writeFile(statsPath, JSON.stringify(stats, null, 2), 'utf8');
    console.log(`📊 Updated statistics: ${stats.total_challenges} total challenges`);

    // Generate human-readable stats summary
    const summaryPath = path.join(this.statsDir, 'summary.md');
    const summary = this.generateStatsSummary(stats);
    await fs.writeFile(summaryPath, summary, 'utf8');
  }

  generateStatsSummary(stats) {
    const difficultyEntries = Object.entries(stats.challenges_by_difficulty)
      .map(([difficulty, count]) => `- ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}: ${count}`)
      .join('\n');

    const categoryEntries = Object.entries(stats.challenges_by_category)
      .sort(([,a], [,b]) => b - a) // Sort by count descending
      .map(([category, count]) => `- ${category}: ${count}`)
      .join('\n');

    return [
      '# Challenge Statistics',
      '',
      `**Total Challenges:** ${stats.total_challenges}`,
      `**Last Challenge:** ${stats.last_challenge_date}`,
      `**Last Updated:** ${new Date(stats.last_updated).toLocaleDateString()}`,
      '',
      '## By Difficulty',
      '',
      difficultyEntries,
      '',
      '## By Category',
      '',
      categoryEntries,
      '',
      '---',
      '',
      '*This file is automatically generated and updated with each new challenge.*'
    ].join('\n');
  }

  async run() {
    console.log('📦 Archiving challenge...');
    
    await this.ensureDirectories();
    
    const challengeData = await this.loadChallengeData();
    
    await Promise.all([
      this.archiveChallenge(challengeData),
      this.updateChallengeIndex(),
      this.updateStatistics()
    ]);

    console.log('✅ Challenge archiving completed');
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const options = {};

args.forEach(arg => {
  if (arg.startsWith('--challenge-data=')) {
    options.challengeData = arg.split('=')[1];
  } else if (arg.startsWith('--issue-url=')) {
    options.issueUrl = arg.split('=')[1];
  } else if (arg.startsWith('--issue-number=')) {
    options.issueNumber = arg.split('=')[1];
  }
});

if (!options.challengeData) {
  console.error('Usage: node archive-challenge.js --challenge-data=<path> [--issue-url=<url>] [--issue-number=<number>]');
  process.exit(1);
}

// Run the archiver
const archiver = new ChallengeArchiver(options);
archiver.run().catch(error => {
  console.error('❌ Challenge archiving failed:', error.message);
  process.exit(1);
});
