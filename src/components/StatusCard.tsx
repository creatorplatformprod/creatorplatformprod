import { useEffect, useState } from "react";
import { Heart, Share2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { readEngagement, writeEngagement } from "@/lib/engagement";

interface StatusCardProps {
  id: string;
  user: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  title: string;
  text: string;
  timestamp: string;
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

  useEffect(() => {
    const saved = readEngagement(engagementId);
    setIsLiked(saved.liked);
    setCurrentLikes(saved.likes);
    setCurrentShares(saved.shares);
  }, [engagementId]);

  const persistEngagement = (nextLikes: number, nextShares: number, nextLiked: boolean) => {
    setCurrentLikes(nextLikes);
    setCurrentShares(nextShares);
    setIsLiked(nextLiked);
    writeEngagement(engagementId, {
      likes: nextLikes,
      shares: nextShares,
      liked: nextLiked
    });
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
    const nextLiked = !isLiked;
    const nextLikes = Math.max(0, currentLikes + (nextLiked ? 1 : -1));
    persistEngagement(nextLikes, currentShares, nextLiked);
  };

  const handleShare = () => {
    navigator.share?.({
      title: title,
      text: text,
      url: window.location.origin + `/status/${id}`
    }).then(() => {
      persistEngagement(currentLikes, currentShares + 1, isLiked);
    }).catch(() => {
      navigator.clipboard.writeText(window.location.origin + `/status/${id}`)
        .then(() => {
          persistEngagement(currentLikes, currentShares + 1, isLiked);
        })
        .catch(() => {});
    });
  };

  return (
    <div className="post-card rounded-xl overflow-hidden bg-post-bg border border-border animate-fade-in">
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
              <p className="text-xs text-muted-foreground">{timestamp}</p>
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
              {currentShares > 0 && (
                <span className="ml-2 text-xs text-muted-foreground">
                  {formatLikeCount(currentShares)}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
