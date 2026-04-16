const axios = require('axios');
const { ebay } = require('../config/env');
const RateLimiter = require('../utils/rateLimiter');
const retry = require('../utils/retry');
const { app } = require('../config/env');

let cachedToken = null;
let cachedExpiry = 0;
const ebayLimiter = new RateLimiter({ minDelayMs: app.ebayDelayMs });

async function getAccessToken() {
  const now = Date.now();
  if (cachedToken && now < cachedExpiry) return cachedToken;
  if (!ebay.clientId || !ebay.clientSecret) {
    throw new Error('Missing eBay API credentials');
  }

  const credentials = Buffer.from(`${ebay.clientId}:${ebay.clientSecret}`).toString('base64');
  const response = await axios.post(
    'https://api.ebay.com/identity/v1/oauth2/token',
    'grant_type=client_credentials&scope=https%3A%2F%2Fapi.ebay.com%2Foauth%2Fapi_scope',
    {
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );

  cachedToken = response.data.access_token;
  cachedExpiry = now + ((response.data.expires_in || 7200) * 1000) - 60000;
  return cachedToken;
}

async function ebayGet(url, params = {}) {
  return retry(async () => {
    await ebayLimiter.wait();
    const token = await getAccessToken();
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-EBAY-C-MARKETPLACE-ID': ebay.marketplaceId
      },
      params,
      timeout: 60000
    });
    return response.data;
  });
}

async function searchItems({ query, limit = 50, offset = 0 }) {
  return ebayGet('https://api.ebay.com/buy/browse/v1/item_summary/search', {
    q: query,
    limit,
    offset,
    filter: [
      'category_Ids:9355',
      'price:[200..5000]',
      'conditionIds:{1000}',
    ].join(',')
  });
}

async function getItem(itemId) {
  return ebayGet(`https://api.ebay.com/buy/browse/v1/item/${encodeURIComponent(itemId)}`);
}

module.exports = { searchItems, getItem };
