// PostDetail.tsx - UPDATED WITH INLINE VIDEO
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { getCollection } from "@/collections/collectionsData";
import { getCollectionId, isValidSecureId } from "@/utils/secureIdMapper";
import ProgressiveImage from "@/components/ProgressiveImage";
import InlineVideoPlayer from "@/components/InlineVideoPlayer";
import { api } from "@/lib/api";
import { useSeo } from "@/hooks/use-seo";

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

const PostDetail = () => {
  const { secureId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const creatorParam = searchParams.get('creator') || '';
  const isPreviewMode = searchParams.get('mode') === 'preview';
  const [loadedImages, setLoadedImages] = useState(new Set<string>());
  const [currentImagePage, setCurrentImagePage] = useState(1);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [measuredDims, setMeasuredDims] = useState({});
  const [remoteCollection, setRemoteCollection] = useState<any>(null);
  const [remoteLoading, setRemoteLoading] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const mockSeed = useMemo(() => hashString((creatorParam || 'creator').toLowerCase()), [creatorParam]);
  const mockPhotos = useMemo(
    () => seededShuffle(PINK_LEMONADE_IMAGE_IDS.map((imgId) => pexelsImageUrl(imgId, 1600)), mockSeed + 77),
    [mockSeed]
  );
  const localMockCollections = useMemo(() => {
    const titles = seededShuffle(MOCK_COLLECTION_TITLES, mockSeed + 911);
    const imageCountPattern = [6, 8, 10, 12, 14, 16, 18, 20, 9, 13];
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
        description: `Exclusive ${title.toLowerCase()} set with polished edits and premium frames.`,
        images,
        user: {
          name: 'Creator',
          avatar: pexelsImageUrl(7346629, 420) + "&fit=crop",
          verified: true,
          twitterUrl: '',
          instagramUrl: '',
          domainEmail: 'support@sixsevencreator.com',
          telegramUsername: ''
        },
        timestamp: index < 3 ? "Today" : `${Math.min(index + 1, 12)} days ago`
      };
    });
  }, [mockPhotos, mockSeed]);

  const imagesPerPage = 12;

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
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

  useEffect(() => {
    document.documentElement.classList.add('no-bounce');
    document.body.classList.add('no-bounce');
    return () => {
      document.documentElement.classList.remove('no-bounce');
      document.body.classList.remove('no-bounce');
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [secureId]);

  const isVideoUrl = (url: string): boolean => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
    return videoExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  const getCollectionFromSecureId = () => {
    if (!secureId) {
      return null;
    }
    const localMock = localMockCollections.find((collection) => collection.id === secureId);
    if (localMock) {
      return localMock;
    }
    if (!isValidSecureId(secureId)) {
      return null;
    }
    const actualId = getCollectionId(secureId);
    return getCollection(actualId);
  };

  const loadRemoteCollection = async () => {
    if (!secureId || isValidSecureId(secureId) || /^mock-collection-\d+$/i.test(secureId)) return;
    setRemoteLoading(true);
    setAccessDenied(false);

    try {
      const params = new URLSearchParams(window.location.search);
      const accessToken = params.get('access');

      if (!accessToken) {
        // Owner preview bypass: allow creator to open unlocked view without payment token.
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const me = await api.getCurrentUser();
            if (me?.success) {
              const mine = await api.getMyCollections();
              const ownCollection = (mine?.collections || []).find(
                (collection: any) => collection?._id === secureId
              );
              if (ownCollection) {
                setRemoteCollection({
                  id: ownCollection._id,
                  title: ownCollection.title,
                  description: ownCollection.description || '',
                  images: (ownCollection.media || []).map((media: any) => ({
                    full: media.url,
                    thumb: media.thumbnailUrl || media.url,
                    width: Number.isFinite(Number(media.width)) && Number(media.width) > 0 ? Number(media.width) : null,
                    height: Number.isFinite(Number(media.height)) && Number(media.height) > 0 ? Number(media.height) : null
                  })),
                  user: {
                    name: me.user?.displayName || me.user?.username || 'Creator',
                    avatar: me.user?.avatar || '/placeholder.svg',
                    verified: me.user?.isVerified || false,
                    twitterUrl: me.user?.twitterUrl || '',
                    instagramUrl: me.user?.instagramUrl || '',
                    domainEmail: me.user?.domainEmail || 'support@sixsevencreator.com',
                    telegramUsername: me.user?.telegramUsername || ''
                  },
                  timestamp: ownCollection.createdAt
                    ? new Date(ownCollection.createdAt).toLocaleDateString()
                    : 'Recently'
                });
                return;
              }
            }
          } catch {
            // fall through to access denied
          }
        }
        setAccessDenied(true);
        return;
      }

      let accessOk = false;
      try {
        const verify = await api.verifyAccessToken(accessToken);
        accessOk = !!verify?.valid;
      } catch (verifyError) {
        accessOk = false;
      }

      if (!accessOk) {
        setAccessDenied(true);
        return;
      }

      const collectionResult = await api.getCollection(secureId);
      if (collectionResult?.success && collectionResult.collection) {
        const creatorId = collectionResult.collection.creatorId;
        let creatorUser = null;
        if (creatorId) {
          const userResult = await api.getUserById(creatorId);
          if (userResult?.success) {
            creatorUser = userResult.user;
          }
        }

        const mapped = {
          id: collectionResult.collection._id,
          title: collectionResult.collection.title,
          description: collectionResult.collection.description || '',
          images: (collectionResult.collection.media || []).map((media: any) => ({
            full: media.url,
            thumb: media.thumbnailUrl || media.url,
            width: Number.isFinite(Number(media.width)) && Number(media.width) > 0 ? Number(media.width) : null,
            height: Number.isFinite(Number(media.height)) && Number(media.height) > 0 ? Number(media.height) : null
          })),
          user: {
            name: creatorUser?.displayName || creatorUser?.username || 'Creator',
            avatar: creatorUser?.avatar || '/placeholder.svg',
            verified: creatorUser?.isVerified || false,
            // Creator-specific branding data with fallbacks
            twitterUrl: creatorUser?.twitterUrl || '',
            instagramUrl: creatorUser?.instagramUrl || '',
            domainEmail: creatorUser?.domainEmail || 'support@sixsevencreator.com',
            telegramUsername: creatorUser?.telegramUsername || ''
          },
          timestamp: collectionResult.collection.createdAt
            ? new Date(collectionResult.collection.createdAt).toLocaleDateString()
            : 'Recently'
        };

        setRemoteCollection(mapped);
      } else {
        setRemoteCollection(null);
      }
    } catch (error) {
      console.error('Failed to load collection:', error);
      setRemoteCollection(null);
    } finally {
      setRemoteLoading(false);
    }
  };

  useEffect(() => {
    loadRemoteCollection();
  }, [secureId]);

  const localCollection = getCollectionFromSecureId();
  const collection = remoteCollection || localCollection;

  useSeo(
    {
      title: collection?.title
        ? `${collection.title} | SixSevenCreator`
        : "Collection | SixSevenCreator",
      description: collection?.description
        ? String(collection.description).slice(0, 160)
        : "Premium creator collection on SixSevenCreator.",
      noindex: isPreviewMode,
      canonicalPath: secureId ? `/post/${secureId}` : undefined,
      image: collection?.images?.[0]?.thumb || collection?.images?.[0]?.full || undefined,
      type: "article"
    },
    [collection?.title, collection?.description, collection?.images, isPreviewMode, secureId]
  );

  const getProfileFallbackUrl = () => {
    if (!creatorParam) return '/';
    return `/public/${creatorParam}${isPreviewMode ? '?mode=preview' : ''}`;
  };

  const getCollectionsFallbackUrl = () => {
    if (!creatorParam) return '/collections';
    return `/collections?creator=${encodeURIComponent(creatorParam)}${isPreviewMode ? '&mode=preview' : ''}`;
  };

  const handleBackNavigation = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate(getProfileFallbackUrl());
  };

  const getRandomDimensions = (index: number) => {
    const ratios = [
      { width: 400, height: 600 },
      { width: 800, height: 600 },
      { width: 600, height: 600 },
      { width: 1200, height: 400 },
      { width: 400, height: 800 },
    ];
    return ratios[index % ratios.length];
  };

  const preloadImages = (images: any[]) => {
    images.forEach((imageData, idx) => {
      const imageSrc = typeof imageData === 'string' ? imageData : imageData.full;
      
      if (isVideoUrl(imageSrc)) {
        // For videos, load metadata to get actual dimensions
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          setMeasuredDims(prev => ({
            ...prev,
            [imageSrc]: { 
              width: video.videoWidth || 1920, 
              height: video.videoHeight || 1080 
            }
          }));
        };
        video.onerror = () => {
          // Fallback to 16:9 aspect ratio for videos
          setMeasuredDims(prev => ({
            ...prev,
            [imageSrc]: { width: 1920, height: 1080 }
          }));
        };
        video.src = imageSrc;
        return;
      }
      
      if (!loadedImages.has(imageSrc)) {
        const img = new Image();
        img.onload = () => {
          setMeasuredDims(prev => ({
            ...prev,
            [imageSrc]: { width: img.naturalWidth, height: img.naturalHeight }
          }));
        };
        img.onerror = () => {
          const dimensions = getRandomDimensions(idx);
          setMeasuredDims(prev => ({
            ...prev,
            [imageSrc]: { width: dimensions.width, height: dimensions.height }
          }));
        };
        const thumbCandidate = typeof imageData === 'string' ? imageSrc : (imageData.thumb || imageSrc);
        img.src = thumbCandidate;
      }
    });
  };

  const getCurrentImages = () => {
    if (!collection) return [];
    const endIndex = currentImagePage * imagesPerPage;
    return collection.images.slice(0, endIndex);
  };

  const getTotalImagePages = () => {
    if (!collection) return 0;
    return Math.ceil(collection.images.length / imagesPerPage);
  };

  useEffect(() => {
    if (collection) {
      const firstPageImages = collection.images.slice(0, imagesPerPage);
      preloadImages(firstPageImages);
    }
  }, [collection]);

  useEffect(() => {
    if (collection && currentImagePage < getTotalImagePages()) {
      const nextStartIndex = currentImagePage * imagesPerPage;
      const nextEndIndex = nextStartIndex + imagesPerPage;
      const nextImages = collection.images.slice(nextStartIndex, nextEndIndex);
      preloadImages(nextImages);
    }
  }, [currentImagePage, collection]);

  const loadMoreImages = () => {
    const totalPages = getTotalImagePages();
    if (currentImagePage < totalPages && !isLoadingImages) {
      setIsLoadingImages(true);
      setCurrentImagePage(prev => prev + 1);
      
      setTimeout(() => {
        window.scrollTo({
          top: window.scrollY + 100,
          behavior: 'smooth'
        });
      }, 100);
      
      setTimeout(() => {
        setIsLoadingImages(false);
      }, 300);
    }
  };

  if (accessDenied && secureId && !isValidSecureId(secureId)) {
    const previewQuery = creatorParam
      ? `?creator=${encodeURIComponent(creatorParam)}${isPreviewMode ? '&mode=preview' : ''}`
      : (isPreviewMode ? '?mode=preview' : '');
    return (
      <div className="min-h-screen feed-bg flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-foreground mb-4">Access Required</h1>
          <p className="text-muted-foreground mb-6">Purchase this collection to unlock full access.</p>
          <Button onClick={() => navigate(`/post-blurred/${secureId}${previewQuery}`)} variant="outline">
            View Preview
          </Button>
        </div>
      </div>
    );
  }

  if (remoteLoading && !collection) {
    return (
      <div className="min-h-screen feed-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-muted-foreground">Loading collection...</p>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen feed-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Collection not found</h1>
          <Button onClick={handleBackNavigation} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Feed
          </Button>
        </div>
      </div>
    );
  };

  const currentImages = getCurrentImages();
  const totalImagePages = getTotalImagePages();

  return (
    <div className="min-h-screen mobile-stable-shell feed-bg">
      <header className={`sticky top-0 z-10 nav-elevated ${isPreviewMode ? 'mobile-preview-navbar-offset' : ''}`}>
        <div className="max-w-6xl mx-auto p-3 sm:p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleBackNavigation} 
              variant="ghost" 
              size="sm"
              className="hover:bg-secondary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="hidden sm:block brand-wordmark text-sm"><span className="brand-accent">Six</span><span>Seven</span><span className="brand-accent">Creator</span></div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground tabular-nums">
              {Math.min(currentImagePage * imagesPerPage, collection.images.length)} of {collection.images.length}
            </span>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: collection.title, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
              className="p-2 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-all"
              title="Share"
            >
              <svg className="w-3.5 h-3.5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
            </button>
          </div>
        </div>
        {/* Subtle access indicator */}
        <div className="border-t border-emerald-500/10 bg-emerald-500/[0.03]">
          <div className="max-w-6xl mx-auto px-4 py-1.5 flex items-center justify-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60" />
            <span className="text-[10px] font-medium text-emerald-400/60 tracking-wide uppercase">Lifetime access</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="space-y-6">
          <div className="post-card rounded-xl p-6 animate-fade-in">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 tracking-tight">{collection.title}</h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">{collection.description}</p>
            <div className="text-muted-foreground text-xs mt-4">
              {collection.timestamp}
            </div>
          </div>

          {currentImages.length > 0 && (
            <>
              <ResponsiveMasonry
                columnsCountBreakPoints={{350: 1, 750: 3, 900: 4}}
              >
                <Masonry gutter="12px">
                  {currentImages.map((imageData, index) => {
                    const imageSrc = typeof imageData === 'string' ? imageData : imageData.full;
                    let thumbSrc = typeof imageData === 'string' 
                      ? imageSrc
                      : imageData.thumb;
                    
                    const mediaType = isVideoUrl(imageSrc) ? 'video' : 'image';
                    
                    // For videos, try to get a jpg thumbnail instead of the video file
                    if (mediaType === 'video') {
                      thumbSrc = thumbSrc.replace(/\.(mp4|webm|mov|ogg|avi)$/i, '.jpg');
                    }
                    const isMediaLoaded = loadedImages.has(imageSrc);
                    const md = measuredDims[imageSrc];
                    const dimensions = getRandomDimensions(index);
                    const intrinsicWidth = typeof imageData === 'string' ? null : Number(imageData?.width);
                    const intrinsicHeight = typeof imageData === 'string' ? null : Number(imageData?.height);
                    const hasIntrinsicDims =
                      Number.isFinite(intrinsicWidth) &&
                      Number.isFinite(intrinsicHeight) &&
                      Number(intrinsicWidth) > 0 &&
                      Number(intrinsicHeight) > 0;
                    const aspectW = hasIntrinsicDims ? Number(intrinsicWidth) : md ? md.width : dimensions.width;
                    const aspectH = hasIntrinsicDims ? Number(intrinsicHeight) : md ? md.height : dimensions.height;
                    
                    return (
                      <div 
                        key={`${imageSrc}-${index}`}
                        className="relative overflow-hidden rounded-lg animate-fade-in"
                        style={{ 
                          animationDelay: `${Math.min(index * 0.02, 1)}s`,
                          aspectRatio: `${aspectW} / ${aspectH}`
                        }}
                      >
                        {!isMediaLoaded && (
                          <div className="absolute inset-0 skeleton-shimmer z-10 rounded-lg" />
                        )}
                        
                        {mediaType === 'video' ? (
                          <InlineVideoPlayer
                            src={imageSrc}
                            thumbnail={thumbSrc}
                            alt={`${collection.title} - Video ${index + 1}`}
                            className={`w-full h-full transition-all duration-500 ${
                              isMediaLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                            onLoad={() => setLoadedImages(prev => new Set([...prev, imageSrc]))}
                          />
                        ) : (
                          <>
                            <ProgressiveImage
                              src={imageSrc}
                              thumbnail={thumbSrc}
                              alt={`${collection.title} - Image ${index + 1}`}
                              className={`w-full h-full object-cover transition-all duration-500 hover:scale-105 ${
                                isMediaLoaded ? 'opacity-100' : 'opacity-0'
                              }`}
                              onLoad={() => setLoadedImages(prev => new Set([...prev, imageSrc]))}
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

              {currentImagePage < totalImagePages && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={loadMoreImages}
                    disabled={isLoadingImages}
                    className="sky-action-btn px-6 py-2.5 sm:px-8 sm:py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:scale-105"
                  >
                    {isLoadingImages ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <span>Next Page</span>
                        <span className="text-xs opacity-80">({currentImagePage}/{totalImagePages})</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              <div className="flex justify-center mt-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-full backdrop-blur-sm">
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    Showing {Math.min(currentImagePage * imagesPerPage, collection.images.length)} of {collection.images.length} items
                  </span>
                </div>
              </div>
            </>
          )}

          <footer className="mt-12 border-t border-gray-200 pt-6 pb-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="brand-wordmark text-sm"><span className="brand-accent">Six</span><span>Seven</span><span className="brand-accent">Creator</span></div>
              <p className="text-xs text-muted-foreground">
                &copy; {new Date().getFullYear()} {collection.user.name}. All rights reserved.
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <button onClick={() => navigate(getProfileFallbackUrl())} className="hover:text-foreground transition-colors bg-transparent border-none cursor-pointer">Gallery</button>
                <button onClick={() => navigate(getCollectionsFallbackUrl())} className="hover:text-foreground transition-colors bg-transparent border-none cursor-pointer">Collections</button>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default PostDetail;
