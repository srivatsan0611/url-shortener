const DEFAULT_CONFIG = {
  // Database
  adapter: 'mongodb',
  mongoUri: 'mongodb+srv://srivatsansrinivasan03:wixI3ENIgtHHc4NS@url-shortener.swmwy.mongodb.net/?retryWrites=true&w=majority&appName=url-shortener',
  
  // URL Generation
  idLength: 6,
  idAlphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  baseUrl: 'http://localhost:3000',
  
  // Features
  analytics: true,
  
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // requests per window
  }
};

class ConfigManager {
  constructor(userConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...userConfig };
    this.validate();
  }

  validate() {
    if (!this.config.baseUrl) {
      throw new Error('baseUrl is required');
    }
    
    if (this.config.idLength < 3 || this.config.idLength > 20) {
      throw new Error('idLength must be between 3 and 20');
    }
    
    if (this.config.adapter === 'mongodb' && !this.config.mongoUri) {
      throw new Error('mongoUri is required for MongoDB adapter');
    }
  }

  get(key) {
    return this.config[key];
  }

  set(key, value) {
    this.config[key] = value;
    this.validate();
  }

  getAll() {
    return { ...this.config };
  }
}

export default ConfigManager;