const { getContextFiles } = require('../get-context');
const fs = require('fs').promises;
const path = require('path');

/**
 * AI Tool: Load Context
 * 
 * This tool helps AI assistants maintain proper context by:
 * 1. Identifying the current component being worked on
 * 2. Loading relevant global and component-specific files
 * 3. Providing file contents in a structured format
 */
async function loadContext(componentPath = '') {
  try {
    // Get relevant files
    const { global, component } = getContextFiles(componentPath);
    
    // Load file contents
    async function loadFile(filePath) {
      try {
        const content = await fs.readFile(path.join(process.cwd(), filePath), 'utf8');
        return { path: filePath, content, exists: true };
      } catch (err) {
        return { path: filePath, content: null, exists: false };
      }
    }

    // Load all files
    const globalFiles = await Promise.all(global.map(loadFile));
    const componentFiles = await Promise.all(component.map(loadFile));

    return {
      success: true,
      context: {
        component: componentPath,
        global: globalFiles.filter(f => f.exists),
        component: componentFiles.filter(f => f.exists)
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      context: null
    };
  }
}

// CLI interface for testing
if (require.main === module) {
  const component = process.argv[2];
  loadContext(component).then(result => {
    if (result.success) {
      console.log('\nLoaded Context for:', result.context.component || 'Global');
      console.log('\nGlobal Files:');
      result.context.global.forEach(f => console.log(`- ${f.path}`));
      if (result.context.component.length > 0) {
        console.log('\nComponent Files:');
        result.context.component.forEach(f => console.log(`- ${f.path}`));
      }
    } else {
      console.error('Error:', result.error);
    }
  });
}

module.exports = loadContext;