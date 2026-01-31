import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, UserCircle2, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { api } from '@/lib/api';

const Landing = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    displayName: ''
  });

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
    <div className="min-h-screen feed-bg">
      <style>{`
        @keyframes floaty {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/60">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent text-white grid place-items-center shadow-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="leading-tight">
              <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground font-['Space_Grotesk']">
                Creator Platform
              </p>
              <p className="text-lg font-semibold text-foreground font-['Space_Grotesk']">
                CreatorPlatform
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/60 hover:bg-secondary/80 text-foreground transition-all"
            aria-label="Go to dashboard"
          >
            <UserCircle2 className="w-5 h-5" />
            <span className="text-sm font-medium">Dashboard</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.28),transparent_45%),radial-gradient(circle_at_30%_80%,rgba(219,39,119,0.22),transparent_50%),radial-gradient(circle_at_90%_20%,rgba(34,197,94,0.18),transparent_50%)]" />
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br from-accent/30 to-primary/30 blur-2xl animate-[floaty_6s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-80px] -left-10 w-80 h-80 rounded-full bg-gradient-to-br from-primary/25 to-emerald-400/20 blur-2xl animate-[floaty_7s_ease-in-out_infinite]" />

        <div className="relative max-w-6xl mx-auto px-4 pt-16 pb-10">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
            <div className="text-left">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/80 bg-white/10 px-3 py-1.5 rounded-full border border-white/15 backdrop-blur">
                <Zap className="w-3.5 h-3.5" />
                2026 creator stack
              </p>
              <h1 className="mt-6 text-5xl md:text-6xl font-semibold text-white leading-[1.05] font-['Space_Grotesk'] animate-[fadeUp_0.6s_ease-out]">
                Launch a premium
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-200 to-white">
                  creator storefront
                </span>
              </h1>
              <p className="mt-5 text-lg md:text-xl text-white/85 max-w-xl animate-[fadeUp_0.7s_ease-out]">
                A modern platform for exclusive drops, token‑gated access, and frictionless
                card‑to‑crypto payments. Ship fast, look elite.
              </p>

              <div className="mt-8 grid sm:grid-cols-3 gap-3">
                {[
                  { label: 'Instant payouts', icon: Zap },
                  { label: 'Secure access', icon: ShieldCheck },
                  { label: 'Smart analytics', icon: Sparkles },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur px-4 py-3 text-white flex items-center gap-3"
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Registration/Login Form */}
            <div className="post-card rounded-2xl p-7 shadow-xl backdrop-blur-xl border border-border/60 bg-background/80 animate-[fadeUp_0.6s_ease-out]">
          <div className="flex gap-4 mb-6">
            <Button
              variant={!isLogin ? 'default' : 'ghost'}
              onClick={() => setIsLogin(false)}
              className="flex-1"
            >
              Sign Up
            </Button>
            <Button
              variant={isLogin ? 'default' : 'ghost'}
              onClick={() => setIsLogin(true)}
              className="flex-1"
            >
              Login
            </Button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
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
                  <label className="text-sm font-medium text-foreground mb-2 block">
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
              <label className="text-sm font-medium text-foreground mb-2 block">
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
              <label className="text-sm font-medium text-foreground mb-2 block">
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

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Create Account')}
              {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-post-bg px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full mt-4"
              onClick={handleGoogleAuth}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-6">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
