import pool from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { streamName, destinationLink, utm, ttclid } = req.body;

    // Check if the stream name already exists
    const { rows: existingEntries } = await pool.query(
      'SELECT * FROM entries WHERE stream_name = $1',
      [streamName]
    );

    if (existingEntries.length > 0) {
      return res.status(400).json({ error: 'An entry with this Stream Name already exists' });
    }

    try {
      const result = await pool.query(
        'INSERT INTO entries (stream_name, destination_link, utm, ttclid) VALUES ($1, $2, $3, $4) RETURNING *',
        [streamName, destinationLink, utm, ttclid]
      );
      res.status(200).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM entries');
      res.status(200).json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
