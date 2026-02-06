import { useEffect, useMemo, useRef, useState } from "react";
import { Flame, ChevronRight, ChevronLeft, Sun, Moon, Sparkles, Image, Camera, Heart, Flower2, Zap, Star, Droplet, CloudRain, Music, Palette, Briefcase, BookOpen, Gem, Crown, Target, Coffee, Feather, Eye } from "lucide-react";
import FeedHeader from "@/components/FeedHeader";
import PostCard from "@/components/PostCard";
import StatusCard from "@/components/StatusCard";
import StatusCardWithMedia from "../components/StatusCardWithMedia";
import Preloader from "@/components/Preloader";
import TopLoader from "@/components/TopLoader";
import { collections, getAllCollectionIds, getCollection } from "@/collections/collectionsData";
import { fetchEngagement, registerEngagementShare, registerEngagementView, setEngagementLike } from "@/lib/engagement";

// Pexels URL helper for consistent sizing
const pexelsUrl = (photoId: number, width: number = 400): string =>
  `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg?auto=compress&cs=tinysrgb&w=${width}&fit=crop`;

// Creator avatar using Pexels portrait
const portrait1 = pexelsUrl(1239291, 400); // Professional woman portrait

// Status media images from Pexels
const statusMediaImages = {
  behindScenes: pexelsUrl(3622614, 800),    // Lifestyle photo
  goldenHour: pexelsUrl(2681751, 800),       // Golden hour moment
  redFashion: pexelsUrl(1536619, 800),       // Fashion/red theme
  artisticPose: pexelsUrl(2709388, 800),     // Artistic portrait
  creativeMoment: pexelsUrl(2896840, 800),   // Purple/creative lighting
  creativeSession: pexelsUrl(3807517, 800),  // Creative session
};

