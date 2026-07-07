import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

function isNotAdmin(role: any) {
  return role !== undefined && role !== null && role !== "admin";
}

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const key = request.nextUrl.searchParams.get("key");
  if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 });

  const result = await sql`SELECT value, updated_at FROM site_settings WHERE key = ${key}`;
  if (result.length === 0) return NextResponse.json({ value: null });
  return NextResponse.json({ value: result[0].value, updatedAt: result[0].updated_at });
}

export async function POST(request: NextRequest) {
  const { userId, sessionClaims } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (isNotAdmin((sessionClaims as any)?.role))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { key, value } = body;
  if (!key || value === undefined)
    return NextResponse.json({ error: "Missing key or value" }, { status: 400 });

  await sql`
    INSERT INTO site_settings (key, value)
    VALUES (${key}, ${JSON.stringify(value)})
    ON CONFLICT (key)
    DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
  `;

  return NextResponse.json({ success: true });
}