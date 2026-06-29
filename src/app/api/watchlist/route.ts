import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const watchlist = await sql`
      SELECT id, movie_id, movie_slug, movie_title, poster_url, added_at
      FROM watchlist
      WHERE user_id = ${userId}
      ORDER BY added_at DESC
    `;
    return NextResponse.json({ watchlist });
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    return NextResponse.json({ error: 'Failed to fetch watchlist' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { movieId, movieSlug, movieTitle, posterUrl } = body;
    
    if (!movieId || !movieSlug || !movieTitle) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO watchlist (user_id, movie_id, movie_slug, movie_title, poster_url, added_at)
      VALUES (${userId}, ${movieId}, ${movieSlug}, ${movieTitle}, ${posterUrl}, NOW())
      ON CONFLICT (user_id, movie_id) DO NOTHING
      RETURNING *
    `;
    
    return NextResponse.json({ success: true, item: result[0] });
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    return NextResponse.json({ error: 'Failed to add to watchlist' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get('movieId');
    
    if (!movieId) {
      return NextResponse.json({ error: 'Movie ID required' }, { status: 400 });
    }

    await sql`
      DELETE FROM watchlist
      WHERE user_id = ${userId} AND movie_id = ${movieId}
    `;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return NextResponse.json({ error: 'Failed to remove from watchlist' }, { status: 500 });
  }
}