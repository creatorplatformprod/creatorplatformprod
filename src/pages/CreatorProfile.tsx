import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Heart, ChevronRight, ChevronLeft, Sun, Moon, Sparkles, Image, Camera, Flame, Flower2, Zap, Star, Droplet, CloudRain, Music, Palette, Briefcase, BookOpen, Gem, Crown, Target, Coffee, Feather, LogOut, LayoutDashboard } from "lucide-react";
import FeedHeader from "@/components/FeedHeader";
import PostCard from "@/components/PostCard";
import StatusCard from "@/components/StatusCard";
import StatusCardWithMedia from "@/components/StatusCardWithMedia";
import Preloader from "@/components/Preloader";
import TopLoader from "@/components/TopLoader";
import { api } from "@/lib/api";

const CreatorProfile = () => {
  const { username } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showPreloader, setShowPreloader] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [creatorData, setCreatorData] = useState<any>(null);
  const [collections, setCollections] = useState<any[]>([]);
  const [statusCards, setStatusCards] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    loadCreatorProfile();
  }, [username]);

  useEffect(() => {
    const loadCurrentUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setCurrentUser(null);
        return;
      }
      try {
        const result = await api.getCurrentUser();
        if (result?.success && result.user) {
          setCurrentUser(result.user);
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        setCurrentUser(null);
      }
    };

    loadCurrentUser();
  }, []);

  const loadCreatorProfile = async () => {
    try {
      setIsLoading(true);
      const data = await api.getCreatorProfile(username || '');
      
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
        avatar: creatorData?.avatar || '/images485573257456374938/1img.jpg',
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
        avatar: creatorData?.avatar || '/images485573257456374938/1img.jpg',
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

  // Create mixed feed (status cards + collections)
  const feedData = useMemo(() => {
    const mixedFeed = [];
    
    // Add first status card at the beginning
    if (formattedStatusData.length > 0) {
      mixedFeed.push({
        ...formattedStatusData[0],
        sortOrder: 0,
        feedType: 'status'
      });
    }

    // Add collections
    formattedCollections.forEach((collection, index) => {
      mixedFeed.push({
        ...collection,
        sortOrder: (index * 1.5) + 1,
        feedType: 'collection'
      });
    });

    // Add remaining status cards
    formattedStatusData.slice(1).forEach((status, index) => {
      mixedFeed.push({
        ...status,
        sortOrder: (index * 2.1) + 1.5,
        feedType: 'status'
      });
    });

    return mixedFeed.sort((a, b) => a.sortOrder - b.sortOrder);
  }, [formattedStatusData, formattedCollections]);

  const filteredFeedData = useMemo(() => {
    if (!searchQuery) return feedData;
    
    return feedData.filter(post => {
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
  }, [feedData, searchQuery]);

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
    if (post.feedType === 'collection') {
      return <PostCard collection={post} />;
    } else if (post.feedType === 'status') {
      return post.media ? (
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
    }
    return null;
  };

  const allCollections = useMemo(() => {
    return formattedCollections;
  }, [formattedCollections]);

  const isOwnerProfile = useMemo(() => {
    if (!currentUser?.username || !username) return false;
    return currentUser.username === username;
  }, [currentUser, username]);

  const handleCollectionClick = (collectionId: string) => {
    const element = document.getElementById(`collection-${collectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  if (isLoading || showPreloader) {
    return <Preloader isVisible={true} onComplete={handlePreloaderComplete} />;
  }

  if (!creatorData) {
    return (
      <div className="min-h-screen feed-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Creator not found</h1>
          <p className="text-muted-foreground">The profile you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen feed-bg">
      {/* Full Width Navbar - Always on top */}
      <FeedHeader 
        onSearch={handleSearch} 
        onLogoClick={() => setSidebarOpen(!sidebarOpen)} 
        sidebarOpen={sidebarOpen} 
        title={creatorData?.displayName || creatorData?.username || "Creator"}
        subtitle="Exclusive Content"
      />

      {/* Content Area with Sidebar */}
      <div className="flex">
        {/* Desktop Sidebar - Below navbar, hidden on mobile */}
        <aside
          className={`hidden lg:block fixed left-0 bg-background border-r border-border z-20 transition-all duration-300 ${
            sidebarOpen ? 'translate-x-0 w-[380px]' : '-translate-x-full w-[380px]'
          }`}
          style={{ top: '65px', height: 'calc(100vh - 65px)' }}
        >
          <div className="h-full flex flex-col">
            {/* Header Section with Close Button */}
            <div className="pt-6 px-4 pb-3 border-b border-border flex items-center justify-between">
              <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                Choose a collection from the list below
              </p>
              <button
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-1.5 text-xs text-primary whitespace-nowrap flex-shrink-0 bg-background border border-border rounded-full px-3 py-2 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Close
              </button>
            </div>

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
                      className="w-full text-left px-3 py-2.5 rounded-md flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-muted-foreground flex-shrink-0">
                          {getIcon(index)}
                        </span>
                        <span className="text-sm text-foreground truncate">
                          {collection.title}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="px-3 py-2 border-t border-border">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center">
                  <div className="text-sm font-bold text-foreground">{allCollections.length}</div>
                  <div className="text-[10px] text-muted-foreground">Collections</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-foreground">{formattedStatusData.length}</div>
                  <div className="text-[10px] text-muted-foreground">Posts</div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="px-3 py-2 border-t border-border flex-shrink-0">
              <p className="text-[10px] text-muted-foreground mb-1.5 text-center">Follow {creatorData.displayName || creatorData.username}</p>
              <div className="flex items-center justify-center gap-2">
                {creatorData.telegramUsername && (
                  <a
                    href={`https://t.me/${creatorData.telegramUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.174 1.858-.924 6.667-1.304 8.842-.168.968-.5 1.29-1.02 1.323-.87.052-1.53-.574-2.373-1.125-1.055-.69-1.653-1.07-2.68-1.714-1.188-.78-.418-1.21.258-1.912.178-.18 3.247-2.977 3.307-3.23.008-.03.015-.14-.053-.198-.068-.057-.17-.037-.244-.022-.105.02-1.79 1.14-5.06 3.345-.48.336-.914.5-1.302.492-.428-.008-1.252-.242-1.865-.44-.752-.243-1.35-.375-1.297-.79.027-.21.405-.416 1.11-.64 4.28-1.86 7.13-3.09 8.55-3.69 4.01-1.68 4.83-1.98 5.37-2.01.114-.005.37-.027.536.16.13.147.168.345.185.48z"/>
                    </svg>
                  </a>
                )}
                {creatorData.domainEmail && (
                  <a
                    href={`mailto:${creatorData.domainEmail}`}
                    className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
                    </svg>
                  </a>
                )}
              </div>

              {isOwnerProfile && (
                <div className="mt-3 grid grid-cols-1 gap-2">
                  <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="w-full text-xs px-3 py-2 rounded-md bg-secondary text-foreground flex items-center justify-center gap-2 hover:bg-secondary/80 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem('token');
                      window.location.href = '/';
                    }}
                    className="w-full text-xs px-3 py-2 rounded-md bg-destructive/10 text-destructive flex items-center justify-center gap-2 hover:bg-destructive/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Arrow to open sidebar */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="hidden lg:flex fixed left-4 top-1/2 transform -translate-y-1/2 z-30 bg-background border border-border rounded-full w-10 h-10 items-center justify-center"
            style={{ top: '50%' }}
          >
            <ChevronRight className="w-4 h-4 text-foreground" />
          </button>
        )}

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-[380px]' : 'lg:ml-0'}`} style={{ marginTop: '0px' }}>
          <main className="max-w-4xl mx-auto px-4 py-6">
            <div className="space-y-6">
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
              <div className="space-y-6">
                {createStatusGroups(filteredFeedData).map((group, groupIndex) => {
                  if (group.type === 'status-pair') {
                    return (
                      <div 
                        key={`group-${groupIndex}`}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in"
                        style={{ animationDelay: `${groupIndex * 0.1}s` }}
                      >
                        {group.posts.map((post, postIndex) => (
                          <div key={`${post.id}-${group.index + postIndex}`}>
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
                        className="animate-fade-in"
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

            <footer className="post-card rounded-xl p-6 mt-12">
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
                        {creatorData.displayName || creatorData.username}
                      </h2>
                      <p className="text-sm text-muted-foreground">{allCollections.length} Exclusive Collections</p>
                    </div>
                  </div>
                  {creatorData.bio && (
                    <p className="text-muted-foreground text-sm">
                      {creatorData.bio}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-8 md:contents">
                  <div>
                    <h3 className="font-semibold text-foreground mb-4">Explore</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <button 
                          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
                          className="text-muted-foreground text-left bg-transparent border-none"
                        >
                          Gallery
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => window.location.href = `/${username}/collections`} 
                          className="text-muted-foreground text-left bg-transparent border-none"
                        >
                          Collections
                        </button>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-4">Connect</h3>
                    <div className="flex gap-3 mb-4">
                      {creatorData.telegramUsername && (
                        <a href={`https://t.me/${creatorData.telegramUsername}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.174 1.858-.924 6.667-1.304 8.842-.168.968-.5 1.29-1.02 1.323-.87.052-1.53-.574-2.373-1.125-1.055-.69-1.653-1.07-2.68-1.714-1.188-.78-.418-1.21.258-1.912.178-.18 3.247-2.977 3.307-3.23.008-.03.015-.14-.053-.198-.068-.057-.17-.037-.244-.022-.105.02-1.79 1.14-5.06 3.345-.48.336-.914.5-1.302.492-.428-.008-1.252-.242-1.865-.44-.752-.243-1.35-.375-1.297-.79.027-.21.405-.416 1.11-.64 4.28-1.86 7.13-3.09 8.55-3.69 4.01-1.68 4.83-1.98 5.37-2.01.114-.005.37-.027.536.16.13.147.168.345.185.48z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                    {creatorData.domainEmail && (
                      <p className="text-sm text-muted-foreground">{creatorData.domainEmail}</p>
                    )}
                  </div>
                </div>
              </div>

              {allCollections.length > 0 && (
                <div className="border-t border-border mt-8 pt-6">
                  <button 
                    className="flex items-center justify-center gap-2 cursor-pointer group mb-4 w-full bg-transparent border-none"
                    onClick={() => window.location.href = `/${username}/collections/all`}
                  >
                    <Heart className="w-4 h-4 fill-current text-primary" />
                    <span className="font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      Unlock All Collections
                    </span>
                  </button>
                  <p className="text-center text-xs text-muted-foreground mb-6">
                    Get unlimited access to all exclusive content, HD downloads, and early access to new collections
                  </p>
                </div>
              )}

              <div className="border-t border-border pt-6 text-center">
                <p className="text-xs text-muted-foreground">
                  © {new Date().getFullYear()} {creatorData.displayName || creatorData.username}. All rights reserved.
                </p>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CreatorProfile;
