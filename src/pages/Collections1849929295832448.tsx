import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Preloader from "../components/Preloader";
import ProgressiveImage from "@/components/ProgressiveImage";
import InlineVideoPlayer from "@/components/InlineVideoPlayer";
import { api } from "@/lib/api";
import { useSeo } from "@/hooks/use-seo";
import { usePublicWebsiteTheme } from "@/hooks/usePublicWebsiteTheme";

const MOCK_COLLECTION_TITLES = [
  "Pink Lemonade Mood",
  "Velvet Sunshine",
  "Candy Light Sessions",
  "Rose Quartz Frames",
  "Pastel Motion",
  "Soft Focus Diary",
  "Skyline Bubblegum",
  "Sweet Hour Drop",
  "Velvet Portrait Club",
  "Milkshake Neon",
  "Sugar Lens",
  "Cloud Bloom Set"
];

const PINK_LEMONADE_IMAGE_IDS = [
  7346615, 7346619, 7346620, 7346621, 7346623, 7346626, 7346628, 7346629, 7346631, 7346632,
  7346633, 7346634, 7346635, 7346656, 7346657, 7346658, 7346659, 7346660, 7346661, 7346662,
  7346663, 7346666, 7346667, 7346668, 7346672, 7346673, 7346674, 7346675, 7346677, 7346678,
  7346680, 7346681, 7346684, 7346688, 7346689, 7346690, 7346691, 7346692, 7346693, 7346694,
  7346695, 7346696, 7346697, 7346698, 7346699, 7346701, 7346703
];

