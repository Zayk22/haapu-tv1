import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  const { userId, sessionClaims } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const role = (sessionClaims as any)?.role;
  if (role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  try {
    const body = await request.json();
    const {
      title,
      slug,
      description,
      posterUrl,
      backdropUrl,
      videoEmbedUrl,
      duration,
      genres,
      rating,
      accessType = 'free',
      type = 'movie',
    } = body;
    
    if (!title || !slug || !videoEmbedUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, videoEmbedUrl' },
        { status: 400 }
      );
    }
    
    const genresArray = genres ? genres.split(',').map((g: string) => g.trim()) : [];
    
    const result = await sql`
      INSERT INTO movies (title, slug, description, poster_url, backdrop_url, video_embed_url, duration, genres, rating, access_type, type)
      VALUES (${title}, ${slug}, ${description || null}, ${posterUrl || null}, ${backdropUrl || null}, ${videoEmbedUrl}, ${duration || null}, ${genresArray}, ${parseFloat(rating) || 0}, ${accessType}, ${type})
      RETURNING *
    `;
    
    return NextResponse.json({ success: true, movie: result[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating movie:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}