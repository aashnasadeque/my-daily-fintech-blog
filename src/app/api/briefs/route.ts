import { NextResponse } from 'next/server';
import { getAllBriefs } from '@/lib/briefStorage';

/**
 * GET /api/briefs
 * Returns all briefs from the data/briefs/ folder (server-generated).
 */
export async function GET() {
  try {
    const briefs = getAllBriefs();
    return NextResponse.json(briefs);
  } catch (error) {
    console.error('Error fetching briefs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch briefs' },
      { status: 500 }
    );
  }
}
