"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

export default function AddMoviePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    posterUrl: "",
    backdropUrl: "",
    videoEmbedUrl: "",
    duration: "",
    genres: "",
    rating: "0",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/admin/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Failed to create movie');
      
      router.push('/admin/movies');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsSubmitting(false);
    }
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setFormData({ ...formData, slug });
  };

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <Link
          href="/admin/movies"
          className="rounded-lg p-2 text-matte-400 transition-colors hover:bg-matte-800 hover:text-white"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Add Movie</h1>
          <p className="mt-1 text-matte-400">Add a new movie to your catalog</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-matte-300">Title *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            onBlur={generateSlug}
            className="w-full rounded-lg border border-matte-800 bg-matte-900 px-4 py-2 text-white focus:border-crimson-DEFAULT focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-matte-300">Slug *</label>
          <div className="flex gap-2">
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="flex-1 rounded-lg border border-matte-800 bg-matte-900 px-4 py-2 text-white focus:border-crimson-DEFAULT focus:outline-none"
            />
            <button
              type="button"
              onClick={generateSlug}
              className="rounded-lg bg-matte-800 px-4 py-2 text-sm text-matte-300 hover:bg-matte-700"
            >
              Generate
            </button>
          </div>
          <p className="mt-1 text-xs text-matte-500">URL: /movie/{formData.slug || "..."}</p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-matte-300">Description</label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full rounded-lg border border-matte-800 bg-matte-900 px-4 py-2 text-white focus:border-crimson-DEFAULT focus:outline-none"
          />
        </div>

        {/* Image Upload Component */}
        <ImageUpload
          label="Movie Poster"
          onImageUploaded={(url) => setFormData(prev => ({ ...prev, posterUrl: url }))}
          currentImage={formData.posterUrl}
        />

        {/* Backdrop Upload (Optional) */}
        <ImageUpload
          label="Backdrop Image (Optional)"
          onImageUploaded={(url) => setFormData(prev => ({ ...prev, backdropUrl: url }))}
          currentImage={formData.backdropUrl}
        />

        <div>
          <label className="mb-1 block text-sm font-medium text-matte-300">Video Embed URL *</label>
          <input
            type="url"
            required
            value={formData.videoEmbedUrl}
            onChange={(e) => setFormData({ ...formData, videoEmbedUrl: e.target.value })}
            placeholder="https://fast.wistia.net/embed/iframe/xxxxx"
            className="w-full rounded-lg border border-matte-800 bg-matte-900 px-4 py-2 text-white focus:border-crimson-DEFAULT focus:outline-none"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-matte-300">Duration</label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="2h 30min"
              className="w-full rounded-lg border border-matte-800 bg-matte-900 px-4 py-2 text-white focus:border-crimson-DEFAULT focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-matte-300">Genres</label>
            <input
              type="text"
              value={formData.genres}
              onChange={(e) => setFormData({ ...formData, genres: e.target.value })}
              placeholder="Drama, Music, Gospel"
              className="w-full rounded-lg border border-matte-800 bg-matte-900 px-4 py-2 text-white focus:border-crimson-DEFAULT focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-matte-300">Rating (0-10)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
            className="w-32 rounded-lg border border-matte-800 bg-matte-900 px-4 py-2 text-white focus:border-crimson-DEFAULT focus:outline-none"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-crimson-DEFAULT px-6 py-2 font-medium text-white transition-colors hover:bg-crimson-dark disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Movie"}
          </button>
          <Link
            href="/admin/movies"
            className="rounded-lg border border-matte-700 px-6 py-2 text-matte-300 transition-colors hover:bg-matte-800"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}