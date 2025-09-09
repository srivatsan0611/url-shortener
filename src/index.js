import URLShortener from './core/URLShortener.js';
import MongoAdapter from './adapters/MongoAdapter.js';
import ConfigManager from './core/ConfigManager.js';

// Main export
export { URLShortener, MongoAdapter, ConfigManager };

// Default export
export default URLShortener;