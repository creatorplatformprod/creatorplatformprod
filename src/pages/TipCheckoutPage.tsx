import { useState, useEffect } from "react";
import { ArrowLeft, Loader2, CheckCircle2, Shield, Lock, Heart, AlertCircle } from "lucide-react";

// Environment configuration
const CONFIG = {
  API_URL: 'https://lannah.lannadelulu.workers.dev',
  CONTENT_URL: 'https://lannahof.pages.dev'
};

const TipCheckoutPage = () => {
  const [customerEmail, setCustomerEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [availableProviders, setAvailableProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tipAmount, setTipAmount] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

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

  const handleAccessTokenRedirect = async (accessToken) => {
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

  const fetchProviders = async (amount) => {
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

  const isValidEmail = (email) => {
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

  const renderCardIcon = (cardType) => {
    const icons = {
      visa: (
        <div className="w-8 h-5 bg-[#1A1F71] rounded flex items-center justify-center">
          <span className="text-white text-[9px] font-bold tracking-wide">VISA</span>
        </div>
      ),
      mastercard: (
        <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center">
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
    };
    return icons[cardType] || null;
  };

  const handleProviderSelect = async (provider) => {
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
            amount: tipAmount,
            collectionId: 'tip',
            currency: 'USD',
            provider: provider.id,
            email: customerEmail.toLowerCase().trim()
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment session');
      }
      
      if (data.success && data.paymentLink) {
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

  // Success screen
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
          
          <div className="relative mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto shadow-md animate-scale-in">
              <Heart className="w-6 h-6 text-white fill-current animate-bounce-once" />
                </div>
            <div className="absolute inset-0 w-10 h-10 mx-auto bg-red-500/20 rounded-full animate-ping"></div>
              </div>
              
          <h2 className="text-sm font-bold text-foreground mb-1 animate-fade-in">
                Thank You!
              </h2>
              
          <p className="text-muted-foreground text-xs mb-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Your support means the world to me
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
        </div>
      </div>
    );
  }

  // Session expired screen
  if (sessionExpired) {
    return (
      <div className="min-h-screen feed-bg flex items-center justify-center p-4">
        <div className="post-card rounded-2xl p-8 max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-10 h-10 text-yellow-500" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Invalid Session</h2>
            <p className="text-muted-foreground text-sm">
              Please return to the site and try again.
            </p>
          </div>
          
          <div className="pt-4">
          <button 
            onClick={handleBack}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen feed-bg">
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 py-8">
        <div className="post-card rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-md">
              <Heart className="w-6 h-6 text-white fill-current" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                Support My Work
              </h2>
              <p className="text-xs text-muted-foreground">Thank you for your generosity</p>
            </div>
          </div>
          
          <div className="mb-6 p-4 bg-secondary/20 rounded-xl">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Tip Amount</span>
              <span className="text-3xl font-bold text-foreground">${tipAmount}</span>
            </div>
          </div>

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
                  className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  required
                  maxLength={254}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  We'll send your receipt here
                </p>
              </div>

              <div className="space-y-2.5">
                {availableProviders.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => handleProviderSelect(provider)}
                    disabled={isProcessing || !customerEmail}
                    className={`w-full p-3.5 rounded-xl border-2 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md ${
                      selectedProvider === provider.id
                        ? 'border-red-500 bg-red-500/10 shadow-md'
                        : 'border-border hover:border-red-500/50 bg-secondary/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-foreground mb-2 text-sm">
                              {provider.name}
                            </div>
                        <div className="flex gap-1.5 flex-wrap">
                          {provider.cards?.map((card) => (
                                <div key={card}>
                                  {renderCardIcon(card)}
                                </div>
                              ))}
                            </div>
                          </div>
                      {selectedProvider === provider.id && isProcessing && (
                        <Loader2 className="w-5 h-5 animate-spin text-red-500 ml-4 flex-shrink-0" />
                      )}
                      {selectedProvider === provider.id && !isProcessing && (
                        <CheckCircle2 className="w-5 h-5 text-red-500 ml-4 flex-shrink-0" />
                          )}
                    </div>
                        </button>
                      ))}
                    </div>

              <div className="mt-5 flex items-center justify-center gap-6 pt-5 border-t border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Secure Payment</span>
                  </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Lock className="w-4 h-4 text-green-500" />
                  <span>SSL Encrypted</span>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default TipCheckoutPage;