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
        <div className="brand-wordmark text-xl md:text-2xl"><span className="brand-accent">Six</span><span className="text-white">Seven</span><span className="brand-accent">Creator</span></div>
        <div className="relative h-[2px] w-28 overflow-hidden rounded-full bg-white/10">
          <div className="absolute inset-y-0 left-0 w-1/2 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-400 animate-[preloader-slide_1.2s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
};

export default Preloader;
