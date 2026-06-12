import { NextRequest, NextResponse } from 'next/server';
import { getContentBySlug, getContent } from '@/lib/contentData';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const slug = searchParams.get('slug');
  const type = searchParams.get('type');

  try {
    if (slug) {
      const content = await getContentBySlug(slug);
      if (!content) {
        return NextResponse.json({ error: 'Content not found' }, { status: 404 });
      }
      return NextResponse.json(content);
    } else if (type) {
      const content = await getContent(type as any);
      return NextResponse.json(content);
    } else {
      const content = await getContent();
      return NextResponse.json(content);
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}