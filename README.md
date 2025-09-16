# 🧠 Daily Programming Challenge Automation

An automated system that creates daily programming challenges using GitHub Actions, complete with issue creation, email notifications, and challenge archiving.

## 🚀 Features

- **Automated Daily Challenges**: Generates and posts programming challenges every day at 9 AM UTC
- **Smart Challenge Selection**: Uses weighted randomization to avoid recently used challenges
- **Multi-Platform Notifications**: Email and Discord notifications for subscribers
- **Comprehensive Archiving**: Maintains a complete history of all challenges
- **GitHub Integration**: Creates formatted issues for community discussion
- **Template System**: Customizable templates for issues, emails, and notifications
- **Statistics Tracking**: Automatic tracking of challenge statistics and trends
- **Dry Run Support**: Test the system without creating actual issues

## 🧠 Latest Challenge

Latest Challenge: [Check back daily for new challenges!](#)

**Total Challenges:** 0

## 📋 How It Works

1. **Daily Trigger**: GitHub Actions runs every day at 9 AM UTC
2. **Challenge Selection**: Smart algorithm selects a challenge based on difficulty and usage history
3. **Content Generation**: Creates formatted content using customizable templates
4. **Issue Creation**: Posts the challenge as a GitHub issue with proper formatting
5. **Notifications**: Sends email and Discord notifications to subscribers
6. **Archiving**: Saves challenge data and updates repository statistics

## 🛠️ Setup Instructions

### 1. Repository Setup

1. Fork this repository
2. Enable GitHub Actions in your repository settings
3. Set up the required secrets (see below)

### 2. Required Secrets

Add these secrets in your repository settings (`Settings > Secrets and variables > Actions`):

```yaml
# Email Configuration (Required for email notifications)
EMAIL_USERNAME: your-email@gmail.com
EMAIL_PASSWORD: your-app-password  # Use App Password for Gmail
EMAIL_FROM: "Daily Challenge Bot <your-email@gmail.com>"
EMAIL_SUBSCRIBERS: "subscriber1@email.com,subscriber2@email.com"

# Optional: Discord Integration
DISCORD_WEBHOOK_URL: https://discord.com/api/webhooks/your-webhook-url
```

### 3. Optional Variables

Configure these in repository variables for customization:

```yaml
EMAIL_SERVER_ADDRESS: smtp.gmail.com  # Default
EMAIL_SERVER_PORT: 587                # Default
```

### 4. Customization

- **Add Challenges**: Edit `.github/config/challenges.json` to add new programming challenges
- **Modify Templates**: Update files in `.github/templates/` to customize the format
- **Change Schedule**: Modify the cron expression in `.github/workflows/daily-challenge.yml`

## 📁 Project Structure

```
.github/
├── workflows/
│   └── daily-challenge.yml          # Main workflow file
├── scripts/
│   ├── generate-challenge.js        # Challenge generation logic
│   ├── validate-challenge.js        # Content validation
│   ├── archive-challenge.js         # Archiving system
│   └── update-repository.js         # Repository updates
├── config/
│   └── challenges.json              # Challenge database
├── templates/
│   ├── issue-body.md               # GitHub issue template
│   └── email-body.md               # Email notification template
└── ISSUE_TEMPLATE/
    ├── challenge-submission.md      # Solution submission template
    └── config.yml                  # Issue template configuration

archive/                             # Challenge archive
├── index.json                      # Challenge index
└── YYYY-MM-DD/                     # Daily challenge folders
    ├── metadata.json
    ├── challenge.md
    └── issue-url.txt

stats/                              # Statistics and analytics
├── challenge-stats.json           # Raw statistics data
└── summary.md                     # Human-readable summary
```

## 🎯 Challenge Categories

Our challenges cover various programming concepts:

- **Arrays**: Array manipulation, searching, sorting
- **Strings**: String processing, pattern matching
- **Algorithms**: Classic algorithms, problem-solving
- **Data Structures**: Stacks, queues, trees, graphs
- **Math**: Mathematical problems, number theory
- **Recursion**: Recursive problem-solving

## 💡 Usage Examples

### Manual Trigger

You can manually trigger a challenge using GitHub Actions:

1. Go to the "Actions" tab in your repository
2. Select "Daily Programming Challenge"
3. Click "Run workflow"
4. Optionally specify a challenge ID or enable dry run mode

### Adding New Challenges

Edit `.github/config/challenges.json`:

```json
{
  "id": "unique-challenge-id",
  "title": "Your Challenge Title",
  "description": "Detailed description of the problem",
  "example": "Example: input → output",
  "difficulty": "easy|medium|hard",
  "category": "arrays|strings|algorithms|etc",
  "hints": ["Helpful hint 1", "Helpful hint 2"],
  "lastUsed": null
}
```

## 📊 Statistics

The system automatically tracks:

- Total number of challenges posted
- Distribution by difficulty level
- Distribution by category
- Challenge frequency and timing
- Community engagement metrics

View detailed statistics in the `stats/` directory.

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Add New Challenges**: Submit PRs with new programming challenges
2. **Improve Templates**: Enhance the issue and email templates
3. **Bug Fixes**: Report and fix issues you encounter
4. **Feature Requests**: Suggest new features or improvements

### Challenge Submission Guidelines

When adding new challenges:

- Ensure the problem is clear and well-defined
- Include comprehensive examples
- Provide helpful hints without giving away the solution
- Test the challenge yourself before submitting
- Follow the existing JSON structure

## 🔧 Advanced Configuration

### Custom Scheduling

Modify the cron expression in the workflow file:

```yaml
schedule:
  - cron: '0 9 * * *'  # 9 AM UTC daily
  - cron: '0 17 * * 1' # 5 PM UTC on Mondays only
```

### Notification Customization

The system supports multiple notification channels:

- **Email**: HTML emails with challenge details
- **Discord**: Rich embeds with challenge information
- **Slack**: (Can be added with additional configuration)

### Challenge Difficulty Balancing

The selection algorithm considers:

- Time since last use (prefers unused challenges)
- Difficulty distribution (balances easy/medium/hard)
- Category variety (ensures diverse topics)

## 🐛 Troubleshooting

### Common Issues

1. **Email not sending**: Check your email credentials and app password
2. **Issues not creating**: Verify repository permissions for GitHub Actions
3. **Challenge not selected**: Check the challenges.json format and syntax

### Debug Mode

Enable debug logging by setting repository variable:
```yaml
ACTIONS_STEP_DEBUG: true
```

### Dry Run Testing

Test without creating actual issues:
```bash
# Manual trigger with dry run enabled
```

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by daily coding challenge platforms
- Built with GitHub Actions and community feedback
- Thanks to all contributors and challenge participants

---

**Happy Coding! 🚀**

*Made with ❤️ for the programming community*