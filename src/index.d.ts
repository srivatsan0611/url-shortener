import { Router } from 'express';

export interface URLShortenerConfig {
  /** MongoDB connection string */
  mongoUri?: string;
  /** Alternative to mongoUri */
  connectionString?: string;
  /** Base URL for short links (required) */
  baseUrl: string;
  /** Length of generated short IDs (default: 6) */
  idLength?: number;
  /** ID alphabet for generation */
  idAlphabet?: string;
  /** Database adapter type (default: 'mongodb') */
  adapter?: 'mongodb';
  /** Enable analytics tracking (default: true) */
  analytics?: boolean;
}

export interface ShortenOptions {
  /** Custom alias for the short URL */
  customAlias?: string;
  /** Expiration time (future feature) */
  expiresIn?: string;
}

export interface ResolveOptions {
  /** Whether to track this click */
  trackClick?: boolean;
  /** Additional metadata to store */
  metadata?: {
    ip?: string;
    userAgent?: string;
    referrer?: string;
  };
}

export interface ShortenResult {
  /** The generated short ID */
  shortId: string;
  /** The complete short URL */
  shortUrl: string;
  /** The original URL */
  originalUrl: string;
}

export interface VisitEntry {
  timestamp: number;
  ip?: string;
  userAgent?: string;
  referrer?: string;
}

export interface AnalyticsResult {
  /** The short ID */
  shortId: string;
  /** Original URL */
  originalUrl: string;
  /** Total number of clicks */
  totalClicks: number;
  /** Number of unique clicks (by IP) */
  uniqueClicks: number;
  /** Recent clicks (last 30 days) */
  recentClicks: number;
  /** Clicks today */
  clicksToday: number;
  /** When the URL was created */
  createdAt: Date;
  /** When last clicked (null if never) */
  lastClicked: Date | null;
}

export interface ListOptions {
  /** Number of results to return (default: 50) */
  limit?: number;
  /** Number of results to skip */
  skip?: number;
  /** Field to sort by (default: 'createdAt') */
  sortBy?: string;
  /** Sort order: 1 for ascending, -1 for descending (default: -1) */
  sortOrder?: 1 | -1;
}

export interface URLDocument {
  shortId: string;
  redirectURL: string;
  visitHistory: VisitEntry[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BulkShortenResult {
  shortId?: string;
  shortUrl?: string;
  originalUrl?: string;
  url?: string;
  error?: string;
}

/**
 * Main URLShortener class
 */
export class URLShortener {
  constructor(config: URLShortenerConfig);
  
  /**
   * Shorten a URL
   * @param url - The URL to shorten
   * @param options - Additional options
   * @returns Promise resolving to shortened URL data
   */
  shorten(url: string, options?: ShortenOptions): Promise<ShortenResult>;
  
  /**
   * Resolve a short ID to original URL
   * @param shortId - The short ID to resolve
   * @param options - Resolution options
   * @returns Promise resolving to original URL
   */
  resolve(shortId: string, options?: ResolveOptions): Promise<string>;
  
  /**
   * Get analytics for a short URL
   * @param shortId - The short ID to get analytics for
   * @returns Promise resolving to analytics data
   */
  getAnalytics(shortId: string): Promise<AnalyticsResult>;
  
  /**
   * Delete a short URL
   * @param shortId - The short ID to delete
   * @returns Promise resolving to deletion success
   */
  delete(shortId: string): Promise<boolean>;
  
  /**
   * List URLs with pagination
   * @param options - Listing options
   * @returns Promise resolving to array of URLs
   */
  list(options?: ListOptions): Promise<URLDocument[]>;
  
  /**
   * Shorten multiple URLs
   * @param urls - Array of URLs to shorten
   * @returns Promise resolving to array of results
   */
  bulkShorten(urls: string[]): Promise<BulkShortenResult[]>;
  
  /**
   * Get Express middleware for URL shortener routes
   * @returns Express Router with URL shortener endpoints
   */
  middleware(): Router;
}

/**
 * MongoDB adapter for URL storage
 */
export class MongoAdapter {
  constructor(mongoUri: string);
  connect(): Promise<void>;
  create(data: any): Promise<any>;
  findByShortId(shortId: string): Promise<URLDocument | null>;
  incrementClicks(shortId: string, metadata?: any): Promise<URLDocument | null>;
  getAnalytics(shortId: string): Promise<AnalyticsResult>;
  delete(shortId: string): Promise<boolean>;
  list(options?: ListOptions): Promise<URLDocument[]>;
}

/**
 * Configuration manager
 */
export class ConfigManager {
  constructor(userConfig?: Partial<URLShortenerConfig>);
  validate(): void;
  get(key: keyof URLShortenerConfig): any;
  set(key: keyof URLShortenerConfig, value: any): void;
  getAll(): URLShortenerConfig;
}

// Default export
export default URLShortener;