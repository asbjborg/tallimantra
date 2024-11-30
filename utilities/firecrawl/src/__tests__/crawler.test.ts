import { jest } from '@jest/globals';
import { crawlPage } from '../index';

// Mock fetch
global.fetch = jest.fn();

describe('crawlPage', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('should crawl a page successfully', async () => {
    const mockHtml = `
      <html>
        <head><title>Test Page</title></head>
        <body>
          <a href="https://example.com">Link 1</a>
          <a href="https://test.com">Link 2</a>
        </body>
      </html>
    `;

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      status: 200,
      statusText: 'OK',
      text: () => Promise.resolve(mockHtml)
    });

    const result = await crawlPage('https://test-url.com');

    expect(result).toEqual({
      id: expect.any(String),
      title: 'Test Page',
      content: expect.stringContaining('<title>Test Page</title>'),
      links: ['https://example.com', 'https://test.com'],
      metadata: {
        crawledAt: expect.any(String),
        sourceUrl: 'https://test-url.com'
      }
    });
  });

  it('should handle fetch errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(crawlPage('https://error-url.com')).rejects.toThrow('Network error');
  });
}); 