#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

class RepositoryUpdater {
  constructor(options) {
    this.challengeDataPath = options.challengeData;
    this.issueUrl = options.issueUrl;
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

  async updateReadme(challengeData) {
    const readmePath = 'README.md';
    
    try {
      let readme = await fs.readFile(readmePath, 'utf8');
      
      // Update latest challenge section
      const latestChallengePattern = /Latest Challenge:.*$/m;
      const newLatestChallenge = `Latest Challenge: [${challengeData.challenge.title}](${this.issueUrl})`;
      
      if (latestChallengePattern.test(readme)) {
        readme = readme.replace(latestChallengePattern, newLatestChallenge);
      } else {
        // Add latest challenge section if it doesn't exist
        const latestChallengeSection = [
          '',
          '## 🧠 Latest Challenge',
          '',
          newLatestChallenge,
          ''
        ].join('\n');
        
        // Try to insert after the main heading
        const headingPattern = /(# [^\n]+\n)/;
        if (headingPattern.test(readme)) {
          readme = readme.replace(headingPattern, `$1${latestChallengeSection}`);
        } else {
          readme = latestChallengeSection + readme;
        }
      }

      // Update challenge count if statistics exist
      try {
        const statsData = await fs.readFile('stats/challenge-stats.json', 'utf8');
        const stats = JSON.parse(statsData);
        
        const countPattern = /Total Challenges?:?\s*\*?\*?\s*\d+/i;
        const newCount = `**Total Challenges:** ${stats.total_challenges}`;
        
        if (countPattern.test(readme)) {
          readme = readme.replace(countPattern, newCount);
        } else {
          // Add total challenges after latest challenge
          readme = readme.replace(
            newLatestChallenge,
            `${newLatestChallenge}\n${newCount}`
          );
        }
      } catch (error) {
        // Stats file doesn't exist yet, skip count update
      }

      await fs.writeFile(readmePath, readme, 'utf8');
      console.log('📝 Updated README.md');
      
    } catch (error) {
      console.warn(`⚠️  Could not update README.md: ${error.message}`);
    }
  }

  async updateChallengesList() {
    const challengesListPath = 'CHALLENGES.md';
    
    try {
      let challengesList = '';
      
      try {
        challengesList = await fs.readFile(challengesListPath, 'utf8');
      } catch (error) {
        // File doesn't exist, create it
        challengesList = [
          '# Daily Programming Challenges',
          '',
          'This is an automatically maintained list of all daily programming challenges.',
          '',
          '## Challenges',
          '',
          '| Date | Challenge | Difficulty | Category | Issue |',
          '|------|-----------|------------|----------|-------|',
          ''
        ].join('\n');
      }

      const challengeData = await this.loadChallengeData();
      const challenge = challengeData.challenge;
      
      // Create new row
      const newRow = `| ${challengeData.date} | [${challenge.title}](${this.issueUrl}) | ${challenge.difficulty} | ${challenge.category} | [#${this.issueUrl.split('/').pop()}](${this.issueUrl}) |`;
      
      // Insert new row after the header (assumes table format)
      const tableHeaderPattern = /(\| Date \| Challenge \| Difficulty \| Category \| Issue \|\n\|[^|]*\|[^|]*\|[^|]*\|[^|]*\|[^|]*\|\n)/;
      
      if (tableHeaderPattern.test(challengesList)) {
        challengesList = challengesList.replace(tableHeaderPattern, `$1${newRow}\n`);
      } else {
        // Fallback: append to end
        challengesList += `\n${newRow}`;
      }

      await fs.writeFile(challengesListPath, challengesList, 'utf8');
      console.log('📋 Updated CHALLENGES.md');
      
    } catch (error) {
      console.warn(`⚠️  Could not update CHALLENGES.md: ${error.message}`);
    }
  }

  async updatePackageJson() {
    const packageJsonPath = 'package.json';
    
    try {
      const packageData = await fs.readFile(packageJsonPath, 'utf8');
      const packageJson = JSON.parse(packageData);
      
      // Update last challenge info in package.json if it has a challenges section
      if (!packageJson.challenges) {
        packageJson.challenges = {};
      }
      
      const challengeData = await this.loadChallengeData();
      
      packageJson.challenges.lastChallenge = {
        id: challengeData.id,
        date: challengeData.date,
        title: challengeData.challenge.title,
        issueUrl: this.issueUrl
      };
      
      packageJson.challenges.lastUpdated = new Date().toISOString();
      
      await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf8');
      console.log('📦 Updated package.json');
      
    } catch (error) {
      console.warn(`⚠️  Could not update package.json: ${error.message}`);
    }
  }

  async generateSitemap() {
    const sitemapPath = 'sitemap.txt';
    
    try {
      // Load the challenge index
      const indexData = await fs.readFile('archive/index.json', 'utf8');
      const index = JSON.parse(indexData);
      
      // Generate sitemap with all challenge URLs
      const baseUrl = process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY 
        ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}`
        : 'https://github.com/your-repo';
      
      const urls = [
        baseUrl,
        `${baseUrl}/blob/main/README.md`,
        `${baseUrl}/blob/main/CHALLENGES.md`,
        ...index.challenges.map(challenge => challenge.issue_url)
      ];
      
      await fs.writeFile(sitemapPath, urls.join('\n') + '\n', 'utf8');
      console.log('🗺️  Generated sitemap.txt');
      
    } catch (error) {
      console.warn(`⚠️  Could not generate sitemap: ${error.message}`);
    }
  }

  async updateLastUsedDates() {
    // Update the challenges.json file to mark the used challenge
    try {
      const challengesPath = '.github/config/challenges.json';
      const challengesData = await fs.readFile(challengesPath, 'utf8');
      const challenges = JSON.parse(challengesData);
      
      const challengeData = await this.loadChallengeData();
      const usedChallengeTitle = challengeData.challenge.title;
      
      // Find and update the used challenge
      const challengeIndex = challenges.challenges.findIndex(c => c.title === usedChallengeTitle);
      if (challengeIndex !== -1) {
        challenges.challenges[challengeIndex].lastUsed = new Date().toISOString();
        
        await fs.writeFile(challengesPath, JSON.stringify(challenges, null, 2), 'utf8');
        console.log('📅 Updated last used date for challenge');
      }
      
    } catch (error) {
      console.warn(`⚠️  Could not update last used dates: ${error.message}`);
    }
  }

  async run() {
    console.log('🔄 Updating repository files...');
    
    const challengeData = await this.loadChallengeData();
    
    // Run all updates in parallel where possible
    await Promise.all([
      this.updateReadme(challengeData),
      this.updateChallengesList(),
      this.updatePackageJson(),
      this.updateLastUsedDates()
    ]);

    // Generate sitemap (depends on archive being updated first)
    await this.generateSitemap();

    console.log('✅ Repository update completed');
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
  }
});

if (!options.challengeData || !options.issueUrl) {
  console.error('Usage: node update-repository.js --challenge-data=<path> --issue-url=<url>');
  process.exit(1);
}

// Run the updater
const updater = new RepositoryUpdater(options);
updater.run().catch(error => {
  console.error('❌ Repository update failed:', error.message);
  process.exit(1);
});
