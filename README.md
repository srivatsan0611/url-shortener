# URL Shortener SDK

A plug-and-play URL shortener SDK for any Node.js application. Get started with just **1 line of code** and **zero database setup**.

[![npm version](https://badge.fury.io/js/%40srivatsan-dev%2Furl-shortener.svg)](https://www.npmjs.com/package/@srivatsan-dev/url-shortener)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Quick Start (Zero Setup Required)

```bash
npm install @srivatsan-dev/url-shortener
```

```javascript
import { URLShortener } from '@srivatsan-dev/url-shortener';

// Works instantly with shared hosted database - no setup needed!
const shortener = new URLShortener({
  baseUrl: 'https://yourdomain.com'
});

// Use as Express middleware
app.use('/api/urls', shortener.middleware());

// Or use programmatically
const result = await shortener.shorten('https://google.com');
console.log(result.shortUrl); // https://yourdomain.com/abc123
```

> **Zero Database Setup Required** - The SDK includes a shared hosted MongoDB database so you can start shortening URLs immediately without any configuration.

## Key Features

- **Instant Setup**: 1 line of code, zero configuration
- **Shared Database**: Hosted MongoDB included - no setup required
- **Lightning Fast**: Built-in analytics and optimized queries
- **Rich Analytics**: Track clicks, unique visitors, geographic data
- **Express Ready**: Drop-in Express middleware
- **Production Ready**: Error handling, validation, rate limiting
- **Fully Configurable**: Override any setting when needed
- **API First**: RESTful API with JSON responses
- **Custom Aliases**: Support for custom short URLs
- **Bulk Operations**: Shorten multiple URLs at once

## Usage Examples

### 1. Express Middleware (Most Popular)

```javascript
import express from 'express';
import { URLShortener } from '@srivatsan-dev/url-shortener';

const app = express();
app.use(express.json());

// Initialize with just baseUrl - database is handled automatically!
const shortener = new URLShortener({
  baseUrl: 'https://myapp.com'
});

// Mount the URL shortener - provides 5 endpoints instantly
app.use('/short', shortener.middleware());

app.listen(3000);
```

**Instant endpoints created:**
- `POST /short/shorten` - Create short URLs
- `GET /short/:id` - Redirect to original URL (tracks analytics)
- `GET /short/analytics/:id` - Get click analytics
- `DELETE /short/:id` - Delete URLs
- `GET /short/list` - List all URLs with pagination

### 2. Programmatic Usage

```javascript
const shortener = new URLShortener({ baseUrl: 'https://short.ly' });

// Shorten any URL
const result = await shortener.shorten('https://example.com');
console.log(result);
// {
//   shortId: 'abc123',
//   shortUrl: 'https://short.ly/abc123',
//   originalUrl: 'https://example.com'
// }

// Custom aliases
await shortener.shorten('https://github.com', { customAlias: 'github' });

// Bulk shortening
const results = await shortener.bulkShorten([
  'https://google.com',
  'https://stackoverflow.com',
  'https://nodejs.org'
]);

// Get detailed analytics
const analytics = await shortener.getAnalytics('abc123');
console.log(`Total clicks: ${analytics.totalClicks}`);
```

### 3. Custom Integration

```javascript
// Add to your existing Express routes
app.post('/api/create-link', async (req, res) => {
  const result = await shortener.shorten(req.body.url, {
    customAlias: req.body.customId
  });
  
  res.json({
    shortUrl: result.shortUrl,
    qrCode: `https://api.qrserver.com/v1/create-qr-code/?data=${result.shortUrl}`
  });
});
```

## Configuration (All Optional)

```javascript
const shortener = new URLShortener({
  // Required
  baseUrl: 'https://yourdomain.com',
  
  // Optional - customize as needed
  idLength: 8,                     // Longer IDs for more URLs
  analytics: true,                 // Enable/disable tracking
  
  // Advanced - override shared database if needed
  mongoUri: 'your-custom-db-uri'   // Use your own database
});
```

## API Endpoints Reference

When using Express middleware, you get these endpoints automatically:

### Create Short URL
```bash
POST /shorten
Content-Type: application/json

