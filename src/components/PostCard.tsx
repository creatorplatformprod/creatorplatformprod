// components/PostCard.tsx - UPDATED WITH SINGLE SHIMMER FOR WHOLE CARD
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Share2, Check, Lock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collection } from "@/collections/collectionsData";
import ProgressiveImage from "@/components/ProgressiveImage";
import { fetchEngagement, registerEngagementShare, registerEngagementView, setEngagementLike } from "@/lib/engagement";

interface PostCardProps {
  collection: Collection;
}

const PostCard = ({ collection }: PostCardProps) => {
  const engagementId = `collection:${collection.id}`;
  const [isLiked, setIsLiked] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(0);
  const [currentShares, setCurrentShares] = useState(0);
  const [currentViews, setCurrentViews] = useState(0);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [pending, setPending] = useState(false);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const navigate = useNavigate();
  const viewRef = useRef<HTMLDivElement | null>(null);
  const viewTrackedRef = useRef(false);

  useEffect(() => {
    let active = true;
    fetchEngagement('collection', collection.id).then((state) => {
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
        registerEngagementView('collection', collection.id)
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

  const getBlurredTarget = () => {
    const isMockCollection = /^mock-collection-\d+$/i.test(collection.id);
    const params = new URLSearchParams();
    if (isMockCollection && collection.creatorUsername) {
      params.set("creator", collection.creatorUsername);
    }
    if (collection.previewMode) {
      params.set("mode", "preview");
    }
    const query = params.toString();
    return query ? `/post-blurred/${collection.id}?${query}` : `/post-blurred/${collection.id}`;
  };

  const handleClick = () => {
    navigate(getBlurredTarget());
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (pending) return;
    setPending(true);
    const nextLiked = !isLiked;
    const nextLikes = Math.max(0, currentLikes + (nextLiked ? 1 : -1));
    persistEngagement(nextLikes, currentShares, nextLiked);
    setEngagementLike('collection', collection.id, nextLiked)
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

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const blurredUrl = getBlurredTarget();
    const fullUrl = window.location.origin + blurredUrl;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: collection.title,
          text: collection.description,
          url: fullUrl,
        });
        registerEngagementShare('collection', collection.id)
          .then((state) => {
            setIsLiked(state.viewerLiked);
            setCurrentLikes(state.likes);
            setCurrentShares(state.shares);
            setCurrentViews(state.views);
          })
          .catch(() => {});
      } else {
        await navigator.clipboard.writeText(fullUrl);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
        registerEngagementShare('collection', collection.id)
          .then((state) => {
            setIsLiked(state.viewerLiked);
            setCurrentLikes(state.likes);
            setCurrentShares(state.shares);
            setCurrentViews(state.views);
          })
          .catch(() => {});
      }
    } catch (error) {
      console.error('Error sharing:', error);
      try {
        await navigator.clipboard.writeText(fullUrl);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
        registerEngagementShare('collection', collection.id)
          .then((state) => {
            setIsLiked(state.viewerLiked);
            setCurrentLikes(state.likes);
            setCurrentShares(state.shares);
            setCurrentViews(state.views);
          })
          .catch(() => {});
      } catch (clipboardError) {
        console.error('Clipboard error:', clipboardError);
        alert(`Share this link: ${fullUrl}`);
      }
    }
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

  const handleImageLoad = () => {
    setLoadedCount(prev => {
      const newCount = prev + 1;
      const totalImages = Math.min(collection.images.length, collection.cardLayout.maxImages);
      if (newCount >= totalImages) {
        setAllImagesLoaded(true);
      }
      return newCount;
    });
  };

  const renderCollectionPreview = () => {
    const { cardLayout, images } = collection;
    const previewImages = images.slice(0, cardLayout.maxImages);
    
    return (
      <div 
        className="relative overflow-hidden cursor-pointer group h-64 md:h-80"
        onClick={handleClick}
      >
        {/* Single shimmer for entire image area */}
        {!allImagesLoaded && (
          <div className="absolute inset-0 skeleton-shimmer z-10" />
        )}
        
        <div
          className={`${cardLayout.gridClasses} transition-opacity duration-500 ${
            allImagesLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {previewImages.map((image, index) => {
            const spanClasses = cardLayout.imageSpans?.[index] || '';
            
            return (
              <div 
                key={index} 
                className={`relative overflow-hidden ${spanClasses}`}
              >
                <ProgressiveImage
                  src={image.full}
                  thumbnail={image.thumb}
                  alt={`${collection.title} - ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-100 transition-transform duration-500"
                  onLoad={handleImageLoad}
                />
              </div>
            );
          })}

          {/* Additional images indicator - positioned relative to entire image area */}
          {images.length > cardLayout.maxImages && (
            <div className="absolute bottom-3 right-4 z-10">
              <span className="text-white text-sm font-bold drop-shadow-lg">
                +{images.length - cardLayout.maxImages}
              </span>
            </div>
          )}
        </div>

        <div className="absolute inset-0 bg-black bg-opacity-10 backdrop-blur-[6px] group-hover:bg-opacity-5 group-hover:backdrop-blur-[4px] transition-all duration-300 z-[5]"></div>

        {/* Center unlock button */}
        <div className="absolute inset-0 flex items-center justify-center z-[6]">
          <Button
            className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm px-6 py-2 rounded-full font-medium"
            onClick={(e) => {
              e.stopPropagation();
              navigate(getBlurredTarget());
            }}
          >
            <Lock className="w-4 h-4 mr-2" />
            Unlock
          </Button>
        </div>
      </div>
    );
  };

  return (
    <article ref={viewRef} className="post-card rounded-xl overflow-hidden animate-fade-in bg-post-bg border border-border">
      {renderCollectionPreview()}
      
      <div className="p-4 border-t border-border">
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
              className="text-muted-foreground hover:bg-secondary hover:text-foreground px-3 relative"
              disabled={shareSuccess}
            >
              {shareSuccess ? (
                <Check className="w-4 h-4 mr-2 text-green-500" />
              ) : (
                <Share2 className="w-4 h-4 mr-2" />
              )}
              {shareSuccess ? 'Copied!' : 'Share'}
              <span className="ml-2 text-xs text-muted-foreground">
                {formatLikeCount(currentShares)}
              </span>
              {shareSuccess && (
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  Link copied!
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
