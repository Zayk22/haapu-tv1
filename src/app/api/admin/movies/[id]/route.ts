import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

// Only blocks access when role is explicitly set to a non-admin value.
// When role is undefined (Clerk JWT template not yet configured), allows through.
// This prevents permanent lockout during initial setup.
function isNotAdmin(role: any) {
  return role !== undefined && role !== null && role !== "admin";
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await sql`SELECT * FROM movies WHERE id = ${id}`;
  if (result.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(result[0]);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { userId, sessionClaims } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (isNotAdmin((sessionClaims as any)?.role))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await request.json();
    const { title, slug, description, posterUrl, backdropUrl, videoEmbedUrl, duration, genres, rating } = body;
    const genresArray = genres
      ? genres.split(",").map((g: string) => g.trim()).filter(Boolean)
      : [];

    const result = await sql`
      UPDATE movies SET
        title           = ${title},
        slug            = ${slug},
        description     = ${description || null},
        poster_url      = ${posterUrl || null},
        backdrop_url    = ${backdropUrl || null},
        video_embed_url = ${videoEmbedUrl || null},
        duration        = ${duration || null},
        genres          = ${genresArray},
        rating          = ${parseFloat(rating) || 0}
      WHERE id = ${id}
      RETURNING *
    `;
    return NextResponse.json({ success: true, movie: result[0] });
  } catch (error) {
    console.error("Error updating movie:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { userId, sessionClaims } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (isNotAdmin((sessionClaims as any)?.role))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await sql`DELETE FROM movies WHERE id = ${id}`;
  return NextResponse.json({ success: true });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { userId, sessionClaims } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (isNotAdmin((sessionClaims as any)?.role))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await request.json();

    if ("is_featured" in body)
      await sql`UPDATE movies SET is_featured = ${body.is_featured} WHERE id = ${id}`;
    if ("is_trending" in body)
      await sql`UPDATE movies SET is_trending = ${body.is_trending} WHERE id = ${id}`;
    if ("is_new" in body)
      await sql`UPDATE movies SET is_new = ${body.is_new} WHERE id = ${id}`;
    if ("is_recommended" in body)
      await sql`UPDATE movies SET is_recommended = ${body.is_recommended} WHERE id = ${id}`;
    if ("hero_order" in body)
      await sql`UPDATE movies SET hero_order = ${body.hero_order} WHERE id = ${id}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error patching movie:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}