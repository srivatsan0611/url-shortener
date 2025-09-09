import express from 'express';
import { URLShortener } from '../../src/index.js';

/**
 * Standalone URL Shortener Microservice
 * This example shows how to create a dedicated microservice
 * that other applications can consume via REST API
 */

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'url-shortener-microservice',
    timestamp: new Date().toISOString()
  });
});

// Initialize URL Shortener with production config
const shortener = new URLShortener({
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/urlshortener_microservice',
  baseUrl: process.env.BASE_URL || `http://localhost:${PORT}`,
  idLength: 8, // Longer IDs for better collision resistance
  analytics: true
});

// API routes with versioning
app.use('/api/v1/urls', shortener.middleware());

// Batch operations endpoint
app.post('/api/v1/urls/batch', async (req, res) => {
  try {
    const { urls } = req.body;
    
    if (!Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'urls array is required'
      });
    }
    
    if (urls.length > 100) {
      return res.status(400).json({
        success: false,
        error: 'Maximum 100 URLs per batch'
      });
    }
    
    const results = await shortener.bulkShorten(urls);
    
    res.json({
      success: true,
      data: results,
      processed: results.length,
      successful: results.filter(r => !r.error).length,
      failed: results.filter(r => r.error).length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Metrics endpoint for monitoring
app.get('/api/v1/metrics', async (req, res) => {
  try {
    const urls = await shortener.list({ limit: 1000 });
    const totalUrls = urls.length;
    const totalClicks = urls.reduce((sum, url) => sum + url.visitHistory.length, 0);
    
    res.json({
      success: true,
      metrics: {
        totalUrls,
        totalClicks,
        averageClicksPerUrl: totalUrls > 0 ? Math.round(totalClicks / totalUrls) : 0,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// API documentation
app.get('/', (req, res) => {
  res.json({
    service: 'URL Shortener Microservice',
    version: '1.0.0',
    documentation: {
      'POST /api/v1/urls/shorten': 'Create short URL',
      'GET /api/v1/urls/:id': 'Redirect to original URL',
      'GET /api/v1/urls/analytics/:id': 'Get URL analytics',
      'DELETE /api/v1/urls/:id': 'Delete URL',
      'GET /api/v1/urls/list': 'List URLs with pagination',
      'POST /api/v1/urls/batch': 'Create multiple URLs',
      'GET /api/v1/metrics': 'Service metrics',
      'GET /health': 'Health check'
    },
    examples: {
      createUrl: 'POST /api/v1/urls/shorten {"url": "https://example.com"}',
      batchCreate: 'POST /api/v1/urls/batch {"urls": ["https://google.com", "https://github.com"]}',
      getMetrics: 'GET /api/v1/metrics'
    }
  });
});

app.listen(PORT, () => {
  console.log(`URL Shortener Microservice running on port ${PORT}`);
  console.log(`Health: http://localhost:${PORT}/health`);
  console.log(`Metrics: http://localhost:${PORT}/api/v1/metrics`);
});