import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

// Helper to find movie by either ID or slug
async function findMovie(identifier: string) {
  const isNumeric = /^\d+$/.test(identifier);
  
  if (isNumeric) {
    return await sql`SELECT * FROM movies WHERE id = ${parseInt(identifier)}`;
  } else {
    return await sql`SELECT * FROM movies WHERE slug = ${identifier}`;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId, sessionClaims } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const role = (sessionClaims as any)?.role;
  if (role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  try {
    const movies = await findMovie(params.id);
    
    if (movies.length === 0) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }
    
    return NextResponse.json({ movie: movies[0] });
  } catch (error) {
    console.error('Error fetching movie:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    } = body;
    
    const genresArray = genres ? genres.split(',').map((g: string) => g.trim()) : [];
    
    const existingMovie = await findMovie(params.id);
    if (existingMovie.length === 0) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }
    
    const movieId = existingMovie[0].id;
    
    const result = await sql`
      UPDATE movies 
      SET 
        title = ${title},
        slug = ${slug},
        description = ${description || null},
        poster_url = ${posterUrl || null},
        backdrop_url = ${backdropUrl || null},
        video_embed_url = ${videoEmbedUrl},
        duration = ${duration || null},
        genres = ${genresArray},
        rating = ${parseFloat(rating) || 0},
        updated_at = NOW()
      WHERE id = ${movieId}
      RETURNING *
    `;
    
    return NextResponse.json({ success: true, movie: result[0] });
  } catch (error) {
    console.error('Error updating movie:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId, sessionClaims } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const role = (sessionClaims as any)?.role;
  if (role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  try {
    const existingMovie = await findMovie(params.id);
    if (existingMovie.length === 0) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }
    
    const movieId = existingMovie[0].id;
    
    await sql`DELETE FROM movies WHERE id = ${movieId}`;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting movie:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId, sessionClaims } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const role = (sessionClaims as any)?.role;
  if (role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    
    console.log("Received PATCH request for movie:", id);
    console.log("Request body:", body);
    
    if (body.is_featured !== undefined) {
      await sql`UPDATE movies SET is_featured = ${body.is_featured} WHERE id = ${id}`;
      console.log(`Updated is_featured to ${body.is_featured} for movie ${id}`);
    }
    
    if (body.is_trending !== undefined) {
      await sql`UPDATE movies SET is_trending = ${body.is_trending} WHERE id = ${id}`;
      console.log(`Updated is_trending to ${body.is_trending} for movie ${id}`);
    }
    
    if (body.is_recommended !== undefined) {
      await sql`UPDATE movies SET is_recommended = ${body.is_recommended} WHERE id = ${id}`;
      console.log(`Updated is_recommended to ${body.is_recommended} for movie ${id}`);
    }
    
    if (body.hero_order !== undefined) {
      await sql`UPDATE movies SET hero_order = ${body.hero_order} WHERE id = ${id}`;
    }
    
    const updatedMovie = await sql`SELECT * FROM movies WHERE id = ${id}`;
    
    return NextResponse.json({ success: true, movie: updatedMovie[0] });
  } catch (error) {
    console.error('Error updating movie:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}