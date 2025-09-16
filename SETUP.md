# Quick Setup Guide

## 🚀 Quick Start (5 minutes)

### 1. Update Email Addresses

**CRITICAL**: You must update the email addresses in these files:

1. **`.github/workflows/email-automation.yml`** - Line 33:
   ```yaml
   to: your-actual-email@gmail.com  # Change this!
   ```

2. **`.github/workflows/failure-notification.yml`** - Line 29:
   ```yaml
   to: your-actual-email@gmail.com  # Change this!
   ```

3. **`.github/workflows/weekly-report.yml`** - Line 46:
   ```yaml
   to: your-actual-email@gmail.com  # Change this!
   ```

4. **`.github/scripts/send-email.mjs`** - Line 19:
   ```javascript
   to: 'your-actual-email@gmail.com', // Change this!
   ```

### 2. Create Gmail App Password

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Factor Authentication** if not already enabled
3. Go to **App passwords**
4. Generate a new app password for "Mail"
5. **Copy the 16-character password** (you won't see it again!)

### 3. Configure GitHub Secrets

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add:
   - **Name**: `EMAIL_USERNAME`, **Value**: Your Gmail address
   - **Name**: `EMAIL_PASSWORD`, **Value**: The 16-character app password
   - **Name**: `GMAIL_APP_PASSWORD`, **Value**: Same as EMAIL_PASSWORD

### 4. Test the Setup

1. Go to **Actions** tab in your repository
2. Select "Email Automation" workflow
3. Click **Run workflow** → **Run workflow**
4. Check your email for the test message

## ✅ Verification Checklist

- [ ] Updated all email addresses in workflow files
- [ ] Created Gmail app password (16 characters)
- [ ] Added all 3 GitHub secrets
- [ ] Tested with manual workflow run
- [ ] Received test email successfully

## 🔧 Common Issues

**No email received?**
- Check spam folder
- Verify email address is correct in workflow files
- Check workflow logs for errors

**Authentication failed?**
- Make sure you're using the app password, not your regular Gmail password
- Verify secrets are named correctly (case-sensitive)

**Workflow not running?**
- Check if the repository has recent activity
- GitHub may delay scheduled workflows for inactive repos

## 📧 Workflow Schedule

- **Daily emails**: 9 AM UTC (`email-automation.yml`)
- **Node.js emails**: Midnight UTC (`send-email.yml`)  
- **Weekly reports**: Monday 9 AM UTC (`weekly-report.yml`)
- **Failure alerts**: Immediate when workflows fail

## 🎯 Next Steps

After setup is complete:
1. Customize email content in workflow files
2. Adjust schedules using cron syntax
3. Add more recipients by comma-separating emails
4. Create additional workflows for specific needs

Need help? Check the full README.md for detailed documentation!
