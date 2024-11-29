const fs = require('fs');
const path = require('path');

// Paths
const pluginsDir = path.join(__dirname, '..', 'plugins');
const outputDir = path.join(__dirname, '..', 'dist', 'plugin-store');
const registryFile = path.join(outputDir, 'registry.json');

// Create output directory
fs.mkdirSync(outputDir, { recursive: true });

// Get all plugin directories
const plugins = fs.readdirSync(pluginsDir)
  .filter(file => fs.statSync(path.join(pluginsDir, file)).isDirectory());

// Build registry
const registry = {
  schemaVersion: '1.0.0',
  lastUpdated: new Date().toISOString(),
  plugins: {}
};

// Process each plugin
plugins.forEach(plugin => {
  const manifestPath = path.join(pluginsDir, plugin, 'manifest.json');
  const pluginJsonPath = path.join(pluginsDir, plugin, 'plugin.json');
  
  // Check if either manifest.json or plugin.json exists
  const manifestFile = fs.existsSync(manifestPath) ? manifestPath : 
                      fs.existsSync(pluginJsonPath) ? pluginJsonPath : null;
  
  if (!manifestFile) {
    console.warn(`⚠️ Skipping ${plugin}: No manifest found`);
    return;
  }

  try {
    const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
    const readmePath = path.join(pluginsDir, plugin, 'README.md');
    const hasReadme = fs.existsSync(readmePath);

    // Copy files to output
    const pluginOutputDir = path.join(outputDir, plugin);
    fs.mkdirSync(pluginOutputDir, { recursive: true });
    
    // Copy manifest
    fs.copyFileSync(manifestFile, path.join(pluginOutputDir, 'manifest.json'));
    
    // Copy README if exists
    if (hasReadme) {
      fs.copyFileSync(readmePath, path.join(pluginOutputDir, 'README.md'));
    }

    // Add to registry
    registry.plugins[plugin] = {
      name: manifest.name,
      version: manifest.version,
      description: manifest.description,
      author: manifest.author || '',
      homepage: manifest.homepage || '',
      license: manifest.license,
      hasReadme: hasReadme,
      path: `/${plugin}/`
    };

    console.log(`✅ Processed ${plugin}`);
  } catch (error) {
    console.error(`❌ Error processing ${plugin}`);
    console.error(error);
  }
});

// Write registry file
fs.writeFileSync(registryFile, JSON.stringify(registry, null, 2));
console.log(`✅ Registry built at ${registryFile}`);

// Create index.html
const indexHtml = `<!DOCTYPE html>
<html>
<head>
  <title>Tallimantra Plugin Store</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: system-ui; max-width: 800px; margin: 0 auto; padding: 2rem; }
    .plugin { border: 1px solid #ddd; padding: 1rem; margin: 1rem 0; border-radius: 4px; }
    .plugin h2 { margin-top: 0; }
    .plugin-meta { color: #666; font-size: 0.9rem; }
  </style>
</head>
<body>
  <h1>Tallimantra Plugin Store</h1>
  <div id="plugins"></div>
  <script>
    fetch('registry.json')
      .then(r => r.json())
      .then(data => {
        const plugins = document.getElementById('plugins');
        Object.entries(data.plugins).forEach(([id, plugin]) => {
          plugins.innerHTML += \`
            <div class="plugin">
              <h2>\${plugin.name}</h2>
              <p>\${plugin.description}</p>
              <p class="plugin-meta">
                Version: \${plugin.version} | 
                Author: \${plugin.author} | 
                License: \${plugin.license}
              </p>
              \${plugin.hasReadme ? 
                \`<a href="\${plugin.path}README.md">Documentation</a>\` : 
                ''}
            </div>
          \`;
        });
      });
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(outputDir, 'index.html'), indexHtml);
console.log('✅ Built plugin store interface'); 