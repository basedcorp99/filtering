import { NextResponse } from 'next/server';
import pool from '@lib/db';

export default async function handler(req, res) {
  if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end('Unauthorized');
  }

  try {
    const query = `
      DELETE FROM entries
      WHERE last_access < NOW() - INTERVAL '36 hours';
    `;

    await pool.query(query);

    return res.status(200).json({ message: 'Old entries deleted successfully' });
  } catch (error) {
    console.error('Error deleting old entries:', error);
    return res.status(500).json({ error: 'Failed to delete old entries' });
  }
}
