import { useState, useRef, useEffect } from "react";
import { X, Gift, Loader2 } from "lucide-react";

interface TipButtonProps {
  onTipClick?: () => void;
}

const TipButton = ({ onTipClick }: TipButtonProps) => {
  const [showTipModal, setShowTipModal] = useState(false);
  const [tipEmail, setTipEmail] = useState("");
  const [tipError, setTipError] = useState("");
  const [loadingAmount, setLoadingAmount] = useState<number | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const tipAmounts = [5, 10, 20, 50, 100, 500, 1000, 5000];

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showTipModal &&
        modalRef.current &&
        buttonRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowTipModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showTipModal]);

  // Email validation
  const isValidEmail = (email: string) => {
    if (!email || typeof email !== 'string') return false;
    if (email.length > 254 || email.length < 3) return false;
    if (email.includes('..')) return false;
    
    const [localPart, domain] = email.split('@');
    if (!localPart || !domain) return false;
    if (localPart.startsWith('.') || localPart.endsWith('.')) return false;
    if (domain.startsWith('.') || domain.endsWith('.')) return false;
    
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!emailRegex.test(email)) return false;
    if (email.split('@').length !== 2) return false;
    if (!domain.includes('.')) return false;
    
    const domainParts = domain.split('.');
    if (domainParts.some(part => part.length === 0)) return false;
    
    return true;
  };

  const sanitizeEmail = (email: string) => {
    if (!email || typeof email !== 'string') return '';
    return email
      .toLowerCase()
      .trim()
      .replace(/[<>]/g, '')
      .substring(0, 254);
  };

  const handleTipSelect = async (amount: number) => {
    const sanitizedEmail = sanitizeEmail(tipEmail);

    if (!sanitizedEmail) {
      setTipError('Please enter your email address');
      return;
    }

    if (!isValidEmail(sanitizedEmail)) {
      setTipError('Please enter a valid email address (e.g., name@example.com)');
      return;
    }

    // Set loading state for this button
    setLoadingAmount(amount);

    // Small delay to show loading state
    setTimeout(() => {
      // Redirect to tip checkout page
      const checkoutUrl = `/tip-checkout?` +
        `amount=${amount}` +
        `&email=${encodeURIComponent(sanitizedEmail)}`;

      window.location.href = checkoutUrl;
    }, 500); // 500ms delay to show the loader
  };

  const handleButtonClick = () => {
    setShowTipModal(!showTipModal);
    if (onTipClick) onTipClick();
  };

  // Softer rosy pink color
  const roseColor = "#db2777";

  return (
    <div className="relative">
      {/* Minimalistic Tip Button - no border, rose color */}
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        className="group flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full bg-transparent hover:bg-rose-500/10 transition-colors duration-200 text-sm font-semibold"
        style={{ color: roseColor }}
      >
        <Gift className="w-4 h-4" style={{ color: roseColor }} />
        <span>Tip</span>
      </button>

      {/* Floating Tip Modal - Minimalistic */}
      {showTipModal && (
        <div 
          ref={modalRef}
          className="absolute right-0 top-full mt-2 z-50"
          style={{
            animation: 'tipModalFadeIn 0.15s ease-out'
          }}
        >
          <style>{`
            @keyframes tipModalFadeIn {
              from { opacity: 0; transform: translateY(-4px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
          <div className="bg-background border border-border rounded-xl p-4 w-[300px] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.15)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)]">
            {/* Close Button */}
            <button
              onClick={() => setShowTipModal(false)}
              className="absolute top-3 right-3 w-6 h-6 rounded-full hover:bg-secondary flex items-center justify-center transition-colors"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>

            {/* Header - Minimalistic */}
            <div className="mb-4 pr-6">
              <h3 className="text-sm font-semibold" style={{ color: roseColor }}>Send a Tip</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Support my work</p>
            </div>
            
            {tipError && (
              <div className="mb-3 p-2 bg-rose-500/10 rounded-lg">
                <p className="text-xs" style={{ color: roseColor }}>{tipError}</p>
              </div>
            )}
            
            {/* Email Input */}
            <div className="mb-3">
              <input
                type="email"
                placeholder="your@email.com"
                value={tipEmail}
                onChange={(e) => {
                  setTipEmail(e.target.value);
                  setTipError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
                className="w-full px-3 py-2 text-sm bg-secondary/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:border-transparent transition-all"
                style={{ "--tw-ring-color": roseColor } as React.CSSProperties}
                required
                maxLength={254}
              />
            </div>
            
            {/* Tip Amount Grid - Compact */}
            <div className="grid grid-cols-4 gap-1.5">
              {tipAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleTipSelect(amount)}
                  disabled={loadingAmount !== null}
                  className="py-2 bg-secondary/50 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-lg text-foreground font-medium transition-all text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                >
                  {loadingAmount === amount ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" style={{ color: roseColor }} />
                      <span>${amount}</span>
                    </>
                  ) : (
                    `$${amount}`
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TipButton;
