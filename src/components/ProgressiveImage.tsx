// src/components/ProgressiveImage.tsx
import { useState, useEffect, useRef, type CSSProperties } from 'react';

interface ProgressiveImageProps {
  src: string;
  thumbnail: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
  style?: CSSProperties;
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
  onLoad,
  style
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
  const failedThumbnailCacheRef = useRef<Set<string>>(new Set<string>());

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

    const targetSrc = src || FALLBACK_IMAGE;
    const srcCandidates = (() => {
      const normalized = String(targetSrc || '').trim();
      if (!normalized) return [FALLBACK_IMAGE];
      const candidates = [normalized];
      if (/\.avif(\?|#|$)/i.test(normalized)) {
        candidates.push(
          normalized.replace(/\.avif(\?|#|$)/i, '.webp$1'),
          normalized.replace(/\.avif(\?|#|$)/i, '.jpg$1'),
          normalized.replace(/\.avif(\?|#|$)/i, '.jpeg$1'),
          normalized.replace(/\.avif(\?|#|$)/i, '.png$1')
        );
      }
      return Array.from(new Set(candidates.filter(Boolean)));
    })();
    let cancelled = false;

    const cached = srcCandidates.find((candidate) => loadedCacheRef.current.has(candidate));
    if (cached) {
      setImgSrc(cached);
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
    const preloadCandidate = (index: number) => {
      if (cancelled) return;
      const currentCandidate = srcCandidates[index];
      if (!currentCandidate) {
        setImgSrc(BLANK_IMAGE);
        setIsLoading(false);
        return;
      }
      const img = new Image();
      img.src = currentCandidate;
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
        loadedCacheRef.current.add(currentCandidate);
        setImgSrc(currentCandidate);
        setIsLoading(false);
        if (!onLoadCalledRef.current && onLoad) {
          onLoadCalledRef.current = true;
          onLoad();
        }
      };
      img.onerror = () => {
        preloadCandidate(index + 1);
      };
    };
    preloadCandidate(0);

    return () => {
      cancelled = true;
    };
  }, [src, onLoad, isInView, useStableMockDecode]);

  useEffect(() => {
    const initialSrc = useStableMockDecode
      ? BLANK_IMAGE
      : (
          hasDistinctThumbnail && !failedThumbnailCacheRef.current.has(thumbnail)
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
      draggable={false}
      className={`${className} ${isLoading ? 'image-loading' : 'image-loaded'}`}
      style={{ touchAction: 'pan-y', ...style }}
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
          failedThumbnailCacheRef.current.add(thumbnail);
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