{
  "url": "https://example.com",
  "customAlias": "my-link" // optional
}

# Response:
{
  "success": true,
  "data": {
    "shortId": "abc123",
    "shortUrl": "https://yourdomain.com/abc123",
    "originalUrl": "https://example.com"
  }
}
```

### Get Analytics
```bash
GET /analytics/abc123

# Response:
{
  "success": true,
  "data": {
    "shortId": "abc123",
    "originalUrl": "https://example.com",
    "totalClicks": 42,
    "uniqueClicks": 28,
    "clicksToday": 5,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "lastClicked": "2024-01-15T10:30:00.000Z"
  }
}
```

## Shared Database Benefits

The SDK comes with a **free shared MongoDB database** that provides:

- **Instant functionality** - no database setup required  
- **High availability** - hosted on MongoDB Atlas  
- **Automatic scaling** - handles traffic spikes  
- **Data persistence** - your URLs are safely stored  
- **Analytics included** - click tracking out of the box  

> **Note**: All users share the same database, making it perfect for demos, prototypes, and small projects. For production use with sensitive data, consider using your own MongoDB instance.

## Live Examples & Testing

### Quick Test
```bash
# Clone and test immediately
git clone https://github.com/srivatsan0611/url-shortener.git
cd url-shortener
npm install
node test-sdk.js  # Works instantly with shared database!
```

### Run Examples
```bash
# Basic Express example
npm run dev

# Microservice example
node examples/standalone-service/microservice.js

# Programmatic examples
node examples/programmatic-usage/example.js
```

## Custom Database (Optional)

Want to use your own database? Just provide your MongoDB URI:

```javascript
const shortener = new URLShortener({
  baseUrl: 'https://yourdomain.com',
  mongoUri: 'mongodb://your-database-uri'  // Override shared database
});
```

## Production Deployment

The SDK is production-ready with:
- Error handling and validation
- Rate limiting capabilities  
- Analytics and monitoring
- TypeScript support
- Comprehensive logging

```javascript
const shortener = new URLShortener({
  baseUrl: process.env.BASE_URL,
  mongoUri: process.env.MONGO_URI,  // Use your production database
  analytics: true
});
```

## Perfect For

- **Rapid Prototyping** - Start immediately without setup
- **Demo Applications** - Impress with working URLs instantly  
- **Learning Projects** - Focus on your app, not infrastructure
- **Microservices** - Add URL shortening to any service
- **Production Apps** - Scale with your own database when ready

## Community & Shared Database

By using the shared database, you join a community of developers building with this SDK. Your short URLs become part of a larger ecosystem, making the service more robust and reliable for everyone.

## Development & Contributing

### Local Development Setup

1. Clone the repository
```bash
git clone https://github.com/srivatsan0611/url-shortener.git
cd url-shortener
```

2. Install dependencies
```bash
npm install
```

3. Run examples locally
```bash
# Basic Express example
npm run dev

# Test SDK functionality
node test-sdk.js

# Run microservice
node examples/standalone-service/microservice.js
```

### Tech Stack

**Backend**: Node.js, Express.js  
**Database**: MongoDB, Mongoose  
**URL Generation**: NanoID  
**Package Manager**: NPM  
**Version Control**: Git

### Project Structure

```
url-shortener/
├── src/                    # SDK source code
│   ├── core/              # Main URLShortener class
│   ├── adapters/          # Database adapters
│   ├── middleware/        # Express middleware
│   └── index.js           # Main exports
├── examples/              # Integration examples
└── test-sdk.js           # Test script
```

## Support & Contributing

- [Report Issues](https://github.com/srivatsan0611/url-shortener/issues)  
- [Request Features](https://github.com/srivatsan0611/url-shortener/issues)
- [View Examples](./examples/)
- GitHub: [@srivatsan0611](https://github.com/srivatsan0611)

### Contributing Guidelines

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Show Your Support

If this SDK helped you build something awesome, give it a star on GitHub!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built for the developer community. Start shortening URLs and integrating it to your own use case in 30 seconds.**