const pexelsImageUrl = (id: number, width = 1600) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;
const pexelsThumbUrl = (url: string, width = 560) => url.replace(/w=\d+/, `w=${width}`);
const hashString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
};
const seededShuffle = <T,>(items: T[], seed: number) => {
  const arr = [...items];
  let state = (seed || 1) >>> 0;
  for (let i = arr.length - 1; i > 0; i -= 1) {
    state = (state * 1664525 + 1013904223) >>> 0;
    const j = state % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const Collections1849929295832448 = () => {
  const navigate = useNavigate();
  const { secureId } = useParams();
  const [searchParams] = useSearchParams();
  const accessToken = searchParams.get('access') || '';
  const creatorParam = searchParams.get('creator') || '';
  const isPreviewMode = searchParams.get('mode') === 'preview';
  const [currentPage, setCurrentPage] = useState(1);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isPreloading, setIsPreloading] = useState(!isPreviewMode);
  const [showPreloader, setShowPreloader] = useState(!isPreviewMode);
  const [measuredDims, setMeasuredDims] = useState({});
  const [accessVerified, setAccessVerified] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [remoteCollections, setRemoteCollections] = useState<any[]>([]);
  const [verifying, setVerifying] = useState(true);
  const themeClass = usePublicWebsiteTheme(creatorParam || undefined);

  useEffect(() => {
    const verifyAndLoad = async () => {
      setVerifying(true);

      // Fast path for creator preview: don't block UI on access verification calls.
      if (isPreviewMode && localStorage.getItem('token')) {
        setAccessVerified(true);
        setVerifying(false);
        try {
          const mine = await api.getMyCollections();
          if (mine?.success) {
            setRemoteCollections(mine.collections || []);
          }
        } catch {
          // Ignore and keep fallback behavior.
        }
        return;
      }

      // For dynamic access: verify the access token
      if (!accessToken) {
        // Owner preview bypass: only allow in explicit preview mode.
        if (!isPreviewMode) {
          setAccessDenied(true);
          setVerifying(false);
          return;
        }

        // In preview mode, allow logged-in creator to preview unlocked bundle.
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const me = await api.getCurrentUser();
            const isOwner =
              me?.success &&
              (!creatorParam ||
                me.user?.username?.toLowerCase() === creatorParam.toLowerCase());
            if (isOwner) {
              const mine = await api.getMyCollections();
              if (mine?.success) {
                setRemoteCollections(mine.collections || []);
                setAccessVerified(true);
                setVerifying(false);
                return;
              }
            }
          } catch {
            // fall through to denied
          }
        }

        setAccessDenied(true);
        setVerifying(false);
        return;
      }

      try {
        const verify = await api.verifyAccessToken(accessToken);
        if (verify?.valid) {
          setAccessVerified(true);

          // Load creator's collections from API
          let creatorUsername = creatorParam || verify.creatorUsername || verify.creator || '';
          if (!creatorUsername && verify.creatorId) {
            try {
              const userResult = await api.getUserById(verify.creatorId);
              if (userResult?.success && userResult.user?.username) {
                creatorUsername = userResult.user.username;
              }
            } catch {
              // Ignore fallback fetch failures.
            }
          }

          if (creatorUsername) {
            const result = await api.getCollections(creatorUsername);
            if (result?.success && result.collections?.length > 0) {
              setRemoteCollections(result.collections);
            }
          }
        } else {
          setAccessDenied(true);
        }
      } catch (error) {
        console.error('Access verification failed:', error);
        setAccessDenied(true);
      } finally {
        setVerifying(false);
      }
    };

    verifyAndLoad();
    // Keep white theme as default; never force global dark mode from this page.
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('no-bounce');
    document.body.classList.add('no-bounce');
    return () => {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.remove('no-bounce');
      document.body.classList.remove('no-bounce');
    };
  }, [secureId, accessToken, creatorParam, isPreviewMode]);

  const getProfileFallbackUrl = () => {
    if (!creatorParam) return '/';
    return `/public/${creatorParam}${isPreviewMode ? '?mode=preview' : ''}`;
  };

  const handleBackNavigation = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate(getProfileFallbackUrl());
  };

  const imagesPerPage = 24;

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      .animate-shimmer {
        animation: shimmer 2s infinite linear;
      }
      video::-webkit-media-controls-panel {
        display: none !important;
      }
      video::-webkit-media-controls-download-button {
        display: none !important;
      }
      video::-webkit-media-controls-fullscreen-button {
        display: none !important;
      }
      video::--webkit-media-controls-enclosure {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const isVideoUrl = (url: string): boolean => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
    return videoExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  const mockSeed = useMemo(() => hashString((creatorParam || 'creator').toLowerCase()), [creatorParam]);
  const mockPhotos = useMemo(
    () => seededShuffle(PINK_LEMONADE_IMAGE_IDS.map((id) => pexelsImageUrl(id, 1600)), mockSeed + 77),
    [mockSeed]
  );
  const localMockCollections = useMemo(() => {
    const titles = seededShuffle(MOCK_COLLECTION_TITLES, mockSeed + 911);
    const imageCountPattern = [2, 3, 4, 5, 6, 4, 3, 5, 2, 6];
    const statusMediaCount = Math.min(6, mockPhotos.length);
    const availableForCollections = Math.max(0, mockPhotos.length - statusMediaCount);
    const total = Math.min(10, titles.length);
    return Array.from({ length: total }, (_, index) => {
      const title = titles[index % titles.length];
      const imageCount = imageCountPattern[index % imageCountPattern.length];
      const safePool = Math.max(1, availableForCollections);
      const images = Array.from({ length: imageCount }, (_, offset) => {
        const poolIndex = (index * 5 + offset) % safePool;
        const full =
          mockPhotos[statusMediaCount + poolIndex] ||
          mockPhotos[(index + offset) % Math.max(1, mockPhotos.length)];
        return { full, thumb: pexelsThumbUrl(full, 560) };
      });
      return {
        id: `mock-collection-${index + 1}`,
        title,
        images
      };
    });
  }, [mockPhotos, mockSeed]);

  const allImages = useMemo(() => {
    const items: any[] = [];

    // If we have remote API collections (per-creator), use those
    if (remoteCollections.length > 0) {
      remoteCollections.forEach((collection: any) => {
        const mediaItems = collection.media || [];
        mediaItems.forEach((mediaItem: any, index: number) => {
          if (!mediaItem?.url) return;
          const imageSrc = mediaItem.url;
          let thumbSrc = mediaItem.thumbnailUrl || mediaItem.url;
          const mediaType = mediaItem.mediaType || (isVideoUrl(imageSrc) ? 'video' : 'image');
          if (mediaType === 'video') {
            thumbSrc = thumbSrc.replace(/\.(mp4|webm|mov|ogg|avi)$/i, '.jpg');
          }
          const parsedWidth = Number(mediaItem.width);
          const parsedHeight = Number(mediaItem.height);
          const fallbackDims = getRandomDimensions(items.length);
          items.push({
            src: imageSrc,
            thumb: thumbSrc,
            collectionId: collection._id,
            collectionTitle: collection.title,
            imageIndex: index,
            mediaType,
            hasStoredDims: Number.isFinite(parsedWidth) && parsedWidth > 0 && Number.isFinite(parsedHeight) && parsedHeight > 0,
            width: Number.isFinite(parsedWidth) && parsedWidth > 0 ? parsedWidth : fallbackDims.width,
            height: Number.isFinite(parsedHeight) && parsedHeight > 0 ? parsedHeight : fallbackDims.height
          });
        });
      });
      return items;
    }

    // Fallback: use seeded mock collections aligned with profile/detail routes.
    localMockCollections.forEach((collection) => {
      collection.images.forEach((imageData: any, index: number) => {
        const imageSrc = imageData.full;
        items.push({
          src: imageSrc,
          thumb: imageData.thumb,
          collectionId: collection.id,
          collectionTitle: collection.title,
          imageIndex: index,
          mediaType: 'image',
          hasStoredDims: false,
          ...getRandomDimensions(items.length)
        });
      });
    });
    return items;
  }, [remoteCollections, localMockCollections]);

  const footerCreatorName = useMemo(() => {
    const firstCollection = (remoteCollections || [])[0] as any;
    const rawName =
      firstCollection?.creatorDisplayName ||
      firstCollection?.creatorName ||
      firstCollection?.creator?.displayName ||
      firstCollection?.creator?.username ||
      firstCollection?.creatorUsername ||
      firstCollection?.username ||
      creatorParam;
    const safeName = String(rawName || '').trim();
    return safeName || 'Creator';
  }, [remoteCollections, creatorParam]);

  useSeo(
    {
      title: "Exclusive Collections | SixSevenCreator",
      description: "Browse exclusive creator collection content on SixSevenCreator.",
      canonicalPath: secureId ? `/collections/${secureId}` : "/collections",
      noindex: isPreviewMode
    },
    [secureId, isPreviewMode]
  );

  function getRandomDimensions(index) {
    const ratios = [
      { width: 400, height: 600 },
      { width: 800, height: 600 },
      { width: 600, height: 600 },
      { width: 1200, height: 400 },
      { width: 400, height: 800 },
    ];
    return ratios[index % ratios.length];
  }

  const startIndex = (currentPage - 1) * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;
  const currentImages = allImages.slice(startIndex, endIndex);
  const totalPages = Math.ceil(allImages.length / imagesPerPage);

  const preloadFirstPageImages = () => {
    const firstPageImages = currentImages;
    
    const preloadPromises = firstPageImages.map((imageObj) => {
      return new Promise((resolve) => {
        const srcUrl = imageObj.src;
        
        if (imageObj.mediaType === 'video') {
          const video = document.createElement('video');
          video.preload = 'metadata';
          video.onloadedmetadata = () => {
            setLoadedImages(prev => new Set([...prev, srcUrl]));
            setMeasuredDims(prev => ({
              ...prev,
              [srcUrl]: { 
                width: video.videoWidth || 1920, 
                height: video.videoHeight || 1080 
              }
            }));
            resolve(srcUrl);
          };
          video.onerror = () => {
            setLoadedImages(prev => new Set([...prev, srcUrl]));
            setMeasuredDims(prev => ({
              ...prev,
              [srcUrl]: { width: 1920, height: 1080 }
            }));
            resolve(srcUrl);
          };
          video.src = srcUrl;
          return;
        }

        const img = new Image();
        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, srcUrl]));
          setMeasuredDims(prev => ({
            ...prev,
            [srcUrl]: { width: img.naturalWidth, height: img.naturalHeight }
          }));
          resolve(srcUrl);
        };
        img.onerror = () => {
          setMeasuredDims(prev => ({
            ...prev,
            [srcUrl]: { width: imageObj.width, height: imageObj.height }
          }));
          setLoadedImages(prev => new Set([...prev, srcUrl]));
          resolve(srcUrl);
        };
        const cleanUrl = srcUrl.split('?')[0];
        img.src = cleanUrl;
      });
    });

    Promise.allSettled(preloadPromises).then(() => {
      setTimeout(() => {
        setIsPreloading(false);
      }, 800);
    });
  };

  useEffect(() => {
    preloadFirstPageImages();
  }, []);

  const preloadNextPage = () => {
    if (currentPage < totalPages) {
      const nextStartIndex = currentPage * imagesPerPage;
      const nextEndIndex = nextStartIndex + imagesPerPage;
      const nextImages = allImages.slice(nextStartIndex, nextEndIndex);
      
      nextImages.forEach(imageObj => {
        const srcUrl = imageObj.src;
        
        if (!loadedImages.has(srcUrl)) {
          if (imageObj.mediaType === 'video') {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = () => {
              setLoadedImages(prev => new Set([...prev, srcUrl]));
              setMeasuredDims(prev => ({
                ...prev,
                [srcUrl]: { 
                  width: video.videoWidth || 1920, 
                  height: video.videoHeight || 1080 
                }
              }));
            };
            video.onerror = () => {
              setLoadedImages(prev => new Set([...prev, srcUrl]));
              setMeasuredDims(prev => ({
                ...prev,
                [srcUrl]: { width: 1920, height: 1080 }
              }));
            };
            video.src = srcUrl;
            return;
          }

          const img = new Image();
          img.onload = () => {
            setLoadedImages(prev => new Set([...prev, srcUrl]));
            setMeasuredDims(prev => ({
              ...prev,
              [srcUrl]: { width: img.naturalWidth, height: img.naturalHeight }
            }));
          };
          img.onerror = () => {
            setLoadedImages(prev => new Set([...prev, srcUrl]));
            setMeasuredDims(prev => ({
              ...prev,
              [srcUrl]: { width: imageObj.width, height: imageObj.height }
            }));
          };
          const cleanUrl = srcUrl.split('?')[0];
          img.src = cleanUrl;
        }
      });
    }
  };

  const loadMoreImages = () => {
    if (currentPage < totalPages && !isLoading) {
      setIsLoading(true);
      
      const nextPage = currentPage + 1;
      const nextStartIndex = (nextPage - 1) * imagesPerPage;
      const nextEndIndex = nextStartIndex + imagesPerPage;
      const nextPageImages = allImages.slice(nextStartIndex, nextEndIndex);
      
      setCurrentPage(nextPage);
      
      setTimeout(() => {
        scrollToTop();
      }, 100);
      
      nextPageImages.forEach((imageObj) => {
        const srcUrl = imageObj.src;
        
        if (imageObj.mediaType === 'video') {
          const video = document.createElement('video');
          video.preload = 'metadata';
          video.onloadedmetadata = () => {
            setLoadedImages(prev => new Set([...prev, srcUrl]));
            setMeasuredDims(prev => ({
              ...prev,
              [srcUrl]: { 
                width: video.videoWidth || 1920, 
                height: video.videoHeight || 1080 
              }
            }));
          };
          video.onerror = () => {
            setLoadedImages(prev => new Set([...prev, srcUrl]));
            setMeasuredDims(prev => ({
              ...prev,
              [srcUrl]: { width: 1920, height: 1080 }
            }));
          };
          video.src = srcUrl;
          return;
        }

        const img = new Image();
        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, srcUrl]));
          setMeasuredDims(prev => ({
            ...prev,
            [srcUrl]: { width: img.naturalWidth, height: img.naturalHeight }
          }));
        };
        img.onerror = () => {
          setLoadedImages(prev => new Set([...prev, srcUrl]));
          setMeasuredDims(prev => ({
            ...prev,
            [srcUrl]: { width: imageObj.width, height: imageObj.height }
          }));
        };
        const cleanUrl = srcUrl.split('?')[0];
        img.src = cleanUrl;
      });
      
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  };

  const loadPreviousImages = () => {
    if (currentPage > 1 && !isLoading) {
      setIsLoading(true);
      
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      
      setTimeout(() => {
        scrollToTop();
      }, 100);
      
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  };

  useEffect(() => {
    preloadNextPage();
  }, [currentPage]);

  const handlePreloaderComplete = () => {
    setShowPreloader(false);
  };

  // Show verifying state
  if (verifying) {
    return (
      <div className={`min-h-screen feed-bg flex items-center justify-center ${themeClass}`}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Show access denied state
  if (accessDenied) {
    return (
      <div className={`min-h-screen feed-bg flex items-center justify-center p-4 ${themeClass}`}>
        <div className="text-center max-w-sm">
          <h2 className="text-xl font-bold text-foreground mb-2">Access Required</h2>
          <p className="text-sm text-muted-foreground mb-4">
            You need a valid access token to view this content. Please complete the purchase to get access.
          </p>
          <Button onClick={handleBackNavigation} className="btn-67">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {showPreloader && <Preloader isVisible={isPreloading} onComplete={handlePreloaderComplete} themeClass={themeClass} />}
      
      {!showPreloader && (
        <div className={`min-h-screen mobile-stable-shell feed-bg ${themeClass}`}>
          <header className={`sticky top-0 z-10 nav-elevated p-3 sm:p-4 ${isPreviewMode ? 'mobile-preview-navbar-offset' : ''}`}>
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <Button 
                onClick={handleBackNavigation} 
                variant="ghost" 
                size="sm"
                className="hover:bg-secondary"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Feed
              </Button>
              <div className="flex items-center gap-3">
                <div className="brand-wordmark"><span className="brand-accent">Six</span><span>Seven</span><span className="brand-accent">Creator</span></div>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 relative">
            <ResponsiveMasonry
              columnsCountBreakPoints={{350: 1, 750: 3, 900: 4}}
            >
              <Masonry gutter="12px">
                {currentImages.map((mediaObj, index) => {
                  const globalIndex = startIndex + index;
                  const isMediaLoaded = loadedImages.has(mediaObj.src);
                  const md = measuredDims[mediaObj.src];
                  const shouldUseMeasured = !mediaObj.hasStoredDims && md;
                  const aspectW = shouldUseMeasured ? md.width : mediaObj.width;
                  const aspectH = shouldUseMeasured ? md.height : mediaObj.height;

                  return (
                    <div 
                      key={`${mediaObj.src}-${globalIndex}`}
                      className="relative overflow-hidden rounded-lg animate-fade-in"
                      style={{ 
                        animationDelay: `${Math.min(index * 0.02, 1)}s`,
                        aspectRatio: `${aspectW} / ${aspectH}`
                      }}
                    >
                      {!isMediaLoaded && (
                        <div className="absolute inset-0 bg-gradient-to-br from-secondary/80 to-secondary/40 animate-pulse z-10">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                        </div>
                      )}
                      
                      {mediaObj.mediaType === 'video' ? (
                        <InlineVideoPlayer
                          src={mediaObj.src}
                          thumbnail={mediaObj.thumb}
                          alt=""
                          className={`w-full h-full transition-all duration-500 ${
                            isMediaLoaded ? 'opacity-100' : 'opacity-0'
                          }`}
                          onLoad={() => setLoadedImages(prev => new Set([...prev, mediaObj.src]))}
                        />
                      ) : (
                        <>
                          <ProgressiveImage
                            src={mediaObj.src}
                            thumbnail={mediaObj.thumb}
                            alt={`${mediaObj.collectionTitle} - Image ${mediaObj.imageIndex + 1}`}
                            className={`w-full h-full object-cover transition-all duration-500 hover:scale-105 ${
                              isMediaLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                            onLoad={() => setLoadedImages(prev => new Set([...prev, mediaObj.src]))}
                          />
                          <div className={`absolute inset-0 bg-black/20 transition-opacity duration-500 ${
                            isMediaLoaded ? 'opacity-100' : 'opacity-0'
                          }`} />
                        </>
                      )}
                    </div>
                  );
                })}
              </Masonry>
            </ResponsiveMasonry>

            <div className="flex justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
              {currentPage > 1 && (
                <button
                  onClick={loadPreviousImages}
                  disabled={isLoading}
                  className="px-4 py-2.5 sm:px-6 sm:py-3 bg-secondary hover:bg-secondary/80 text-foreground rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm hover:shadow-md"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>
              )}

              {currentPage < totalPages && (
                <button
                  onClick={loadMoreImages}
                  disabled={isLoading}
                  className="px-6 py-2.5 sm:px-8 sm:py-3 bg-gradient-to-r from-primary via-primary to-accent text-primary-foreground rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:scale-105"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <span>Next Page</span>
                      <span className="text-xs opacity-80">({currentPage}/{totalPages})</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="flex justify-center mt-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-full backdrop-blur-sm">
                <span className="text-xs sm:text-sm text-muted-foreground">
                  Showing {Math.min(endIndex, allImages.length)} of {allImages.length} exclusive items from {remoteCollections.length || localMockCollections.length} collections
                </span>
              </div>
            </div>

            <footer className="post-card rounded-xl p-5 sm:p-6 mt-6 sm:mt-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-2">
                  <div className="flex items-center gap-3 mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-foreground">
                        {footerCreatorName}
                      </h2>
                      <p className="text-sm text-muted-foreground">Build Your Content Platform</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Create your exclusive content platform with {footerCreatorName}.
                    Build, preview, and publish premium collections with card-to-crypto payments.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8 md:contents">
                  <div>
                    <h3 className="font-semibold text-foreground mb-4">Explore</h3>
                    <ul className="space-y-2 text-sm">
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Gallery</a></li>
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Collections</a></li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-4">Connect</h3>
                    <div className="flex gap-3 mb-4">
                      <a href="https://twitter.com/sixsevencreator" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.040 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                        </svg>
                      </a>
                      <a href="https://instagram.com/sixsevencreator" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.40s-.644-1.44-1.439-1.40z"/>
                        </svg>
                      </a>
                    </div>
                    <p className="text-sm text-muted-foreground">support@sixsevencreator.com</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-border mt-8 pt-6 text-center">
                <p className="text-xs text-muted-foreground">
                  © {new Date().getFullYear()} {footerCreatorName}. All rights reserved. 
                  <span className="mx-2">|</span>
                  <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                  <span className="mx-2">|</span>
                  <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                </p>
              </div>
            </footer>
          </main>
        </div>
      )}
    </>
  );
};

export default Collections1849929295832448;
