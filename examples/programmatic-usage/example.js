import { URLShortener } from '../../src/index.js';

/**
 * Programmatic Usage Examples
 * This file demonstrates how to use the URLShortener class directly
 * in your application without Express middleware
 */

async function examples() {
  // Initialize the shortener
  const shortener = new URLShortener({
    mongoUri: 'mongodb://localhost:27017/urlshortener_examples',
    baseUrl: 'https://short.ly',
    idLength: 6
  });

  console.log('URL Shortener SDK - Programmatic Usage Examples\n');

  try {
    // Example 1: Basic URL shortening
    console.log('1. Basic URL Shortening:');
    const result1 = await shortener.shorten('https://www.google.com');
    console.log(`   Original: ${result1.originalUrl}`);
    console.log(`   Shortened: ${result1.shortUrl}`);
    console.log(`   Short ID: ${result1.shortId}\n`);

    // Example 2: Custom alias
    console.log('2. Custom Alias:');
    try {
      const result2 = await shortener.shorten('https://github.com', { 
        customAlias: 'github' 
      });
      console.log(`   Custom URL: ${result2.shortUrl}\n`);
    } catch (error) {
      console.log(`   Error: ${error.message} (alias might already exist)\n`);
    }

    // Example 3: Resolving URLs
    console.log('3. Resolving Short URLs:');
    try {
      const originalUrl = await shortener.resolve(result1.shortId, {
        trackClick: true,
        metadata: {
          ip: '192.168.1.1',
          userAgent: 'Mozilla/5.0 Example Browser',
          referrer: 'https://example.com'
        }
      });
      console.log(`   Resolved: ${originalUrl}\n`);
    } catch (error) {
      console.log(`   Error: ${error.message}\n`);
    }

    // Example 4: Analytics
    console.log('4. Getting Analytics:');
    try {
      const analytics = await shortener.getAnalytics(result1.shortId);
      console.log('   Analytics:');
      console.log(`   - Total clicks: ${analytics.totalClicks}`);
      console.log(`   - Unique clicks: ${analytics.uniqueClicks}`);
      console.log(`   - Clicks today: ${analytics.clicksToday}`);
      console.log(`   - Created: ${analytics.createdAt}`);
      console.log(`   - Last clicked: ${analytics.lastClicked || 'Never'}\n`);
    } catch (error) {
      console.log(`   Error: ${error.message}\n`);
    }

    // Example 5: Bulk shortening
    console.log('5. Bulk URL Shortening:');
    const urls = [
      'https://stackoverflow.com',
      'https://developer.mozilla.org',
      'https://nodejs.org',
      'invalid-url' // This will fail
    ];
    
    const bulkResults = await shortener.bulkShorten(urls);
    console.log('   Results:');
    bulkResults.forEach((result, index) => {
      if (result.error) {
        console.log(`   ${index + 1}. Error: ${result.error} (${result.url})`);
      } else {
        console.log(`   ${index + 1}. ${result.originalUrl} → ${result.shortUrl}`);
      }
    });
    console.log('');

    // Example 6: List URLs
    console.log('6. Listing URLs:');
    const urlList = await shortener.list({ limit: 5, sortBy: 'createdAt' });
    console.log(`   Found ${urlList.length} URLs:`);
    urlList.forEach((url, index) => {
      const clickCount = url.visitHistory ? url.visitHistory.length : 0;
      console.log(`   ${index + 1}. ${url.shortId} → ${url.redirectURL} (${clickCount} clicks)`);
    });
    console.log('');

    // Example 7: Error handling
    console.log('7. Error Handling Examples:');
    
    try {
      await shortener.shorten('not-a-valid-url');
    } catch (error) {
      console.log(`   Invalid URL error: ${error.message}`);
    }
    
    try {
      await shortener.resolve('nonexistent123');
    } catch (error) {
      console.log(`   Not found error: ${error.message}`);
    }
    
    try {
      await shortener.getAnalytics('nonexistent123');
    } catch (error) {
      console.log(`   Analytics error: ${error.message}`);
    }

    console.log('\n[SUCCESS] All examples completed successfully!');

  } catch (error) {
    console.error('[ERROR] Error running examples:', error.message);
  }
}

// Run examples if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  examples().catch(console.error);
}

export default examples;