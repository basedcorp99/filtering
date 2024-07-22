import pool from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { destinationLink, utm, ttclid } = req.body;
    try {
      const result = await pool.query(
        'UPDATE entries SET destination_link = $1, utm = $2, ttclid = $3 WHERE id = $4 RETURNING *',
        [destinationLink, utm, ttclid, id]
      );
      res.status(200).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const result = await pool.query('DELETE FROM entries WHERE id = $1 RETURNING *', [id]);
      res.status(200).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM entries WHERE id = $1', [id]);
      res.status(200).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
