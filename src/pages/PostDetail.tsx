// PostDetail.tsx - UPDATED WITH INLINE VIDEO
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Flame, Heart } from "lucide-react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { getCollection } from "@/collections/collectionsData";
import { getCollectionId, isValidSecureId } from "@/utils/secureIdMapper";
import ProgressiveImage from "@/components/ProgressiveImage";
import InlineVideoPlayer from "@/components/InlineVideoPlayer";
import { api } from "@/lib/api";

const PostDetail = () => {
  const { secureId } = useParams();
  const navigate = useNavigate();
  const [loadedImages, setLoadedImages] = useState(new Set<string>());
  const [currentImagePage, setCurrentImagePage] = useState(1);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [measuredDims, setMeasuredDims] = useState({});
  const [remoteCollection, setRemoteCollection] = useState<any>(null);
  const [remoteLoading, setRemoteLoading] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

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
    window.scrollTo(0, 0);
  }, [secureId]);

  const isVideoUrl = (url: string): boolean => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
    return videoExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  const getCollectionFromSecureId = () => {
    if (!secureId || !isValidSecureId(secureId)) {
      return null;
    }
    const actualId = getCollectionId(secureId);
    return getCollection(actualId);
  };

  const loadRemoteCollection = async () => {
    if (!secureId || isValidSecureId(secureId)) return;
    setRemoteLoading(true);
    setAccessDenied(false);

    try {
      const params = new URLSearchParams(window.location.search);
      const accessToken = params.get('access');

      if (!accessToken) {
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
            thumb: media.thumbnailUrl || media.url
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
          setLoadedImages(prev => new Set([...prev, imageSrc]));
          setMeasuredDims(prev => ({
            ...prev,
            [imageSrc]: { 
              width: video.videoWidth || 1920, 
              height: video.videoHeight || 1080 
            }
          }));
        };
        video.onerror = () => {
          setLoadedImages(prev => new Set([...prev, imageSrc]));
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
          setLoadedImages(prev => new Set([...prev, imageSrc]));
          setMeasuredDims(prev => ({
            ...prev,
            [imageSrc]: { width: img.naturalWidth, height: img.naturalHeight }
          }));
        };
        img.onerror = () => {
          setLoadedImages(prev => new Set([...prev, imageSrc]));
          const dimensions = getRandomDimensions(idx);
          setMeasuredDims(prev => ({
            ...prev,
            [imageSrc]: { width: dimensions.width, height: dimensions.height }
          }));
        };
        img.src = imageSrc.split('?')[0];
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
    return (
      <div className="min-h-screen feed-bg flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-foreground mb-4">Access Required</h1>
          <p className="text-muted-foreground mb-6">Purchase this collection to unlock full access.</p>
          <Button onClick={() => navigate(`/post-blurred/${secureId}`)} variant="outline">
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
          <Button onClick={() => navigate("/")} variant="outline">
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
    <div className="min-h-screen feed-bg">
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-background/80 border-b border-border p-3 sm:p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Button 
            onClick={() => navigate("/")} 
            variant="ghost" 
            size="sm"
            className="hover:bg-secondary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Feed
          </Button>
          <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Flame className="w-4 h-4 text-primary-foreground fill-current" />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="space-y-6">
          <div className="post-card rounded-xl p-6 animate-fade-in">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">{collection.title}</h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">{collection.description}</p>
            <div className="text-muted-foreground text-sm mt-4">
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
                      ? imageSrc.replace('/collection', '/thumbs/collection')
                      : imageData.thumb;
                    
                    const mediaType = isVideoUrl(imageSrc) ? 'video' : 'image';
                    
                    // For videos, try to get a jpg thumbnail instead of the video file
                    if (mediaType === 'video') {
                      thumbSrc = imageSrc.replace('/collection', '/thumbs/collection')
                                         .replace(/\.(mp4|webm|mov|ogg|avi)$/i, '.jpg');
                    }
                    const isMediaLoaded = loadedImages.has(imageSrc);
                    const md = measuredDims[imageSrc];
                    const dimensions = getRandomDimensions(index);
                    const aspectW = md ? md.width : dimensions.width;
                    const aspectH = md ? md.height : dimensions.height;
                    
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
                    className="px-6 py-2.5 sm:px-8 sm:py-3 bg-gradient-to-r from-primary via-primary to-accent text-primary-foreground rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:scale-105"
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

          <footer className="post-card rounded-xl p-5 sm:p-6 mt-6 sm:mt-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                      <Flame className="w-6 h-6 text-primary-foreground fill-current" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {collection.user.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">Exclusive Content</p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  Discover premium photography, art, and exclusive content from {collection.user.name}. 
                  Join the community of creative enthusiasts.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 md:contents">
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Explore</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <button 
                        onClick={() => navigate('/')} 
                        className="text-muted-foreground hover:text-primary transition-colors text-left"
                      >
                        Gallery
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => navigate('/collections')} 
                        className="text-muted-foreground hover:text-primary transition-colors text-left"
                      >
                        Collections
                      </button>
                    </li>
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
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                  </div>
                  <p className="text-sm text-muted-foreground">support@sixsevencreator.com</p>
                </div>
              </div>
            </div>

            <div className="border-t border-border mt-8 pt-6">
              <button 
                className="flex items-center justify-center gap-2 cursor-pointer hover:opacity-80 transition-all duration-300 group mb-4 w-full bg-transparent border-none"
                onClick={() => navigate('/collections')}
              >
                <Heart className="w-4 h-4 fill-current text-primary group-hover:scale-110 transition-transform" />
                <span className="font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Unlock Everything
                </span>
              </button>
              <p className="text-center text-xs text-muted-foreground mb-6">
                Get unlimited access to exclusive content, HD downloads, and early access to new collections
              </p>
            </div>

            <div className="border-t border-border pt-6 text-center">
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} {collection.user.name}. All rights reserved. 
                <span className="mx-2">|</span>
                <button className="hover:text-primary transition-colors bg-transparent border-none text-xs text-muted-foreground underline-none">Privacy Policy</button>
                <span className="mx-2">|</span>
                <button className="hover:text-primary transition-colors bg-transparent border-none text-xs text-muted-foreground underline-none">Terms of Service</button>
              </p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default PostDetail;
