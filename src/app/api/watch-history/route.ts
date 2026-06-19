import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic'; // ← ADD THIS LINE

// GET - Fetch user's watch history
export async function GET(request: NextRequest) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    // Debug: log the connection
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    
    const history = await sql`
      SELECT 
        id,
        movie_id,
        movie_slug,
        movie_title,
        poster_url,
        progress,
        duration,
        last_watched
      FROM watch_history
      WHERE user_id = ${userId}
      ORDER BY last_watched DESC
      LIMIT 20
    `;
    
    return NextResponse.json({ history });
  } catch (error) {
    console.error('Error fetching watch history:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch watch history',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST - Save/Update watch progress
export async function POST(request: NextRequest) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    const { movieId, movieSlug, movieTitle, posterUrl, progress, duration } = body;
    
    if (!movieId || !movieSlug || !movieTitle) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Upsert: update if exists, insert if not
    const result = await sql`
      INSERT INTO watch_history (user_id, movie_id, movie_slug, movie_title, poster_url, progress, duration, last_watched)
      VALUES (${userId}, ${movieId}, ${movieSlug}, ${movieTitle}, ${posterUrl}, ${progress}, ${duration}, NOW())
      ON CONFLICT (user_id, movie_id) 
      DO UPDATE SET 
        progress = EXCLUDED.progress,
        duration = EXCLUDED.duration,
        poster_url = EXCLUDED.poster_url,
        last_watched = NOW()
      RETURNING *
    `;
    
    return NextResponse.json({ success: true, history: result[0] });
  } catch (error) {
    console.error('Error saving watch progress:', error);
    return NextResponse.json({ error: 'Failed to save watch progress' }, { status: 500 });
  }
}

// DELETE - Remove a movie from watch history
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
      DELETE FROM watch_history
      WHERE user_id = ${userId} AND movie_id = ${movieId}
    `;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting watch history:', error);
    return NextResponse.json({ error: 'Failed to delete watch history' }, { status: 500 });
  }
}