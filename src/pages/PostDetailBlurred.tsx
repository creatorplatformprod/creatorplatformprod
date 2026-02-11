import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, Loader2, Users, Eye } from "lucide-react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { getAllCollectionIds, getCollection } from "@/collections/collectionsData";
import ProgressiveImage from "@/components/ProgressiveImage";
import InlineVideoPlayer from "@/components/InlineVideoPlayer";
import { api } from "@/lib/api";
import { getSecureId } from "@/utils/secureIdMapper";

const PostDetailBlurred = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loadedImages, setLoadedImages] = useState(new Set<string>());
  const [measuredDims, setMeasuredDims] = useState({});
  const [paymentError, setPaymentError] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [isCardPaymentLoading, setIsCardPaymentLoading] = useState(false);
  const [remoteCollection, setRemoteCollection] = useState<any>(null);
  const [remoteLoading, setRemoteLoading] = useState(false);
  const [canRevealContent, setCanRevealContent] = useState(false);

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
      .video-container video {
        -webkit-transform: translateZ(0) scale(1.0001);
        transform: translateZ(0) scale(1.0001);
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        -webkit-perspective: 1000;
        perspective: 1000;
        will-change: transform;
        background: black;
        display: block;
        object-fit: cover;
      }
      .video-container {
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        -webkit-perspective: 1000;
        perspective: 1000;
        isolation: isolate;
        background: black;
        overflow: hidden;
      }
      body.modal-open .video-container {
        -webkit-transform: translate3d(0, 0, 0) scale(0.999);
        transform: translate3d(0, 0, 0) scale(0.999);
      }
      body.modal-open .video-container video {
        -webkit-transform: translateZ(0) scale(1.0001);
        transform: translateZ(0) scale(1.0001);
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  // Pre-fill email from fan registration
  useEffect(() => {
    const savedEmail = localStorage.getItem('fan_email');
    if (savedEmail && !customerEmail) {
      setCustomerEmail(savedEmail);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const isVideoUrl = (url: string): boolean => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
    return videoExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  const resolveLocalCollection = (collectionId?: string) => {
    if (!collectionId) return undefined;
    const directCollection = getCollection(collectionId);
    if (directCollection) return directCollection;

    const mockMatch = collectionId.match(/^mock-collection-(\d+)$/i);
    if (!mockMatch) return undefined;

    const allIds = getAllCollectionIds();
    if (allIds.length === 0) return undefined;

    const parsed = Number.parseInt(mockMatch[1], 10);
    const index = Number.isNaN(parsed) ? 0 : Math.max(parsed - 1, 0) % allIds.length;
    return getCollection(allIds[index]);
  };

  const localCollection = resolveLocalCollection(id as string);
  const fallbackMockCollection = getCollection(getAllCollectionIds()[0] || '');

  const loadRemoteCollection = async () => {
    if (!id || localCollection) return;
    setRemoteLoading(true);
    try {
      const collectionResult = await api.getCollection(id);
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
            avatar: creatorUser?.avatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&fit=crop',
            verified: creatorUser?.isVerified || false
          },
          timestamp: collectionResult.collection.createdAt
            ? new Date(collectionResult.collection.createdAt).toLocaleDateString()
            : 'Recently',
          price: collectionResult.collection.price || 4.99,
          creatorId: creatorId || ''
        };

        setRemoteCollection(mapped);
        return;
      }

      // Owner preview fallback for unpublished/private content.
      const token = localStorage.getItem('token');
      if (token) {
        const me = await api.getCurrentUser();
        if (me?.success) {
          const mine = await api.getMyCollections();
          const ownCollection = (mine?.collections || []).find((c: any) => c?._id === id);
          if (ownCollection) {
            setRemoteCollection({
              id: ownCollection._id,
              title: ownCollection.title,
              description: ownCollection.description || '',
              images: (ownCollection.media || []).map((media: any) => ({
                full: media.url,
                thumb: media.thumbnailUrl || media.url
              })),
              user: {
                name: me.user?.displayName || me.user?.username || 'Creator',
                avatar: me.user?.avatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&fit=crop',
                verified: me.user?.isVerified || false
              },
              timestamp: ownCollection.createdAt
                ? new Date(ownCollection.createdAt).toLocaleDateString()
                : 'Recently',
              price: ownCollection.price || 4.99,
              creatorId: ownCollection.creatorId || me.user?._id || ''
            });
            return;
          }
        }
      }
    } catch (error) {
      console.error('Failed to load collection:', error);
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const me = await api.getCurrentUser();
          const mine = await api.getMyCollections();
          const ownCollection = (mine?.collections || []).find((c: any) => c?._id === id);
          if (ownCollection) {
            setRemoteCollection({
              id: ownCollection._id,
              title: ownCollection.title,
              description: ownCollection.description || '',
              images: (ownCollection.media || []).map((media: any) => ({
                full: media.url,
                thumb: media.thumbnailUrl || media.url
              })),
              user: {
                name: me?.user?.displayName || me?.user?.username || 'Creator',
                avatar: me?.user?.avatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&fit=crop',
                verified: me?.user?.isVerified || false
              },
              timestamp: ownCollection.createdAt
                ? new Date(ownCollection.createdAt).toLocaleDateString()
                : 'Recently',
              price: ownCollection.price || 4.99,
              creatorId: ownCollection.creatorId || me?.user?._id || ''
            });
            return;
          }
        }
      } catch {
        // ignore fallback failures
      }
      setRemoteCollection(null);
    } finally {
      setRemoteLoading(false);
    }
  };

  useEffect(() => {
    loadRemoteCollection();
  }, [id]);

  useEffect(() => {
    const resolveRevealAccess = async () => {
      if (!id) {
        setCanRevealContent(false);
        return;
      }
      const token = localStorage.getItem('token');
      if (!token) {
        setCanRevealContent(false);
        return;
      }
      try {
        const mine = await api.getMyCollections();
        const ownsCollection = !!(mine?.collections || []).find((collection: any) => collection?._id === id);
        setCanRevealContent(ownsCollection || !!localCollection);
      } catch {
        setCanRevealContent(!!localCollection);
      }
    };
    resolveRevealAccess();
  }, [id, localCollection]);

  const getRevealUrl = () => {
    if (!id) return '#';
    // Mock/local collections use secure IDs on revealed route.
    if (localCollection) {
      const resolvedId = localCollection.id;
      const secureId = getSecureId(resolvedId);
      return secureId ? `/post/${secureId}` : `/post/${resolvedId}`;
    }
    // Real creator collections use direct collection IDs with owner bypass.
    return `/post/${id}`;
  };

  const collection = remoteCollection || localCollection || fallbackMockCollection;
  
  // Get the price for this collection (default to 4.99 if no price set)
  const collectionPrice = collection?.price || 4.99;
  const formattedPrice = `$${collectionPrice.toFixed(2)}`;

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

  useEffect(() => {
    if (collection) {
      preloadImages(collection.images);
    }
  }, [collection]);

  const sanitizeEmail = (email: string): string => {
    if (!email || typeof email !== 'string') return '';
    return email
      .toLowerCase()
      .trim()
      .replace(/[<>]/g, '')
      .substring(0, 254);
  };

  const isValidEmail = (email: string): boolean => {
    if (!email || typeof email !== 'string') return false;
    if (email.length > 254 || email.length < 3) return false;
    
    if (email.includes('..')) return false;
    
    const [localPart, domain] = email.split('@');
    if (!localPart || !domain) return false;
    if (localPart.startsWith('.') || localPart.endsWith('.')) return false;
    if (domain.startsWith('.') || domain.endsWith('.')) return false;
    
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!emailRegex.test(email)) return false;
    if (email.split('@').length !== 2) return false;
    if (!domain.includes('.')) return false;
    
    const domainParts = domain.split('.');
    if (domainParts.some(part => part.length === 0)) return false;
    
    return true;
  };

  const handleCardPaymentClick = () => {
    if (!collection) return;

    const sanitizedEmail = sanitizeEmail(customerEmail);

    if (!sanitizedEmail) {
      setPaymentError('Please enter your email address');
      return;
    }

    if (!isValidEmail(sanitizedEmail)) {
      setPaymentError('Please enter a valid email address (e.g., name@example.com)');
      return;
    }

    setIsCardPaymentLoading(true);
    setPaymentError("");

    const checkoutUrl = `/checkout?` +
      `amount=${collectionPrice}` +
      `&collectionId=${collection.id}` +
      `&collectionTitle=${encodeURIComponent(collection.title)}` +
      `&itemCount=${collection.images?.length || 0}` +
      `&email=${encodeURIComponent(sanitizedEmail)}` +
      (collection.creatorId ? `&creatorId=${encodeURIComponent(collection.creatorId)}` : '');

    window.location.href = checkoutUrl;
  };

  const handleUnlockClick = () => {
    // Modal is already visible
  };

  if (remoteLoading && !collection) {
    return (
      <div className="min-h-screen feed-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
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
  }

  return (
    <div className="min-h-screen feed-bg">
      <button
        onClick={() => window.history.back()}
        className="fixed top-4 left-4 z-[60] w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-secondary/80 backdrop-blur-xl hover:bg-secondary flex items-center justify-center text-foreground transition-all duration-300 shadow-lg"
      >
        <ArrowLeft className="w-5 h-5 sm:w-5 sm:h-5" />
      </button>
      {canRevealContent && id && (
        <button
          onClick={() => navigate(getRevealUrl())}
          className="fixed top-4 right-4 z-[60] h-9 sm:h-8 px-3 rounded-full bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-xl hover:bg-emerald-500/30 text-emerald-300 transition-all duration-300 shadow-lg text-xs font-medium inline-flex items-center gap-1.5"
        >
          <Eye className="w-3.5 h-3.5" />
          Reveal Content
        </button>
      )}

      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[60] flex flex-col items-center">
        <span className="text-xs text-white font-medium drop-shadow-lg">Scroll down to preview</span>
        <span className="text-lg text-white mt-1 animate-bounce drop-shadow-lg" style={{ animationDuration: '2s' }}>↓</span>
      </div>

      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6 relative">
        <div className="space-y-6">
          <div className="post-card rounded-xl p-6 animate-fade-in">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">{collection.title}</h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">{collection.description}</p>
            <div className="text-muted-foreground text-sm mt-4">
              {collection.timestamp}
            </div>
          </div>

          <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 3, 900: 4}}>
            <Masonry gutter="12px">
              {collection.images.map((imageData, index) => {
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
                    className={`relative overflow-hidden rounded-lg animate-fade-in cursor-pointer ${mediaType === 'video' ? 'video-container' : ''}`}
                    style={{ 
                      animationDelay: `${Math.min(index * 0.02, 1)}s`,
                      aspectRatio: `${aspectW} / ${aspectH}`,
                      transform: 'translateZ(0)',
                      WebkitTransform: 'translateZ(0)'
                    }}
                    onClick={handleUnlockClick}
                  >
                    {!isMediaLoaded && (
                      <div className="absolute inset-0 skeleton-shimmer z-10 rounded-lg" />
                    )}
                    
                    {mediaType === 'video' ? (
                      <InlineVideoPlayer
                        src={imageSrc}
                        thumbnail={thumbSrc}
                        alt=""
                        className={`w-full h-full transition-all duration-500 ${isMediaLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setLoadedImages(prev => new Set([...prev, imageSrc]))}
                        isBlurred={true}
                        onClick={handleUnlockClick}
                      />
                    ) : (
                      <>
                        <ProgressiveImage
                          src={imageSrc}
                          thumbnail={thumbSrc}
                          alt={`${collection.title} - Image ${index + 1}`}
                          className={`w-full h-full object-cover transition-all duration-500 ${isMediaLoaded ? 'opacity-100' : 'opacity-0'}`}
                          onLoad={() => setLoadedImages(prev => new Set([...prev, imageSrc]))}
                        />
                        <div className={`absolute inset-0 bg-black/30 transition-opacity duration-500 ${isMediaLoaded ? 'opacity-100' : 'opacity-0'}`} />
                      </>
                    )}
                  </div>
                );
              })}
            </Masonry>
          </ResponsiveMasonry>

          {collection.images && (
            <div className="flex justify-center mt-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-full backdrop-blur-sm">
                <span className="text-xs sm:text-sm text-muted-foreground">
                  {collection.images.length} items in this collection
                </span>
              </div>
            </div>
          )}

          <footer className="post-card rounded-xl p-5 sm:p-6 mt-6 sm:mt-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="brand-wordmark text-lg"><span className="brand-accent">Six</span><span className="text-white">Seven</span><span className="brand-accent">Creator</span></div>
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
                    <li onClick={() => window.location.href = '/'}><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Gallery</a></li>
                    <li onClick={() => window.location.href = '/collections'}><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Collections</a></li>
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
                © {new Date().getFullYear()} {collection.user.name}. All rights reserved. 
                <span className="mx-2">•</span>
                <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                <span className="mx-2">•</span>
                <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              </p>
            </div>
          </footer>
        </div>

        {/* Payment Modal */}
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            overscrollBehavior: 'contain'
          }}
        >
          <div 
            className="bg-transparent rounded-2xl p-4 sm:p-6 w-full max-w-[340px] sm:max-w-sm"
            style={{ maxHeight: '85vh', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}
          >
            <div className="text-center">
              <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-1 sm:mb-1.5">
                Unlock "{collection.title}"
              </h2>

              <div className="flex items-center justify-center gap-1.5 mb-3 sm:mb-4">
                <Users className="w-3 h-3 text-white/50" />
                <span className="text-[11px] text-white/50">Join 1,000+ fans who unlocked this content</span>
              </div>
              
              {paymentError && (
                <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-red-500/20 border border-red-500/40 rounded-lg">
                  <p className="text-xs sm:text-sm text-white">{paymentError}</p>
                </div>
              )}
              
              <div className="mb-3 sm:mb-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={customerEmail}
                  onChange={(e) => {
                    setCustomerEmail(e.target.value);
                    setPaymentError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === 'Go') {
                      e.preventDefault();
                      handleCardPaymentClick();
                    }
                  }}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-base bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                  maxLength={254}
                />
              </div>
              
              <button 
                onClick={handleCardPaymentClick}
                disabled={isCardPaymentLoading}
                className="w-full py-2.5 sm:py-3.5 px-3 sm:px-4 rounded-xl text-sm sm:text-base font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-lg hover:scale-[1.02]"
              >
                {isCardPaymentLoading ? (
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                    {`Unlock Now -- ${formattedPrice}`}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  window.location.href = '/recover-access';
                }}
                className="mt-2 text-[11px] text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2 bg-transparent border-none cursor-pointer"
              >
                Lost your access link? Recover via email
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostDetailBlurred;
