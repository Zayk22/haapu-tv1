"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-matte-300">
        {label}
        {required && <span className="ml-1 text-crimson-DEFAULT">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-matte-500">{hint}</p>}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-matte-700 bg-matte-800 px-4 py-2.5 text-sm text-white placeholder:text-matte-500 focus:border-crimson-DEFAULT focus:outline-none transition-colors";

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

  const set = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const generateSlug = () => {
    set(
      "slug",
      formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create movie");
      router.push("/admin/movies");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Link
          href="/admin/movies"
          className="rounded-lg p-2 text-matte-400 transition-colors hover:bg-matte-800 hover:text-white"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Add Movie
          </h1>
          <p className="mt-1 text-sm text-matte-400">
            Add a new title to your catalog
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="rounded-xl border border-matte-800 bg-matte-900 p-6">
          <h2 className="mb-5 font-semibold text-white">Basic Information</h2>
          <div className="space-y-4">
            <Field label="Title" required>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => set("title", e.target.value)}
                onBlur={generateSlug}
                placeholder="e.g. Don Moen Live"
                className={inputClass}
                required
              />
            </Field>

            <Field
              label="Slug"
              required
              hint="Auto-generated from title. Used in the URL: /movie/your-slug"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => set("slug", e.target.value)}
                  placeholder="don-moen-live"
                  className={inputClass}
                  required
                />
                <button
                  type="button"
                  onClick={generateSlug}
                  className="flex-shrink-0 rounded-lg border border-matte-700 px-3 py-2 text-xs text-matte-400 transition-colors hover:border-matte-500 hover:text-white"
                >
                  Generate
                </button>
              </div>
            </Field>

            <Field label="Description">
              <textarea
                value={formData.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="A short description shown on the movie detail page..."
                rows={3}
                className={inputClass}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Duration" hint='e.g. "1 h : 45 min"'>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => set("duration", e.target.value)}
                  placeholder="1 h : 45 min"
                  className={inputClass}
                />
              </Field>
              <Field label="Rating" hint="0–10 scale, e.g. 8.5">
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => set("rating", e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>

            <Field
              label="Genres"
              hint="Comma-separated, e.g. Gospel, Music, Worship"
            >
              <input
                type="text"
                value={formData.genres}
                onChange={(e) => set("genres", e.target.value)}
                placeholder="Gospel, Music, Worship"
                className={inputClass}
              />
            </Field>
          </div>
        </div>

        {/* Media */}
        <div className="rounded-xl border border-matte-800 bg-matte-900 p-6">
          <h2 className="mb-5 font-semibold text-white">Media</h2>
          <div className="space-y-5">
            <Field
              label="Poster Image"
              hint="Portrait (2:3 ratio). Shown on movie cards throughout the site."
            >
              <ImageUpload
                onImageUploaded={(url) => set("posterUrl", url)}
                currentImage={formData.posterUrl}
                label=""
              />
            </Field>

            <Field
              label="Backdrop Image"
              hint="Landscape (16:9 ratio). Used in the hero carousel and detail page background."
            >
              <ImageUpload
                onImageUploaded={(url) => set("backdropUrl", url)}
                currentImage={formData.backdropUrl}
                label=""
              />
            </Field>

            <Field
              label="Video Embed URL"
              hint="Paste the Wistia iframe URL: https://fast.wistia.net/embed/iframe/..."
            >
              <input
                type="url"
                value={formData.videoEmbedUrl}
                onChange={(e) => set("videoEmbedUrl", e.target.value)}
                placeholder="https://fast.wistia.net/embed/iframe/..."
                className={inputClass}
              />
            </Field>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pb-8">
          <Link
            href="/admin/movies"
            className="rounded-lg border border-matte-700 px-5 py-2.5 text-sm font-medium text-matte-300 transition-colors hover:border-matte-500 hover:text-white"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-lg bg-crimson-DEFAULT px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-crimson-dark disabled:opacity-60"
          >
            {isSubmitting && <Loader2 size={15} className="animate-spin" />}
            {isSubmitting ? "Saving..." : "Add Movie"}
          </button>
        </div>
      </form>
    </div>
  );
}