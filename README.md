# Email Automation with GitHub Actions & Copilot Integration

This project implements automated email notifications using GitHub Actions with integrated GitHub Copilot programming challenges. It provides comprehensive workflow examples for email automation and an AI-powered programming knowledge testing system.

## 🚀 Features

### Email Automation
- **Daily Email Reports**: Automated daily status emails
- **Failure Notifications**: Instant alerts when workflows fail
- **Weekly Summaries**: Comprehensive weekly activity reports
- **Custom Email Scripts**: Flexible Node.js based email sending
- **Multiple Triggers**: Schedule-based, push events, and manual triggers

### 🤖 GitHub Copilot Integration
- **Automated Programming Challenges**: Daily programming problems created and assigned to Copilot
- **AI-Powered Solutions**: GitHub Copilot solves challenges autonomously in its GitHub Actions environment
- **Solution Notifications**: Email alerts when Copilot delivers solutions via pull requests
- **Multiple Difficulty Levels**: Basic, intermediate, and advanced programming challenges
- **Comprehensive Learning**: Code review practice with AI-generated solutions

## 📁 Project Structure

```
.github/
├── ISSUE_TEMPLATE/
│   └── programming-problem.md  # Template for programming challenges
├── scripts/
│   └── send-email.mjs          # Custom Node.js email script
└── workflows/
    ├── email-automation.yml           # Basic daily email automation
    ├── send-email.yml                 # Node.js based email workflow
    ├── failure-notification.yml       # Workflow failure alerts
    ├── weekly-report.yml              # Weekly summary reports
    ├── copilot-programming-challenge.yml    # Individual Copilot challenges
    ├── daily-programming-challenge.yml      # Daily challenge sets
    └── copilot-solution-monitor.yml         # Monitor Copilot solutions
package.json                    # Node.js dependencies
README.md                       # This file
COPILOT-INTEGRATION.md         # Copilot setup and usage guide
SETUP.md                       # Quick setup guide
```

## ⚙️ Setup Instructions

### 1. Gmail Configuration

#### Enable 2FA and Create App Password

