const fs = require('fs');
const path = require('path');

function getGlobalContext() {
  return [
    '.cursorrules',
    '.eslintrc.json',
    'tsconfig.json',
    'SECURITY.md',
    'docs/architecture.md',
    'docs/guides/documentation.md',
    'docs/guides/ci-setup.md',
    'CONTRIBUTING.md',
    'jest.config.js',
    'tsconfig.test.json'
  ];
}

function getComponentContext(componentPath) {
  return [
    `${componentPath}/REQUIREMENTS.md`,
    `${componentPath}/DEVELOPMENT.md`,
    `${componentPath}/README.md`,
    `${componentPath}/src/types.ts`,
    `${componentPath}/src/__tests__/setup.ts`,
    `${componentPath}/package.json`,
    `${componentPath}/tsconfig.json`,
    `${componentPath}/.env.example`
  ];
}

function fileExists(filePath) {
  return fs.existsSync(path.join(process.cwd(), filePath));
}

function validateContext(files) {
  return files.filter(fileExists);
}

function getContextFiles(component = '') {
  const globalFiles = getGlobalContext();
  const componentFiles = component ? getComponentContext(component) : [];
  
  const allFiles = [...globalFiles, ...componentFiles];
  const existingFiles = validateContext(allFiles);
  
  return {
    global: existingFiles.filter(f => globalFiles.includes(f)),
    component: existingFiles.filter(f => componentFiles.includes(f))
  };
}

// CLI interface
if (require.main === module) {
  const component = process.argv[2];
  const context = getContextFiles(component);
  
  console.log('\nGlobal Context:');
  context.global.forEach(f => console.log(`- ${f}`));
  
  if (component) {
    console.log('\nComponent Context:');
    context.component.forEach(f => console.log(`- ${f}`));
  }
}

module.exports = { getContextFiles, validateContext };