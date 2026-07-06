import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

function isAdmin(sessionClaims: any) {
  return (sessionClaims as any)?.role === 'admin';
}

// Search users by email using Clerk's backend API
export async function GET(request: NextRequest) {
  const { userId, sessionClaims } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isAdmin(sessionClaims)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const query = request.nextUrl.searchParams.get('query');
  if (!query) return NextResponse.json({ error: 'Missing query' }, { status: 400 });

  try {
    const res = await fetch(
      `https://api.clerk.com/v1/users?query=${encodeURIComponent(query)}&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json({ error: err.message || 'Clerk API error' }, { status: res.status });
    }

    const data = await res.json();
    const users = data.map((user: any) => ({
      id: user.id,
      email: user.email_addresses?.[0]?.email_address || '',
      firstName: user.first_name,
      lastName: user.last_name,
      imageUrl: user.image_url,
      role: user.public_metadata?.role || null,
    }));

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// Update user role via Clerk's backend API
export async function PATCH(request: NextRequest) {
  const { userId, sessionClaims } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isAdmin(sessionClaims)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await request.json();
  const { userId: targetUserId, role } = body;

  if (!targetUserId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.clerk.com/v1/users/${targetUserId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        public_metadata: { role: role || null },
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json({ error: err.message || 'Clerk API error' }, { status: res.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}