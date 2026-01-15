import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Flame, CreditCard, Shield, Lock, Loader2 } from "lucide-react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { getCollection } from "@/collections/collectionsData";
import ProgressiveImage from "@/components/ProgressiveImage";
import InlineVideoPlayer from "@/components/InlineVideoPlayer";

const PostDetailBlurred = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loadedImages, setLoadedImages] = useState(new Set<string>());
  const [measuredDims, setMeasuredDims] = useState({});
  const [paymentError, setPaymentError] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [isCardPaymentLoading, setIsCardPaymentLoading] = useState(false);

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const isVideoUrl = (url: string): boolean => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
    return videoExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  const collection = getCollection(id as string);
  
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
      `&email=${encodeURIComponent(sanitizedEmail)}`;

    window.location.href = checkoutUrl;
  };

  const handleUnlockClick = () => {
    // Modal is already visible
  };

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
        className="fixed top-4 left-4 z-[60] w-10 h-10 rounded-full bg-secondary/80 backdrop-blur-xl hover:bg-secondary flex items-center justify-center text-foreground transition-all duration-300 shadow-lg"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <main className="max-w-6xl mx-auto px-4 py-6 relative">
        <div className="space-y-6">
          <div className="post-card rounded-xl p-6 animate-fade-in">
            <h1 className="text-3xl font-bold text-foreground mb-3">{collection.title}</h1>
            <p className="text-muted-foreground text-lg leading-relaxed">{collection.description}</p>
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
                <span className="text-sm text-muted-foreground">
                  {collection.images.length} items in this collection
                </span>
              </div>
            </div>
          )}

          <footer className="post-card rounded-xl p-6 mt-8">
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
                    <li onClick={() => window.location.href = '/'}><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Gallery</a></li>
                    <li onClick={() => window.location.href = '/collections'}><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Collections</a></li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-4">Connect</h3>
                  <div className="flex gap-3 mb-4">
                    <a href="https://twitter.com/lannadelulu" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.040 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    </a>
                    <a href="https://instagram.com/lannadelulu" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.40s-.644-1.44-1.439-1.40z"/>
                      </svg>
                    </a>
                  </div>
                  <p className="text-sm text-muted-foreground">info@lannadelulu.com</p>
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

        {/* Payment Modal - Mobile Optimized */}
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
            className="bg-transparent rounded-2xl p-3.5 sm:p-6 w-full max-w-[310px] sm:max-w-md"
            style={{
              maxHeight: '85vh',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <div className="text-center">
              <div className="w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-2.5 sm:mb-4">
                <Flame className="w-5 h-5 sm:w-8 sm:h-8 text-primary-foreground fill-current" />
              </div>
              <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-1.5 sm:mb-2">
                Unlock "{collection.title}"
              </h2>
              <p className="text-xs sm:text-base text-white mb-3.5 sm:mb-6">
                Get instant access to {collection.images?.length || 0} exclusive items
              </p>
              
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
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-base bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-none"
                  required
                  maxLength={254}
                />
              </div>
              
              <div className="space-y-2 sm:space-y-3 mb-3.5 sm:mb-6">
                <div>
                  <button
                    onClick={handleCardPaymentClick}
                    disabled={isCardPaymentLoading}
                    className="bg-secondary/80 hover:bg-secondary text-foreground py-2 sm:py-3.5 px-3 sm:px-4 rounded-xl text-xs sm:text-base font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-full shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-none"
                  >
                    {isCardPaymentLoading ? (
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-foreground" />
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                        {`Pay by Card - ${formattedPrice}`}
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2.5 sm:gap-4 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-white/20">
                <div className="flex items-center gap-1 sm:gap-1.5 text-xs text-white">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5 text-xs text-white">
                  <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                  <span>SSL Encrypted</span>
                </div>
              </div>

              <p className="text-xs text-white">
                One-time purchase • Instant access • No subscriptions
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostDetailBlurred;