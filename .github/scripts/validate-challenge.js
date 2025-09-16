#!/usr/bin/env node

const fs = require('fs').promises;

class ChallengeValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  addError(message) {
    this.errors.push(message);
    console.error(`❌ ERROR: ${message}`);
  }

  addWarning(message) {
    this.warnings.push(message);
    console.warn(`⚠️  WARNING: ${message}`);
  }

  validateChallengeData(data) {
    // Validate required fields
    if (!data.id) this.addError('Challenge ID is required');
    if (!data.date) this.addError('Challenge date is required');
    if (!data.challenge) this.addError('Challenge object is required');

    if (data.challenge) {
      this.validateChallenge(data.challenge);
    }

    // Validate date format
    if (data.date && !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
      this.addError('Date must be in YYYY-MM-DD format');
    }

    // Validate ID format
    if (data.id && !/^challenge-\d{4}-\d{2}-\d{2}-[a-f0-9]{8}$/.test(data.id)) {
      this.addError('Challenge ID must follow format: challenge-YYYY-MM-DD-{8-char-hash}');
    }
  }

  validateChallenge(challenge) {
    const requiredFields = ['title', 'description', 'difficulty', 'category'];
    
    requiredFields.forEach(field => {
      if (!challenge[field]) {
        this.addError(`Challenge.${field} is required`);
      }
    });

    // Validate difficulty
    const validDifficulties = ['easy', 'medium', 'hard'];
    if (challenge.difficulty && !validDifficulties.includes(challenge.difficulty)) {
      this.addError(`Challenge difficulty must be one of: ${validDifficulties.join(', ')}`);
    }

    // Validate category
    const validCategories = ['arrays', 'strings', 'algorithms', 'data-structures', 'math', 'recursion', 'sorting'];
    if (challenge.category && !validCategories.includes(challenge.category)) {
      this.addWarning(`Challenge category '${challenge.category}' is not in recommended list: ${validCategories.join(', ')}`);
    }

    // Validate content length
    if (challenge.title && challenge.title.length > 100) {
      this.addWarning('Challenge title is quite long (>100 characters)');
    }

    if (challenge.description && challenge.description.length < 50) {
      this.addWarning('Challenge description is quite short (<50 characters)');
    }

    if (challenge.description && challenge.description.length > 500) {
      this.addWarning('Challenge description is quite long (>500 characters)');
    }

    // Validate example
    if (!challenge.example) {
      this.addWarning('Challenge should include an example');
    }

    // Validate hints
    if (challenge.hints && !Array.isArray(challenge.hints)) {
      this.addError('Challenge hints must be an array');
    }

    if (challenge.hints && challenge.hints.length > 5) {
      this.addWarning('Too many hints provided (>5), consider reducing for better challenge');
    }
  }

  async validateGeneratedFiles(basePath) {
    const requiredFiles = [
      'issue-body.md',
      'issue-title.txt',
      'issue-labels.txt',
      'email-body.html',
      'email-subject.txt',
      'discord-message.txt'
    ];

    for (const file of requiredFiles) {
      try {
        const content = await fs.readFile(`${basePath}/${file}`, 'utf8');
        
        if (!content.trim()) {
          this.addError(`Generated file ${file} is empty`);
        }

        // File-specific validations
        if (file === 'issue-body.md') {
          this.validateIssueBody(content);
        } else if (file === 'email-body.html') {
          this.validateEmailBody(content);
        }
        
      } catch (error) {
        this.addError(`Required file ${file} was not generated`);
      }
    }
  }

  validateIssueBody(content) {
    const requiredSections = [
      '# 🧠 Daily Programming Challenge',
      '## Challenge:',
      '## 📋 Instructions',
      '## 🏆 Submission Guidelines'
    ];

    requiredSections.forEach(section => {
      if (!content.includes(section)) {
        this.addError(`Issue body missing required section: ${section}`);
      }
    });

    // Check for template variables that weren't replaced
    const unreplacedVars = content.match(/\{\{[^}]+\}\}/g);
    if (unreplacedVars) {
      this.addError(`Issue body contains unreplaced template variables: ${unreplacedVars.join(', ')}`);
    }
  }

  validateEmailBody(content) {
    // Basic HTML validation
    if (!content.includes('<html>') && !content.includes('<h')) {
      this.addWarning('Email body might not be valid HTML');
    }

    // Check for template variables that weren't replaced
    const unreplacedVars = content.match(/\{\{[^}]+\}\}/g);
    if (unreplacedVars) {
      this.addError(`Email body contains unreplaced template variables: ${unreplacedVars.join(', ')}`);
    }
  }

  async run(challengeDataPath) {
    console.log('🔍 Validating challenge data...');

    try {
      // Load and validate challenge data
      const data = await fs.readFile(challengeDataPath, 'utf8');
      const challengeData = JSON.parse(data);
      
      this.validateChallengeData(challengeData);

      // Validate generated files
      const basePath = challengeDataPath.replace('/challenge-data.json', '');
      await this.validateGeneratedFiles(basePath);

      // Report results
      if (this.errors.length === 0 && this.warnings.length === 0) {
        console.log('✅ All validations passed!');
        return;
      }

      if (this.warnings.length > 0) {
        console.log(`\n⚠️  Found ${this.warnings.length} warning(s):`);
        this.warnings.forEach(warning => console.log(`   ${warning}`));
      }

      if (this.errors.length > 0) {
        console.log(`\n❌ Found ${this.errors.length} error(s):`);
        this.errors.forEach(error => console.log(`   ${error}`));
        process.exit(1);
      }

      if (this.warnings.length > 0) {
        console.log('\n✅ Validation completed with warnings');
      }

    } catch (error) {
      console.error(`❌ Validation failed: ${error.message}`);
      process.exit(1);
    }
  }
}

// Get challenge data path from command line
const challengeDataPath = process.argv[2];

if (!challengeDataPath) {
  console.error('Usage: node validate-challenge.js <challenge-data.json>');
  process.exit(1);
}

// Run validation
const validator = new ChallengeValidator();
validator.run(challengeDataPath);
