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
  const [imgSrc, setImgSrc] = useState(thumbnail);
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
        rootMargin: '800px', // Start loading earlier to avoid visible tile-by-tile pop-in
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
