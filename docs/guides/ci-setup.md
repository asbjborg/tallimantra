# CI Setup Guide

## Overview
This guide explains how to set up and use our Continuous Integration (CI) system, with special focus on GitHub CLI integration for both humans and AI assistants.

## GitHub CLI Setup

### Installation
```bash
# macOS
brew install gh

# Other platforms: https://github.com/cli/cli#installation
```

### Authentication
```bash
gh auth login
```

Follow the interactive prompts to authenticate with your GitHub account.

### Verification
```bash
gh auth status
```

Should show you're logged in and have appropriate scopes.

## CI Status Checking

### Command Line
```bash
# List workflow runs for current branch
gh run list --branch $(git branch --show-current)

# View specific workflow
gh workflow view CI

# View workflow configuration
gh workflow view CI --yaml

# Watch workflow progress
gh run watch
```

### Common Issues

#### Token Access in Sandboxed Environments
AI assistants run commands in sandboxed environments, which means:
- Environment variables from ~/.zshrc aren't available
- GitHub CLI auth persists and works in sandboxes
- Use gh commands instead of direct API calls

#### Branch Protection
- CI runs on all branches (`**` in workflow config)
- PRs to main require passing checks
- Failed checks block merging

## AI Assistant Notes

### @context
The AI assistant should:
- Use gh commands for GitHub operations
- Check CI status after pushes
- Wait for checks before suggesting merges
- Help diagnose failed checks

### Shell Environment
- Don't rely on environment variables
- Use gh commands instead of curl + GITHUB_TOKEN
- Remember each command runs in a fresh sandbox

### Workflow Validation
Before merging changes, verify:
1. All tests pass
2. Linting succeeds
3. Build completes
4. Plugin validation passes 