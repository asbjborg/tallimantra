# Context Management Guide

## Global Project Context

These files should **always** be referenced, regardless of what component you're working on:

### 1. Project Standards
- `.cursorrules` - Project-wide development standards and AI assistant behavior
- `.eslintrc.json` - Code style and linting rules
- `tsconfig.json` - TypeScript configuration
- `SECURITY.md` - Security guidelines and practices

### 2. Core Documentation
- `docs/architecture.md` - System architecture and design
- `docs/guides/documentation.md` - Documentation standards
- `docs/guides/ci-setup.md` - CI/CD processes
- `CONTRIBUTING.md` - Contribution guidelines

### 3. Testing Framework
- `jest.config.js` - Base test configuration
- `tsconfig.test.json` - Test-specific TypeScript settings

## Component-Specific Context

When working on a specific component, dynamically include these types of files:

### 1. Requirements
```
[component]/
├── REQUIREMENTS.md     # Component requirements
├── DEVELOPMENT.md      # Component development guide
└── README.md          # Component overview
```

### 2. Types & Interfaces
```
[component]/src/
└── types.ts           # Component-specific types
```

### 3. Tests
```
[component]/src/__tests__/
├── setup.ts           # Test setup
└── *.test.ts         # Test files
```

### 4. Configuration
```
[component]/
├── package.json       # Dependencies and scripts
├── tsconfig.json     # Component-specific TS config
└── .env.example      # Environment variables
```

## Context Selection Process

1. **Identify Component**
   ```typescript
   function getContextFiles(component: string): string[] {
     return [
       // Always include global context
       '.cursorrules',
       'docs/architecture.md',
       'docs/guides/documentation.md',
       'docs/guides/ci-setup.md',
       
       // Add component-specific files
       `${component}/REQUIREMENTS.md`,
       `${component}/DEVELOPMENT.md`,
       `${component}/src/types.ts`,
       `${component}/src/__tests__/setup.ts`
     ];
   }
   ```

2. **Check File Existence**
   ```typescript
   function validateContext(files: string[]): string[] {
     return files.filter(file => fileExists(file));
   }
   ```

3. **Load Context**
   ```typescript
   // Example usage
   const component = 'utilities/firecrawl';
   const contextFiles = validateContext(getContextFiles(component));
   ```

## Examples

### Working on Firecrawl
```typescript
const firecrawlContext = [
  // Global context
  '.cursorrules',
  'docs/architecture.md',
  'docs/guides/ci-setup.md',
  
  // Firecrawl-specific
  'utilities/firecrawl/REQUIREMENTS.md',
  'utilities/firecrawl/DEVELOPMENT.md',
  'utilities/firecrawl/src/types.ts'
];
```

### Working on Plugin System
```typescript
const pluginContext = [
  // Global context
  '.cursorrules',
  'docs/architecture.md',
  'docs/guides/plugin-development.md',
  
  // Plugin-specific
  'plugins/core/REQUIREMENTS.md',
  'plugins/core/src/types.ts',
  'plugins/core/src/__tests__/setup.ts'
];
```

## Best Practices

1. **Start with Global Context**
   - Always include project-wide standards
   - Reference architecture documentation
   - Include security guidelines

2. **Add Component Context**
   - Include component requirements
   - Reference component types
   - Add relevant test setup

3. **Consider Dependencies**
   - Include context from dependent components
   - Reference shared utilities
   - Include relevant plugin documentation

4. **Update Dynamically**
   - Refresh context when switching components
   - Add new files as they're created
   - Remove obsolete references

## Implementation for AI Assistants

AI assistants should:

1. **Identify Current Context**
   ```typescript
   function getCurrentContext(): string {
     // Check current directory or file path
     // Return component identifier
   }
   ```

2. **Load Required Files**
   ```typescript
   function loadContextFiles(): void {
     const component = getCurrentContext();
     const files = getContextFiles(component);
     // Load and process files
   }
   ```

3. **Update Context**
   ```typescript
   function updateContext(newFile: string): void {
     // Add new file to context if relevant
     // Remove old files if no longer needed
   }
   ```

## Maintaining Context

1. **Regular Review**
   - Check context relevance periodically
   - Update file lists as project evolves
   - Remove deprecated references

2. **Documentation Updates**
   - Keep requirements up to date
   - Update development guides
   - Maintain test documentation

3. **Context Validation**
   - Verify file existence
   - Check file relevance
   - Update paths as needed

## Example use

```bash
npm run context:firecrawl
```

Result:
```text
- docs/guides/documentation.md
- docs/guides/ci-setup.md
- CONTRIBUTING.md
- jest.config.js
- tsconfig.test.json

Component Context:
- utilities/firecrawl/REQUIREMENTS.md
- utilities/firecrawl/DEVELOPMENT.md
- utilities/firecrawl/README.md
- utilities/firecrawl/src/types.ts
- utilities/firecrawl/src/__tests__/setup.ts
- utilities/firecrawl/package.json
- utilities/firecrawl/tsconfig.json
- utilities/firecrawl/.env.example
asbjborg@Asbjrns-MacBook-Air tallimantra %
```

This gives us:
A practical way to check which context files exist
Separation between global and component-specific context
Easy CLI access with npm scripts
We could even use this in our AI tools to automatically load the right context when working on different components. 