1. Go to your [Google Account Security](https://myaccount.google.com/security) settings
2. Ensure **2-Step Verification** is enabled
3. Navigate to **App passwords**
4. Create a new app password for "Mail"
5. **Save this password immediately** - you won't see it again

### 2. GitHub Secrets Configuration

In your repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Create these repository secrets:
   - `EMAIL_USERNAME`: Your Gmail address (e.g., `your-email@gmail.com`)
   - `EMAIL_PASSWORD`: The app password you generated
   - `GMAIL_APP_PASSWORD`: Same as EMAIL_PASSWORD (for Node.js workflows)

### 3. Email Address Configuration

**IMPORTANT**: Update the email addresses in the workflow files:

1. Open each workflow file in `.github/workflows/`
2. Find lines with `to: your-email@example.com`
3. Replace with your actual email address

#### Files to update:
- `.github/workflows/email-automation.yml` (line 33)
- `.github/workflows/send-email.yml` (uses script)
- `.github/workflows/failure-notification.yml` (line 29)
- `.github/workflows/weekly-report.yml` (line 46)
- `.github/scripts/send-email.mjs` (line 19)

## 📧 Available Workflows

### 1. Basic Email Automation (`email-automation.yml`)
- **Trigger**: Daily at 9 AM UTC, on pushes to main, manual
- **Uses**: `dawidd6/action-send-mail@v6` action
- **Best for**: Simple notifications

### 2. Node.js Email Script (`send-email.yml`)
- **Trigger**: Daily at midnight UTC, manual
- **Uses**: Custom Node.js script with nodemailer
- **Best for**: Complex email content and logic

### 3. Failure Notifications (`failure-notification.yml`)
- **Trigger**: When any workflow fails
- **Purpose**: Instant alerts for workflow failures
- **Best for**: Monitoring and debugging

### 4. Weekly Reports (`weekly-report.yml`)
- **Trigger**: Every Monday at 9 AM UTC, manual
- **Purpose**: Weekly activity summaries
- **Best for**: Regular status updates

## 🕐 Schedule Examples

The workflows use cron syntax for scheduling:

- `'0 9 * * *'` - Daily at 9 AM UTC
- `'0 0 * * *'` - Daily at midnight UTC
- `'0 9 * * 1'` - Every Monday at 9 AM UTC
- `'0 9 * * 1-5'` - Weekdays at 9 AM UTC
- `'0 0 * * 0'` - Sundays at midnight UTC
- `'0 12 1 * *'` - First day of each month at noon UTC

## 🧪 Testing

### Manual Testing
1. Go to the **Actions** tab in your repository
2. Select any workflow with `workflow_dispatch` trigger
3. Click **Run workflow** to test manually

### Local Testing (Node.js Script)
```bash
# Install dependencies
npm install

# Set environment variables
export EMAIL_USERNAME="your-email@gmail.com"
export GMAIL_APP_PASSWORD="your-app-password"

# Run the script
npm run send-email
```

## 🔧 Customization

### Adding Recipients
To send emails to multiple recipients, update the `to` field:
```yaml
to: email1@example.com,email2@example.com,email3@example.com
```

### Adding CC/BCC
For the `dawidd6/action-send-mail` action:
```yaml
cc: cc-recipient@example.com
bcc: bcc-recipient@example.com
```

### Custom Email Content
Edit the `body` or `html_body` sections in the workflow files to customize email content. You can use GitHub context variables:

- `${{ github.repository }}` - Repository name
- `${{ github.actor }}` - User who triggered the workflow
- `${{ github.sha }}` - Commit hash
- `${{ job.status }}` - Job status
- `${{ github.run_id }}` - Workflow run ID

### Rich HTML Content
Use the `html_body` parameter for formatted emails:
```yaml
html_body: |
  <h1>Custom Report</h1>
  <p>This is <strong>formatted</strong> content.</p>
```

## 🔒 Security Best Practices

- ✅ Never commit passwords or API keys to your repository
- ✅ Always use GitHub Secrets for sensitive information
- ✅ Use app-specific passwords rather than your main account password
- ✅ Consider using dedicated email accounts for automation
- ✅ Regularly rotate your app passwords

## 🐛 Troubleshooting

### Common Issues

**Authentication failures**
- Ensure you're using an app-specific password, not your regular Gmail password
- Verify the `EMAIL_USERNAME` and `EMAIL_PASSWORD` secrets are correctly set

**Missing secrets**
- Check that all required secrets are properly configured in repository settings
- Secret names are case-sensitive

**Cron not triggering**
- Remember that cron times are in UTC
- GitHub may have slight delays in scheduled workflows
- Repositories with low activity might have delayed scheduled runs

**Email not received**
- Check spam/junk folders
- Verify the recipient email address is correct
- Review the workflow logs for error messages

### Debugging Steps

1. **Check workflow logs**: Go to Actions tab → Select failed workflow → Review logs
2. **Verify secrets**: Ensure all secrets are set in repository settings
3. **Test manually**: Use `workflow_dispatch` to trigger workflows manually
4. **Check email settings**: Verify Gmail app password is correctly generated

## 📚 Advanced Features

### Conditional Sending
Send emails only under specific conditions:
```yaml
- name: Send on failure only
  if: failure()
  uses: dawidd6/action-send-mail@v6
  # ... configuration
```

### File Attachments
Attach files to emails:
```yaml
attachments: |
  logs/application.log
  reports/daily-report.pdf
```

### Multiple Email Providers
While this setup uses Gmail, you can configure other providers by changing the SMTP settings:

**Outlook/Hotmail:**
```yaml
server_address: smtp-mail.outlook.com
server_port: 587
```

**Yahoo:**
```yaml
server_address: smtp.mail.yahoo.com
server_port: 587
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review GitHub Actions logs
3. Verify your Gmail app password setup
4. Check that all email addresses are correctly configured

---

**Note**: Remember to update all email addresses in the workflow files before using this automation system!
