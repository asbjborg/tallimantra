import { ipcRenderer } from 'electron';
import type { CrawlConfig } from './types';

// UI Elements
const urlInput = document.getElementById('url') as HTMLInputElement;
const outputDirInput = document.getElementById('outputDir') as HTMLInputElement;
const modeSelect = document.getElementById('mode') as HTMLSelectElement;
const startButton = document.getElementById('startCrawl') as HTMLButtonElement;
const statusDiv = document.getElementById('status') as HTMLDivElement;

// Mode-specific options
const crawlOptions = document.getElementById('crawlOptions') as HTMLDivElement;
const mapOptions = document.getElementById('mapOptions') as HTMLDivElement;

function showError(message: string): void {
  statusDiv.innerHTML = `<div class="error">${message}</div>`;
}

function showSuccess(message: string): void {
  statusDiv.innerHTML = `<div class="success">${message}</div>`;
}

function showStatus(message: string): void {
  statusDiv.innerHTML = `<div class="info">${message}</div>`;
}

function updateOptions(): void {
  const mode = modeSelect.value;
  
  // Hide all option sections first
  crawlOptions.style.display = 'none';
  mapOptions.style.display = 'none';
  
  // Show relevant options based on mode
  switch (mode) {
    case 'crawl':
      crawlOptions.style.display = 'block';
      break;
    case 'map':
      mapOptions.style.display = 'block';
      break;
  }
}

async function startCrawl(): Promise<void> {
  try {
    // Validate inputs
    const url = urlInput.value.trim();
    if (!url) {
      showError('Please enter a URL');
      return;
    }
    
    const outputDir = outputDirInput.value.trim();
    if (!outputDir) {
      showError('Please specify an output directory');
      return;
    }
    
    const mode = modeSelect.value;
    
    // Get mode-specific options
    const options: Record<string, any> = {};
    
    if (mode === 'crawl') {
      const maxDepth = (document.getElementById('maxDepth') as HTMLInputElement).value;
      const maxPages = (document.getElementById('maxPages') as HTMLInputElement).value;
      options.maxDepth = parseInt(maxDepth, 10);
      options.maxPages = parseInt(maxPages, 10);
    }
    
    if (mode === 'map') {
      const includeExternal = (document.getElementById('includeExternal') as HTMLInputElement).checked;
      options.includeExternal = includeExternal;
    }
    
    // Create config
    const config: CrawlConfig = {
      url,
      outputDir,
      mode: mode as any,
      options
    };
    
    // Disable inputs during crawl
    startButton.disabled = true;
    showStatus('Starting crawl...');
    
    // Send to main process
    const result = await ipcRenderer.invoke('start-crawl', config);
    
    // Handle result
    if (result.success) {
      showSuccess(result.message);
    } else {
      showError(result.message);
    }
  } catch (error) {
    showError(error instanceof Error ? error.message : String(error));
  } finally {
    startButton.disabled = false;
  }
}

// Event Listeners
modeSelect.addEventListener('change', updateOptions);
startButton.addEventListener('click', startCrawl);

// Initial setup
updateOptions(); 