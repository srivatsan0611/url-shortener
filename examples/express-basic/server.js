import express from 'express';
import dotenv from 'dotenv';
import { URLShortener } from '../../src/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize URL Shortener with shared hosted database
const shortener = new URLShortener({
  mongoUri: process.env.MONGO_URI, // Uses shared hosted MongoDB by default
  baseUrl: process.env.BASE_URL || `http://localhost:${PORT}`
});

// Mount URL shortener middleware
app.use('/api/urls', shortener.middleware());

// Custom route example
app.post('/api/create-link', async (req, res) => {
  try {
    const { url, customId } = req.body;
    
    const result = await shortener.shorten(url, { 
      customAlias: customId 
    });
    
    res.json({
      success: true,
      shortUrl: result.shortUrl,
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?data=${result.shortUrl}`,
      message: 'URL shortened successfully!'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Home page
app.get('/', (req, res) => {
  res.json({
    message: 'URL Shortener SDK Example',
    endpoints: {
      'POST /api/urls/shorten': 'Create short URL',
      'GET /api/urls/:shortId': 'Redirect to original URL',
      'GET /api/urls/analytics/:shortId': 'Get analytics',
      'DELETE /api/urls/:shortId': 'Delete short URL',
      'GET /api/urls/list': 'List all URLs',
      'POST /api/create-link': 'Custom endpoint with QR code'
    },
    example: {
      createUrl: {
        method: 'POST',
        url: '/api/urls/shorten',
        body: {
          url: 'https://google.com',
          customAlias: 'my-link' // optional
        }
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`URL Shortener Example Server running on http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/api/urls/list`);
});