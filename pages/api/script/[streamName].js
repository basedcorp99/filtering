import pool from '../../../lib/db';

export default async function handler(req, res) {
  const { streamName } = req.query;

  try {
    const { rows } = await pool.query('SELECT * FROM entries WHERE stream_name = $1', [streamName]);
    const entry = rows[0];

    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    const { destination_link, utm, ttclid } = entry;

    if (!destination_link) {
      return res.setHeader('Content-Type', 'application/javascript').send('');
    }

    // Base script code
    // Placeholder for base script code
    let scriptContent = `
      (function() {
        function getQueryParam(param) {
          var params = new URLSearchParams(window.location.search);
          return params.get(param);
        }
    `;

    if (utm && ttclid) {
      // UTM and TTCLID Script Code
      scriptContent += `
        if (getQueryParam('ttclid') && getQueryParam('utm_term') !== '__AID_NAME__') {
          window.location.href = "${destination_link}";
        }
      `;
    } else if (utm) {
      // UTM Script Code
      scriptContent += `
        if (getQueryParam('utm_term') !== '__AID_NAME__') {
          window.location.href = "${destination_link}";
        }
      `;
    } else if (ttclid) {
      // TTCLID Script Code
      scriptContent += `
        if (getQueryParam('ttclid')) {
          window.location.href = "${destination_link}";
        }
      `;
    } else {
      // Redirect Script Code
      scriptContent += `
        window.location.href = "${destination_link}";
      `;
    }

    scriptContent += `
      })();
    `;

    res.setHeader('Content-Type', 'application/javascript');
    res.send(scriptContent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
