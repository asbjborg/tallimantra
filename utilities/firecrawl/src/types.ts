export type CrawlMode = 'scrape' | 'crawl' | 'map';

export interface CrawlOptions {
  maxDepth?: number;
  pageLimit?: number;
  includePaths?: string[];
  excludePaths?: string[];
  allowBackwardLinks?: boolean;
  allowExternalLinks?: boolean;
  formats?: ('markdown' | 'html' | 'links' | 'screenshot')[];
}

export interface CrawlResponse {
  id: string;
  title: string;
  content: string;
  links: string[];
  metadata: {
    crawledAt: string;
    sourceUrl: string;
    version?: string;
  };
}

export interface CrawlConfig {
  mode: CrawlMode;
  url: string;
  outputDir: string;
  options: CrawlOptions;
  version?: string;
  clean?: boolean;
  includeFrontmatter?: boolean;
} 