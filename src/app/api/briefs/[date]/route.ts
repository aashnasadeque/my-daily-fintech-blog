import { NextResponse } from 'next/server';
import { getBriefByDate } from '@/lib/briefStorage';

/**
 * GET /api/briefs/[date]
 * Returns a specific brief by date from the data/briefs/ folder.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ date: string }> }
) {
  const { date } = await params;

  try {
    const brief = getBriefByDate(date);

    if (!brief) {
      return NextResponse.json(
        { error: 'Brief not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(brief);
  } catch (error) {
    console.error(`Error fetching brief for ${date}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch brief' },
      { status: 500 }
    );
  }
}
