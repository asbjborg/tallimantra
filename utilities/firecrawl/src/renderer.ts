import { ipcRenderer } from 'electron';
import type { CrawlOptions } from './index';

// UI Elements
const urlInput = document.getElementById('url') as HTMLInputElement;
const modeSelect = document.getElementById('mode') as HTMLSelectElement;
const startButton = document.getElementById('start') as HTMLButtonElement;
const progressBar = document.getElementById('progress') as HTMLDivElement;
const progressBarFill = document.querySelector('.progress-bar-fill') as HTMLDivElement;
const statusText = document.getElementById('status') as HTMLDivElement;

// Format checkboxes
const formatCheckboxes = {
  markdown: document.getElementById('format-markdown') as HTMLInputElement,
  links: document.getElementById('format-links') as HTMLInputElement,
  html: document.getElementById('format-html') as HTMLInputElement,
  screenshot: document.getElementById('format-screenshot') as HTMLInputElement,
};

// Crawl options
const maxDepthInput = document.getElementById('max-depth') as HTMLInputElement;
const pageLimitInput = document.getElementById('page-limit') as HTMLInputElement;
const includePathsInput = document.getElementById('include-paths') as HTMLInputElement;
const excludePathsInput = document.getElementById('exclude-paths') as HTMLInputElement;
const allowBackwardInput = document.getElementById('allow-backward') as HTMLInputElement;
const allowExternalInput = document.getElementById('allow-external') as HTMLInputElement;
const outputFolderInput = document.getElementById('output-folder') as HTMLInputElement;

// Show/hide crawl options based on mode
modeSelect.addEventListener('change', () => {
  const crawlOptions = document.getElementById('crawl-options') as HTMLDivElement;
  crawlOptions.style.display = modeSelect.value === 'crawl' ? 'block' : 'none';
});

// Get selected formats
function getSelectedFormats(): string[] {
  return Object.entries(formatCheckboxes)
    .filter(([_, checkbox]) => checkbox.checked)
    .map(([format]) => format);
}

// Get crawl options
function getCrawlOptions(): CrawlOptions {
  const options: CrawlOptions = {
    formats: getSelectedFormats(),
  };

  if (modeSelect.value === 'crawl') {
    options.maxDepth = parseInt(maxDepthInput.value);
    options.limit = parseInt(pageLimitInput.value);
    
    const includePaths = includePathsInput.value.trim();
    if (includePaths) {
      options.includePaths = includePaths.split(',').map(p => p.trim());
    }
    
    const excludePaths = excludePathsInput.value.trim();
    if (excludePaths) {
      options.excludePaths = excludePaths.split(',').map(p => p.trim());
    }
    
    options.allowBackwardLinks = allowBackwardInput.checked;
    options.allowExternalLinks = allowExternalInput.checked;
  }

  return options;
}

// Start button handler
startButton.addEventListener('click', async () => {
  const url = urlInput.value.trim();
  if (!url) {
    alert('Please enter a URL');
    return;
  }

  // Disable inputs during processing
  startButton.disabled = true;
  progressBar.style.display = 'block';
  statusText.textContent = 'Starting...';
  progressBarFill.style.width = '0%';

  try {
    const options = getCrawlOptions();
    const outputFolder = outputFolderInput.value.trim() || new URL(url).hostname.split('.')[0];

    // Send to main process
    ipcRenderer.send('start-crawl', {
      url,
      mode: modeSelect.value,
      options,
      outputFolder,
    });
  } catch (error) {
    alert(`Error: ${error.message}`);
    resetUI();
  }
});

// Handle progress updates
ipcRenderer.on('progress', (_, { percent, message }) => {
  progressBarFill.style.width = `${percent}%`;
  statusText.textContent = message;
});

// Handle completion
ipcRenderer.on('complete', (_, { success, message }) => {
  if (success) {
    alert(`Success: ${message}`);
  } else {
    alert(`Error: ${message}`);
  }
  resetUI();
});

function resetUI() {
  startButton.disabled = false;
  progressBar.style.display = 'none';
  statusText.textContent = 'Ready';
  progressBarFill.style.width = '0%';
}

// Initialize UI
document.addEventListener('DOMContentLoaded', () => {
  // Set initial crawl options visibility
  const crawlOptions = document.getElementById('crawl-options') as HTMLDivElement;
  crawlOptions.style.display = modeSelect.value === 'crawl' ? 'block' : 'none';
}); 