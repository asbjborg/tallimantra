import { jest } from '@jest/globals';
import type { CrawlResponse } from '../types';
import { crawlPage, saveResponse } from '../index';
import { mkdir, writeFile } from 'fs/promises';

// Mock fs/promises
jest.mock('fs/promises', () => ({
  mkdir: jest.fn(() => Promise.resolve()),
  writeFile: jest.fn(() => Promise.resolve())
}));

// Mock fetch
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
global.fetch = mockFetch;

// Helper to mock fetch responses
function mockFetchResponse(html: string, status = 200): void {
  mockFetch.mockResolvedValueOnce({
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    text: () => Promise.resolve(html)
  } as Response);
}

describe('Crawler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('crawlPage', () => {
    it('should extract title and links from HTML', async () => {
      const mockHtml = `
        <html>
          <head>
            <title>Test Page</title>
          </head>
          <body>
            <a href="https://example.com/page1">Link 1</a>
            <a href="https://example.com/page2">Link 2</a>
            <a href="#skip">Skip Link</a>
          </body>
        </html>
      `;
      mockFetchResponse(mockHtml);

      const result = await crawlPage('https://example.com');

      expect(result.title).toBe('Test Page');
      expect(result.links).toHaveLength(2); // Skip link should be filtered
      expect(result.links).toContain('https://example.com/page1');
      expect(result.links).toContain('https://example.com/page2');
    });

    it('should handle missing title', async () => {
      const mockHtml = '<html><body>No title here</body></html>';
      mockFetchResponse(mockHtml);

      const result = await crawlPage('https://example.com');

      expect(result.title).toBe('Untitled');
    });

    it('should handle fetch errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(crawlPage('https://example.com')).rejects.toThrow('Network error');
    });

    it('should handle malformed HTML', async () => {
      const mockHtml = 'Not really HTML';
      mockFetchResponse(mockHtml);

      const result = await crawlPage('https://example.com');

      expect(result.title).toBe('Untitled');
      expect(result.links).toHaveLength(0);
    });

    it('should handle non-200 responses', async () => {
      mockFetchResponse('Error page', 404);

      const result = await crawlPage('https://example.com');

      expect(result.title).toBe('Untitled');
      expect(result.content).toBe('Error page');
    });
  });

  describe('saveResponse', () => {
    const mockResponse: CrawlResponse = {
      id: 'test',
      title: 'Test Page',
      content: '<html>Test content</html>',
      links: ['https://example.com/page1'],
      metadata: {
        crawledAt: '2024-01-01T00:00:00Z',
        sourceUrl: 'https://example.com'
      }
    };

    it('should save files in selected formats', async () => {
      const mockWriteFile = writeFile as jest.MockedFunction<typeof writeFile>;
      const mockMkdir = mkdir as jest.MockedFunction<typeof mkdir>;
      
      await saveResponse(mockResponse, '/test/output', ['markdown', 'html', 'links']);

      // Should create directory
      expect(mockMkdir).toHaveBeenCalledWith('/test/output', { recursive: true });
      
      // Should create all three files
      expect(mockWriteFile).toHaveBeenCalledTimes(3);
      
      // Get all calls
      const calls = mockWriteFile.mock.calls as Array<[string, string]>;
      
      // Check markdown content
      const markdownCall = calls.find(call => call[0].endsWith('index.md'));
      expect(markdownCall?.[1]).toContain('title: Test Page');
      expect(markdownCall?.[1]).toContain('source_url: https://example.com');
      
      // Check HTML content
      const htmlCall = calls.find(call => call[0].endsWith('index.html'));
      expect(htmlCall?.[1]).toBe('<html>Test content</html>');
      
      // Check links content
      const linksCall = calls.find(call => call[0].endsWith('links.json'));
      const linksContent = linksCall?.[1] ? JSON.parse(linksCall[1]) : [];
      expect(linksContent).toEqual(['https://example.com/page1']);
    });

    it('should handle filesystem errors', async () => {
      const mockMkdir = mkdir as jest.MockedFunction<typeof mkdir>;
      mockMkdir.mockRejectedValueOnce(new Error('Disk full'));

      await expect(
        saveResponse(mockResponse, '/test/output', ['markdown'])
      ).rejects.toThrow('Disk full');
    });

    it('should only save selected formats', async () => {
      const mockWriteFile = writeFile as jest.MockedFunction<typeof writeFile>;
      const mockMkdir = mkdir as jest.MockedFunction<typeof mkdir>;
      
      await saveResponse(mockResponse, '/test/output', ['markdown']);

      // Should create directory
      expect(mockMkdir).toHaveBeenCalledWith('/test/output', { recursive: true });
      
      // Should only create markdown file
      expect(mockWriteFile).toHaveBeenCalledTimes(1);
      expect(mockWriteFile.mock.calls[0]?.[0]).toMatch(/index\.md$/);
    });
  });
}); 