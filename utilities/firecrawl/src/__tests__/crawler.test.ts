import { jest } from '@jest/globals';
import { crawlPage } from '../index';

// Mock fetch
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
global.fetch = mockFetch;

describe('crawlPage', () => {
  beforeEach(() => {
    mockFetch.mockClear();
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

    mockFetch.mockResolvedValueOnce({
      status: 200,
      statusText: 'OK',
      text: () => Promise.resolve(mockHtml)
    } as Response);

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
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(crawlPage('https://error-url.com')).rejects.toThrow('Network error');
  });
}); 