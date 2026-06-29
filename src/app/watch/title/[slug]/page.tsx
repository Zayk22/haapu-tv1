"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CustomPlayer from "@/components/movie/CustomPlayer";
import type { ContentItem } from "@/types/content";

export default function WatchTitlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [content, setContent] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/content?slug=${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => {
        setContent(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-matte-black">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-matte-700 border-t-crimson-DEFAULT" />
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="flex h-screen items-center justify-center bg-matte-black">
        <p className="text-white">Content not found.</p>
      </div>
    );
  }

  const movie = {
    id: parseInt(content.id) || 0,
    slug: content.slug,
    title: content.title,
    posterUrl: content.posterUrl,
    backdropUrl: content.backdropUrl,
    rating: content.rating || 0,
    year: content.releaseDate ? new Date(content.releaseDate).getFullYear() : new Date().getFullYear(),
    duration: content.duration,
    genres: content.genres || [],
    description: content.description,
    type: "movie" as const,
    videoEmbedUrl: content.videoEmbedUrl,
  };

  return <CustomPlayer movie={movie} />;
}