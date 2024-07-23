import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';
import { invalidateCache } from '../../../../lib/cache';


export async function GET(request, { params }) {
  const { id } = params;

  try {
    const { rows } = await pool.query('SELECT * FROM entries WHERE id = $1', [id]);
    const entry = rows[0];

    if (!entry) {
      return NextResponse.error(new Error('Entry not found'));
    }

    return NextResponse.json(entry);
  } catch (error) {
    return NextResponse.error(new Error(error.message));
  }
}

export async function PUT(request, { params }) {
  const { id } = params;
  const body = await request.json();

  try {
    const { stream_name, destination_link, utm, ttclid } = body;
    await pool.query(
      'UPDATE entries SET destination_link = $1, utm = $2, ttclid = $3 WHERE id = $4',
      [destination_link, utm, ttclid, id]
    );
    // Invalidate the cache for the updated stream_name
    invalidateCache(stream_name);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    await pool.query('DELETE FROM entries WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.error(new Error(error.message));
  }
}
