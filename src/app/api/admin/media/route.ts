import { NextRequest, NextResponse } from 'next/server';
import { list, del } from '@vercel/blob';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  const { userId, sessionClaims } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const role = (sessionClaims as any)?.role;
  if (role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  try {
    const blobs = await list({
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    
    const images = blobs.blobs.map(blob => ({
      filename: blob.pathname,
      url: blob.url,
      size: blob.size,
      createdAt: blob.uploadedAt,
    }));
    
    // Sort by newest first
    images.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { userId, sessionClaims } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const role = (sessionClaims as any)?.role;
  if (role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    
    if (!filename) {
      return NextResponse.json({ error: 'Filename required' }, { status: 400 });
    }
    
    await del(filename, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
  }
}