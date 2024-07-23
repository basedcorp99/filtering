import { NextResponse } from 'next/server';
import pool from '@lib/db';

export async function GET() {
  try {
    const { rows } = await pool.query('SELECT * FROM entries');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.error(new Error(error.message));
  }
}

export async function POST(request) {
  const { streamName, safeLink, moneyLink, utm, ttclid } = await request.json();

  try {
    await pool.query(
      'INSERT INTO entries (stream_name, safe_link, money_link, utm, ttclid, last_access) VALUES ($1, $2, $3, $4, $5, NOW())',
      [streamName, safeLink, moneyLink, utm, ttclid]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.error(new Error(error.message));
  }
}
