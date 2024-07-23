import { NextResponse } from 'next/server';
import { emptyCache } from '../../../lib/cache';

export async function POST() {
  emptyCache();
  return NextResponse.json({ message: 'Cache cleared successfully' }, { status: 200 });
}
