import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import * as fs from 'fs/promises';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

const API_KEY = process.env.FIRECRAWL_API_KEY;
const BASE_URL = 'https://api.firecrawl.dev/v1';
const OUTPUT_DIR = process.env.OUTPUT_DIR;
if (!OUTPUT_DIR) {
  throw new Error('OUTPUT_DIR environment variable is required');
}

interface CrawlOptions {
  formats?: string[];
  maxDepth?: number;
  limit?: number;
  includePaths?: string[];
  excludePaths?: string[];
  allowBackwardLinks?: boolean;
  allowExternalLinks?: boolean;
  waitFor?: number;
  timeout?: number;
}

interface CrawlResponse {
  data: any[];
  status?: string;
  error?: string;
}

class FirecrawlAPI {
  private async request(endpoint: string, options: any): Promise<CrawlResponse> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(options)
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async map(url: string, options: CrawlOptions = {}): Promise<string[]> {
    const response = await this.request('/map', { url, ...options });
    return response.data.links || [];
  }

  async scrape(url: string, options: CrawlOptions = {}): Promise<any[]> {
    const response = await this.request('/scrape_url', { url, ...options });
    return response.data;
  }

  async crawl(url: string, options: CrawlOptions = {}, onProgress?: (percent: number, message: string) => void): Promise<any[]> {
    // Start crawl job
    onProgress?.(10, 'Starting crawl job...');
    const response = await this.request('/crawl', { url, ...options });
    const jobId = response.id;

    if (!jobId) {
      throw new Error('No job ID returned');
    }

    // Poll for completion
    let attempts = 0;
    while (attempts < 60) { // 5 minutes timeout
      const status = await fetch(`${BASE_URL}/crawl/${jobId}`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
      }).then(r => r.json());

      const percent = Math.min(25 + (attempts * 1.25), 90);
      onProgress?.(percent, `Processing... ${attempts * 5}s`);

      if (status.status === 'completed') {
        onProgress?.(95, 'Downloading results...');
        return status.data;
      }
      if (status.status === 'failed') {
        throw new Error(`Crawl failed: ${status.error}`);
      }

      attempts++;
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    throw new Error('Crawl timed out');
  }
}

class FirecrawlGUI {
  private mainWindow: BrowserWindow | null = null;
  private api: FirecrawlAPI;

  constructor() {
    this.api = new FirecrawlAPI();
    this.setupIPC();
  }

  private setupIPC() {
    ipcMain.on('start-crawl', async (event, { url, mode, options, outputFolder }) => {
      try {
        const sendProgress = (percent: number, message: string) => {
          event.sender.send('progress', { percent, message });
        };

        // Create output directory
        const outputPath = path.join(process.cwd(), OUTPUT_DIR, outputFolder);
        await fs.mkdir(outputPath, { recursive: true });

        // Process based on mode
        let data: any[];
        switch (mode) {
          case 'map':
            sendProgress(50, 'Mapping site...');
            data = await this.api.map(url, options);
            break;
          case 'crawl':
            data = await this.api.crawl(url, options, sendProgress);
            break;
          default: // scrape
            sendProgress(50, 'Scraping page...');
            data = await this.api.scrape(url, options);
        }

        // Save results
        sendProgress(98, 'Saving results...');
        for (const [index, item] of data.entries()) {
          const title = item.metadata?.title || `page_${index}`;
          const filename = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.md`;
          const filePath = path.join(outputPath, filename);
          
          // Format markdown with frontmatter
          const content = `---\n${Object.entries(item.metadata || {})
            .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
            .join('\n')}\n---\n\n${item.data?.markdown || ''}`;
          
          await fs.writeFile(filePath, content, 'utf8');
        }

        event.sender.send('complete', {
          success: true,
          message: `Saved ${data.length} files to ${outputFolder}/`
        });
      } catch (error) {
        event.sender.send('complete', {
          success: false,
          message: error.message
        });
      }
    });
  }

  async start() {
    await app.whenReady();
    this.createWindow();

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createWindow();
      }
    });
  }

  private createWindow() {
    this.mainWindow = new BrowserWindow({
      width: 800,
      height: 800,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });

    // Load the GUI HTML file
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    this.mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }
}

// Start the application
if (require.main === module) {
  const gui = new FirecrawlGUI();
  gui.start().catch(console.error);
}

export { FirecrawlAPI, CrawlOptions, CrawlResponse }; 