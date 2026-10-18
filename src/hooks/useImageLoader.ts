import { useState, useEffect } from 'react';

interface ImageLoaderState {
  image: HTMLImageElement | null;
  isLoading: boolean;
  error: string | null;
}

const imageCache = new Map<string, HTMLImageElement>();

/**
 * Hook untuk memuat gambar dari URL atau path lokal dengan caching dan error handling
 */
export function useImageLoader(url: string | null): ImageLoaderState {
  const [data, setData] = useState<{
    url: string | null;
    image: HTMLImageElement | null;
    isLoading: boolean;
    error: string | null;
  }>(() => {
    if (!url) return { url: null, image: null, isLoading: false, error: null };
    const cached = imageCache.get(url);
    if (cached && cached.complete && cached.naturalWidth > 0) {
      return { url, image: cached, isLoading: false, error: null };
    }
    return { url, image: null, isLoading: true, error: null };
  });

  // Adjust state during render when URL prop changes (recommended React pattern)
  if (data.url !== url) {
    const cached = url ? imageCache.get(url) : null;
    if (cached && cached.complete && cached.naturalWidth > 0) {
      setData({ url, image: cached, isLoading: false, error: null });
    } else {
      setData({ url, image: null, isLoading: !!url, error: null });
    }
  }

  useEffect(() => {
    if (!url) return;

    const cached = imageCache.get(url);
    if (cached && cached.complete && cached.naturalWidth > 0) return;

    let isCancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      if (!isCancelled) {
        imageCache.set(url, img);
        setData({ url, image: img, isLoading: false, error: null });
      }
    };

    img.onerror = () => {
      if (!isCancelled) {
        setData({
          url,
          image: null,
          isLoading: false,
          error: `Gagal memuat aset gambar dari: ${url}`,
        });
      }
    };

    img.src = url;

    return () => {
      isCancelled = true;
    };
  }, [url]);

  return {
    image: data.image,
    isLoading: data.isLoading,
    error: data.error,
  };
}
