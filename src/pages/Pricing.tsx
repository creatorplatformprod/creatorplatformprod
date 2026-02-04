import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';

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

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Free Trial Card */}
          <div className="rounded-xl border border-[#0284c7]/30 bg-[#0ea5e9]/5 p-6">
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
              className="w-full mb-6 border-[#0284c7] text-[#0284c7] hover:bg-[#0ea5e9]/10 hover:text-[#0284c7]"
            >
              Start Free Trial
            </Button>

            <div className="space-y-3">
              {freeFeatures.map((feature, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 flex-shrink-0 text-[#0284c7]" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Card */}
          <div className="rounded-xl border-2 border-[#0284c7]/50 bg-[#0ea5e9]/5 p-6 relative">
            <div className="absolute -top-3 left-4">
              <span 
                className="text-white text-xs font-medium px-3 py-1 rounded-full"
                style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)' }}
              >
                Recommended
              </span>
            </div>

            <div className="mb-5">
              <h3 className="text-lg font-semibold text-foreground">Pro</h3>
              <p className="text-sm text-muted-foreground mt-1">Everything included</p>
            </div>
            
            <div className="mb-5">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">$9.99</span>
                <span className="text-muted-foreground text-sm">/ month</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">After free trial</p>
            </div>

            <Button 
              onClick={handleCheckoutPro}
              className="w-full mb-6 btn-67"
            >
              Get Pro
            </Button>

            <div className="space-y-3">
              {proFeatures.map((feature, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 flex-shrink-0 text-[#0284c7]" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Business Card */}
          <div className="rounded-xl border border-[#0284c7]/30 bg-[#0ea5e9]/5 p-6">
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-foreground">Business</h3>
              <p className="text-sm text-muted-foreground mt-1">$4.99 a month for 12 months</p>
            </div>
            
            <div className="mb-5">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">$4.99</span>
                <span className="text-muted-foreground text-sm">/ month</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">12-month commitment</p>
            </div>

            <Button 
              onClick={handleCheckoutBusiness}
              variant="outline"
              className="w-full mb-6 border-[#0284c7] text-[#0284c7] hover:bg-[#0ea5e9]/10 hover:text-[#0284c7]"
            >
              Get Business
            </Button>

            <div className="space-y-3">
              {businessFeatures.map((feature, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 flex-shrink-0 text-[#0284c7]" />
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
