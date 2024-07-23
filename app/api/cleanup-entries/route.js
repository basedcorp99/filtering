import { NextResponse } from 'next/server';
import pool from '@lib/db';

export async function GET() {
  try {
    const query = `
      DELETE FROM redirects
      WHERE last_access < NOW() - INTERVAL '36 hours';
    `;

    await pool.query(query);

    return NextResponse.json({ message: 'Old entries deleted successfully' });
  } catch (error) {
    console.error('Error deleting old entries:', error);
    return NextResponse.error(new Error('Failed to delete old entries'));
  }
}
