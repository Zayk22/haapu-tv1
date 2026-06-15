"use client";

import { useState, useEffect } from "react";
import { Trash2, Download, Image as ImageIcon, X } from "lucide-react";

interface ImageItem {
  filename: string;
  url: string;
  size: number;
  createdAt: string;
}

export default function MediaPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/admin/media');
      const data = await response.json();
      setImages(data.images || []);
    } catch (error) {
      console.error('Failed to fetch images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (filename: string) => {
    if (!confirm('Delete this image? This cannot be undone.')) return;
    
    setDeleting(filename);
    try {
      const response = await fetch(`/api/admin/media?filename=${encodeURIComponent(filename)}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setImages(images.filter(img => img.filename !== filename));
        if (selectedImage === filename) setSelectedImage(null);
      } else {
        alert('Failed to delete');
      }
    } catch (error) {
      alert('Failed to delete');
    } finally {
      setDeleting(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const copyToClipboard = (url: string) => {
    const fullUrl = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    alert('URL copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-matte-700 border-t-crimson-DEFAULT" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white">Media Library</h1>
        <p className="mt-1 text-matte-400">Manage uploaded images and posters</p>
      </div>

      {images.length === 0 ? (
        <div className="rounded-lg border border-matte-800 bg-matte-900 p-12 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-matte-600" />
          <p className="mt-4 text-matte-400">No images uploaded yet</p>
          <p className="mt-1 text-sm text-matte-500">
            Upload images when adding or editing movies
          </p>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="mb-6 rounded-lg border border-matte-800 bg-matte-900 p-4">
            <p className="text-sm text-matte-400">
              Total images: <span className="font-semibold text-white">{images.length}</span>
            </p>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {images.map((image) => (
              <div
                key={image.filename}
                className="group relative overflow-hidden rounded-lg border border-matte-800 bg-matte-900 transition-all hover:border-matte-600"
              >
                <div
                  className="aspect-[2/3] cursor-pointer overflow-hidden"
                  onClick={() => setSelectedImage(image.url)}
                >
                  <img
                    src={image.url}
                    alt={image.filename}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                
                <div className="p-2">
                  <p className="truncate text-xs text-matte-400" title={image.filename}>
                    {image.filename}
                  </p>
                  <p className="text-xs text-matte-500">{formatFileSize(image.size)}</p>
                </div>
                
                {/* Action buttons */}
                <div className="absolute right-1 top-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => copyToClipboard(image.url)}
                    className="rounded bg-matte-800 p-1.5 text-matte-400 transition-colors hover:bg-matte-700 hover:text-white"
                    title="Copy URL"
                  >
                    <Download size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(image.filename)}
                    disabled={deleting === image.filename}
                    className="rounded bg-red-600/80 p-1.5 text-white transition-colors hover:bg-red-600"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-h-full max-w-full">
            <img
              src={selectedImage}
              alt="Preview"
              className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -right-2 -top-2 rounded-full bg-matte-800 p-1.5 text-white hover:bg-matte-700"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}