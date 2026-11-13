const IMAGE_EXT_RE = /\.(png|jpe?g|webp|gif|svg|avif|bmp)(\?.*)?$/i;
const VIDEO_EXT_RE = /\.(mp4|webm|mov|ogg|m4v)(\?.*)?$/i;

/** Returns true when a URL points directly to a downloadable video asset. */
export function isDirectVideoFile(url: string): boolean {
  return VIDEO_EXT_RE.test(url.trim());
}

/**
 * Determines whether an entry URL represents a playable video rather than a photo
 * or external web/photo post link.
 */
export function isPlayableVideoUrl(
  rawUrl?: string | null,
  category?: string | null,
  detectedMime?: string | null
): boolean {
  if (!rawUrl) return false;
  const url = rawUrl.trim();
  if (!url) return false;

  if (detectedMime) {
    return detectedMime.startsWith('video/');
  }

  if (IMAGE_EXT_RE.test(url)) {
    return false;
  }

  if (VIDEO_EXT_RE.test(url)) {
    return true;
  }

  if (url.startsWith('/api/media/')) {
    const cat = (category || '').toLowerCase();
    if (cat.includes('photo') || cat.includes('image') || cat.includes('article') || cat.includes('logo')) {
      return false;
    }
    return true;
  }

  if (/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)[A-Za-z0-9_-]{6,}/.test(url)) {
    return true;
  }

  if (
    (url.includes('facebook.com') || url.includes('fb.watch')) &&
    (url.includes('/videos/') || url.includes('/reel/') || url.includes('/share/v/') || url.includes('/watch') || url.includes('fb.watch'))
  ) {
    return true;
  }

  if (/drive\.google\.com\/file\/d\/[^/]+/.test(url)) {
    return true;
  }

  return false;
}

/** Converts supported video URLs into an embed source descriptor for VideoPlayer. */
export function getEmbedUrl(raw: string): { kind: 'video' | 'iframe' | 'link'; src: string } {
  const url = raw.trim();
  if (url.startsWith('/api/media/') || isDirectVideoFile(url)) {
    return { kind: 'video', src: url };
  }

  const ytMatch =
    url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/);
  if (ytMatch) {
    return { kind: 'iframe', src: `https://www.youtube.com/embed/${ytMatch[1]}` };
  }

  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveMatch) {
    return { kind: 'iframe', src: `https://drive.google.com/file/d/${driveMatch[1]}/preview` };
  }

  if (
    (url.includes('facebook.com') || url.includes('fb.watch')) &&
    (url.includes('/videos/') || url.includes('/reel/') || url.includes('/share/v/') || url.includes('/watch') || url.includes('fb.watch'))
  ) {
    return {
      kind: 'iframe',
      src: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&width=560`
    };
  }

  return { kind: 'link', src: url };
}
