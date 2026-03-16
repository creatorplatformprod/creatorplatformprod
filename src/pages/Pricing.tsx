import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Sparkles, Zap } from 'lucide-react';

const Pricing = () => {
  const navigate = useNavigate();

  const handleStartTrial = () => {
    navigate('/');
  };

  const handleCheckoutPro = () => {
    window.open('https://checkout.example.com', '_blank');
  };

  const handleCheckoutBusiness = () => {
    window.open('https://checkout.example.com/business', '_blank');
  };

  const freeFeatures = [
    'Unlimited uploads',
    'Creator profile',
    'Basic analytics',
    'Email support'
  ];

  const proFeatures = [
    'Unlimited uploads',
    'Creator profile',
    'Card to crypto payments',
    'Real-time analytics',
    'Priority support',
    'Custom domain',
    'No transaction fees',
    'Cancel anytime'
  ];

  const businessFeatures = [
    'Everything in Pro',
    'Billed monthly for 12 months',
    'Lower monthly rate',
    'Card to crypto payments',
    'Priority support',
    'Cancel anytime'
  ];

  return (
    <div className="min-h-screen feed-bg">
      <header className="nav-elevated sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
          <div className="flex items-center gap-3">
            <div className="brand-wordmark"><span className="brand-accent">Six</span><span>Seven</span><span className="brand-accent">Creator</span></div>
            <div className="w-px h-5 bg-gray-200" />
            <span className="text-xs font-medium text-muted-foreground">Pricing</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-14">
        <div className="text-center max-w-xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/5 border border-primary/10 rounded-full px-3 py-1 mb-5">
            <Zap className="w-3 h-3" />
            Simple, transparent pricing
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-3">
            Choose your plan
          </h1>
          <p className="text-muted-foreground text-base">
            Start free, upgrade when you need more
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {/* Free Trial Card */}
          <div className="card-elevated p-6 flex flex-col">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground">Free Trial</h3>
              <p className="text-xs text-muted-foreground mt-1">Try it out</p>
            </div>
            
            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground tracking-tight">$0</span>
                <span className="text-muted-foreground text-sm">/ 1 month</span>
              </div>
            </div>

            <Button 
              onClick={handleStartTrial}
              variant="outline"
              className="w-full mb-6 h-11 rounded-xl border-border hover:border-primary/40 text-foreground hover:text-primary font-semibold transition-all"
            >
              Start Free Trial
            </Button>

            <div className="space-y-3 flex-1">
              {freeFeatures.map((feature, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-4.5 h-4.5 rounded-full bg-primary/8 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Card */}
          <div className="card-elevated p-6 relative ring-2 ring-primary/20 flex flex-col" style={{ boxShadow: '0 8px 40px -8px rgba(14,165,233,0.12)' }}>
            <div className="absolute -top-3 left-4">
              <span className="inline-flex items-center gap-1 text-white text-xs font-medium px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 shadow-sm">
                <Sparkles className="w-3 h-3" />
                Recommended
              </span>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground">Pro</h3>
              <p className="text-xs text-muted-foreground mt-1">Everything included</p>
            </div>
            
            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground tracking-tight">$9.99</span>
                <span className="text-muted-foreground text-sm">/ month</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">After free trial</p>
            </div>

            <Button 
              onClick={handleCheckoutPro}
              className="w-full mb-6 h-11 rounded-xl font-semibold shadow-sm bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600 text-white border-0"
            >
              Get Pro
            </Button>

            <div className="space-y-3 flex-1">
              {proFeatures.map((feature, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-4.5 h-4.5 rounded-full bg-primary/8 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Business Card */}
          <div className="card-elevated p-6 flex flex-col">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground">Business</h3>
              <p className="text-xs text-muted-foreground mt-1">$4.99 a month for 12 months</p>
            </div>
            
            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground tracking-tight">$4.99</span>
                <span className="text-muted-foreground text-sm">/ month</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">12-month commitment</p>
            </div>

            <Button 
              onClick={handleCheckoutBusiness}
              variant="outline"
              className="w-full mb-6 h-11 rounded-xl border-border hover:border-primary/40 text-foreground hover:text-primary font-semibold transition-all"
            >
              Get Business
            </Button>

            <div className="space-y-3 flex-1">
              {businessFeatures.map((feature, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-4.5 h-4.5 rounded-full bg-primary/8 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            All plans include 1 month free trial. Cancel anytime.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Questions? support@sixsevencreator.com
          </p>
        </div>
      </main>
    </div>
  );
};

export default Pricing;
