'use client';

import { getEmbedUrl } from '@/lib/mediaUrl';

export function VideoPlayer({ url, title, poster }: { url: string; title: string; poster?: string | null }) {
  const parsed = getEmbedUrl(url);

  if (parsed.kind === 'video') {
    return (
      <div className="media-frame">
        <video
          src={parsed.src}
          poster={poster || undefined}
          controls
          playsInline
          preload="metadata"
        />
      </div>
    );
  }

  if (parsed.kind === 'iframe') {
    return (
      <div className="media-frame">
        <iframe
          title={title}
          src={parsed.src}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  return null;
}
