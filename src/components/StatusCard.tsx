import { useEffect, useRef, useState } from "react";
import { Heart, Share2, MoreHorizontal, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchEngagement, registerEngagementShare, registerEngagementView, setEngagementLike } from "@/lib/engagement";
import { formatRelativeTime } from "@/utils/relativeTime";

interface StatusCardProps {
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
}

const StatusCard = ({ 
  id,
  user,
  title,
  text,
  timestamp,
  likes
}: StatusCardProps) => {
  const engagementId = `status:${id}`;
  const [isLiked, setIsLiked] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(0);
  const [currentShares, setCurrentShares] = useState(0);
  const [currentViews, setCurrentViews] = useState(0);
  const [pending, setPending] = useState(false);
  const [displayTime, setDisplayTime] = useState(() => 
    typeof timestamp === 'string' && !timestamp.includes('T') 
      ? timestamp 
      : formatRelativeTime(timestamp)
  );
  const viewRef = useRef<HTMLDivElement | null>(null);
  const viewTrackedRef = useRef(false);

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

  return (
    <div ref={viewRef} className="post-card rounded-xl overflow-hidden bg-post-bg border border-border animate-fade-in">
      <div className="p-5">
        {/* Header with user info and timestamp */}
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

        {/* Status Title */}
        <h4 className="text-lg font-bold text-foreground mb-2">{title}</h4>
                
        {/* Status Text */}
        <p className="text-foreground mb-4">{text}</p>
      </div>
      
      {/* Engagement Bar */}
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

export default StatusCard;
