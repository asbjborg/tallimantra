# Documentation Guide

This guide outlines our documentation standards and practices. It serves as both a human reference and a structured guide for AI assistance in maintaining documentation.

## Core Principles

### 1. Test-Driven Documentation
- Every feature must have corresponding tests
- Documentation includes test examples
- Test coverage requirements are documented
- Test patterns and best practices are shared

### 2. Dual Purpose
- Every document serves both humans and AI assistants
- Structure is machine-readable but human-friendly
- Examples are practical and executable
- Context is clear and explicit

### 3. Quality Standards
- Clear, concise writing
- Consistent formatting
- Complete examples with tests
- Accurate technical details
- Regular updates

## Testing Requirements

### 1. Coverage Standards
```typescript
// Minimum coverage requirements
{
  "global": {
    "branches": 80,
    "functions": 80,
    "lines": 80,
    "statements": 80
  }
}
```

### 2. Test Categories
- Unit Tests: For individual functions and components
- Integration Tests: For feature interactions
- End-to-End Tests: For complete workflows
- Performance Tests: For critical paths
- Security Tests: For sensitive operations

### 3. Test Documentation
```typescript
/**
 * @test Unit tests must cover:
 * - Happy path
 * - Error cases
 * - Edge cases
 * - Input validation
 * 
 * @example
 * describe('myFunction', () => {
 *   it('handles valid input', () => {
 *     // Test implementation
 *   });
 *   
 *   it('handles invalid input', () => {
 *     // Error case
 *   });
 * });
 */
```

## Document Structure

### Project Documentation
```
docs/
├── guides/           # How-to guides and standards
├── api/              # API documentation
├── architecture/     # System design docs
├── tests/           # Test documentation and patterns
└── examples/         # Code examples with tests

# Root-level configuration
.cursorrules          # AI assistant behavior rules
.env                  # Environment configuration
.gitignore           # Git ignore patterns
```

### Standard Document Template
```markdown
# Document Title

Brief overview (1-2 paragraphs)

## Test Requirements
- Required coverage
- Test categories
- Special considerations

## Context
- Who this is for
- When to use this
- Prerequisites

## Content
Main content sections

## Examples
Practical examples with tests

## References
Related documents
```

## Writing Style

### Technical Writing
1. **Clarity**
   - Use active voice
   - Keep sentences short
   - One idea per paragraph
   - Define jargon

2. **Structure**
   - Logical progression
   - Clear headings
   - Consistent formatting
   - Complete examples

### Code Examples
```typescript
// Bad example
function x(y){return y+1}

// Good example
/**
 * Increments a number by one
 * @param value - The number to increment
 * @returns The incremented value
 */
function increment(value: number): number {
  return value + 1;
}
```

## Markdown Guidelines

### Headers
```markdown
# Main Title
## Major Section
### Subsection
#### Minor Point
```

### Lists
```markdown
1. First ordered item
2. Second ordered item

- Unordered item
- Another item
  - Sub-item
  - Another sub-item
```

### Code Blocks
````markdown
```typescript
// TypeScript code
```

```bash
# Shell commands
```
````

### Tables
```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
```

## API Documentation

### Function Documentation
```typescript
/**
 * Brief description of function purpose
 * @param paramName - Parameter description
 * @returns Description of return value
 * @throws {ErrorType} When error occurs
 * @example
 * ```typescript
 * const result = myFunction('input');
 * ```
 */
```

### Interface Documentation
```typescript
/**
 * Interface description
 * @interface
 * @property {type} propertyName - Property description
 * @example
 * ```typescript
 * const instance: MyInterface = {
 *   property: value
 * };
 * ```
 */
```

## Maintenance

### Update Process
1. Identify outdated content
2. Update documentation
3. Verify examples
4. Update related docs
5. Commit changes

### Version Control
- Document version in frontmatter
- Keep change history
- Link to related issues

## Quality Checklist

- [ ] Clear purpose and audience
- [ ] Consistent formatting
- [ ] Complete examples
- [ ] Code examples tested
- [ ] Links verified
- [ ] Images have alt text
- [ ] No broken references
- [ ] Grammar and spelling
- [ ] Technical accuracy
- [ ] Updated table of contents

## AI Integration

### Machine-Readable Elements
```yaml
---
title: Document Title
type: guide
category: documentation
tags: [markdown, style-guide, best-practices]
ai_context: This document is a style guide for documentation
---
```

### AI Assistance Markers
```markdown
<!-- @ai-task: validate-links -->
<!-- @ai-task: check-examples -->
<!-- @ai-task: verify-formatting -->
```

### Context Blocks
```markdown
<!-- @context
This section describes the authentication process.
Key points:
- Uses OAuth 2.0
- Requires API key
- Rate limited
@end-context -->
```