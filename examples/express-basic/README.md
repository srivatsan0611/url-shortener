# Basic Express Example

This example shows how to integrate the URL Shortener SDK into a basic Express.js application.

## Quick Start

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB connection string
   ```

4. Run the example:
   ```bash
   npm run dev
   ```

5. Visit `http://localhost:3000` to see available endpoints

## Available Endpoints

- `GET /` - API documentation and examples
- `POST /api/urls/shorten` - Create short URL
- `GET /api/urls/:shortId` - Redirect to original URL
- `GET /api/urls/analytics/:shortId` - Get analytics
- `DELETE /api/urls/:shortId` - Delete short URL
- `GET /api/urls/list` - List all URLs (paginated)
- `POST /api/create-link` - Custom endpoint with QR code generation

## Example Requests

### Create Short URL
```bash
curl -X POST http://localhost:3000/api/urls/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://google.com", "customAlias": "google"}'
```

### Get Analytics
```bash
curl http://localhost:3000/api/urls/analytics/google
```

### List All URLs
```bash
curl http://localhost:3000/api/urls/list?page=1&limit=5
```