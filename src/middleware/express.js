import express from "express";

function createExpressMiddleware(shortener) {
  const router = express.Router();
  
  // POST /shorten - Create short URL
  router.post('/shorten', async (req, res) => {
    try {
      const { url, customAlias } = req.body;
      
      if (!url) {
        return res.status(400).json({ 
          success: false, 
          error: 'URL is required' 
        });
      }
      
      const result = await shortener.shorten(url, { customAlias });
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        error: error.message 
      });
    }
  });
  
  // GET /:shortId - Redirect to original URL
  router.get('/:shortId', async (req, res) => {
    try {
      const { shortId } = req.params;
      
      const originalUrl = await shortener.resolve(shortId, {
        trackClick: true,
        metadata: {
          ip: req.ip || req.connection.remoteAddress,
          userAgent: req.get('User-Agent'),
          referrer: req.get('Referrer')
        }
      });
      
      res.redirect(originalUrl);
    } catch (error) {
      res.status(404).json({ 
        success: false, 
        error: 'URL not found' 
      });
    }
  });
  
  // GET /analytics/:shortId - Get analytics
  router.get('/analytics/:shortId', async (req, res) => {
    try {
      const { shortId } = req.params;
      const analytics = await shortener.getAnalytics(shortId);
      
      res.json({
        success: true,
        data: analytics
      });
    } catch (error) {
      res.status(404).json({ 
        success: false, 
        error: error.message 
      });
    }
  });
  
  // DELETE /:shortId - Delete short URL
  router.delete('/:shortId', async (req, res) => {
    try {
      const { shortId } = req.params;
      const deleted = await shortener.delete(shortId);
      
      if (deleted) {
        res.json({
          success: true,
          message: 'URL deleted successfully'
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'URL not found'
        });
      }
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  });
  
  // GET /list - List all URLs (with pagination)
  router.get('/list', async (req, res) => {
    try {
      const { limit = 10, page = 1, sortBy = 'createdAt' } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const urls = await shortener.list({
        limit: parseInt(limit),
        skip,
        sortBy
      });
      
      res.json({
        success: true,
        data: urls,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  });
  
  return router;
}

export default createExpressMiddleware;