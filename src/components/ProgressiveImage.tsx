// src/components/ProgressiveImage.tsx
import { useState, useEffect, useRef } from 'react';

interface ProgressiveImageProps {
  src: string;
  thumbnail: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
}

const isLocalMockAssetUrl = (value: string) => {
  const url = String(value || '').trim();
  if (!url) return false;
  if (/^https?:\/\//i.test(url)) return false;
  if (url.includes('/mockdata/')) return true;
  return /\/assets\/pexels-[^/]+\.(jpg|jpeg|png|webp|avif)(\?|#|$)/i.test(url);
};

const ProgressiveImage = ({ 
  src, 
  thumbnail, 
  alt, 
  className = "",
  onLoad 
}: ProgressiveImageProps) => {
  const BLANK_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';
  const FALLBACK_IMAGE = '/placeholder.svg';
  const useStableMockDecode = isLocalMockAssetUrl(src);
  const hasDistinctThumbnail = Boolean(thumbnail && thumbnail !== src);
  const [imgSrc, setImgSrc] = useState(
    useStableMockDecode
      ? BLANK_IMAGE
      : (hasDistinctThumbnail ? thumbnail : (src || BLANK_IMAGE))
  );
  const [isLoading, setIsLoading] = useState(Boolean(src));
  const [isInView, setIsInView] = useState(false);
  const onLoadCalledRef = useRef(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const loadedCacheRef = useRef<Set<string>>((globalThis as any).__progressiveImageLoadedCache || new Set<string>());
  const failedCacheRef = useRef<Set<string>>((globalThis as any).__progressiveImageFailedCache || new Set<string>());

  if (!(globalThis as any).__progressiveImageLoadedCache) {
    (globalThis as any).__progressiveImageLoadedCache = loadedCacheRef.current;
  }
  if (!(globalThis as any).__progressiveImageFailedCache) {
    (globalThis as any).__progressiveImageFailedCache = failedCacheRef.current;
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

    const targetSrc = failedCacheRef.current.has(src) ? FALLBACK_IMAGE : src;
    const img = new Image();
    let cancelled = false;

    if (loadedCacheRef.current.has(targetSrc)) {
      setImgSrc(targetSrc);
      setIsLoading(false);
      if (!onLoadCalledRef.current && onLoad) {
        onLoadCalledRef.current = true;
        onLoad();
      }
      return;
    }

    if (useStableMockDecode) {
      setImgSrc(BLANK_IMAGE);
    }
    img.src = targetSrc;
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
      loadedCacheRef.current.add(targetSrc);
      setImgSrc(targetSrc);
      setIsLoading(false);
      if (!onLoadCalledRef.current && onLoad) {
        onLoadCalledRef.current = true;
        onLoad();
      }
    };

    img.onerror = () => {
      if (cancelled) return;
      failedCacheRef.current.add(targetSrc);
      if (targetSrc !== FALLBACK_IMAGE) {
        const fallbackImg = new Image();
        fallbackImg.src = FALLBACK_IMAGE;
        fallbackImg.onload = () => {
          if (cancelled) return;
          loadedCacheRef.current.add(FALLBACK_IMAGE);
          setImgSrc(FALLBACK_IMAGE);
          setIsLoading(false);
          if (!onLoadCalledRef.current && onLoad) {
            onLoadCalledRef.current = true;
            onLoad();
          }
        };
        fallbackImg.onerror = () => {
          if (cancelled) return;
          setImgSrc(BLANK_IMAGE);
          setIsLoading(false);
        };
        return;
      }

      setImgSrc(BLANK_IMAGE);
      setIsLoading(false);
    };

    return () => {
      cancelled = true;
      img.onload = null;
      img.onerror = null;
    };
  }, [src, onLoad, isInView, useStableMockDecode]);

  useEffect(() => {
    const initialSrc = useStableMockDecode
      ? BLANK_IMAGE
      : (
          hasDistinctThumbnail && !failedCacheRef.current.has(thumbnail)
            ? thumbnail
            : (src || BLANK_IMAGE)
        );
    setImgSrc(initialSrc);
    setIsLoading(Boolean(src));
    onLoadCalledRef.current = false;
  }, [src, thumbnail, hasDistinctThumbnail, useStableMockDecode]);

  return (
    <img
      ref={imgRef}
      src={imgSrc}
      alt={alt}
      className={`${className} ${isLoading ? 'image-loading' : 'image-loaded'}`}
      loading={useStableMockDecode ? "eager" : (hasDistinctThumbnail ? "lazy" : "eager")}
      decoding="async"
      onLoad={() => {
        if (!hasDistinctThumbnail && !useStableMockDecode) {
          if (isLoading) {
            setIsLoading(false);
          }
          if (!onLoadCalledRef.current && onLoad) {
            onLoadCalledRef.current = true;
            onLoad();
          }
        }
      }}
      onError={() => {
        if (imgSrc === thumbnail && hasDistinctThumbnail) {
          failedCacheRef.current.add(thumbnail);
          setImgSrc(BLANK_IMAGE);
          return;
        }
        if (imgSrc !== FALLBACK_IMAGE) {
          setImgSrc(FALLBACK_IMAGE);
          setIsLoading(false);
          if (!onLoadCalledRef.current && onLoad) {
            onLoadCalledRef.current = true;
            onLoad();
          }
        }
      }}
    />
  );
};

export default ProgressiveImage;
