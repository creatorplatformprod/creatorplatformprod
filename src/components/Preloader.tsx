import { useState, useEffect } from "react";
import CreatorLockup from "@/components/CreatorLockup";
// Brand preloader

type PreloaderProps = {
  isVisible: boolean;
  onComplete: () => void;
  themeClass?: string;
};

const Preloader = ({ isVisible, onComplete, themeClass = "" }: PreloaderProps) => {
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
      className={`fixed inset-0 z-50 flex items-center justify-center feed-bg ${themeClass} transition-opacity duration-500 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="scale-110 md:scale-[1.2] origin-center">
          <CreatorLockup />
        </div>
        <div className="relative w-6 h-6">
          <div className="absolute inset-0 rounded-full border-2 border-gray-200" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500 border-r-sky-400 animate-spin" />
        </div>
      </div>
    </div>
  );
};

export default Preloader;
