import { nanoid } from "nanoid";
import MongoAdapter from "../adapters/MongoAdapter.js";
import createExpressMiddleware from "../middleware/express.js";

class URLShortener {
  constructor(config = {}) {
    this.config = {
      idLength: 6,
      baseUrl: 'http://localhost:3000',
      analytics: true,
      adapter: 'mongodb',
      mongoUri: 'mongodb+srv://srivatsansrinivasan03:wixI3ENIgtHHc4NS@url-shortener.swmwy.mongodb.net/?retryWrites=true&w=majority&appName=url-shortener',
      ...config
    };
    
    this.adapter = this.initializeAdapter();
  }

  initializeAdapter() {
    switch (this.config.adapter) {
      case 'mongodb':
      default:
        return new MongoAdapter(this.config.mongoUri || this.config.connectionString);
    }
  }

  async shorten(url, options = {}) {
    if (!url || typeof url !== 'string') {
      throw new Error('Invalid URL provided');
    }

    const shortId = options.customAlias || nanoid(this.config.idLength);
    
    const urlData = {
      shortId,
      redirectURL: url,
      visitHistory: [],
      createdAt: new Date(),
      ...options
    };

    await this.adapter.create(urlData);

    return {
      shortId,
      shortUrl: `${this.config.baseUrl}/${shortId}`,
      originalUrl: url
    };
  }

  async resolve(shortId, options = {}) {
    if (!shortId) {
      throw new Error('Short ID is required');
    }

    const urlEntry = await this.adapter.findByShortId(shortId);
    
    if (!urlEntry) {
      throw new Error('URL not found');
    }

    if (options.trackClick && this.config.analytics) {
      await this.adapter.incrementClicks(shortId, options.metadata || {});
    }

    return urlEntry.redirectURL;
  }

  async getAnalytics(shortId) {
    if (!shortId) {
      throw new Error('Short ID is required');
    }

    return await this.adapter.getAnalytics(shortId);
  }

  async delete(shortId) {
    if (!shortId) {
      throw new Error('Short ID is required');
    }

    return await this.adapter.delete(shortId);
  }

  middleware() {
    return createExpressMiddleware(this);
  }

  // Utility methods
  async list(options = {}) {
    return await this.adapter.list(options);
  }

  async bulkShorten(urls) {
    const results = [];
    for (const url of urls) {
      try {
        const result = await this.shorten(url);
        results.push(result);
      } catch (error) {
        results.push({ error: error.message, url });
      }
    }
    return results;
  }
}

export default URLShortener;