import { app, BrowserWindow } from 'electron';
import { config } from 'dotenv';
import type { CrawlResponse } from './types';
import path from 'path';
import { mkdir, writeFile } from 'fs/promises';

// Load environment variables
config();

function formatError(err: unknown): Error {
  return err instanceof Error ? err : new Error(String(err));
}

export async function crawlPage(url: string): Promise<CrawlResponse> {
  console.log(`[Crawler] Starting to crawl: ${url}`);
  try {
    const fetchResponse = await fetch(url);
    console.log(`[Crawler] Fetched page: ${fetchResponse.status} ${fetchResponse.statusText}`);
    
    const html = await fetchResponse.text();
    console.log(`[Crawler] Got HTML content: ${html.length} bytes`);
    
    // Extract title
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : 'Untitled';
    console.log(`[Crawler] Extracted title: ${title}`);
    
    // Extract links
    const linkPattern = /<a[^>]+href="([^"]+)"/gi;
    const links: string[] = [];
    let match;
    while ((match = linkPattern.exec(html)) !== null) {
      if (!match[1].startsWith('#')) {
        links.push(match[1]);
      }
    }
    console.log(`[Crawler] Found ${links.length} links`);
    
    // Create response
    const id = Buffer.from(url).toString('base64');
    const crawlResponse: CrawlResponse = {
      id,
      title,
      content: html,
      links,
      metadata: {
        crawledAt: new Date().toISOString(),
        sourceUrl: url
      }
    };
    console.log(`[Crawler] Created response object with ID: ${id}`);
    
    return crawlResponse;
  } catch (err) {
    const error = formatError(err);
    console.error('[Crawler] Error crawling page:', error);
    throw error;
  }
}

export async function saveResponse(response: CrawlResponse, outputDir: string, formats: string[]): Promise<void> {
  console.log(`[Saver] Saving response to: ${outputDir}`);
  console.log(`[Saver] Selected formats:`, formats);
  
  try {
    // Create output directory
    await mkdir(outputDir, { recursive: true });
    console.log(`[Saver] Created directory: ${outputDir}`);
    
    // Save in each format
    for (const format of formats) {
      if (format === 'markdown') {
        console.log(`[Saver] Creating markdown file...`);
        const markdown = `---
title: ${response.title}
source_url: ${response.metadata.sourceUrl}
crawled_at: ${response.metadata.crawledAt}
---

${response.content}`;
        await writeFile(path.join(outputDir, 'index.md'), markdown);
        console.log(`[Saver] Saved markdown to: ${path.join(outputDir, 'index.md')}`);
      }
      
      if (format === 'html') {
        console.log(`[Saver] Saving HTML file...`);
        await writeFile(path.join(outputDir, 'index.html'), response.content);
        console.log(`[Saver] Saved HTML to: ${path.join(outputDir, 'index.html')}`);
      }
      
      if (format === 'links') {
        console.log(`[Saver] Saving links file...`);
        await writeFile(path.join(outputDir, 'links.json'), JSON.stringify(response.links, null, 2));
        console.log(`[Saver] Saved ${response.links.length} links to: ${path.join(outputDir, 'links.json')}`);
      }
    }
    
    console.log(`[Saver] All files saved successfully`);
  } catch (err) {
    const error = formatError(err);
    console.error('[Saver] Error saving response:', error);
    throw error;
  }
}

function createWindow(): Electron.BrowserWindow {
  console.log('[App] Creating main window');
  
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadURL(`file://${__dirname}/dist/index.html`);
  console.log('[App] Loaded index.html');
  
  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools();
    console.log('[App] Opened DevTools (development mode)');
  }
  
  return win;
}

// Only initialize Electron app if this is the main module
if (require.main === module) {
  app.whenReady().then(() => {
    console.log('[App] Application ready, creating window');
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
} 