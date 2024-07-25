const express = require('express');
const { Pool } = require('pg');
const { LRUCache } = require('lru-cache');

// Set up Express app
const app = express();

// Set up PostgreSQL pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Set up LRU cache
const cache = new LRUCache({
  max: 500, // Maximum number of items in cache
  maxAge: 1000 * 60 * 60, // 1 hour
});
app.use(express.json());

app.get('/script/:proxy', async (req, res) => {
  const streamName = req.params.proxy;
  try {
    // Perform asynchronous database update
    pool.query(
      'UPDATE entries SET last_access = NOW() WHERE stream_name = $1',
      [streamName]
    ).catch(error => {
      console.error('Failed to update last access time:', error);
    });

    // Check LRU cache first
    const cachedScript = cache.get(streamName);
    if (cachedScript) {
      return res.set('Content-Type', 'application/javascript').send(cachedScript);
    }

    const { rows } = await pool.query(
      'SELECT safe_link, money_link, money_active, utm, ttclid FROM entries WHERE stream_name = $1', [streamName]);
    const entry = rows[0];

    if (!entry) {
      return res.status(500).send('Entry not found');
    }

    const { safe_link, money_link, money_active, utm, ttclid } = entry;

    const dest_link = money_active ? money_link : safe_link;

    if (!dest_link) return res.status(200).send('');

    let scriptContent = '(function() {\n';

    if (utm || ttclid) {
      scriptContent += `
        function getQueryParam(param) {
          var params = new URLSearchParams(window.location.search);
          return params.get(param);
        }\n`;
    }

    let conditions = "";
    if (utm) conditions = "getQueryParam('utm_term') !== '__AID_NAME__'";
    if (ttclid) conditions = (conditions ? conditions + " && " : "") + "getQueryParam('ttclid')";

    if (conditions.length) {
      scriptContent += `
        if (${conditions}) {
          window.location.href = "${dest_link}";
        }\n`;
    } else {
      scriptContent += `
        window.location.href = "${dest_link}";\n`;
    }

    scriptContent += '})();';

    // Cache the script content
    if (money_active) {
      cache.set(streamName, scriptContent + "\"fast\"");
    }

    return res.set('Content-Type', 'application/javascript').send(scriptContent);

  } catch (error) {
    console.error(error);
    return res.status(500).send(error.message);
  }
});

app.delete('/script/:proxy', async (req, res) => {
  const streamName = req.params.proxy;
  cache.delete(streamName);
});

app.delete('/script/', async (req, res) => {
  cache.clear();
});

module.exports = app;
