import { useState, useEffect } from "react";
import { Heart, ArrowLeft, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Preloader from "../components/Preloader";
import { getAllCollectionIds, getCollection } from "@/collections/collectionsData";
import ProgressiveImage from "@/components/ProgressiveImage";
import InlineVideoPlayer from "@/components/InlineVideoPlayer";

const Collections1849929295832448 = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isPreloading, setIsPreloading] = useState(true);
  const [showPreloader, setShowPreloader] = useState(true);
  const [theme, setTheme] = useState("dark");
  const [measuredDims, setMeasuredDims] = useState({});

  useEffect(() => {
    const savedTheme = window.localStorage?.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.className = savedTheme;
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.className = newTheme;
    if (window.localStorage) {
      window.localStorage.setItem('theme', newTheme);
    }
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

  const collectionIds = getAllCollectionIds();
  const allImages = [];
  
  collectionIds.forEach(id => {
    const collection = getCollection(id);
    if (collection) {
      collection.images.forEach((imageData, index) => {
        const imageSrc = typeof imageData === 'string' ? imageData : imageData.full;
        const thumbSrc = typeof imageData === 'string' 
          ? imageSrc.replace('/collection', '/thumbs/collection')
          : imageData.thumb;
        
        const mediaType = isVideoUrl(imageSrc) ? 'video' : 'image';
        
        allImages.push({
          src: imageSrc,
          thumb: thumbSrc,
          collectionId: id,
          collectionTitle: collection.title,
          imageIndex: index,
          mediaType: mediaType,
          ...getRandomDimensions(allImages.length)
        });
      });
    }
  });

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

  return (
    <>
      {showPreloader && <Preloader isVisible={isPreloading} onComplete={handlePreloaderComplete} />}
      
      {!showPreloader && (
        <div className="min-h-screen feed-bg">
          <header className="sticky top-0 z-10 backdrop-blur-xl bg-background/80 border-b border-border p-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <Button 
                onClick={() => navigate('/')} 
                variant="ghost" 
                size="sm"
                className="hover:bg-secondary"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Feed
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Heart className="w-4 h-4 text-primary-foreground fill-current" />
                </div>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-secondary/80 transition-all duration-200 hover:scale-105"
                >
                  {theme === "dark" ? (
                    <Sun className="w-5 h-5 text-amber-500" />
                  ) : (
                    <Moon className="w-5 h-5 text-primary" />
                  )}
                </button>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-4 py-6 relative">
            <ResponsiveMasonry
              columnsCountBreakPoints={{350: 1, 750: 3, 900: 4}}
            >
              <Masonry gutter="12px">
                {currentImages.map((mediaObj, index) => {
                  const globalIndex = startIndex + index;
                  const isMediaLoaded = loadedImages.has(mediaObj.src);
                  const md = measuredDims[mediaObj.src];
                  const aspectW = md ? md.width : mediaObj.width;
                  const aspectH = md ? md.height : mediaObj.height;

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

            <div className="flex justify-center gap-4 mt-8">
              {currentPage > 1 && (
                <button
                  onClick={loadPreviousImages}
                  disabled={isLoading}
                  className="px-6 py-3 bg-secondary hover:bg-secondary/80 text-foreground rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm hover:shadow-md"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>
              )}

              {currentPage < totalPages && (
                <button
                  onClick={loadMoreImages}
                  disabled={isLoading}
                  className="px-8 py-3 bg-gradient-to-r from-primary via-primary to-accent text-primary-foreground rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:scale-105"
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
                <span className="text-sm text-muted-foreground">
                  Showing {Math.min(endIndex, allImages.length)} of {allImages.length} exclusive items from {collectionIds.length} collections
                </span>
              </div>
            </div>

            <footer className="post-card rounded-xl p-6 mt-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                        <Heart className="w-6 h-6 text-primary-foreground fill-current" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Lannah
                      </h2>
                      <p className="text-sm text-muted-foreground">17 Exclusive Collections</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Discover premium photography, art, and exclusive content from Lannah. 
                    Join the community of creative enthusiasts exploring 17 unique visual collections.
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
                      <a href="https://twitter.com/lannah" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.040 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                        </svg>
                      </a>
                      <a href="https://instagram.com/lannah" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.40z"/>
                        </svg>
                      </a>
                    </div>
                    <p className="text-sm text-muted-foreground">info@lannah.com</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-border mt-8 pt-6 text-center">
                <p className="text-xs text-muted-foreground">
                  © {new Date().getFullYear()} Lannah. All rights reserved. 
                  <span className="mx-2">•</span>
                  <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                  <span className="mx-2">•</span>
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