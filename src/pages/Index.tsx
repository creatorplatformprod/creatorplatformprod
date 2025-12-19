import { useState, useEffect, useMemo } from "react";
import { Flame, ChevronRight, ChevronLeft, Sun, Moon, Sparkles, Image, Camera, Heart, Flower2, Zap, Star, Droplet, CloudRain, Music, Palette, Briefcase, BookOpen, Gem, Crown, Target, Coffee, Feather } from "lucide-react";
import FeedHeader from "@/components/FeedHeader";
import PostCard from "@/components/PostCard";
import StatusCard from "@/components/StatusCard";
import StatusCardWithMedia from "../components/StatusCardWithMedia";
import Preloader from "@/components/Preloader";
import TopLoader from "@/components/TopLoader";
import { collections, getAllCollectionIds, getCollection } from "@/collections/collectionsData";

const portrait1 = "/images485573257456374938/1img.jpg";

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
        name: "Lannah",
        avatar: portrait1,
        verified: true
      },
      title: "",
      text: "purple lights casting shadows across sensual black fabric... there's something about that neon glow against skin that just unlocks a different version of me. cozy fit but make it dangerous. mysterious but inviting. this is the energy tonight. 💜🖤",
      timestamp: "4 hours ago",
      likes: 125000,
      comments: 3470,
      media: {
        type: "image" as const,
        url: "./images485573257456374938/collection17/38.jpg",
        alt: "Behind the scenes photoshoot"
      }
    },
    {
      id: "status-19475368",
      user: {
        name: "Lannah",
        avatar: portrait1,
        verified: true
      },
      title: "Something's Brewing",
      text: "the studio walls have been keeping secrets lately. late nights, new concepts, pushing boundaries I didn't know I had. the creative chaos is intoxicating — messy, unpredictable, and absolutely addictive. can't reveal everything yet but trust me... what's coming will be worth the wait. stay close. 👀🔥",
      timestamp: "5 hours ago",
      likes: 89000,
      comments: 1560
    },
    {
      id: "status-73926481",
      user: {
        name: "Lannah",
        avatar: portrait1,
        verified: true
      },
      title: "Before the World Wakes",
      text: "the first hour belongs to no one but me. warm sheets still holding my shape, soft light learning my face through the curtains, coffee promising everything will be okay. I protect this hour fiercely. just me, my breath, my thoughts before they become content. you're one of the few I'd share this with. ☀️☕",
      timestamp: "3 days ago",
      likes: 67000,
      comments: 890
    },
    {
      id: "status-58391627",
      user: {
        name: "Lannah",
        avatar: portrait1,
        verified: true
      },
      title: "",
      text: "put on red. stared at the camera. forgot how to be anything but fierce. there's something about crimson against my skin that unlocks a different version of me — bolder, more passionate, completely unapologetic. the kind of sensual energy that doesn't ask permission. she's here and she's not sorry about it. 🔴💋",
      timestamp: "1 hour ago",
      likes: 92000,
      comments: 1234,
      media: {
        type: "image" as const,
        url: "./images485573257456374938/collection17/40.jpg",
        alt: "Sun-kissed moment"
      }
    },
    {
      id: "status-92847315",
      user: {
        name: "Lannah",
        avatar: portrait1,
        verified: true
      },
      title: "Unboxed",
      text: "spent way too long shrinking myself to fit spaces that were never designed for bodies like mine, dreams like mine, fire like mine. plot twist: I'm done asking permission to exist loudly. building my own kingdom now — messy, imperfect, entirely mine. the most terrifying and liberating thing I've ever done. to everyone else burning the boxes they were put in: I see you. keep going. we're free now. 🔥💫",
      timestamp: "12 days ago",
      likes: 156000,
      comments: 2890
    },
    {
      id: "status-46172953",
      user: {
        name: "Lannah",
        avatar: portrait1,
        verified: true
      },
      title: "Maid to Slay",
      text: "okay hear me out — black and white maid aesthetic but make it fashion, make it art, make it completely inappropriate for actual cleaning. there's something deliciously subversive about taking the 'serving' trope and flipping it into pure confidence. lace-trimmed rebellion. apron strings with attitude. she plays the role but rewrites all the rules. the uniform is just the beginning of this story... 🖤🤍",
      timestamp: "22 days ago",
      likes: 203000,
      comments: 4567,
      media: {
        type: "image" as const,
        url: "./images485573257456374938/collection17/21.jpg",
        alt: "Red fashion moment"
      }
    },
    {
      id: "status-83659742",
      user: {
        name: "Lannah",
        avatar: portrait1,
        verified: true
      },
      title: "",
      text: "here's a thought that keeps me warm at 2am: the version of you with mascara running, heart racing, still healing from the last thing — she's not broken. she's becoming. growth looks like chaos before it looks like clarity. and somewhere between who you were and who you're becoming lives the most beautiful version: the one still in progress. that's the real art. 🎭✨",
      timestamp: "39 days ago",
      likes: 78000,
      comments: 1120
    },
    {
      id: "status-37284561",
      user: {
        name: "Lannah",
        avatar: portrait1,
        verified: true
      },
      title: "You",
      text: "sometimes I scroll through your messages and just... cry. the good kind. you found me when I was just a girl with a camera and too many feelings. now you're the reason I keep creating, keep sharing, keep being vulnerable in public. this connection we have? it saved me more times than you know. thank you for choosing to stay. 💕🤝",
      timestamp: "46 days ago",
      likes: 94000,
      comments: 1890
    },
    {
      id: "status-65918473",
      user: {
        name: "Lannah",
        avatar: portrait1,
        verified: true
      },
      title: "",
      text: "those eyes don't just see — they hunt. wrapped in sensual black that moves like liquid shadow, channeling pure feline energy. there's something primal about letting the inner predator out to play. the gaze of someone who knows exactly what she wants... and always, always gets it. black silk. dangerous curves. eyes that could pin you to the wall from across the room. she's here. 🐆🖤",
      timestamp: "50 days ago",
      likes: 112000,
      comments: 2340,
      media: {
        type: "image" as const,
        url: "./images485573257456374938/collection7/2.jpg",
        alt: "Artistic pose"
      }
    },
    {
      id: "status-19426837",
      user: {
        name: "Lannah",
        avatar: portrait1,
        verified: true
      },
      title: "",
      text: "photography is just organized obsession with light and skin and the spaces between heartbeats. every shadow placed with intention, every highlight earned through patience. behind each image is someone who refused to settle for 'good enough' — who chased the perfect angle until her arms ached and the moment finally surrendered. this is what love looks like when it becomes craft. 📸🎨",
      timestamp: "75 days ago",
      likes: 156000,
      comments: 4200
    },
    {
      id: "status-74853296",
      user: {
        name: "Lannah",
        avatar: portrait1,
        verified: true
      },
      title: "Permission Granted",
      text: "revolutionary act of the day: existing without explanation. no schedule, no agenda, no performance. just a woman and her thoughts and the radical audacity to do absolutely nothing beautifully. they call it lazy; I call it reclaiming my time, my body, my energy. the world can wait. I'm busy being whole. 🌙✨",
      timestamp: "54 days ago",
      likes: 67000,
      comments: 890
    },
    {
      id: "status-52174639",
      user: {
        name: "Lannah",
        avatar: portrait1,
        verified: true
      },
      title: "",
      text: "yesterday's session broke something open in the best way. new lighting techniques that made skin glow like moonlight, angles we've never tried, energy that just... clicked. I keep looking at these frames and getting emotional. can't explain it. full set drops this week and I need you to see what I saw — because for the first time, I felt genuinely beautiful. 🔥📸",
      timestamp: "58 days ago",
      likes: 145000,
      comments: 3200,
      media: {
        type: "image" as const,
        url: "./images485573257456374938/collection9/4.jpg",
        alt: "Creative moment"
      }
    },
      {
      id: "status-41739582",
      user: {
        name: "Lannah",
        avatar: portrait1,
        verified: true
      },
      title: "",
      text: "in a world obsessed with hustle culture, my most radical act is stillness. lying here in barely anything, curtains drawn, phone on silent, choosing peace over productivity. they call it lazy. I call it reclaiming my body from a system that wants it constantly performing. rest is resistance. softness is strength. and right now, doing nothing never felt so powerful. 🛋️✨",
      timestamp: "62 days ago",
      likes: 128000,
      comments: 2890
    },
    {
      id: "status-87162493",
      user: {
        name: "Lannah",
        avatar: portrait1,
        verified: true
      },
      title: "",
      text: "I love the way soft sheets feel against my skin, how they move when I stretch, and the subtle thrill when I know someone's eyes are on me. 💛",
      timestamp: "63 days ago",
      likes: 234000,
      comments: 5670
    },
    {
      id: "status-23685917",
      user: {
        name: "Lannah",
        avatar: portrait1,
        verified: true
      },
      title: "",
      text: "behind this shot: 73 outtakes, two wardrobe malfunctions, one moment where I completely forgot how to pose naturally, and laughing so hard we had to take a break. the 'effortless' version you see? she took work. but the chaos, the imperfection, the humanity behind the polished result — that's where the real magic lives. I love this messy beautiful process. 📷😅✨",
      timestamp: "67 days ago",
      likes: 76000,
      comments: 1234,
      media: {
        type: "image" as const,
        url: "./images485573257456374938/collection12/19.jpg",
        alt: "Creative Approach"
      }
    },
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
        <article className="post-card rounded-xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-lg font-bold text-foreground mb-3">{post.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{post.description}</p>
            <div className="text-muted-foreground text-xs mt-4 opacity-75">
              {post.timestamp}
            </div>
          </div>
          <div className="p-4 border-t border-border bg-post-bg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 text-muted-foreground hover:text-like active:bg-transparent transition-colors px-3 py-1 hover:bg-secondary rounded-lg">
                  <Heart className="w-4 h-4" />
                  {(post.likes / 1000).toFixed(0)}k
                </button>
              </div>
            </div>
          </div>
        </article>
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

          <div className="flex">
            <aside
              className={`hidden lg:block fixed left-0 bg-background border-r border-border z-20 transition-all duration-300 ${
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
                  <p className="text-[10px] text-muted-foreground mb-1.5 text-center">Follow me</p>
                  <div className="flex items-center justify-center gap-2">
                    <a
                      href="https://twitter.com/lannahof"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.040 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    </a>
                    <a
                      href="https://instagram.com/cherryxtati"
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
                            <Flame className="w-6 h-6 text-primary-foreground fill-current" />
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
                        Discover premium photography, art, and exclusive content from Elena Muarova. 
                        Join the community of creative enthusiasts exploring 17 unique visual collections.
                      </p>
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
                              onClick={() => window.location.href = '/collections'} 
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
                          <a href="https://twitter.com/lannahof" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.040 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                            </svg>
                          </a>
                          <a href="https://instagram.com/cherryxtati" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.40s-.644-1.44-1.439-1.40z"/>
                            </svg>
                          </a>
                        </div>
                        <p className="text-sm text-muted-foreground">info@lannahof.com</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border mt-8 pt-6">
                    <button 
                      className="flex items-center justify-center gap-2 cursor-pointer group mb-4 w-full bg-transparent border-none"
                      onClick={() => window.location.href = '/collections'}
                    >
                      <Heart className="w-4 h-4 fill-current text-primary" />
                      <span className="font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Unlock All 17 Collections
                      </span>
                    </button>
                    <p className="text-center text-xs text-muted-foreground mb-6">
                      Get unlimited access to all exclusive content, HD downloads, and early access to new collections
                    </p>
                  </div>

                  <div className="border-t border-border pt-6 text-center">
                    <p className="text-xs text-muted-foreground">
                      © {new Date().getFullYear()} Lannah. All rights reserved. 
                      <span className="mx-2">•</span>
                      <button className="bg-transparent border-none text-xs text-muted-foreground underline-none">Privacy Policy</button>
                      <span className="mx-2">•</span>
                      <button className="bg-transparent border-none text-xs text-muted-foreground underline-none">Terms of Service</button>
                    </p>
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

