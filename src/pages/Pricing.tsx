import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Moon, Sun } from 'lucide-react';

const Pricing = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return true;
  });

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleStartTrial = () => {
    navigate('/');
  };

  const handleCheckout = () => {
    window.open('https://checkout.example.com', '_blank');
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full w-9 h-9"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Choose your plan
          </h1>
          <p className="text-muted-foreground">
            Start free, upgrade when you need more
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free Trial Card */}
          <div className="rounded-xl border border-border bg-secondary/30 p-6">
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-foreground">Free Trial</h3>
              <p className="text-sm text-muted-foreground mt-1">Try it out</p>
            </div>
            
            <div className="mb-5">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">$0</span>
                <span className="text-muted-foreground text-sm">/ 1 month</span>
              </div>
            </div>

            <Button 
              onClick={handleStartTrial}
              variant="outline" 
              className="w-full mb-6"
            >
              Start Free Trial
            </Button>

            <div className="space-y-3">
              {freeFeatures.map((feature, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Card */}
          <div className="rounded-xl border-2 border-sky-500/50 bg-sky-500/5 p-6 relative">
            <div className="absolute -top-3 left-4">
              <span className="bg-sky-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                Recommended
              </span>
            </div>

            <div className="mb-5">
              <h3 className="text-lg font-semibold text-foreground">Pro</h3>
              <p className="text-sm text-muted-foreground mt-1">Everything included</p>
            </div>
            
            <div className="mb-5">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">$4.99</span>
                <span className="text-muted-foreground text-sm">/ month</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">After free trial</p>
            </div>

            <Button 
              onClick={handleCheckout}
              className="w-full mb-6 bg-sky-500 hover:bg-sky-600"
            >
              Subscribe
            </Button>

            <div className="space-y-3">
              {proFeatures.map((feature, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-sky-500 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
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