const TextPostCard = ({ post, engagementId }: { post: any; engagementId: string }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(0);
  const [currentShares, setCurrentShares] = useState(0);
  const [currentViews, setCurrentViews] = useState(0);
  const [pending, setPending] = useState(false);
  const viewRef = useRef<HTMLDivElement | null>(null);
  const viewTrackedRef = useRef(false);

  useEffect(() => {
    let active = true;
    fetchEngagement('text', engagementId).then((state) => {
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
        registerEngagementView('text', engagementId)
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

  const formatCount = (count: number) => {
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
    setEngagementLike('text', engagementId, nextLiked)
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
      title: post.title,
      text: post.description,
      url: window.location.origin
    }).then(() => {
      registerEngagementShare('text', engagementId)
        .then((state) => {
          setIsLiked(state.viewerLiked);
          setCurrentLikes(state.likes);
          setCurrentShares(state.shares);
          setCurrentViews(state.views);
        })
        .catch(() => {});
    }).catch(() => {
      navigator.clipboard.writeText(window.location.origin)
        .then(() => {
          registerEngagementShare('text', engagementId)
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
    <article ref={viewRef} className="post-card rounded-xl overflow-hidden">
      <div className="p-5 sm:p-8">
        <h2 className="text-base sm:text-lg font-bold text-foreground mb-3">{post.title}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{post.description}</p>
        <div className="text-muted-foreground text-xs mt-4 opacity-75">
          {post.timestamp}
        </div>
      </div>
      <div className="p-4 border-t border-border bg-post-bg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className="flex items-center gap-2 text-muted-foreground hover:text-like active:bg-transparent transition-colors px-3 py-1 hover:bg-secondary rounded-lg"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-muted-foreground'}`} />
              <span className={isLiked ? 'text-rose-500' : 'text-muted-foreground'}>{formatCount(currentLikes)}</span>
            </button>
            <div className="flex items-center gap-2 px-3 py-1 text-muted-foreground">
              <Eye className="w-4 h-4" />
              <span>{formatCount(currentViews)}</span>
            </div>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors px-3 py-1 rounded-lg hover:bg-secondary"
          >
            <span>Share</span>
            <span className="text-xs text-muted-foreground">{formatCount(currentShares)}</span>
          </button>
        </div>
      </div>
    </article>
  );
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showPreloader, setShowPreloader] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handlePreloaderComplete = () => {
    setShowPreloader(false);
  };

  const statusData = [
    {
      id: "status-24820024",
      user: {
        name: "Creator",
        avatar: portrait1,
        verified: true
      },
      title: "",
      text: "Today felt special from the moment I woke up. Favorite outfit, iced coffee, and going with the flow. Sometimes unplanned days are the best ones.",
      timestamp: "4 hours ago",
      likes: 12500,
      comments: 3470,
      media: {
        type: "image" as const,
        url: statusMediaImages.behindScenes,
        alt: "Behind the scenes moment"
      }
    },
    {
      id: "status-19475368",
      user: {
        name: "Creator",
        avatar: portrait1,
        verified: true
      },
      title: "A Little Life Update",
      text: "Exciting projects brewing behind the scenes. The creative process is messy, unpredictable, and totally thrilling. Stay tuned for big things!",
      timestamp: "5 hours ago",
      likes: 8900,
      comments: 1560
    },
    {
      id: "status-73926481",
      user: {
        name: "Creator",
        avatar: portrait1,
        verified: true
      },
      title: "Morning Rituals",
      text: "My morning routine is sacred — skincare, playlist on shuffle, and 20 minutes of just existing before the world demands my attention. It's not about productivity, it's about starting the day on my own terms.",
      timestamp: "3 days ago",
      likes: 6700,
      comments: 890
    },
    {
      id: "status-58391627",
      user: {
        name: "Creator",
        avatar: portrait1,
        verified: true
      },
      title: "",
      text: "That golden light hit different today. Dropped everything to capture this moment because some things just can't wait. Nature's timing is always perfect.",
      timestamp: "1 hour ago",
      likes: 9200,
      comments: 1234,
      media: {
        type: "image" as const,
        url: statusMediaImages.goldenHour,
        alt: "Golden hour moment"
      }
    },
    {
      id: "status-92847315",
      user: {
        name: "Creator",
        avatar: portrait1,
        verified: true
      },
      title: "Real Talk",
      text: "I spent years trying to fit into boxes that weren't made for me. Now I'm building my own. It's scary, it's liberating, and it's the most authentic thing I've ever done. Here's to everyone else doing the same.",
      timestamp: "12 days ago",
      likes: 15600,
      comments: 2890
    },
    {
      id: "status-46172953",
      user: {
        name: "Creator",
        avatar: portrait1,
        verified: true
      },
      title: "Feeling Bold",
      text: "Some days you play it safe, and other days you go all out. Red lips, red nails, no regrets. This color just makes me feel powerful. What's your go-to color?",
      timestamp: "22 days ago",
      likes: 20300,
      comments: 4567,
      media: {
        type: "image" as const,
        url: statusMediaImages.redFashion,
        alt: "Red fashion moment"
      }
    },
    {
      id: "status-83659742",
      user: {
        name: "Creator",
        avatar: portrait1,
        verified: true
      },
      title: "",
      text: "Plot twist: your messy, unfiltered self is just as worthy of love as the polished version. Maybe even more so. Embracing it all today.",
      timestamp: "39 days ago",
      likes: 7800,
      comments: 1120
    },
    {
      id: "status-37284561",
      user: {
        name: "Creator",
        avatar: portrait1,
        verified: true
      },
      title: "Grateful Heart",
      text: "Grateful for everyone supporting this journey. Every like, comment, and DM means the world. This community is everything.",
      timestamp: "46 days ago",
      likes: 9400,
      comments: 1890
    },
    {
      id: "status-65918473",
      user: {
        name: "Creator",
        avatar: portrait1,
        verified: true
      },
      title: "",
      text: "Tried something totally new for this shoot and honestly, it scared me a little. But that's usually when you know you're growing. Getting out of your comfort zone is where the good stuff happens.",
      timestamp: "50 days ago",
      likes: 11200,
      comments: 2340,
      media: {
        type: "image" as const,
        url: statusMediaImages.artisticPose,
        alt: "Artistic pose"
      }
    },
    {
      id: "status-19426837",
      user: {
        name: "Creator",
        avatar: portrait1,
        verified: true
      },
      title: "",
      text: "Three things I won't apologize for: taking up space, having high standards, and loving myself out loud. Life's too short to play small.",
      timestamp: "75 days ago",
      likes: 15600,
      comments: 4200
    },
    {
      id: "status-74853296",
      user: {
        name: "Creator",
        avatar: portrait1,
        verified: true
      },
      title: "Weekend Mood",
      text: "Saturday plans: nothing scheduled but everything's possible. Sometimes the best thing you can do is just give yourself permission to relax. No pressure, just being.",
      timestamp: "54 days ago",
      likes: 6700,
      comments: 890
    },
    {
      id: "status-52174639",
      user: {
        name: "Creator",
        avatar: portrait1,
        verified: true
      },
      title: "",
      text: "Quick peek from yesterday's shoot. We tried some new lighting and I love how it came out. Full collection coming this week - you won't believe it!",
      timestamp: "58 days ago",
      likes: 14500,
      comments: 3200,
      media: {
        type: "image" as const,
        url: statusMediaImages.creativeMoment,
        alt: "Creative moment"
      }
    },
    {
      id: "status-41739582",
      user: {
        name: "Creator",
        avatar: portrait1,
        verified: true
      },
      title: "",
      text: "Rest isn't earned by working hard — it's deserved. Self-care isn't lazy, it's essential. Let's normalize chilling sometimes.",
      timestamp: "62 days ago",
      likes: 12800,
      comments: 2890
    },
    {
      id: "status-87162493",
      user: {
        name: "Creator",
        avatar: portrait1,
        verified: true
      },
      title: "",
      text: "Currently manifesting: good energy, creative breakthroughs, and flights to places I've never been. What are you manifesting today?",
      timestamp: "63 days ago",
      likes: 23400,
      comments: 5670
    },
    {
      id: "status-23685917",
      user: {
        name: "Creator",
        avatar: portrait1,
        verified: true
      },
      title: "",
      text: "Behind every great photo is about 47 outtakes, three outfit changes, and probably a coffee spill. The glamour is real, folks. Worth it though.",
      timestamp: "67 days ago",
      likes: 7600,
      comments: 1234,
      media: {
        type: "image" as const,
        url: statusMediaImages.creativeSession,
        alt: "Creative Session"
      }
    }
  ];
  const collectionIds = getAllCollectionIds();
  
  const feedData = useMemo(() => {
    const mixedFeed = [];
    
    const workoutStatus = statusData.find(status => status.id === 'status-58391627');
    if (workoutStatus) {
      mixedFeed.push({
        ...workoutStatus,
        sortOrder: 0,
        feedType: 'status'
      });
    }

    collectionIds.forEach((collectionId, index) => {
      const collection = getCollection(collectionId);
      if (collection && !collectionId.startsWith('status-')) {
        mixedFeed.push({
          ...collection,
          sortOrder: (index * 1.5) + 1,
          feedType: 'collection'
        });
      }
    });

    statusData.forEach((status, index) => {
      if (status.id !== 'status-58391627') {
        mixedFeed.push({
          ...status,
          sortOrder: (index * 2.1) + 1.5,
          feedType: 'status'
        });
      }
    });

    return mixedFeed.sort((a, b) => a.sortOrder - b.sortOrder);
  }, [collectionIds]);

  const filteredFeedData = useMemo(() => {
    if (!searchQuery) return feedData;
    
    return feedData.filter(post => {
      const query = searchQuery.toLowerCase();
      
      if (post.feedType === 'text-only') {
        return (
          (post.title && post.title.toLowerCase().includes(query)) ||
          (post.description && post.description.toLowerCase().includes(query))
        );
      } else if (post.feedType === 'collection') {
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

  const createStatusGroups = (posts) => {
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

  const renderPost = (post, index) => {
    if (post.feedType === 'text-only') {
      return (
        <TextPostCard
          post={post}
          engagementId={`text:${post.id || post.title || index}`}
        />
      );
    } else if (post.feedType === 'collection') {
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
    return collectionIds
      .map(id => ({ id, collection: getCollection(id) }))
      .filter(item => item.collection && !item.id.startsWith('status-'))
      .map(item => item.collection);
  }, [collectionIds]);

  const showEmptySidebarHint = allCollections.length === 0;

  const handleCollectionClick = (collectionId: string) => {
    const element = document.getElementById(`collection-${collectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen feed-bg">
      {isLoading ? (
        <Preloader isVisible={true} onComplete={() => {}} />
      ) : (
        <>
          <FeedHeader onSearch={handleSearch} onLogoClick={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />

          {/* Profile Hero Section */}
          <div className="profile-hero">
            <div className="relative h-32 sm:h-40 lg:h-44" />
            <div className={`relative max-w-4xl mx-auto px-4 -mt-12 sm:-mt-14 pb-6 transition-all duration-300 ${sidebarOpen ? 'lg:ml-[380px]' : 'lg:ml-0'}`}>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="profile-avatar-ring flex-shrink-0">
                  <img
                    src={portrait1}
                    alt="SixSeven Creator"
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover bg-background"
                  />
                </div>
                <div className="flex-1 min-w-0 pt-1 sm:pt-3">
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground">SixSeven Creator</h1>
                  <p className="text-sm text-muted-foreground mt-1">Exclusive content & premium collections</p>
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span className="stat-pill">{allCollections.length} Collections</span>
                    <span className="stat-pill">450+ Photos</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <a href="https://twitter.com/sixsevencreator" target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-md bg-secondary flex items-center justify-center">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.040 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                    </a>
                    <a href="https://instagram.com/sixsevencreator" target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-md bg-secondary flex items-center justify-center">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => window.location.href = '/collections'}
                  className="hidden sm:flex items-center gap-2 mt-4 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 transition-all shadow-lg shadow-indigo-500/20"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="5" y="11" width="14" height="10" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <path d="M9 11V7C9 4.79086 10.7909 3 13 3C15.2091 3 17 4.79086 17 7V11" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                  Unlock Everything
                </button>
              </div>
            </div>
          </div>

          <div className="flex">
            <aside
              className={`hidden lg:block fixed left-0 z-20 transition-all duration-300 backdrop-blur-xl bg-[rgba(8,11,20,0.85)] border-r border-white/[0.06] ${
                sidebarOpen ? 'translate-x-0 w-[380px]' : '-translate-x-full w-[380px]'
              }`}
              style={{ top: '65px', height: 'calc(100vh - 65px)' }}
            >
              <div className="h-full flex flex-col">
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

                {showEmptySidebarHint && (
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      The sidebar lists your collections for quick navigation. It will populate as soon as you create collections.
                    </p>
                  </div>
                )}

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
                            {collection.images?.length || 0}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="px-3 py-2 border-t border-border">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center">
                      <div className="text-sm font-bold text-foreground">{allCollections.length}</div>
                      <div className="text-[10px] text-muted-foreground">Collections</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-foreground">450+</div>
                      <div className="text-[10px] text-muted-foreground">Photos</div>
                    </div>
                  </div>
                </div>

                <div className="px-3 py-2 border-t border-border flex-shrink-0">
                  <p className="text-[10px] text-muted-foreground mb-1.5 text-center">Follow us</p>
                  <div className="flex items-center justify-center gap-2">
                    <a
                      href="https://twitter.com/sixsevencreator"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.040 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    </a>
                    <a
                      href="https://instagram.com/sixsevencreator"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.40s-.644-1.44-1.439-1.40z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </aside>

            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="hidden lg:flex fixed left-4 top-1/2 transform -translate-y-1/2 z-30 bg-background border border-border rounded-full w-10 h-10 items-center justify-center"
                style={{ top: '50%' }}
              >
                <ChevronRight className="w-4 h-4 text-foreground" />
              </button>
            )}

            <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-[380px]' : 'lg:ml-0'}`} style={{ marginTop: '0px' }}>
              <main className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
                <div className="space-y-4 sm:space-y-6">
                  {searchQuery && (
                    <div className="post-card rounded-xl p-3 sm:p-4 animate-fade-in">
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
                  <div className="space-y-4 sm:space-y-6">
                    {!searchQuery && filteredFeedData.length === 0 && (
                      <div className="post-card rounded-xl p-6 sm:p-8 text-center animate-fade-in">
                        <h3 className="text-xl font-bold text-foreground mb-2">Your feed will appear here</h3>
                        <p className="text-muted-foreground">
                          This main view fills with your status updates, posts, and collections once you publish content.
                        </p>
                      </div>
                    )}
                    {createStatusGroups(filteredFeedData).map((group, groupIndex) => {
                      if (group.type === 'status-pair') {
                        return (
                          <div 
                            key={`group-${groupIndex}`}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 animate-fade-in"
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
                    <div className="post-card rounded-xl p-6 sm:p-8 text-center animate-fade-in">
                      <h3 className="text-xl font-bold text-foreground mb-2">No results found</h3>
                      <p className="text-muted-foreground">
                        Try searching for something else or clear your search to see all posts.
                      </p>
                    </div>
                  )}
                </div>

                <footer className="mt-8 sm:mt-12 border-t border-white/[0.06] pt-6 pb-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="brand-wordmark text-sm"><span className="brand-accent">Six</span><span className="text-white">Seven</span><span className="brand-accent">Creator</span></div>
                    <p className="text-xs text-muted-foreground">
                      &copy; {new Date().getFullYear()} SixSeven Creator. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-foreground transition-colors bg-transparent border-none cursor-pointer">Gallery</button>
                      <button onClick={() => window.location.href = '/collections'} className="hover:text-foreground transition-colors bg-transparent border-none cursor-pointer">Collections</button>
                      <button className="hover:text-foreground transition-colors bg-transparent border-none cursor-pointer">Privacy</button>
                      <button className="hover:text-foreground transition-colors bg-transparent border-none cursor-pointer">Terms</button>
                    </div>
                  </div>
                </footer>
              </main>
            </div>
          </div>
        </>
      )}
    </div>
  );
};export default Index;
