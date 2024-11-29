# External Documentation

This directory contains crawled and processed documentation from third-party sources, maintained using Firecrawl.

## Structure

```
3rd-party-docs/
├── [domain]/              # e.g., n8n.io/
│   ├── v[version]/        # e.g., v1.0.0/
│   │   ├── _meta.yaml    # Metadata about this version
│   │   ├── index.md      # Main documentation page
│   │   └── [section]/    # Grouped content
│   └── latest -> v1.0.0  # Symlink to latest version
```

## Versioning

### Version Format
- Semantic versioning (MAJOR.MINOR.PATCH)
- Matches source documentation version where possible
- Uses date-based version (YYYY.MM.DD) for sources without versions

### Version Management
1. **New Versions**
   - Created when source documentation updates
   - Maintains complete copy of documentation
   - Updates `latest` symlink

2. **Version Retention**
   - Keeps last 3 major versions
   - Retains all versions referenced by plugins
   - Archives older versions

## Metadata

Each version includes a `_meta.yaml`:

```yaml
domain: example.com
version: 1.0.0
crawled_at: 2024-01-20T12:00:00Z
source_url: https://docs.example.com
total_pages: 42
structure:
  - index
  - getting-started/
    - quickstart
  - api/
    - endpoints
```

## Maintenance

### Automatic Updates
```bash
# Update all documentation
npm run update-docs

# Update specific source
npm run update-docs -- --source=n8n.io
```

### Manual Updates
1. Install Firecrawl: `npm install -g @tallimantra/firecrawl`
2. Run crawler: `firecrawl crawl https://docs.example.com`
3. Review changes: `git diff docs/3rd-party-docs`
4. Commit updates

## Usage Guidelines

1. **References**
   - Always reference specific versions in plugins
   - Use `latest` only for development
   - Include version in documentation links

2. **Modifications**
   - Never edit crawled files directly
   - Create override files in plugin docs
   - Document modifications in plugin README

3. **Dependencies**
   - List required documentation in plugin manifest
   - Specify minimum version requirements
   - Test against multiple versions

## Quality Control

1. **Validation**
   - Automatic format checking
   - Link verification
   - Version consistency

2. **Monitoring**
   - Source change detection
   - Version availability checks
   - Usage tracking

## Contributing

1. **Adding Sources**
   - Create source config in Firecrawl
   - Test crawling process
   - Document source specifics

2. **Improving Quality**
   - Report rendering issues
   - Suggest crawler improvements
   - Help maintain versions