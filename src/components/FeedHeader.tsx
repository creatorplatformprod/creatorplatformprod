import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import TipButton from "@/components/TipButton";

interface FeedHeaderProps {
  onSearch: (query: string) => void;
  onLogoClick?: () => void;
  sidebarOpen?: boolean;
  title?: string;
  subtitle?: string;
}

const FeedHeader = ({
  onSearch,
  onLogoClick,
  title = "Creator",
}: FeedHeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);


  const searchSuggestions = [
    // Collection Titles
    "Dripping in Midnight", "Creature of the Night", "Netflix & Thrill",
    "Body as Canvas", "Dark Elegance", "Midnight Muse", "Crimson Sophistication",
    "Whisper White", "Caramel Dreams", "Siren Song", "Dark Christmas",
    "Shower Dreams", "Pink Fury", "X Marks the Heart", "Off Duty Heat",
    "Kyoto Dreams", "Symbiote Chic", "Ultraviolet Dreams", "Tangerine Dreams",
    "Sailor Moon Energy", "Violet Hour", "Wanderlust Chronicles", "Crimson Fire",
    // Colors & Themes
    "White", "Black", "Pink", "Red", "Purple", "Blue", "Orange", "Brown",
    "Violet", "Crimson", "Midnight", "Caramel", "Tangerine",
    // Moods & Vibes
    "Sensual", "Cozy", "Elegant", "Intimate", "Playful", "Confident", "Mysterious",
    "Seductive", "Sophisticated", "Artistic", "Bold", "Soft", "Dark", "Dreamy",
    // Themes
    "Halloween", "Christmas", "Sailor", "Japanese", "Venom", "Siren", "Feline",
    "Shower", "Travel", "Everyday", "Night", "Comfort", "Fire", "Canvas",
    // Style Keywords
    "Lingerie", "Lace", "Silk", "Cozy Fit", "Minimal", "Body Art", "Photography",
    "Behind Scenes", "Photoshoot", "Camera", "Curves", "Silhouette"
  ];

  const filteredSuggestions = searchSuggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleLogoClick = () => {
    if (isDesktop && onLogoClick) {
      onLogoClick();
    }
  };

  return (
    <header className="sticky top-0 z-50 nav-elevated">
      <div className="max-w-none mx-auto px-3 sm:px-4 lg:px-6 py-2.5">
        <div className="flex items-center justify-between gap-3 lg:gap-6">
          {/* Left: Logo + Creator Name */}
          <div 
            onClick={handleLogoClick}
            className={`flex items-center gap-2.5 flex-shrink-0 transition-opacity ${
              isDesktop ? 'cursor-pointer hover:opacity-80' : 'cursor-default'
            }`}
          >
            <div className="brand-wordmark"><span className="brand-accent">Six</span><span className="text-white">Seven</span><span className="brand-accent">Creator</span></div>
            <div className="hidden sm:block w-px h-5 bg-white/[0.10]" />
            <span className="hidden sm:block text-sm font-medium text-foreground/80 tracking-tight">{title}</span>
          </div>

          {/* Center: Search (desktop) */}
          <div className="hidden md:flex items-center flex-1 max-w-lg lg:max-w-xl mx-3 lg:mx-8">
            <div className="relative w-full group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="relative pl-10 pr-4 py-2 h-9 bg-secondary/50 border-0 rounded-full text-sm focus:bg-secondary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              />
              {showSuggestions && searchQuery && filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-post-bg border border-border rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
                  {filteredSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-2.5 hover:bg-secondary transition-colors first:rounded-t-xl last:rounded-b-xl text-sm"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Mobile search toggle */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>

            <TipButton onTipClick={() => {}} />
          </div>
        </div>

        {/* Mobile search (collapsible) */}
        {mobileSearchOpen && (
          <div className="md:hidden mt-2.5 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="pl-10 h-9 bg-secondary/50 border-0 rounded-full text-sm focus:bg-secondary"
              autoFocus
            />
            {showSuggestions && searchQuery && filteredSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-post-bg border border-border rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
                {filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-2.5 hover:bg-secondary transition-colors first:rounded-t-xl last:rounded-b-xl text-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default FeedHeader;
