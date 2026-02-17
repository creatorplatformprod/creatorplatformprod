import { useState, useEffect } from "react";
// Brand preloader

const Preloader = ({ isVisible, onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setFadeOut(true);
      const timer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible && !fadeOut) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center feed-bg transition-opacity duration-500 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="brand-wordmark text-xl md:text-2xl"><span className="brand-accent">Six</span><span>Seven</span><span className="brand-accent">Creator</span></div>
        <div className="relative w-6 h-6">
          <div className="absolute inset-0 rounded-full border-2 border-gray-200" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500 border-r-sky-400 animate-spin" />
        </div>
      </div>
    </div>
  );
};

export default Preloader;
