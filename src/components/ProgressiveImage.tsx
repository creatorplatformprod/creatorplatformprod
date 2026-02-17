// src/components/ProgressiveImage.tsx
import { useState, useEffect, useRef } from 'react';

interface ProgressiveImageProps {
  src: string;
  thumbnail: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
}

const ProgressiveImage = ({ 
  src, 
  thumbnail, 
  alt, 
  className = "",
  onLoad 
}: ProgressiveImageProps) => {
  const BLANK_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';
  const hasDistinctThumbnail = Boolean(thumbnail && thumbnail !== src);
  const [imgSrc, setImgSrc] = useState(hasDistinctThumbnail ? thumbnail : BLANK_IMAGE);
  const [isLoading, setIsLoading] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const onLoadCalledRef = useRef(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const loadedCacheRef = useRef<Set<string>>((globalThis as any).__progressiveImageLoadedCache || new Set<string>());

  if (!(globalThis as any).__progressiveImageLoadedCache) {
    (globalThis as any).__progressiveImageLoadedCache = loadedCacheRef.current;
  }

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '1200px', // Start loading much earlier to avoid visible pop-in on fast scroll
        threshold: 0
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Load full image when in view
  useEffect(() => {
    if (!isInView) return;

    const img = new Image();
    let cancelled = false;

    if (loadedCacheRef.current.has(src)) {
      setImgSrc(src);
      setIsLoading(false);
      if (!onLoadCalledRef.current && onLoad) {
        onLoadCalledRef.current = true;
        onLoad();
      }
      return;
    }

    img.src = src;
    img.decoding = 'async';

    img.onload = async () => {
      try {
        if (typeof img.decode === 'function') {
          await img.decode();
        }
      } catch {
        // decode can fail on some browsers; fallback to onload behavior
      }

      if (cancelled) return;
      loadedCacheRef.current.add(src);
      setImgSrc(src);
      setIsLoading(false);
      if (!onLoadCalledRef.current && onLoad) {
        onLoadCalledRef.current = true;
        onLoad();
      }
    };

    return () => {
      cancelled = true;
      img.onload = null;
    };
  }, [src, onLoad, isInView]);

  useEffect(() => {
    setImgSrc(hasDistinctThumbnail ? thumbnail : BLANK_IMAGE);
    setIsLoading(true);
    onLoadCalledRef.current = false;
  }, [src, thumbnail, hasDistinctThumbnail]);

  return (
    <img
      ref={imgRef}
      src={imgSrc}
      alt={alt}
      className={`${className} ${isLoading ? 'image-loading' : 'image-loaded'}`}
      loading="lazy"
      decoding="async"
    />
  );
};

export default ProgressiveImage;
