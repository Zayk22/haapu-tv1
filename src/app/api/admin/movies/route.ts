import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

function isNotAdmin(role: any) {
  return role !== undefined && role !== null && role !== "admin";
}

// POST /api/admin/movies — create a new movie
// GET/PUT/DELETE/PATCH for a specific movie → src/app/api/admin/movies/[id]/route.ts
export async function POST(request: NextRequest) {
  const { userId, sessionClaims } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (isNotAdmin((sessionClaims as any)?.role))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const body = await request.json();
    const { title, slug, description, posterUrl, backdropUrl, videoEmbedUrl, duration, genres, rating } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 });
    }

    const genresArray = genres
      ? genres.split(',').map((g: string) => g.trim()).filter(Boolean)
      : [];

    const existing = await sql`SELECT id FROM movies WHERE slug = ${slug}`;
    if (existing.length > 0) {
      return NextResponse.json({ error: `A movie with slug "${slug}" already exists` }, { status: 409 });
    }

    const result = await sql`
      INSERT INTO movies (
        title, slug, description, poster_url, backdrop_url,
        video_embed_url, duration, genres, rating, access_type
      ) VALUES (
        ${title}, ${slug}, ${description || null}, ${posterUrl || null}, ${backdropUrl || null},
        ${videoEmbedUrl || null}, ${duration || null}, ${genresArray}, ${parseFloat(rating) || 0}, 'free'
      )
      RETURNING *
    `;

    return NextResponse.json({ success: true, movie: result[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating movie:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}