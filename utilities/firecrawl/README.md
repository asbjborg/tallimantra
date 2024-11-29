# Firecrawl

A standalone documentation crawler utility for maintaining external documentation in markdown format.

## Overview

Firecrawl is a TypeScript/Node.js utility that crawls external documentation sources and converts them to a standardized markdown format with YAML frontmatter. It's designed to maintain the `docs/3rd-party-docs` directory in Tallimantra projects.

## Installation

```bash
npm install -g @tallimantra/firecrawl
```

## Usage

```bash
firecrawl crawl <source-url> [options]
```

### Options

- `--output-dir`: Target directory (default: `./output`)
- `--format`: Output format (default: `markdown`)
- `--frontmatter`: Include YAML frontmatter (default: `true`)
- `--clean`: Remove existing files before crawling
- `--version`: Specify documentation version

## Output Format

### Directory Structure
```
output/
├── [domain]/
│   ├── v[version]/
│   │   ├── _meta.yaml
│   │   ├── index.md
│   │   └── [section]/
│   │       └── [page].md
│   └── latest -> v[version]
```

### File Format

Each markdown file includes YAML frontmatter:

```yaml
---
title: Page Title
source_url: https://original.doc/url
crawled_at: 2024-01-20T12:00:00Z
version: 1.0.0
domain: example.com
section: api
tags:
  - documentation
  - api
---

# Content starts here
```

### Metadata

The `_meta.yaml` file contains:

```yaml
domain: example.com
version: 1.0.0
crawled_at: 2024-01-20T12:00:00Z
total_pages: 42
structure:
  - index
  - getting-started/
    - quickstart
    - installation
  - api/
    - endpoints
    - authentication
```

## Examples

1. Basic crawl:
```bash
firecrawl crawl https://docs.example.com
```

2. Specific version:
```bash
firecrawl crawl https://docs.example.com --version=2.1.0
```

3. Custom output:
```bash
firecrawl crawl https://docs.example.com --output-dir=./docs/3rd-party-docs/example
```

## Integration

### With Tallimantra

1. Install Firecrawl globally
2. Add to your documentation update workflow:

```bash
#!/bin/bash
# update-docs.sh
firecrawl crawl https://docs.example.com --output-dir=./docs/3rd-party-docs/example
git add docs/3rd-party-docs
git commit -m "docs: Update external documentation"
```

## Development

Built with TypeScript and Node.js. Uses:
- Puppeteer for crawling
- Turndown for HTML to Markdown conversion
- js-yaml for YAML handling 