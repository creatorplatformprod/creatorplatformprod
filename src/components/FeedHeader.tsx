import { Moon, Sun, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
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
  subtitle = "Exclusive Content",
}: FeedHeaderProps) => {
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
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
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-post-bg/80 border-b border-border/50">
      <div className="max-w-none mx-auto px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between gap-4 lg:gap-8">
          <div 
            onClick={handleLogoClick}
            className={`flex items-center gap-3 flex-shrink-0 transition-opacity ${
              isDesktop ? 'cursor-pointer hover:opacity-80' : 'cursor-default'
            }`}
          >
            {/* 67 Logo */}
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent leading-none">
                67
              </span>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-foreground leading-tight">
                  {title}
                </h1>
                <p className="text-[10px] text-muted-foreground">{subtitle}</p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-xl lg:max-w-2xl mx-4 lg:mx-12">
            <div className="relative w-full group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Find what you are looking for..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="relative pl-12 pr-4 py-3 bg-secondary/50 border-0 rounded-full focus:bg-secondary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              />
              {showSuggestions && searchQuery && filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-post-bg border border-border rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
                  {filteredSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-3 hover:bg-secondary transition-colors first:rounded-t-xl last:rounded-b-xl text-sm"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
            <Button
              onClick={() => window.location.href = '/collections'}
              className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-all duration-300 px-4 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="11" width="14" height="10" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                <path d="M9 11V7C9 4.79086 10.7909 3 13 3C15.2091 3 17 4.79086 17 7V11" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
              <span className="hidden lg:inline">Unlock Everything</span>
              <span className="lg:hidden">Unlock</span>
            </Button>

            {/* Tip Button */}
            <TipButton onTipClick={() => {}} />

            <div className="w-px h-6 bg-border mx-1 lg:mx-2"></div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hover:bg-secondary/80 rounded-full transition-all duration-200 hover:scale-105"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-amber-500" />
              ) : (
                <Moon className="w-5 h-5 text-primary" />
              )}
            </Button>

          </div>
        </div>

        <div className="md:hidden mt-4 space-y-3">
          <Button
            onClick={() => window.location.href = '/collections'}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-all duration-300 py-3 rounded-full font-semibold shadow-lg"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="11" width="14" height="10" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M9 11V7C9 4.79086 10.7909 3 13 3C15.2091 3 17 4.79086 17 7V11" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
            Unlock Everything
          </Button>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Find what you are looking for..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setShowSuggestions(true)}
              className="pl-12 bg-secondary/50 border-0 rounded-full focus:bg-secondary"
            />
            {showSuggestions && searchQuery && filteredSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-post-bg border border-border rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
                {filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-3 hover:bg-secondary transition-colors first:rounded-t-xl last:rounded-b-xl text-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default FeedHeader;
