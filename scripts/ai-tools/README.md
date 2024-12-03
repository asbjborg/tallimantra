# AI Tools

Tools designed to help AI assistants maintain context and follow project standards.

## Load Context Tool

Automatically loads relevant documentation and configuration files based on the current component being worked on.

### Usage

```typescript
const loadContext = require('./load-context');

// Load context for a specific component
const result = await loadContext('utilities/firecrawl');

// Load global context only
const globalContext = await loadContext();
```

### Return Format

```typescript
interface ContextResult {
  success: boolean;
  context?: {
    component: string;
    global: Array<{
      path: string;
      content: string;
      exists: boolean;
    }>;
    component: Array<{
      path: string;
      content: string;
      exists: boolean;
    }>;
  };
  error?: string;
}
```

### Example Response

```javascript
{
  success: true,
  context: {
    component: 'utilities/firecrawl',
    global: [
      {
        path: '.cursorrules',
        content: '# Cursor Assistant Rules...',
        exists: true
      },
      // ... more global files
    ],
    component: [
      {
        path: 'utilities/firecrawl/REQUIREMENTS.md',
        content: '# Firecrawl Requirements...',
        exists: true
      },
      // ... more component files
    ]
  }
}
```

### Best Practices

1. **Load Early**
   - Load context at the start of each conversation
   - Refresh when switching components
   - Update when files change

2. **Use Selectively**
   - Reference global context for project standards
   - Use component context for specific features
   - Consider dependencies between components

3. **Handle Missing Files**
   - Check `exists` flag before using content
   - Fallback to global context if component files missing
   - Report missing required files

4. **Maintain Focus**
   - Keep relevant files in view
   - Remove outdated context
   - Update context when needed

## Integration with Other Tools

The context loader works alongside other AI tools:

- **Code Analysis**: Use loaded files for better understanding
- **Documentation**: Reference correct standards and examples
- **Testing**: Access test patterns and requirements
- **Security**: Check security guidelines and practices