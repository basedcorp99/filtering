import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function GET() {
  try {
    const { rows } = await pool.query('SELECT * FROM entries');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.error(new Error(error.message));
  }
}

export async function POST(request) {
  const { streamName, destinationLink, utm, ttclid } = await request.json();

  try {
    await pool.query(
      'INSERT INTO entries (stream_name, destination_link, utm, ttclid) VALUES ($1, $2, $3, $4)',
      [streamName, destinationLink, utm, ttclid]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.error(new Error(error.message));
  }
}
