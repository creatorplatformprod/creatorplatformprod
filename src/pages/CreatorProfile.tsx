import { useState, useEffect, useMemo, type SyntheticEvent } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Heart, ChevronRight, ChevronLeft, Sun, Moon, Sparkles, Image, Camera, Flame, Flower2, Zap, Star, Droplet, CloudRain, Music, Palette, Briefcase, BookOpen, Gem, Crown, Target, Coffee, Feather, Info } from "lucide-react";
import FeedHeader from "@/components/FeedHeader";
import PostCard from "@/components/PostCard";
import StatusCard from "@/components/StatusCard";
import StatusCardWithMedia from "@/components/StatusCardWithMedia";
import Preloader from "@/components/Preloader";
import TopLoader from "@/components/TopLoader";
import FanAccountMenu from "@/components/FanAccountMenu";
import FanAuthModal from "@/components/FanAuthModal";
import { api } from "@/lib/api";
import { useFanAuth } from "@/contexts/FanAuthContext";
const MOCK_ASSETS = {
  avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400&fit=crop",
  cover: "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=1600&fit=crop",
  statusOne: "https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?auto=compress&cs=tinysrgb&w=1200",
  statusTwo: "https://images.pexels.com/photos/1758144/pexels-photo-1758144.jpeg?auto=compress&cs=tinysrgb&w=1200",
  statusThree: "https://images.pexels.com/photos/1468379/pexels-photo-1468379.jpeg?auto=compress&cs=tinysrgb&w=1200",
  collections: [
    {
      title: "After Dark Portraits",
      description: "Neon-lit portraits and cinematic edits from late-night shoots.",
      images: [
        "https://images.pexels.com/photos/1796730/pexels-photo-1796730.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "https://images.pexels.com/photos/1386604/pexels-photo-1386604.jpeg?auto=compress&cs=tinysrgb&w=1200"
      ]
    },
    {
      title: "Studio Sets",
      description: "Polished studio content with color-graded premium frames.",
      images: [
        "https://images.pexels.com/photos/2116469/pexels-photo-2116469.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "https://images.pexels.com/photos/1755385/pexels-photo-1755385.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=1200"
      ]
    },
    {
      title: "Street Sessions",
      description: "Editorial street looks, candid motion, and urban backdrops.",
      images: [
        "https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "https://images.pexels.com/photos/1832323/pexels-photo-1832323.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "https://images.pexels.com/photos/1755385/pexels-photo-1755385.jpeg?auto=compress&cs=tinysrgb&w=1200"
      ]
    }
  ]
};
const DEFAULT_COVER_OVERLAY = 0.45;

const CreatorProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isPreviewMode = searchParams.get('mode') === 'preview';
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showPreloader, setShowPreloader] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [creatorData, setCreatorData] = useState<any>(null);
  const [collections, setCollections] = useState<any[]>([]);
  const [statusCards, setStatusCards] = useState<any[]>([]);
  const [feedFilter, setFeedFilter] = useState<'all' | 'collections' | 'posts'>('all');
  const [showFanAuthModal, setShowFanAuthModal] = useState(false);
  const { fan, loading: fanLoading, guestMode } = useFanAuth();
  const hasDraftCapablePreview = isPreviewMode;
  const getProfileDraft = (targetUsername?: string) => {
    if (!targetUsername) return null;
    try {
      const raw = localStorage.getItem(`publicWebsiteProfileDraft:${targetUsername}`);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : null;
    } catch {
      return null;
    }
  };
  
  useEffect(() => {
    if (isPreviewMode || fanLoading) return;
    const seen = localStorage.getItem('fan_entry_prompt_seen') === 'true';
    const hasKnownEmail = !!localStorage.getItem('fan_email');
    const shouldPrompt = !seen && !fan && !guestMode && !hasKnownEmail;
    if (!shouldPrompt) return;
    const timer = window.setTimeout(() => {
      setShowFanAuthModal(true);
      localStorage.setItem('fan_entry_prompt_seen', 'true');
    }, 800);
    return () => window.clearTimeout(timer);
  }, [isPreviewMode, fanLoading, fan, guestMode]);
  
  // Mock status cards for empty preview -- richer content
  const mockStatusCards = useMemo(() => [
    {
      id: "mock-status-1",
      user: {
        name: creatorData?.displayName || "Your Name",
        avatar: creatorData?.avatar || MOCK_ASSETS.avatar,
        verified: true
      },
      title: "",
      text: "Just wrapped an incredible shoot! Can't wait to share the full set with you. New collection dropping this week -- stay tuned for something special.",
      timestamp: "2 hours ago",
      likes: 1234,
      comments: 89,
      media: {
        type: "image" as const,
        url: MOCK_ASSETS.statusOne,
        alt: "Behind the scenes"
      },
      isMockData: true
    },
    {
      id: "mock-status-2",
      user: {
        name: creatorData?.displayName || "Your Name",
        avatar: creatorData?.avatar || MOCK_ASSETS.avatar,
        verified: true
      },
      title: "Thank You 💜",
      text: "We just hit 1,000 supporters! You all mean the world to me. As a thank you, I'm working on something extra special for my next drop.",
      timestamp: "5 hours ago",
      likes: 2847,
      comments: 156,
      isMockData: true
    },
    {
      id: "mock-status-3",
      user: {
        name: creatorData?.displayName || "Your Name",
        avatar: creatorData?.avatar || MOCK_ASSETS.avatar,
        verified: true
      },
      title: "",
      text: "Golden hour magic from yesterday's session. This light was unreal.",
      timestamp: "1 day ago",
      likes: 943,
      comments: 67,
      media: {
        type: "image" as const,
        url: MOCK_ASSETS.statusThree,
        alt: "Golden hour shoot"
      },
      isMockData: true
    }
  ], [creatorData]);

  // Purpose-aligned mock collections with stable image sources.
  const mockCollections = useMemo(() => {
    return MOCK_ASSETS.collections.map((collection, index) => ({
      id: `mock-collection-${index + 1}`,
      title: collection.title,
      description: collection.description,
      images: collection.images.map((url) => ({ full: url, thumb: url })),
      user: {
        name: creatorData?.displayName || "Your Name",
        avatar: creatorData?.avatar || MOCK_ASSETS.avatar,
        verified: true
      },
      timestamp: 'Recently',
      likes: 0,
      comments: 0,
      type: 'collection' as const,
      feedType: 'collection' as const,
      price: 9.99,
      currency: 'USD',
      cardLayout: {
        gridType: 'quad',
        maxImages: 4,
        gridClasses: 'grid grid-cols-2 grid-rows-2 gap-1 h-full'
      },
      isMockData: true
    }));
  }, [creatorData]);

  useEffect(() => {
    loadCreatorProfile();
  }, [username, isPreviewMode]);

  useEffect(() => {
    const creatorName = creatorData?.displayName || creatorData?.username || "Creator";
    document.title = `${creatorName} | SixSevenCreator`;
  }, [creatorData]);

  const loadCreatorProfile = async () => {
    try {
      setIsLoading(true);
      const safeUsername = username || '';
      if (!safeUsername) {
        return;
      }

      if (hasDraftCapablePreview) {
        try {
          const authUserResult = await api.getCurrentUser();
          const isOwnerViewingPreview =
            authUserResult?.success &&
            authUserResult?.user?.username?.toLowerCase() === safeUsername.toLowerCase();

          if (isOwnerViewingPreview) {
            const [publicUserResult, privateCollectionsResult, statusCardsResult] = await Promise.all([
              api.getUser(safeUsername),
              api.getMyCollections(),
              api.getStatusCards(safeUsername)
            ]);

            const baseUser = publicUserResult?.success
              ? publicUserResult.user
              : authUserResult.user;
            const profileDraft = getProfileDraft(safeUsername);
            setCreatorData(
              profileDraft ? { ...baseUser, ...profileDraft } : baseUser
            );
            setCollections(privateCollectionsResult?.success ? (privateCollectionsResult.collections || []) : []);
            setStatusCards(statusCardsResult?.success ? (statusCardsResult.statusCards || []) : []);
            return;
          }
        } catch {
          // Fall back to public endpoint for non-owner preview sessions.
        }
      }

      const data = await api.getCreatorProfile(safeUsername);
      if (data.success) {
        setCreatorData(data.user);
        setCollections(data.collections || []);
        setStatusCards(data.statusCards || []);
      }
    } catch (error) {
      console.error('Error loading creator profile:', error);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setShowPreloader(false);
      }, 2000);
    }
  };

  const handlePreloaderComplete = () => {
    setShowPreloader(false);
  };

  // Format status cards to match Index.tsx structure
  const formattedStatusData = useMemo(() => {
    return statusCards.map((card, index) => ({
      id: card._id || `status-${index}`,
      user: {
        name: creatorData?.displayName || creatorData?.username || 'Creator',
        avatar: creatorData?.avatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&fit=crop',
        verified: creatorData?.isVerified || false
      },
      title: "",
      text: card.text || '',
      timestamp: card.createdAt ? new Date(card.createdAt).toLocaleDateString() : 'Recently',
      likes: 0,
      comments: 0,
      ...(card.hasImage && card.imageUrl ? {
        media: {
          type: "image" as const,
          url: card.imageUrl,
          alt: card.text || 'Status image'
        }
      } : {})
    }));
  }, [statusCards, creatorData]);

  // Format collections to match Index.tsx structure
  const formattedCollections = useMemo(() => {
    return collections.map((col, index) => ({
      id: col._id || index.toString(),
      title: col.title,
      description: col.description || '',
      images: (col.media || []).map((media: any) => ({
        full: media.url,
        thumb: media.thumbnailUrl || media.url
      })),
      user: {
        name: creatorData?.displayName || creatorData?.username || 'Creator',
        avatar: creatorData?.avatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&fit=crop',
        verified: creatorData?.isVerified || false
      },
      timestamp: col.createdAt ? new Date(col.createdAt).toLocaleDateString() : 'Recently',
      likes: 0,
      comments: 0,
      type: 'collection' as const,
      feedType: 'collection' as const,
      price: col.price || 0,
      currency: col.currency || 'USD',
      cardLayout: {
        gridType: (col.media || []).length === 1 ? 'single' : (col.media || []).length <= 3 ? 'triple' : 'quad',
        maxImages: Math.min((col.media || []).length, 4),
        gridClasses: (col.media || []).length === 1 
          ? 'grid grid-cols-1 h-full'
          : (col.media || []).length <= 3
          ? 'grid grid-cols-3 gap-1 h-full'
          : 'grid grid-cols-2 grid-rows-2 gap-1 h-full'
      }
    }));
  }, [collections, creatorData]);

  const shouldUseMockData =
    formattedStatusData.length === 0 &&
    formattedCollections.length === 0;

  // Create mixed feed (status cards + collections)
  // Use mock data only when there is zero real content.
  const feedData = useMemo(() => {
    const mixedFeed = [];
    
    // Determine which data to use
    const statusToUse = shouldUseMockData ? mockStatusCards : formattedStatusData;
    const collectionsToUse = shouldUseMockData ? mockCollections : formattedCollections;
    
    // Add first status card at the beginning
    if (statusToUse.length > 0) {
      mixedFeed.push({
        ...statusToUse[0],
        sortOrder: 0,
        feedType: 'status'
      });
    }

    // Add collections
    collectionsToUse.forEach((collection, index) => {
      mixedFeed.push({
        ...collection,
        sortOrder: (index * 1.5) + 1,
        feedType: 'collection'
      });
    });

    // Add remaining status cards
    statusToUse.slice(1).forEach((status, index) => {
      mixedFeed.push({
        ...status,
        sortOrder: (index * 2.1) + 1.5,
        feedType: 'status'
      });
    });

    return mixedFeed.sort((a, b) => a.sortOrder - b.sortOrder);
  }, [formattedStatusData, formattedCollections, shouldUseMockData, mockStatusCards, mockCollections]);

  const filteredFeedData = useMemo(() => {
    let data = feedData;
    
    // Apply feed type filter
    if (feedFilter === 'collections') {
      data = data.filter(post => post.feedType === 'collection');
    } else if (feedFilter === 'posts') {
      data = data.filter(post => post.feedType === 'status');
    }
    
    // Apply search filter
    if (searchQuery) {
      data = data.filter(post => {
        const query = searchQuery.toLowerCase();
        if (post.feedType === 'collection') {
          return (
            (post.title && post.title.toLowerCase().includes(query)) ||
            (post.description && post.description.toLowerCase().includes(query))
          );
        } else if (post.feedType === 'status') {
          return (
            (post.title && post.title.toLowerCase().includes(query)) ||
            (post.text && post.text.toLowerCase().includes(query))
          );
        }
        return false;
      });
    }
    
    return data;
  }, [feedData, searchQuery, feedFilter]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const createStatusGroups = (posts: any[]) => {
    const groups = [];
    let i = 0;
    
    while (i < posts.length) {
      const post = posts[i];
      
      if (post.feedType === 'status') {
        const nextPost = posts[i + 1];
        const isLastStatus = i === posts.length - 1;
        
        if (isLastStatus && groups.length > 0) {
          const lastGroup = groups[groups.length - 1];
          if (lastGroup.type === 'single' && lastGroup.posts[0].feedType === 'status') {
            lastGroup.type = 'status-pair';
            lastGroup.posts.push(post);
            i += 1;
            continue;
          }
        }
        
        const canPair = nextPost && 
                       nextPost.feedType === 'status' && 
                       i + 1 < posts.length &&
                       Math.random() > 0.4;
        
        if (canPair && !isLastStatus) {
          groups.push({
            type: 'status-pair',
            posts: [post, nextPost],
            index: i
          });
          i += 2;
        } else {
          groups.push({
            type: 'single',
            posts: [post],
            index: i
          });
          i += 1;
        }
      } else {
        groups.push({
            type: 'single',
            posts: [post],
            index: i
        });
        i += 1;
      }
    }
    
    if (groups.length >= 2) {
      const lastGroup = groups[groups.length - 1];
      const secondLastGroup = groups[groups.length - 2];
      
      if (lastGroup.type === 'single' && 
          lastGroup.posts[0].feedType === 'status' &&
          secondLastGroup.type === 'single' && 
          secondLastGroup.posts[0].feedType === 'status') {
        secondLastGroup.type = 'status-pair';
        secondLastGroup.posts.push(lastGroup.posts[0]);
        groups.pop();
      }
    }
    
    return groups;
  };

  const renderPost = (post: any, index: number) => {
    const isMock = isPreviewMode && post.isMockData;
    
    // Wrapper for mock data badge
    const MockBadgeWrapper = ({ children }: { children: React.ReactNode }) => (
      <div className="relative">
        {isMock && (
          <div className="absolute top-3 right-3 z-10 px-2 py-1 bg-amber-500/90 text-white text-[10px] font-bold rounded shadow-lg">
            EXAMPLE
          </div>
        )}
        {children}
      </div>
    );
    
    if (post.feedType === 'collection') {
      return isMock ? (
        <MockBadgeWrapper>
          <PostCard collection={post} />
        </MockBadgeWrapper>
      ) : (
        <PostCard collection={post} />
      );
    } else if (post.feedType === 'status') {
      const statusCard = post.media ? (
        <StatusCardWithMedia
          id={post.id}
          user={post.user}
          title={post.title}
          text={post.text}
          timestamp={post.timestamp}
          likes={post.likes}
          comments={post.comments}
          media={post.media}
        />
      ) : (
        <StatusCard
          id={post.id}
          user={post.user}
          title={post.title}
          text={post.text}
          timestamp={post.timestamp}
          likes={post.likes}
          comments={post.comments}
        />
      );
      
      return isMock ? <MockBadgeWrapper>{statusCard}</MockBadgeWrapper> : statusCard;
    }
    return null;
  };

  const allCollections = useMemo(() => {
    // Use mock collections only when there is no real content at all.
    if (shouldUseMockData) {
      return mockCollections;
    }
    return formattedCollections;
  }, [formattedCollections, shouldUseMockData, mockCollections]);

  const handleCollectionClick = (collectionId: string) => {
    const element = document.getElementById(`collection-${collectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleAvatarImageError = (event: SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    if (img.dataset.fallbackApplied === '1') return;
    img.dataset.fallbackApplied = '1';
    img.src = MOCK_ASSETS.avatar;
  };

  const formatSocialUrl = (value?: string) => {
    if (!value) return '';
    const trimmed = value.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    return `https://${trimmed.replace(/^@/, '')}`;
  };

  const twitterUrl = formatSocialUrl(creatorData?.twitterUrl);
  const instagramUrl = formatSocialUrl(creatorData?.instagramUrl);
  const tiktokUrl = formatSocialUrl(creatorData?.tiktokUrl);
  const twitchUrl = formatSocialUrl(creatorData?.twitchUrl);
  const telegramUrl = creatorData?.telegramUsername ? `https://t.me/${creatorData.telegramUsername}` : '';
  const emailUrl = creatorData?.domainEmail ? `mailto:${creatorData.domainEmail}` : '';
  const pageMode = typeof window !== 'undefined'
    ? new URL(window.location.href).searchParams.get('mode')
    : null;
  const showHelp = isPreviewMode && pageMode !== 'clean';
  const coverOverlay = DEFAULT_COVER_OVERLAY;
  // Template switching is intentionally disabled for now.
  const templateStyleClass = "midnight-glass";
  const useMasonryFlow = false;
  const showSidebar = true;
  const mainOffsetClass = showSidebar && sidebarOpen ? 'lg:ml-[300px]' : 'lg:ml-0';
  const creatorCoverImage =
    typeof creatorData?.coverImage === 'string' ? creatorData.coverImage.trim() : '';
  const previewFallbackCover = isPreviewMode && shouldUseMockData ? MOCK_ASSETS.cover : '';
  const heroCoverImage = creatorCoverImage || previewFallbackCover;

  const renderSocialIcon = (
    url: string,
    label: string,
    icon: JSX.Element,
    sizeClass: string,
    iconClass: string,
    roundedClass: string
  ) => {
    const hasUrl = Boolean(url);
    if (!hasUrl) {
      return null;
    }
    const baseClass = `${sizeClass} ${roundedClass} bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors`;
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        title={label}
        className={baseClass}
      >
        {iconClass ? (
          <span className={iconClass}>{icon}</span>
        ) : (
          icon
        )}
      </a>
    );
  };

  if (isLoading || showPreloader) {
    return <Preloader isVisible={true} onComplete={handlePreloaderComplete} />;
  }

  if (!creatorData) {
    return (
      <div className="min-h-screen feed-bg public-template public-template-midnight-glass flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Creator not found</h1>
          <p className="text-muted-foreground">The profile you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen feed-bg public-template public-template-${templateStyleClass} template-layout template-layout-${templateStyleClass} ${showSidebar && sidebarOpen ? 'template-sidebar-open' : 'template-sidebar-closed'}`}>
      {/* Full Width Navbar - Always on top */}
      <FeedHeader 
        onSearch={handleSearch} 
        onLogoClick={() => setSidebarOpen(!sidebarOpen)} 
        sidebarOpen={sidebarOpen} 
        title={creatorData?.displayName || creatorData?.username || "Creator"}
        rightSlot={<FanAccountMenu onOpenAuth={() => setShowFanAuthModal(true)} />}
      />

      {/* Profile Hero Section */}
      <div className="profile-hero template-hero relative">
        {/* Cover Photo Area with gradient overlay */}
        <div className="template-cover relative h-52 sm:h-64 lg:h-72 overflow-hidden">
          {heroCoverImage ? (
            <img
              src={heroCoverImage}
              alt="Profile cover"
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-violet-600/10 to-cyan-600/15" />
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-violet-600/10 to-cyan-600/15" />
          <div className="absolute inset-0" style={{ backgroundColor: `rgba(2, 6, 23, ${coverOverlay})` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--background))] via-transparent to-transparent" />
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        </div>

        {/* Profile Info */}
        <div className={`template-profile-shell relative max-w-4xl mx-auto px-4 -mt-20 sm:-mt-24 pb-4 transition-all duration-300 ${mainOffsetClass}`}>
          <div className="template-profile-row flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="profile-avatar-ring flex-shrink-0">
              <img
                src={creatorData?.avatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'}
                alt={creatorData?.displayName || 'Creator'}
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover bg-background"
                onError={handleAvatarImageError}
              />
            </div>
            <div className="flex-1 min-w-0 pt-1 sm:pt-4 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="template-display-name text-xl sm:text-2xl font-bold text-foreground truncate">
                  {creatorData?.displayName || creatorData?.username || 'Creator'}
                </h1>
                <svg className="w-5 h-5 text-primary flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              {creatorData?.bio && (
                <p className="template-bio text-sm text-muted-foreground mt-1 line-clamp-2">{creatorData.bio}</p>
              )}
              <div className="template-stats flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3">
                <span className="stat-pill">{allCollections.length} Collections</span>
                <span className="stat-pill">{formattedStatusData.length} Posts</span>
              </div>
            </div>
            {allCollections.length > 0 && (
              <button
                onClick={() => navigate(`/collections?creator=${username}${isPreviewMode ? '&mode=preview' : ''}`)}
                className="template-unlock-cta mt-3 sm:mt-5 mx-auto md:mx-0 md:ml-auto self-center md:self-center px-4 py-2 rounded-xl text-sm sm:text-base font-bold tracking-tight text-cyan-100 border border-cyan-300/30 bg-gradient-to-b from-cyan-500/40 via-sky-500/30 to-indigo-600/35 shadow-[0_7px_18px_rgba(56,189,248,0.28),inset_0_1px_0_rgba(255,255,255,0.35)] hover:translate-y-[-1px] hover:shadow-[0_10px_22px_rgba(56,189,248,0.34),inset_0_1px_0_rgba(255,255,255,0.35)] active:translate-y-0 transition-all"
              >
                Unlock Everything
              </button>
            )}
          </div>

          {/* Content Filter Tabs - Integrated into hero */}
          <div className={`template-filter-shell template-filter-container mt-4 mx-auto sm:mx-0 flex items-center gap-1 p-1 bg-white/[0.03] rounded-xl border border-white/[0.06] w-fit`}>
            {(['all', 'collections', 'posts'] as const).map(filter => (
              <button
                key={filter}
                onClick={() => setFeedFilter(filter)}
                className={`template-filter-tab px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                  feedFilter === filter
                    ? 'template-filter-tab-active bg-white/[0.10] text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.04]'
                }`}
              >
                {filter === 'all' ? 'All' : filter === 'collections' ? 'Collections' : 'Posts'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area with Sidebar */}
      <div className="template-content-wrap flex">
        {/* Desktop Sidebar - Below navbar, hidden on mobile */}
        <aside
          className={`${showSidebar ? 'hidden lg:block' : 'hidden'} fixed left-0 z-20 transition-all duration-300 sidebar-glass template-sidebar ${
            sidebarOpen ? 'translate-x-0 w-[300px]' : '-translate-x-full w-[300px]'
          }`}
          style={{ top: '65px', height: 'calc(100vh - 65px)' }}
        >
          <div className="h-full flex flex-col">
            {/* Header Section with Close Button */}
            <div className="pt-4 px-4 pb-3 border-b border-border flex items-center justify-between">
              <span className="text-xs font-medium text-foreground/80 uppercase tracking-wider">Collections</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="flex items-center justify-center w-7 h-7 rounded-full bg-white/[0.05] hover:bg-white/[0.10] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>

            {showHelp && formattedCollections.length === 0 && (
              <div className="px-4 py-3 border-b border-border">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The sidebar will list the titles of every collection you publish for quick navigation. Below you will also see your total collections and post counts.
                </p>
              </div>
            )}
            
            {isPreviewMode && shouldUseMockData && mockCollections.length > 0 && (
              <div className="px-4 py-3 border-b border-border bg-amber-500/5">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="inline-flex items-center px-1.5 py-0.5 bg-amber-500/20 text-amber-600 text-[10px] font-medium rounded mr-1">EXAMPLE</span>
                  These are sample collections. Create your own from the Dashboard.
                </p>
              </div>
            )}

            {/* Collections List */}
            <div className="flex-1 py-3 px-3 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="space-y-1">
                {allCollections.map((collection, index) => {
                  const getIcon = (idx: number) => {
                    const IconComponent = [
                      Sun, Moon, Heart, Gem, Flower2, Flame, Sparkles, Zap,
                      Star, Droplet, CloudRain, Music, Palette, Briefcase,
                      BookOpen, Crown, Target
                    ][idx] || Coffee;
                    return <IconComponent className="w-4 h-4" />;
                  };
                  
                  return (
                    <button
                      key={collection.id}
                      onClick={() => handleCollectionClick(collection.id)}
                      className="w-full text-left collection-item flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-muted-foreground flex-shrink-0">
                          {getIcon(index)}
                        </span>
                        <span className="text-sm text-foreground truncate">
                          {collection.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground flex-shrink-0">
                        {(collection as any).images?.length || 0}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="px-3 py-3 sidebar-stats">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center py-2 rounded-lg bg-white/[0.02]">
                  <div className="text-base font-bold text-foreground">{allCollections.length}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Collections</div>
                </div>
                <div className="text-center py-2 rounded-lg bg-white/[0.02]">
                  <div className="text-base font-bold text-foreground">{formattedStatusData.length}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Posts</div>
                </div>
              </div>
              {showHelp && allCollections.length === 0 && formattedStatusData.length === 0 && (
                <p className="text-[10px] text-muted-foreground text-center mt-2">
                  Totals update automatically as you publish content.
                </p>
              )}
            </div>

            {/* Social Links */}
            <div className="px-3 py-2 border-t border-border flex-shrink-0">
              <p className="text-[10px] text-muted-foreground mb-1.5 text-center">Follow {creatorData.displayName || creatorData.username}</p>
              <div className="flex items-center justify-center gap-2">
                {renderSocialIcon(
                  twitterUrl,
                  "Twitter",
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.040 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>,
                  "w-7 h-7",
                  "",
                  "rounded-md"
                )}
                {renderSocialIcon(
                  instagramUrl,
                  "Instagram",
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.40s-.644-1.44-1.439-1.40z"/>
                  </svg>,
                  "w-7 h-7",
                  "",
                  "rounded-md"
                )}
                {renderSocialIcon(
                  tiktokUrl,
                  "TikTok",
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.8v13.1a2.48 2.48 0 0 1-2.47 2.48 2.48 2.48 0 0 1-2.48-2.48 2.48 2.48 0 0 1 2.48-2.48c.24 0 .47.03.69.08V8.72a6.06 6.06 0 0 0-.69-.04A6.42 6.42 0 0 0 3.13 15.1a6.42 6.42 0 0 0 6.42 6.42 6.42 6.42 0 0 0 6.42-6.42V9.78a8.7 8.7 0 0 0 3.62.78z"/>
                  </svg>,
                  "w-7 h-7",
                  "",
                  "rounded-md"
                )}
                {renderSocialIcon(
                  twitchUrl,
                  "Twitch",
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 3h16v10h-5l-3 3h-2v-3H4V3zm2 2v6h4v3.5L13 11h5V5H6zm11.5 9.5h2.5V21h-6v-3h4v-3.5z"/>
                  </svg>,
                  "w-7 h-7",
                  "",
                  "rounded-md"
                )}
                {renderSocialIcon(
                  telegramUrl,
                  "Telegram",
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.174 1.858-.924 6.667-1.304 8.842-.168.968-.5 1.29-1.02 1.323-.87.052-1.53-.574-2.373-1.125-1.055-.69-1.653-1.07-2.68-1.714-1.188-.78-.418-1.21.258-1.912.178-.18 3.247-2.977 3.307-3.23.008-.03.015-.14-.053-.198-.068-.057-.17-.037-.244-.022-.105.02-1.79 1.14-5.06 3.345-.48.336-.914.5-1.302.492-.428-.008-1.252-.242-1.865-.44-.752-.243-1.35-.375-1.297-.79.027-.21.405-.416 1.11-.64 4.28-1.86 7.13-3.09 8.55-3.69 4.01-1.68 4.83-1.98 5.37-2.01.114-.005.37-.027.536.16.13.147.168.345.185.48z"/>
                  </svg>,
                  "w-7 h-7",
                  "",
                  "rounded-md"
                )}
                {renderSocialIcon(
                  emailUrl,
                  "Email",
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
                  </svg>,
                  "w-7 h-7",
                  "",
                  "rounded-md"
                )}
              </div>
              {showHelp && !creatorData.telegramUsername && !creatorData.domainEmail && !twitterUrl && !instagramUrl && !tiktokUrl && !twitchUrl && (
                <p className="text-[10px] text-muted-foreground text-center mt-2">
                  Add social links in Profile Settings to show them here and on your public page.
                </p>
              )}

            </div>
          </div>
        </aside>

        {/* Arrow to open sidebar */}
        {!sidebarOpen && showSidebar && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="hidden lg:flex fixed left-4 top-1/2 transform -translate-y-1/2 z-30 bg-background border border-border rounded-full w-10 h-10 items-center justify-center"
            style={{ top: '50%' }}
          >
            <ChevronRight className="w-4 h-4 text-foreground" />
          </button>
        )}

        {/* Main Content */}
        <div className={`template-main-column flex-1 transition-all duration-300 ${mainOffsetClass}`} style={{ marginTop: '0px' }}>
          <main className="template-main-shell max-w-4xl mx-auto px-4 py-6">
            <div className="template-main-stack space-y-6">
              {searchQuery && (
                <div className="post-card rounded-xl p-4 animate-fade-in">
                  <p className="text-muted-foreground">
                    Showing results for: <span className="font-medium text-foreground">"{searchQuery}"</span>
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="ml-4 text-sm text-primary"
                    >
                      Clear search
                    </button>
                  </p>
                </div>
              )}

              <TopLoader />

              {/* Mock Data Explanation Banner - Only in preview mode with mock data */}
              {isPreviewMode && shouldUseMockData && filteredFeedData.length > 0 && (
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-4 mb-4 animate-fade-in">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Info className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm mb-1">Preview Mode - Example Content</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        This is how your page will look with content. Items marked <span className="inline-flex items-center px-1.5 py-0.5 bg-amber-500/20 text-amber-600 text-[10px] font-medium rounded">EXAMPLE</span> are templates. 
                        Add your own content from the Dashboard to replace them.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className={`template-feed-stack ${
                useMasonryFlow
                  ? 'template-feed-stack-masonry'
                  : 'space-y-6'
              }`}>
                {showHelp && !searchQuery && filteredFeedData.length === 0 && (
                  <div className="post-card rounded-xl p-6 sm:p-8 text-center animate-fade-in">
                    <h3 className="text-xl font-bold text-foreground mb-2">Your content will appear here</h3>
                    <p className="text-muted-foreground">
                      This main feed is where your statuses, posts, and collections will show once you publish them.
                    </p>
                  </div>
                )}
                {(useMasonryFlow
                  ? filteredFeedData.map((post, index) => ({ type: 'single', posts: [post], index }))
                  : createStatusGroups(filteredFeedData)
                ).map((group, groupIndex) => {
                  if (group.type === 'status-pair') {
                    return (
                      <div 
                        key={`group-${groupIndex}`}
                        className="template-feed-item template-feed-pair-grid grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in"
                        style={{ animationDelay: `${groupIndex * 0.1}s` }}
                      >
                        {group.posts.map((post, postIndex) => (
                          <div key={`${post.id}-${group.index + postIndex}`} className="template-feed-item">
                            {renderPost(post, group.index + postIndex)}
                          </div>
                        ))}
                      </div>
                    );
                  } else {
                    const post = group.posts[0];
                    return (
                      <div 
                        key={`${post.id}-${group.index}`}
                        id={post.feedType === 'collection' ? `collection-${post.id}` : undefined}
                        className="template-feed-item animate-fade-in"
                        style={{ animationDelay: `${groupIndex * 0.1}s` }}
                      >
                        {renderPost(post, group.index)}
                      </div>
                    );
                  }
                })}
              </div>

              {searchQuery && filteredFeedData.length === 0 && (
                <div className="post-card rounded-xl p-8 text-center animate-fade-in">
                  <h3 className="text-xl font-bold text-foreground mb-2">No results found</h3>
                  <p className="text-muted-foreground">
                    Try searching for something else or clear your search to see all posts.
                  </p>
                </div>
              )}
            </div>

            <footer className="mt-12 border-t border-white/[0.06] pt-6 pb-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="brand-wordmark text-sm"><span className="brand-accent">Six</span><span className="text-white">Seven</span><span className="brand-accent">Creator</span></div>
                <p className="text-xs text-muted-foreground">
                  &copy; {new Date().getFullYear()} {creatorData.displayName || creatorData.username}. All rights reserved.
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-foreground transition-colors bg-transparent border-none cursor-pointer">Gallery</button>
                  <button onClick={() => window.location.href = `/collections?creator=${username}${isPreviewMode ? '&mode=preview' : ''}`} className="hover:text-foreground transition-colors bg-transparent border-none cursor-pointer">Collections</button>
                </div>
              </div>
            </footer>
          </main>
        </div>
      </div>

      <FanAuthModal
        open={showFanAuthModal}
        onClose={() => setShowFanAuthModal(false)}
      />
    </div>
  );
};

export default CreatorProfile;
