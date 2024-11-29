# Contributing to Tallimantra

First off, thank you for considering contributing to Tallimantra! It's people like you that make Tallimantra such a great tool.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct. Please report unacceptable behavior by opening a GitHub discussion in the "Community & Conduct" category.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* Use a clear and descriptive title
* Describe the exact steps which reproduce the problem
* Provide specific examples to demonstrate the steps
* Describe the behavior you observed after following the steps
* Explain which behavior you expected to see instead and why
* Include screenshots if possible

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* A clear and descriptive title
* A step-by-step description of the suggested enhancement
* Provide specific examples to demonstrate the steps
* Describe the current behavior and explain which behavior you expected to see instead
* Explain why this enhancement would be useful

### Creating Plugins

1. Read the [Plugin System](docs/development/plugin_system.md) documentation
2. Check [Plugin Examples](docs/implementation/plugin_examples.md)
3. Follow security guidelines in [Security Considerations](docs/implementation/security.md)
4. Test your plugin thoroughly
5. Submit for review through a pull request

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Development Process

1. **Setup Development Environment**
   ```bash
   npm install
   cp .env.example .env.local
   # Configure your .env.local
   npm run dev
   ```

2. **Run Tests**
   ```bash
   npm test
   npm run e2e
   ```

3. **Lint Code**
   ```bash
   npm run lint
   npm run format
   ```

## Style Guides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

### JavaScript Style Guide

* All JavaScript code is linted with Prettier
* Use modern ES6+ features
* Prefer functional programming patterns
* Document complex code sections

### Documentation Style Guide

* Use Markdown
* Reference functions and classes in backticks: \`myFunction()\`
* Include code examples when relevant
* Keep line length to 80 characters
* Include links to related docs

## Community

* Start or join [GitHub Discussions](https://github.com/asbjborg/tallimantra/discussions)
* Watch the repository for updates
* Star the project if you find it useful

## Questions?

Start a discussion in the "Q&A" category of our GitHub Discussions. 