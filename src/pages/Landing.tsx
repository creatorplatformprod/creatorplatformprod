import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, X, Cookie } from 'lucide-react';
import { api } from '@/lib/api';

// Toggle between images to test - change this to 1 or 2
const IMAGE_OPTION = 1;

const IMAGES = {
  1: 'https://images.pexels.com/photos/7219129/pexels-photo-7219129.jpeg?auto=compress&cs=tinysrgb&w=800',
  2: 'https://images.pexels.com/photos/7081145/pexels-photo-7081145.jpeg?auto=compress&cs=tinysrgb&w=800'
};

const Landing = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    displayName: ''
  });
  const [showCookies, setShowCookies] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const result = await api.login(formData.email, formData.password);
        if (result.success && result.token) {
          localStorage.setItem('token', result.token);
          navigate('/dashboard');
        } else {
          setError(result.error || 'Login failed');
        }
      } else {
        const result = await api.register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          displayName: formData.displayName
        });
        if (result.success && result.token) {
          localStorage.setItem('token', result.token);
          navigate('/dashboard');
        } else {
          setError(result.error || 'Registration failed');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    api.googleAuth();
  };

  return (
    <div className="min-h-screen feed-bg flex flex-col relative">
      {/* Mobile only: full-page blurred background */}
      <div className="fixed inset-0 z-0 md:hidden" aria-hidden>
        <img
          src={IMAGES[2]}
          alt=""
          className="w-full h-full object-cover opacity-40"
          style={{ transform: 'scale(1.5) translateY(-8%)' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(14, 165, 233, 0.15) 0%, rgba(2, 132, 199, 0.10) 40%, hsl(var(--background) / 0.8) 100%)'
          }}
        />
      </div>

      {/* Promo Banner */}
      {showBanner && (
        <div className="relative z-10 bg-secondary border-b border-border text-foreground py-2.5 px-4 text-center">
          <p className="text-xs sm:text-sm leading-relaxed pr-6">
            <span className="hidden sm:inline">Try SixSevenCreator free for 1 month — No credit card required</span>
            <span className="sm:hidden">Start your 1-month free trial — no credit card required.</span>
            <button 
              onClick={() => navigate('/pricing')}
              className="ml-2 underline hover:no-underline font-medium"
            >
              Pricing
            </button>
          </p>
          <button 
            onClick={() => setShowBanner(false)}
            className="absolute right-2 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-6">
        {/* Main Container */}
        <div className="w-full max-w-5xl">
          {/* Wrapper for 67 positioning */}
          <div className="relative">
            {/* 67 OUTSIDE and BEHIND the card */}
            <div 
              className="absolute right-8 md:left-auto md:right-[26%] md:translate-x-1/2 z-0 select-none pointer-events-none -top-[74px] sm:-top-20 md:-top-[130px]"
            >
              <span 
                className="text-[100px] sm:text-[140px] md:text-[180px] font-black leading-none"
                style={{
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                67
              </span>
            </div>

            {/* Connected Card - Image + Form */}
            <div className="relative z-10 flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-xl border border-border/40 bg-background/95 backdrop-blur mt-16 sm:mt-20 max-w-5xl mx-auto">
              
              {/* Left - Image with floating text */}
              <div className="md:w-1/2 relative hidden md:block">
                <img 
                  src={IMAGES[2]}
                  alt="Creator"
                  className="w-full h-full object-cover absolute inset-0"
                />
                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Floating sentence - Bottom Left */}
                <div className="absolute bottom-4 left-4 right-4">
                  <p 
                    className="text-xl font-bold text-white leading-tight"
                    style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
                  >
                    Create content. Get paid.
                  </p>
                  <p 
                    className="text-sm text-white/80 mt-1"
                    style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}
                  >
                    Card to crypto, instantly.
                  </p>
                </div>
              </div>

              {/* Right - Form */}
              <div className="md:w-1/2 p-8">
                {/* Tabs */}
                <div className="flex gap-2 mb-4">
                  <Button
                    variant={!isLogin ? 'default' : 'ghost'}
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 ${!isLogin ? 'btn-67' : 'hover-foreground'}`}
                  >
                    Sign Up
                  </Button>
                  <Button
                    variant={isLogin ? 'default' : 'ghost'}
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 ${isLogin ? 'btn-67' : 'hover-foreground'}`}
                  >
                    Login
                  </Button>
                </div>

                {error && (
                  <div className="mb-3 p-2.5 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                  {!isLogin && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">
                          Username
                        </label>
                        <Input
                          type="text"
                          placeholder="Choose a username"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          required
                          disabled={loading}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">
                          Display Name
                        </label>
                        <Input
                          type="text"
                          placeholder="Your display name"
                          value={formData.displayName}
                          onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                          required
                          disabled={loading}
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      Password
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      disabled={loading}
                    />
                  </div>

                  <Button type="submit" className="w-full btn-67" size="lg" disabled={loading}>
                    {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Get Started')}
                    {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
                  </Button>
                </form>

                <div className="mt-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">or</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full mt-3 hover-foreground"
                    onClick={handleGoogleAuth}
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  By signing up, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cookies - Bottom Left */}
      {!showCookies ? (
        <button
          onClick={() => setShowCookies(true)}
          className="fixed bottom-6 left-6 w-12 h-12 bg-background border border-border rounded-full shadow-lg flex items-center justify-center z-[100] hover:bg-secondary transition-colors"
          title="Cookie Settings"
        >
          <Cookie className="w-5 h-5 text-foreground" />
        </button>
      ) : (
        <div className="fixed bottom-6 left-6 max-w-sm bg-background border border-border rounded-xl shadow-2xl p-5 z-[100]">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-foreground">Cookie Settings</h4>
            <button onClick={() => setShowCookies(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
            We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. Essential cookies are required for basic functionality.
          </p>
          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              onClick={() => setShowCookies(false)}
              className="w-full btn-67"
            >
              Accept All Cookies
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowCookies(false)}
              className="w-full hover-foreground"
            >
              Essential Only
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;
