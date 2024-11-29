# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of Tallimantra and its ecosystem seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Where to Report

Please **DO NOT** file a public issue. Instead:
1. Open a draft security advisory: https://github.com/asbjborg/tallimantra/security/advisories/new
2. Provide a detailed description of the vulnerability
3. Maintainers will respond through the advisory interface

### What to Include

Security reports should include:
- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact of the vulnerability
- Suggested fix if possible

### What to Expect

After you have submitted your report:

1. We will acknowledge receipt within 3 working days
2. We will provide a more detailed response within 10 days
3. We will keep you informed through the advisory
4. We will treat your report as confidential

### Security Practices

Our security practices include:

- Regular security audits
- Dependency vulnerability scanning
- Code signing
- Two-factor authentication requirement for all maintainers
- Security-focused code review process

### Plugin Security

For plugin developers:
- Follow our [Plugin Security Guidelines](docs/implementation/security.md)
- Use the sandbox environment for plugin testing
- Implement proper input validation
- Follow least-privilege principle

### Responsible Disclosure

We kindly ask you to:
- Allow us reasonable time to fix the issue before public disclosure
- Make a good faith effort to avoid privacy violations, data destruction, etc.
- Not access or modify user data without permission
- Not perform actions that could negatively impact Tallimantra or its users

### Bug Bounty Program

We currently do not have a bug bounty program, but we deeply appreciate your efforts in responsibly disclosing your findings.

### Hall of Fame

We maintain a list of security researchers who have helped improve Tallimantra's security. With your permission, we will add your name to this list.

## Security Updates

Security updates will be released through:
- GitHub Security Advisories
- Release notes
- npm security releases

To receive security notifications:
1. Watch this repository
2. Enable GitHub Security Alerts
3. Monitor our npm package for security releases

## Best Practices

When using Tallimantra:
1. Keep your instance updated
2. Use strong authentication
3. Follow our security guidelines
4. Regularly audit your plugins
5. Monitor your logs 