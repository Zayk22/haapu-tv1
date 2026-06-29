import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

// POST /api/admin/movies
//
// This file did not exist before — only src/app/api/admin/movies/[id]/route.ts
// existed (GET/PUT/DELETE/PATCH for a *specific* movie). Your admin "Add Movie"
// form at src/app/admin/movies/add/page.tsx POSTs to /api/admin/movies, but
// with no route.ts at that exact path, Next.js's App Router has nothing to
// match and the request 404s. This adds the handler that was missing.
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
    } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 });
    }

    const genresArray = genres
      ? genres.split(',').map((g: string) => g.trim()).filter(Boolean)
      : [];

    // Catches duplicate slugs cleanly instead of a raw 500 from the
    // movies.slug UNIQUE constraint (see scripts/setup-db.js).
    const existing = await sql`SELECT id FROM movies WHERE slug = ${slug}`;
    if (existing.length > 0) {
      return NextResponse.json(
        { error: `A movie with slug "${slug}" already exists` },
        { status: 409 }
      );
    }

    const result = await sql`
      INSERT INTO movies (
        title, slug, description, poster_url, backdrop_url,
        video_embed_url, duration, genres, rating, access_type
      )
      VALUES (
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