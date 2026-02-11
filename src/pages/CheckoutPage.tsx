import { useState, useEffect } from "react";
import { ArrowLeft, Loader2, CheckCircle2, Lock, ChevronDown, ChevronUp, Clock, AlertCircle, CreditCard } from "lucide-react";

const RAW_API_URL =
  import.meta.env.VITE_API_URL ||
  'https://creator-platform-api-production.creatorplatformprod.workers.dev';
const FALLBACK_API_URL = 'https://creator-platform-api-production.creatorplatformprod.workers.dev';

// Environment configuration
const CONFIG = {
  API_URL: RAW_API_URL.replace(/\/+$/, ''),
  CONTENT_URL: import.meta.env.VITE_CONTENT_URL || window.location.origin
};

const getProviderEndpoints = (amount) => {
  const endpoints = [`${CONFIG.API_URL}/api/payment/providers?amount=${amount}&currency=USD`];
  const fallbackBase = FALLBACK_API_URL.replace(/\/+$/, '');
  if (fallbackBase !== CONFIG.API_URL) {
    endpoints.push(`${fallbackBase}/api/payment/providers?amount=${amount}&currency=USD`);
  }
  return endpoints;
};

const CheckoutPage = () => {
  const [customerEmail, setCustomerEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [availableProviders, setAvailableProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [checkoutData, setCheckoutData] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [isProviderDropdownOpen, setIsProviderDropdownOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get('email') || '';
    const accessToken = params.get('access');
    const amount = params.get('amount');
    const collectionId = params.get('collectionId');
    const collectionTitle = params.get('collectionTitle');
    const itemCount = params.get('itemCount');
    const urlCreatorId = params.get('creatorId') || '';
    const urlCreator = params.get('creator') || '';
    
    // Use URL param email, or fall back to saved fan email
    const savedFanEmail = localStorage.getItem('fan_email') || '';
    setCustomerEmail(email || savedFanEmail);
    
    // Validate checkout data early
    if (amount && collectionId) {
      const parsedAmount = parseFloat(amount);
      const parsedItemCount = parseInt(itemCount) || 0;
      
      // Input validation
      if (isNaN(parsedAmount) || parsedAmount <= 0 || parsedAmount > 10000) {
        setSessionExpired(true);
        setIsLoading(false);
        return;
      }
      
      if (!isValidCollectionId(collectionId)) {
        setSessionExpired(true);
        setIsLoading(false);
        return;
      }
      
      setCheckoutData({
        amount: parsedAmount,
        collectionId,
        collectionTitle: sanitizeString(collectionTitle) || 'Exclusive Collection',
        itemCount: parsedItemCount,
        creatorId: urlCreatorId,
        creator: urlCreator
      });
    }
    
    // Handle access token redirect (from Card2Crypto callback)
    if (accessToken) {
      handleAccessTokenRedirect(accessToken, collectionId);
      return;
    }
    
    // Normal checkout flow - fetch providers
    if (amount && collectionId) {
      fetchProviders(amount);
    } else {
      // No valid checkout data
      setSessionExpired(true);
      setIsLoading(false);
    }
  }, []);

  // Fire purchase analytics event when payment succeeds
  useEffect(() => {
    if (paymentSuccess && checkoutData) {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'purchase', {
          transaction_id: Date.now().toString(),
          value: checkoutData.amount,
          currency: 'USD',
          items: [{
            item_id: checkoutData.collectionId,
            item_name: checkoutData.collectionTitle,
            price: checkoutData.amount,
            quantity: 1
          }]
        });
      }
    }
  }, [paymentSuccess, checkoutData]);

  // Input validation helpers - ENHANCED
  const isValidCollectionId = (id) => {
    if (id === 'all') return true;
    if (/^[a-f0-9]{24}$/i.test(id)) return true;
    const numId = parseInt(id, 10);
    return !isNaN(numId) && numId >= 1;
  };

  const sanitizeString = (str) => {
    if (!str) return '';
    return str.replace(/[<>]/g, '').substring(0, 100);
  };

  // PRODUCTION-READY EMAIL VALIDATION (RFC 5322 compliant)
  const isValidEmail = (email) => {
    if (!email || typeof email !== 'string') return false;
    if (email.length > 254 || email.length < 3) return false;
    
    // Prevent consecutive dots
    if (email.includes('..')) return false;
    
    // Prevent leading/trailing dots in local part
    const [localPart, domain] = email.split('@');
    if (!localPart || !domain) return false;
    if (localPart.startsWith('.') || localPart.endsWith('.')) return false;
    if (domain.startsWith('.') || domain.endsWith('.')) return false;
    
    // RFC 5322 compliant regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!emailRegex.test(email)) return false;
    
    // Prevent emails with multiple @ symbols
    if (email.split('@').length !== 2) return false;
    
    // Ensure domain has at least one dot
    if (!domain.includes('.')) return false;
    
    // Prevent domains that are too short
    const domainParts = domain.split('.');
    if (domainParts.some(part => part.length === 0)) return false;
    
    return true;
  };

  const handleAccessTokenRedirect = async (accessToken, collectionId) => {
    // Validate token format (should be 64 hex characters)
    if (!accessToken || accessToken.length !== 64 || !/^[a-f0-9]+$/.test(accessToken)) {
      setPaymentError('Invalid access token format');
      setRedirecting(false);
      return;
    }

    // Show success animation
    setPaymentSuccess(true);
    setRedirecting(true);
    
    // Get redirect URL from backend (keeps secureIdMap private) - CRITICAL FIX
    try {
      const response = await fetch(
        `${CONFIG.API_URL}/api/payment/get-redirect-url?collectionId=${collectionId}&access=${accessToken}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.redirectUrl) {
        console.log('Redirecting to:', data.redirectUrl);
        setTimeout(() => {
          window.location.href = data.redirectUrl;
        }, 2500);
      } else {
        throw new Error(data.error || 'Failed to get redirect URL');
      }
    } catch (error) {
      console.error('Redirect error:', error);
      setPaymentError('Unable to redirect to content. Please contact support.');
      setRedirecting(false);
      
      // Show error state instead of fallback redirect
      setTimeout(() => {
        setPaymentSuccess(false);
      }, 2000);
    }
  };

  const fetchProviders = async (amount) => {
    setIsLoading(true);
    try {
      let lastError = null;
      const endpoints = getProviderEndpoints(amount);

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }

          const text = await response.text();
          let data;
          try {
            data = JSON.parse(text);
          } catch {
            throw new Error('Invalid JSON response');
          }

          if (data.success) {
            setAvailableProviders(data.providers);
            return;
          }

          throw new Error(data.error || 'Failed to fetch available providers');
        } catch (error) {
          lastError = error;
        }
      }

      throw lastError || new Error('Failed to fetch providers');
    } catch (error) {
      console.error('Provider fetch error:', error);
      setPaymentError('Unable to load payment providers. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderCardIcon = (cardType) => {
    const icons = {
      visa: (
        <div className="w-8 h-5 bg-[#1A1F71] rounded flex items-center justify-center">
          <span className="text-white text-[9px] font-bold tracking-wide">VISA</span>
        </div>
      ),
      mastercard: (
        <div className="w-8 h-5 bg-white/10 border border-white/20 rounded flex items-center justify-center">
          <svg className="w-7 h-7" viewBox="0 0 48 48" fill="none">
            <circle cx="15" cy="24" r="12" fill="#EB001B"/>
            <circle cx="33" cy="24" r="12" fill="#FF5F00"/>
            <path d="M24 13.5C21.2 16.8 19.5 20.2 19.5 24C19.5 27.8 21.2 31.2 24 34.5C26.8 31.2 28.5 27.8 28.5 24C28.5 20.2 26.8 16.8 24 13.5Z" fill="#FF5F00"/>
          </svg>
        </div>
      ),
      amex: (
        <div className="w-8 h-5 bg-[#006FCF] rounded flex items-center justify-center">
          <span className="text-white text-[8px] font-bold">AMEX</span>
        </div>
      ),
      bank: (
        <div className="w-5 h-5 bg-white/10 border border-white/20 rounded flex items-center justify-center">
          <svg className="w-3 h-3 text-white/70" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.86-1.03-7-5.23-7-9V8.3l7-3.89 7 3.89V11c0 3.77-3.14 7.97-7 9z"/>
          </svg>
        </div>
      ),
      applepay: (
        <div className="w-8 h-5 bg-black rounded flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
          </svg>
        </div>
      ),
      googlepay: (
        <div className="w-8 h-5 bg-white/10 border border-white/20 rounded flex items-center justify-center">
          <span className="text-[8px] font-bold text-white/70">GPay</span>
        </div>
      ),
      robinhood: (
        <div className="w-16 h-5 bg-[#00C805] rounded flex items-center justify-center px-2">
          <span className="text-white text-[9px] font-bold">Robinhood</span>
        </div>
      )
    };
    return icons[cardType] || null;
  };

  const handleProviderSelect = async (provider) => {
    // Enhanced email validation with better error message
    if (!customerEmail) {
      setPaymentError('Please enter your email address');
      return;
    }
    
    if (!isValidEmail(customerEmail)) {
      setPaymentError('Please enter a valid email address (e.g., name@example.com)');
      return;
    }

    if (!checkoutData) {
      setPaymentError('Missing checkout data. Please try again.');
      return;
    }

    // Additional validation
    if (!isValidCollectionId(checkoutData.collectionId)) {
      setPaymentError('Invalid collection. Please try again.');
      return;
    }

    if (checkoutData.amount <= 0 || checkoutData.amount > 10000) {
      setPaymentError('Invalid amount. Please try again.');
      return;
    }

    setSelectedProvider(provider.id);
    setIsProcessing(true);
    setPaymentError("");

    try {
      const response = await fetch(
        `${CONFIG.API_URL}/api/payment/create-session`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: checkoutData.amount,
            collectionId: checkoutData.collectionId,
            currency: 'USD',
            provider: provider.id,
            email: customerEmail.toLowerCase().trim(),
            ...(checkoutData.creatorId ? { creatorId: checkoutData.creatorId } : {})
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment session');
      }
      
      if (data.success && data.paymentLink) {
        // Google Analytics tracking
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'begin_checkout', {
            collection_id: checkoutData.collectionId,
            collection_title: checkoutData.collectionTitle,
            value: checkoutData.amount,
            currency: 'USD',
            payment_method: 'card2crypto',
            provider: provider.id
          });
        }

        // Redirect to Card2Crypto payment page
        window.location.href = data.paymentLink;
      } else {
        throw new Error('Invalid payment session response');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentError(error.message || 'Unable to process payment. Please try again.');
      setIsProcessing(false);
      setSelectedProvider(null);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  // Success screen (shown when redirected with access token)
  if (paymentSuccess) {
    return (
      <div className="min-h-screen feed-bg flex items-center justify-center p-4">
        <div className="p-3 max-w-xs w-full text-center">
          <style>{`
            @keyframes scale-in {
              0% { transform: scale(0); opacity: 0; }
              50% { transform: scale(1.1); }
              100% { transform: scale(1); opacity: 1; }
            }
            @keyframes bounce-once {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
            .animate-scale-in {
              animation: scale-in 0.5s ease-out;
            }
            .animate-bounce-once {
              animation: bounce-once 0.6s ease-out 0.3s;
            }
            .animate-fade-in {
              animation: fadeIn 0.5s ease-out forwards;
              opacity: 0;
            }
            @keyframes fadeIn {
              to { opacity: 1; }
            }
          `}</style>
          
          {redirecting && !paymentError ? (
            <>
              <div className="relative mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto shadow-md animate-scale-in">
                  <CheckCircle2 className="w-6 h-6 text-primary-foreground animate-bounce-once" />
                </div>
                <div className="absolute inset-0 w-10 h-10 mx-auto bg-primary/20 rounded-full animate-ping"></div>
              </div>
              
              <h2 className="text-sm font-bold text-foreground mb-1 animate-fade-in">
                Payment Successful!
              </h2>
              
              <p className="text-muted-foreground text-xs mb-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Your exclusive content is ready
              </p>
              
              <div className="flex flex-col gap-1 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-primary">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Payment confirmed</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Redirecting...</span>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground mb-1">
                  Redirect Failed
                </h2>
                <p className="text-xs text-muted-foreground mb-3">
                  {paymentError || 'Unable to redirect to your content'}
                </p>
                <button
                  onClick={() => window.location.href = CONFIG.CONTENT_URL}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors"
                >
                  Go to Homepage
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Session expired screen
  if (sessionExpired || (!checkoutData && !isLoading)) {
    return (
      <div className="min-h-screen feed-bg flex items-center justify-center p-4">
        <div className="post-card rounded-2xl p-8 max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto">
            <Clock className="w-10 h-10 text-yellow-500" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Session Expired</h2>
            <p className="text-muted-foreground text-sm">
              Your checkout session has expired. Please return to the collection and start a new purchase.
            </p>
          </div>
          
          <div className="pt-4">
            <button 
              onClick={handleBack}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Store</span>
            </button>
            <button
              onClick={() => {
                window.location.href = '/recover-access';
              }}
              className="w-full mt-2 text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2 bg-transparent border-none cursor-pointer"
            >
              Recover previous access links
            </button>
          </div>
          
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Need help? Contact support at{" "}
              <a href="mailto:support@sixsevencreator.com" className="text-primary hover:text-primary/80 transition-colors">
                support@sixsevencreator.com
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Loading state while fetching checkout data
  if (isLoading && !checkoutData) {
    return (
      <div className="min-h-screen feed-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen feed-bg">
      <header className="sticky top-0 z-10 nav-elevated">
        <div className="max-w-5xl mx-auto p-3 sm:p-4 flex items-center justify-between">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>
          <div className="brand-wordmark text-sm"><span className="brand-accent">Six</span><span className="text-white">Seven</span><span className="brand-accent">Creator</span></div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-10">
          {/* Order Summary -- Left Column */}
          <div className="lg:col-span-2 order-1 lg:order-1">
            <div className="lg:sticky lg:top-24">
              <div className="lg:hidden mb-4">
                <button
                  onClick={() => setShowOrderDetails(!showOrderDetails)}
                  className="w-full flex items-center justify-between py-3 text-sm"
                >
                  <span className="font-medium text-foreground">Show order summary</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">${checkoutData.amount}</span>
                    {showOrderDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>
              </div>

              <div className={`space-y-5 ${showOrderDetails ? 'block' : 'hidden lg:block'}`}>
                {/* Product Card */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500/20 via-violet-500/15 to-cyan-500/20 border border-white/[0.06] flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="4" /><path d="M3 9h18M9 21V9" /></svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground text-sm truncate">{checkoutData.collectionTitle}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {checkoutData.itemCount > 0 ? `${checkoutData.itemCount} items` : 'Digital content'} · Instant access
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-foreground flex-shrink-0">${checkoutData.amount}</span>
                </div>

                {/* Price Summary */}
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">${checkoutData.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="text-emerald-400">Free</span>
                  </div>
                  <div className="h-px bg-white/[0.06] my-1" />
                  <div className="flex justify-between items-baseline">
                    <span className="text-foreground font-medium">Total</span>
                    <span className="text-2xl font-bold text-foreground tracking-tight">${checkoutData.amount}</span>
                  </div>
                </div>

                {/* Perks */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                    <div className="w-1 h-1 rounded-full bg-emerald-400" />
                    <span>One-time purchase · No subscription</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                    <div className="w-1 h-1 rounded-full bg-emerald-400" />
                    <span>Instant access after payment</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                    <div className="w-1 h-1 rounded-full bg-emerald-400" />
                    <span>Lifetime ownership</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form -- Right Column (primary focus) */}
          <div className="lg:col-span-3 order-2 lg:order-2">
            <div className="card-elevated rounded-2xl p-5 sm:p-7">
              <h1 className="text-lg sm:text-xl font-bold text-foreground mb-1 tracking-tight">Payment</h1>
              <p className="text-xs text-muted-foreground mb-6">
                Secure checkout · Encrypted end-to-end
              </p>

              {paymentError && (
                <div className="mb-5 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400 flex-1">{paymentError}</p>
                </div>
              )}

              {isLoading ? (
                <div className="py-12 flex flex-col items-center justify-center">
                  <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Loading payment options...</p>
                </div>
              ) : (
                <>
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => {
                        setCustomerEmail(e.target.value);
                        if (paymentError && paymentError.includes('email')) {
                          setPaymentError('');
                        }
                      }}
                      placeholder="name@example.com"
                      className="w-full px-4 py-2.5 sm:py-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      required
                      maxLength={254}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      We'll send your purchase confirmation here
                    </p>
                  </div>

                  {/* Payment Provider Dropdown */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Payment Provider
                    </label>
                    <div>
                      <button
                        type="button"
                        onClick={() => setIsProviderDropdownOpen(!isProviderDropdownOpen)}
                        className={`w-full px-4 py-2.5 sm:py-3 bg-secondary/30 border border-border rounded-xl text-foreground flex items-center justify-between hover:bg-secondary/50 transition-all ${isProviderDropdownOpen ? 'rounded-b-none border-b-0' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-5 h-5 text-muted-foreground" />
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {availableProviders.find((p) => p.id === selectedProvider)?.name || 'Select payment provider'}
                            </span>
                            {selectedProvider && (
                              <div className="flex gap-1">
                                {availableProviders.find((p) => p.id === selectedProvider)?.cards?.slice(0, 3).map((card) => (
                                  <div key={card} className="scale-90">
                                    {renderCardIcon(card)}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${isProviderDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Dropdown options - flows in document, pushing content down */}
                      <div className={`overflow-hidden transition-all duration-200 ${isProviderDropdownOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="bg-background border border-t-0 border-border rounded-b-xl overflow-hidden">
                          {availableProviders.map((provider) => (
                            <button
                              key={provider.id}
                              onClick={() => {
                                setSelectedProvider(provider.id);
                                setIsProviderDropdownOpen(false);
                              }}
                              className={`w-full px-4 py-3 text-left hover:bg-secondary/50 transition-colors flex items-center justify-between border-b border-border last:border-b-0 ${
                                selectedProvider === provider.id ? 'bg-secondary/30' : ''
                              }`}
                            >
                              <div>
                                <div className="font-semibold text-foreground text-sm mb-1.5">
                                  {provider.name}
                                </div>
                                <div className="flex gap-1.5 flex-wrap">
                                  {provider.cards?.slice(0, 5).map((card) => (
                                    <div key={card}>
                                      {renderCardIcon(card)}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              {selectedProvider === provider.id && (
                                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pay Button */}
                  <button
                    onClick={() => {
                      const provider = availableProviders.find((p) => p.id === selectedProvider);
                      if (provider) handleProviderSelect(provider);
                    }}
                    disabled={isProcessing || !customerEmail || !selectedProvider}
                    className="checkout-pay-btn w-full"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>Pay ${checkoutData?.amount}</span>
                    )}
                  </button>

                  <p className="mt-3 text-center text-[11px] text-muted-foreground/60">
                    <Lock className="w-3 h-3 inline-block mr-1 -mt-px" />
                    Secured with 256-bit SSL encryption
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8 pb-4">
          <p className="text-[11px] text-muted-foreground/50 leading-relaxed">
            By completing your purchase, you agree to our{" "}
            <a href="#" className="text-muted-foreground/70 underline underline-offset-2 hover:text-foreground transition-colors">Terms</a>
            {" "}and{" "}
            <a href="#" className="text-muted-foreground/70 underline underline-offset-2 hover:text-foreground transition-colors">Privacy Policy</a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
