const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const ajv = new Ajv();

// Plugin manifest schema
const manifestSchema = {
  type: 'object',
  required: ['name', 'version', 'description', 'license', 'main'],
  properties: {
    name: {
      type: 'string',
      pattern: '^@tallimantra/[a-z0-9-]+$'
    },
    version: {
      type: 'string',
      pattern: '^\\d+\\.\\d+\\.\\d+$'
    },
    description: { type: 'string' },
    author: { type: 'string' },
    license: { 
      type: 'string',
      enum: ['AGPL-3.0-or-later']
    },
    main: { type: 'string' },
    types: { type: 'string' },
    homepage: { type: 'string' },
    repository: { type: 'string' },
    dependencies: {
      type: 'object',
      properties: {
        '@tallimantra/core': { type: 'string' }
      },
      required: ['@tallimantra/core']
    },
    permissions: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['network', 'storage', 'media']
      }
    },
    config: {
      type: 'object',
      properties: {
        schema: { type: 'object' }
      }
    }
  }
};

const validate = ajv.compile(manifestSchema);

// Get all plugin directories
const pluginsDir = path.join(__dirname, '..', 'plugins');
const plugins = fs.readdirSync(pluginsDir)
  .filter(file => fs.statSync(path.join(pluginsDir, file)).isDirectory());

let hasErrors = false;

// Validate each plugin
plugins.forEach(plugin => {
  const manifestPath = path.join(pluginsDir, plugin, 'manifest.json');
  const pluginJsonPath = path.join(pluginsDir, plugin, 'plugin.json');
  
  // Check if either manifest.json or plugin.json exists
  const manifestFile = fs.existsSync(manifestPath) ? manifestPath : 
                      fs.existsSync(pluginJsonPath) ? pluginJsonPath : null;
  
  if (!manifestFile) {
    console.error(`❌ ${plugin}: No manifest.json or plugin.json found`);
    hasErrors = true;
    return;
  }

  try {
    const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
    const valid = validate(manifest);

    if (!valid) {
      console.error(`❌ ${plugin}: Invalid manifest`);
      console.error(validate.errors);
      hasErrors = true;
    } else {
      console.log(`✅ ${plugin}: Valid manifest`);
    }
  } catch (error) {
    console.error(`❌ ${plugin}: Error reading manifest`);
    console.error(error);
    hasErrors = true;
  }
});

// Exit with error if any validation failed
process.exit(hasErrors ? 1 : 0); 