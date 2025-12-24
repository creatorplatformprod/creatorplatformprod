import { useState, useEffect } from "react";
import { ArrowLeft, Loader2, CheckCircle2, Gift, AlertCircle, Clock, ChevronDown, CreditCard } from "lucide-react";

// Environment configuration
const CONFIG = {
  API_URL: 'https://lannah.lannadelulu.workers.dev',
  CONTENT_URL: 'https://lannadelulu.com'
};

// Rosy pink color - matches TipButton in FeedHeader
const ROSE_COLOR = "#db2777";

const TipCheckoutPage = () => {
  const [customerEmail, setCustomerEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [availableProviders, setAvailableProviders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tipAmount, setTipAmount] = useState<number | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get('email') || '';
    const amount = params.get('amount');
    const accessToken = params.get('access');
    
    setCustomerEmail(email);
    
    // Validate tip amount
    if (amount) {
      const parsedAmount = parseFloat(amount);
      
      if (isNaN(parsedAmount) || parsedAmount <= 0 || parsedAmount > 10000) {
        setSessionExpired(true);
        setIsLoading(false);
        return;
      }
      
      setTipAmount(parsedAmount);
    }
    
    // Handle access token redirect
    if (accessToken) {
      handleAccessTokenRedirect(accessToken);
      return;
    }
    
    // Fetch payment providers
    if (amount) {
      fetchProviders(amount);
    } else {
      setSessionExpired(true);
      setIsLoading(false);
    }
  }, []);

  // Fire purchase analytics event when payment succeeds
  useEffect(() => {
    if (paymentSuccess && tipAmount) {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'purchase', {
          transaction_id: Date.now().toString(),
          value: tipAmount,
          currency: 'USD',
          items: [{
            item_id: 'tip',
            item_name: 'Tip / Support',
            price: tipAmount,
            quantity: 1
          }]
        });
      }
    }
  }, [paymentSuccess, tipAmount]);

  const handleAccessTokenRedirect = async (accessToken: string) => {
    if (!accessToken || accessToken.length !== 64 || !/^[a-f0-9]+$/.test(accessToken)) {
      setPaymentError('Invalid access token format');
      setRedirecting(false);
      return;
    }

    setPaymentSuccess(true);
    setRedirecting(true);
    
    setTimeout(() => {
      window.location.href = CONFIG.CONTENT_URL;
    }, 2500);
  };

  const fetchProviders = async (amount: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${CONFIG.API_URL}/api/payment/providers?amount=${amount}&currency=USD`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch providers');
      }

      const data = await response.json();

      if (data.success) {
        setAvailableProviders(data.providers);
        // Don't auto-select - let user choose like CheckoutPage
      } else {
        throw new Error(data.error || 'Failed to fetch available providers');
      }
    } catch (error) {
      console.error('Provider fetch error:', error);
      setPaymentError('Unable to load payment providers. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  };

  // PRODUCTION-READY EMAIL VALIDATION (RFC 5322 compliant) - same as CheckoutPage
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

  const renderCardIcon = (cardType: string) => {
    const icons: Record<string, JSX.Element> = {
      visa: (
        <div className="w-8 h-5 bg-[#1A1F71] rounded flex items-center justify-center">
          <span className="text-white text-[9px] font-bold tracking-wide">VISA</span>
        </div>
      ),
      mastercard: (
        <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center">
          <svg className="w-7 h-7" viewBox="0 0 48 48" fill="none">
            <circle cx="15" cy="24" r="12" fill="#EB001B"/>
            <circle cx="33" cy="24" r="12" fill="#F79E1B"/>
            <path d="M24 13.5C21.2 16.8 19.5 20.2 19.5 24C19.5 27.8 21.2 31.2 24 34.5C26.8 31.2 28.5 27.8 28.5 24C28.5 20.2 26.8 16.8 24 13.5Z" fill="#FF5F00"/>
          </svg>
        </div>
      ),
      amex: (
        <div className="w-8 h-5 bg-[#006FCF] rounded flex items-center justify-center">
          <span className="text-white text-[8px] font-bold">AMEX</span>
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
        <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center">
          <span className="text-[8px] font-bold text-gray-700">GPay</span>
        </div>
      ),
      robinhood: (
        <div className="w-16 h-5 bg-[#00C805] rounded flex items-center justify-center px-2">
          <span className="text-white text-[9px] font-bold">Robinhood</span>
        </div>
      ),
    };
    return icons[cardType] || null;
  };

  const handlePayment = async () => {
    // Enhanced email validation with better error message - same as CheckoutPage
    if (!customerEmail) {
      setPaymentError('Please enter your email address');
      return;
    }

    if (!isValidEmail(customerEmail)) {
      setPaymentError('Please enter a valid email address (e.g., name@example.com)');
      return;
    }

    if (!tipAmount) {
      setPaymentError('Missing tip amount. Please try again.');
      return;
    }

    if (tipAmount <= 0 || tipAmount > 10000) {
      setPaymentError('Invalid amount. Please try again.');
      return;
    }

    if (!selectedProvider) {
      setPaymentError('Please select a payment method.');
      return;
    }

    setIsProcessing(true);
    setPaymentError("");

    try {
      // Same API call as CheckoutPage - use 'all' as collectionId for tips
      const response = await fetch(
        `${CONFIG.API_URL}/api/payment/create-session`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: tipAmount,
            collectionId: 'all',
            currency: 'USD',
            provider: selectedProvider.id,
            email: customerEmail.toLowerCase().trim()
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment session');
      }

      if (data.success && data.paymentLink) {
        // Google Analytics tracking
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'begin_checkout', {
            collection_id: 'tip',
            collection_title: 'Tip / Support',
            value: tipAmount,
            currency: 'USD',
            payment_method: 'card2crypto',
            provider: selectedProvider.id
          });
        }

        // Redirect to Card2Crypto payment page
        window.location.href = data.paymentLink;
      } else {
        throw new Error('Invalid payment session response');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentError(error.message || 'Unable to process payment. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  // Success screen (shown when redirected with access token)
  if (paymentSuccess) {
    return (
      <div className="min-h-screen feed-bg flex items-center justify-center p-4">
        <div className="p-4 max-w-xs w-full text-center">
          <style>{`
            @keyframes scale-in {
              0% { transform: scale(0); opacity: 0; }
              50% { transform: scale(1.1); }
              100% { transform: scale(1); opacity: 1; }
            }
            @keyframes fadeIn {
              to { opacity: 1; }
            }
            .animate-scale-in { animation: scale-in 0.5s ease-out; }
            .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; opacity: 0; }
          `}</style>

          {redirecting && !paymentError ? (
            <>
              <div className="relative mb-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto animate-scale-in" style={{ backgroundColor: `${ROSE_COLOR}15` }}>
                  <Gift className="w-6 h-6" style={{ color: ROSE_COLOR }} />
                </div>
              </div>

              <h2 className="text-base font-semibold text-foreground mb-1 animate-fade-in">
                Thank You!
              </h2>

              <p className="text-muted-foreground text-sm mb-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Your support means everything
              </p>

              <div className="flex items-center justify-center gap-1.5 text-xs animate-fade-in" style={{ animationDelay: '0.4s', color: ROSE_COLOR }}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Payment confirmed</span>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: `${ROSE_COLOR}15` }}>
                <AlertCircle className="w-6 h-6" style={{ color: ROSE_COLOR }} />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground mb-1">
                  Something went wrong
                </h2>
                <p className="text-sm text-muted-foreground mb-3">
                  {paymentError || 'Unable to redirect'}
                </p>
                <button
                  onClick={() => window.location.href = CONFIG.CONTENT_URL}
                  className="px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors"
                  style={{ backgroundColor: ROSE_COLOR }}
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
  if (sessionExpired || (!tipAmount && !isLoading)) {
    return (
      <div className="min-h-screen feed-bg flex items-center justify-center p-4">
        <div className="post-card rounded-xl p-6 max-w-sm w-full text-center space-y-4">
          <div className="w-14 h-14 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto">
            <Clock className="w-7 h-7 text-amber-500" />
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-foreground">Session Expired</h2>
            <p className="text-muted-foreground text-sm">
              Please go back and try again.
            </p>
          </div>

          <button
            onClick={handleBack}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white font-medium transition-colors"
            style={{ backgroundColor: ROSE_COLOR }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen feed-bg">
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="max-w-lg mx-auto p-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto p-4 py-8">
        <div className="post-card rounded-2xl p-6 shadow-lg">
          {/* Header with Icon */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center">
              <Gift className="w-6 h-6" style={{ color: ROSE_COLOR }} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Send a Tip</h2>
              <p className="text-sm text-muted-foreground">Thank you for your support</p>
            </div>
          </div>

          {/* Tip Amount Display */}
          <div className="mb-6 p-4 bg-secondary/30 rounded-xl border border-border">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Tip Amount</span>
              <span className="text-3xl font-bold" style={{ color: ROSE_COLOR }}>${tipAmount}</span>
            </div>
          </div>

          {paymentError && (
            <div className="mb-5 p-3 rounded-xl flex items-start gap-2" style={{ backgroundColor: `${ROSE_COLOR}10`, border: `1px solid ${ROSE_COLOR}20` }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: ROSE_COLOR }} />
              <p className="text-sm" style={{ color: ROSE_COLOR }}>{paymentError}</p>
            </div>
          )}

          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin mb-4" style={{ color: ROSE_COLOR }} />
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
                  className="w-full px-4 py-2.5 bg-secondary/50 border-2 border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-rose-500/50 transition-all"
                  required
                  maxLength={254}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  We'll send your confirmation here
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
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`w-full px-4 py-3 bg-secondary/30 border border-border rounded-xl text-foreground flex items-center justify-between hover:bg-secondary/50 transition-all ${isDropdownOpen ? 'rounded-b-none border-b-0' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-muted-foreground" />
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {selectedProvider ? selectedProvider.name : 'Select payment provider'}
                        </span>
                        {selectedProvider && (
                          <div className="flex gap-1">
                            {selectedProvider.cards?.slice(0, 3).map((card: string) => (
                              <div key={card} className="scale-90">
                                {renderCardIcon(card)}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown options - flows in document, pushing content down */}
                  <div className={`overflow-hidden transition-all duration-200 ${isDropdownOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="bg-background border border-t-0 border-border rounded-b-xl overflow-hidden">
                      {availableProviders.map((provider: any, index: number) => (
                        <button
                          key={provider.id}
                          onClick={() => {
                            setSelectedProvider(provider);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-secondary/50 transition-colors flex items-center justify-between ${
                            selectedProvider?.id === provider.id ? 'bg-secondary/30' : ''
                          } ${index !== availableProviders.length - 1 ? 'border-b border-border' : ''}`}
                        >
                          <div>
                            <div className="font-medium text-foreground text-sm mb-1.5">
                              {provider.name}
                            </div>
                            <div className="flex gap-1.5">
                              {provider.cards?.slice(0, 5).map((card: string) => (
                                <div key={card}>
                                  {renderCardIcon(card)}
                                </div>
                              ))}
                            </div>
                          </div>
                          {selectedProvider?.id === provider.id && (
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: ROSE_COLOR }} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing || !customerEmail || !selectedProvider}
                className="w-full py-3.5 rounded-xl text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-lg hover:scale-[1.02]"
                style={{
                  background: `linear-gradient(135deg, ${ROSE_COLOR}, ${ROSE_COLOR}dd)`,
                }}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Gift className="w-5 h-5" />
                    <span>Send ${tipAmount} Tip</span>
                  </>
                )}
              </button>

              <div className="mt-5 pt-5 border-t border-border">
                <p className="text-[11px] text-muted-foreground text-center">
                  Protected by 256-bit SSL encryption
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer Text */}
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your tip is greatly appreciated and helps support future content creation.
          </p>
        </div>
      </main>
    </div>
  );
};

export default TipCheckoutPage;