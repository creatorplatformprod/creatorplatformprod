// components/StatusCardWithMedia.tsx - UPDATED WITH SINGLE SHIMMER AND LIVE TIME
import { useEffect, useRef, useState } from "react";
import { Heart, Share2, Play, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProgressiveImage from "@/components/ProgressiveImage";
import { fetchEngagement, registerEngagementShare, registerEngagementView, setEngagementLike } from "@/lib/engagement";
import { formatRelativeTime } from "@/utils/relativeTime";

interface StatusCardWithMediaProps {
  id: string;
  user: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  title: string;
  text: string;
  timestamp: string | number | Date;
  likes: number;
  comments: number;
  media?: {
    type: "image" | "video";
    url: string;
    alt?: string;
    thumbnail?: string;
  };
  mediaItems?: Array<{
    type: "image" | "video";
    url: string;
    alt?: string;
    thumbnail?: string;
  }>;
}

const StatusCardWithMedia = ({ 
  id,
  user,
  title,
  text,
  timestamp,
  likes,
  media,
  mediaItems
}: StatusCardWithMediaProps) => {
  const engagementId = `status:${id}`;
  const [isLiked, setIsLiked] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(0);
  const [currentShares, setCurrentShares] = useState(0);
  const [currentViews, setCurrentViews] = useState(0);
  const [pending, setPending] = useState(false);
  const [showVideoControls, setShowVideoControls] = useState(false);
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);
  const [mediaRevealReady, setMediaRevealReady] = useState(false);
  const [mediaLoadedCount, setMediaLoadedCount] = useState(0);
  const [displayTime, setDisplayTime] = useState(() => 
    typeof timestamp === 'string' && !timestamp.includes('T') 
      ? timestamp 
      : formatRelativeTime(timestamp)
  );
  const viewRef = useRef<HTMLDivElement | null>(null);
  const viewTrackedRef = useRef(false);
  const resolvedMediaItems = (mediaItems && mediaItems.length > 0)
    ? mediaItems
    : (media ? [media] : []);
  const visibleMediaItems = resolvedMediaItems.slice(0, 4);

  // Live update timestamp every minute
  useEffect(() => {
    // Skip if timestamp is already a formatted string like "4 hours ago"
    if (typeof timestamp === 'string' && !timestamp.includes('T')) {
      setDisplayTime(timestamp);
      return;
    }
    
    const updateTime = () => setDisplayTime(formatRelativeTime(timestamp));
    updateTime();
    
    const intervalId = window.setInterval(updateTime, 60000);
    return () => window.clearInterval(intervalId);
  }, [timestamp]);

  useEffect(() => {
    let active = true;
    fetchEngagement('status', id).then((state) => {
      if (!active) return;
      setIsLiked(state.viewerLiked);
      setCurrentLikes(state.likes);
      setCurrentShares(state.shares);
      setCurrentViews(state.views);
    });
    return () => {
      active = false;
    };
  }, [engagementId]);

  useEffect(() => {
    const element = viewRef.current;
    if (!element || viewTrackedRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || viewTrackedRef.current) return;
        viewTrackedRef.current = true;
        registerEngagementView('status', id)
          .then((state) => {
            setCurrentViews(state.views);
          })
          .catch(() => {});
        observer.disconnect();
      },
      { threshold: 0.5 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [engagementId]);

  useEffect(() => {
    setIsMediaLoaded(false);
    setMediaRevealReady(false);
    setMediaLoadedCount(0);
  }, [media?.url, media?.thumbnail, media?.type, JSON.stringify(mediaItems || [])]);

  useEffect(() => {
    if (!isMediaLoaded) return;
    const timer = window.setTimeout(() => setMediaRevealReady(true), 70);
    return () => window.clearTimeout(timer);
  }, [isMediaLoaded]);

  useEffect(() => {
    if (visibleMediaItems.length === 0 || isMediaLoaded) return;
    const timeout = window.setTimeout(() => {
      setIsMediaLoaded(true);
    }, 4500);
    return () => window.clearTimeout(timeout);
  }, [visibleMediaItems.length, isMediaLoaded]);

  const persistEngagement = (nextLikes: number, nextShares: number, nextLiked: boolean) => {
    setCurrentLikes(nextLikes);
    setCurrentShares(nextShares);
    setIsLiked(nextLiked);
  };

  const formatLikeCount = (count: number) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return count.toString();
  };

  const handleLike = () => {
    if (pending) return;
    setPending(true);
    const nextLiked = !isLiked;
    const nextLikes = Math.max(0, currentLikes + (nextLiked ? 1 : -1));
    persistEngagement(nextLikes, currentShares, nextLiked);
    setEngagementLike('status', id, nextLiked)
      .then((state) => {
        setIsLiked(state.viewerLiked);
        setCurrentLikes(state.likes);
        setCurrentShares(state.shares);
        setCurrentViews(state.views);
      })
      .catch(() => {
        setIsLiked(isLiked);
        setCurrentLikes(currentLikes);
      })
      .finally(() => setPending(false));
  };

  const handleShare = () => {
    navigator.share?.({
      title: title,
      text: text,
      url: window.location.origin + `/status/${id}`
    }).then(() => {
      registerEngagementShare('status', id)
        .then((state) => {
          setIsLiked(state.viewerLiked);
          setCurrentLikes(state.likes);
          setCurrentShares(state.shares);
          setCurrentViews(state.views);
        })
        .catch(() => {});
    }).catch(() => {
      navigator.clipboard.writeText(window.location.origin + `/status/${id}`)
        .then(() => {
          registerEngagementShare('status', id)
            .then((state) => {
              setIsLiked(state.viewerLiked);
              setCurrentLikes(state.likes);
              setCurrentShares(state.shares);
              setCurrentViews(state.views);
            })
            .catch(() => {});
        })
        .catch(() => {});
    });
  };

  const handleVideoClick = () => {
    setShowVideoControls(true);
  };

  const handleMediaItemLoad = () => {
    setMediaLoadedCount((prev) => {
      const next = prev + 1;
      if (next >= Math.max(1, visibleMediaItems.length)) {
        setIsMediaLoaded(true);
      }
      return next;
    });
  };

  // Generate thumbnail path from full image URL
  const getThumbnailUrl = (url: string) => {
    return url.replace('/collection', '/thumbs/collection');
  };

  return (
    <div ref={viewRef} className="post-card rounded-xl overflow-hidden bg-post-bg border border-border animate-fade-in">
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center gap-1">
                <h3 className="text-sm font-semibold text-foreground">{user.name}</h3>
                {user.verified && (
                  <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.25 12l-2.75-2.75.75-3.25-3.25.75L12 0 8.75 2.75 5.5 2l.75 3.25L0 12l2.75 2.75-.75 3.25 3.25-.75L12 24l3.25-2.75 3.25.75-.75-3.25L24 12zm-11.5 6.25L6.75 12l1.75-1.75 2.25 2.25 5.25-5.25L18.25 9l-6.5 9.25z"/>
                  </svg>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{displayTime}</p>
            </div>
          </div>
        </div>

        {title && <h4 className="text-lg font-bold text-foreground mb-2">{title}</h4>}
                
        <p className="text-foreground mb-4">{text}</p>

        {visibleMediaItems.length > 0 && (
          <div className="mb-4 rounded-lg overflow-hidden relative">
            {/* Single shimmer for media area */}
            <div
              className={`absolute inset-0 skeleton-shimmer z-10 rounded-lg transition-opacity duration-300 ${
                mediaRevealReady ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            />
            {visibleMediaItems.length > 1 ? (
              <div className="grid grid-cols-2 gap-1">
                {visibleMediaItems.map((item, idx) => {
                  const thumbnail = item.thumbnail || (item.type === 'image' ? getThumbnailUrl(item.url) : item.url);
                  return (
                    <div key={`${item.url}-${idx}`} className="relative h-40 overflow-hidden rounded-md bg-muted/20">
                      <img
                        src={thumbnail}
                        alt={item.alt || `${title} media ${idx + 1}`}
                        className={`w-full h-full object-cover transition-opacity duration-500 ${
                          mediaRevealReady ? 'opacity-100' : 'opacity-0'
                        }`}
                        onLoad={handleMediaItemLoad}
                        onError={handleMediaItemLoad}
                      />
                      {item.type === 'video' && (
                        <div className="absolute inset-0 bg-black/25 flex items-center justify-center pointer-events-none">
                          <Play className="w-7 h-7 text-white/90" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : visibleMediaItems[0].type === "image" ? (
              <ProgressiveImage
                src={visibleMediaItems[0].url}
                thumbnail={visibleMediaItems[0].thumbnail || getThumbnailUrl(visibleMediaItems[0].url)}
                alt={visibleMediaItems[0].alt || title}
                className={`w-full h-auto max-h-96 object-cover transition-opacity duration-500 ${
                  mediaRevealReady ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setIsMediaLoaded(true)}
              />
            ) : (
              <div 
                className="relative cursor-pointer group"
                onClick={handleVideoClick}
              >
                {showVideoControls ? (
                  <video
                    src={visibleMediaItems[0].url}
                    controls
                    className="w-full h-auto max-h-96 object-cover"
                    poster={visibleMediaItems[0].thumbnail}
                    onLoadedData={() => setIsMediaLoaded(true)}
                    onError={() => setIsMediaLoaded(true)}
                  />
                ) : (
                  <div className="relative">
                    <img
                      src={visibleMediaItems[0].thumbnail || visibleMediaItems[0].url}
                      alt={visibleMediaItems[0].alt || title}
                      className="w-full h-auto max-h-96 object-cover"
                      onLoad={() => setIsMediaLoaded(true)}
                      onError={() => setIsMediaLoaded(true)}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-20 transition-all duration-300">
                      <div className="bg-white/90 rounded-full p-4 group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                        <Play className="w-8 h-8 text-black/80 ml-1" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-border bg-post-bg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-muted-foreground'}`} />
              <span className={isLiked ? 'text-rose-500' : 'text-muted-foreground'}>{formatLikeCount(currentLikes)}</span>
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 text-muted-foreground">
              <Eye className="w-4 h-4" />
              <span>{formatLikeCount(currentViews)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="text-muted-foreground hover:bg-secondary hover:text-foreground px-3"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
              <span className="ml-2 text-xs text-muted-foreground">
                {formatLikeCount(currentShares)}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusCardWithMedia;
