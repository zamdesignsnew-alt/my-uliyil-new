'use client';
import { useState } from 'react';
import { Camera } from 'lucide-react';

export function GalleryImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div className="gallery-media-fallback">
        <Camera size={28} strokeWidth={1.5} />
        <span>Image preview unavailable</span>
      </div>
    );
  }

  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />;
}
