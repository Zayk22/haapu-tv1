"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
  label?: string;
}

export default function ImageUpload({ onImageUploaded, currentImage, label }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    
    setUploading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setPreview(data.url);
        onImageUploaded(data.url);
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (err) {
      setError('Upload failed');
    } finally {
      setUploading(false);
    }
  }, [onImageUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-matte-300">{label}</label>
      )}
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-crimson-DEFAULT bg-crimson-DEFAULT/10'
            : 'border-matte-700 hover:border-matte-500'
        }`}
      >
        <input {...getInputProps()} />
        
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="mx-auto max-h-48 rounded-lg object-contain"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPreview(null);
                onImageUploaded('');
              }}
              className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
            >
              <X size={14} />
            </button>
          </div>
        ) : uploading ? (
          <div className="py-8">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-crimson-DEFAULT border-t-transparent" />
            <p className="mt-2 text-sm text-matte-400">Uploading...</p>
          </div>
        ) : (
          <div className="py-8">
            <Upload className="mx-auto h-8 w-8 text-matte-500" />
            <p className="mt-2 text-sm text-matte-400">
              {isDragActive ? 'Drop image here' : 'Drag & drop or click to upload'}
            </p>
            <p className="mt-1 text-xs text-matte-600">JPG, PNG, WEBP up to 5MB</p>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}