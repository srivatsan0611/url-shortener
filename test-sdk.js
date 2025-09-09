import { URLShortener } from './src/index.js';

/**
 * Simple test script to verify the SDK works
 * Run with: node test-sdk.js
 */

async function testSDK() {
  console.log('Testing URL Shortener SDK...\n');

  try {
    // Test 1: Initialize SDK (uses shared hosted database by default)
    console.log('1. Initializing SDK...');
    const shortener = new URLShortener({
      baseUrl: 'http://localhost:3000'
    });
    console.log('[PASS] SDK initialized successfully\n');

    // Test 2: Shorten URL
    console.log('2. Testing URL shortening...');
    const result = await shortener.shorten('https://www.google.com');
    console.log(`[PASS] URL shortened: ${result.shortUrl}`);
    console.log(`   Short ID: ${result.shortId}\n`);

    // Test 3: Resolve URL
    console.log('3. Testing URL resolution...');
    const resolvedUrl = await shortener.resolve(result.shortId, { trackClick: true });
    console.log(`[PASS] URL resolved: ${resolvedUrl}\n`);

    // Test 4: Get Analytics
    console.log('4. Testing analytics...');
    const analytics = await shortener.getAnalytics(result.shortId);
    console.log(`[PASS] Analytics retrieved:`);
    console.log(`   Total clicks: ${analytics.totalClicks}`);
    console.log(`   Unique clicks: ${analytics.uniqueClicks}\n`);

    // Test 5: List URLs
    console.log('5. Testing URL listing...');
    const urls = await shortener.list({ limit: 3 });
    console.log(`[PASS] Found ${urls.length} URLs in database\n`);

    console.log('[SUCCESS] All tests passed! SDK is working correctly.');
    process.exit(0);

  } catch (error) {
    console.error('[ERROR] Test failed:', error.message);
    console.error('Note: Make sure MongoDB connection is available');
    process.exit(1);
  }
}

testSDK();