import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReveal } from '@/hooks/useReveal';
import { Button } from '@/components/ui/button';
import {
  ArrowRight, X, Cookie, Plus,
  CreditCard, BarChart3, UserCircle, ShieldCheck
} from 'lucide-react';
import { api } from '@/lib/api';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

/* ─────────────────── Data ─────────────────── */

const SPOTLIGHTS = [
  { name: 'Grace',  img: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=120' },
  { name: 'Samy',   img: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=120' },
  { name: 'Sose',   img: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=120' },
  { name: 'Sany',   img: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=120' },
  { name: 'Rosie',  img: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=120' },
];

const CHART_DATA = [
  { month: 'Jan', value: 420 },  { month: 'Feb', value: 610 },
  { month: 'Mar', value: 580 },  { month: 'Apr', value: 890 },
  { month: 'May', value: 1150 }, { month: 'Jun', value: 980 },
  { month: 'Jul', value: 1400 }, { month: 'Aug', value: 1720 },
  { month: 'Sep', value: 2100 }, { month: 'Oct', value: 1950 },
  { month: 'Nov', value: 2800 }, { month: 'Dec', value: 3200 },
];

const FEATURES = [
  { icon: CreditCard, title: 'Card-to-Crypto Payments', desc: 'Accept card payments and receive crypto instantly. No delays, no middlemen.' },
  { icon: BarChart3, title: 'Real-time Analytics', desc: 'Track views, earnings, and subscriber growth with live dashboards.' },
  { icon: UserCircle, title: 'Creator Profile', desc: 'Your own branded page with collections, posts, and subscription tiers.' },
  { icon: ShieldCheck, title: 'Secure Platform', desc: 'End-to-end encryption, 2FA, and DMCA protection for your content.' },
];

const FREE_FEATURES = ['Unlimited uploads', 'Creator profile', 'Basic analytics', 'Email support'];
const PRO_FEATURES = ['Unlimited uploads', 'Creator profile', 'Card to crypto payments', 'Real-time analytics', 'Priority support', 'Custom domain', 'No transaction fees', 'Cancel anytime'];
const BIZ_FEATURES = ['Everything in Pro', 'Billed monthly for 12 months', 'Lower monthly rate', 'Card to crypto payments', 'Priority support', 'Cancel anytime'];

const FAQS = [
  { q: 'Is SixSevenCreator really free to start?', a: 'Yes. Every account starts with a full 1-month free trial on the Pro plan. No credit card required. You only pay when you choose to continue.' },
  { q: 'How do card-to-crypto payments work?', a: 'Subscribers pay with their regular debit or credit card. Our payment processor instantly converts the funds to your preferred cryptocurrency and sends them to your wallet.' },
  { q: 'Can I cancel anytime?', a: 'Absolutely. There are no lock-in contracts on the monthly Pro plan. Cancel through your dashboard at any time and your account downgrades at the end of the billing cycle.' },
  { q: 'What content can I upload?', a: 'Photos, videos, audio, and text posts. We support all major media formats. Content must comply with our Terms of Service and community guidelines.' },
  { q: 'How do I get paid?', a: 'Earnings are sent directly to your crypto wallet in real-time as subscribers pay. No waiting periods, no minimum payout thresholds.' },
];

/* ─────────────────── Component ─────────────────── */

const Landing = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const revealFeatures = useReveal(0.12);
  const revealSocial = useReveal(0.12);
  const revealPricing = useReveal(0.12);
  const revealFaq = useReveal(0.12);
  const [isLogin, setIsLogin] = useState(false);
  const [signupStep, setSignupStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', displayName: '' });
  const [showCookies, setShowCookies] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  /* Nav scroll detection */
  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Smooth-scroll helper */
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToHero = (login: boolean) => {
    setIsLogin(login);
    setSignupStep(1);
    setError('');
    heroRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  /* ── Auth ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!isLogin && signupStep < 3) { setSignupStep(signupStep + 1); return; }
    setLoading(true);
    try {
      if (isLogin) {
        const r = await api.login(formData.email, formData.password);
        if (r.success && r.token) { localStorage.setItem('token', r.token); navigate('/dashboard'); }
        else setError(r.error || 'Login failed');
      } else {
        const r = await api.register({ username: formData.username, email: formData.email, password: formData.password, displayName: formData.displayName });
        if (r.success && r.token) { localStorage.setItem('token', r.token); navigate('/dashboard'); }
        else setError(r.error || 'Registration failed');
      }
    } catch (err: any) { setError(err.message || 'An error occurred'); }
    finally { setLoading(false); }
  };

  const handleGoogleAuth = () => { api.googleAuth(); };

  const renderSignupFields = () => {
    switch (signupStep) {
      case 1: return (
        <>
          <input type="text" placeholder="Username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required disabled={loading} className="w-full h-12 px-4 landing-input-white text-sm" />
          <input type="text" placeholder="Display Name" value={formData.displayName} onChange={(e) => setFormData({ ...formData, displayName: e.target.value })} required disabled={loading} className="w-full h-12 px-4 landing-input-white text-sm" />
          <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required disabled={loading} className="w-full h-12 px-4 landing-input-white text-sm" />
        </>
      );
      case 2: return (
        <>
          <input type="password" placeholder="Create password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required disabled={loading} className="w-full h-12 px-4 landing-input-white text-sm" />
          <p className="text-xs text-gray-400">Must be 8+ characters with upper, lower, and a number.</p>
        </>
      );
      case 3: return (
        <div className="text-center py-2">
          <p className="text-gray-600 text-sm mb-1">Ready to create?</p>
          <p className="text-gray-900 text-lg font-semibold">{formData.displayName || formData.username}</p>
          <p className="text-gray-500 text-xs mt-1">{formData.email}</p>
        </div>
      );
      default: return null;
    }
  };

  /* ─────────────────── Render ─────────────────── */
  return (
    <div className="landing-universe landing-waves-bg gradient-mesh-bg">
      <div className="landing-wave" />

      {/* ━━━━━━━━━━ 1. STICKY NAV ━━━━━━━━━━ */}
      <nav className={`landing-nav ${navScrolled ? 'scrolled' : ''}`}>
        <div className="w-full max-w-6xl mx-auto flex items-center justify-between">
          <div className="brand-wordmark">
            <span className="brand-accent">Six</span><span>Seven</span><span className="brand-accent">Creator</span>
          </div>
          <div className="flex items-center gap-0.5 sm:gap-4">
            <button onClick={() => scrollTo('features')} className="text-gray-500 hover:text-gray-900 text-[10px] sm:text-sm font-medium transition-colors px-1.5 sm:px-2 py-1">Features</button>
            <button onClick={() => scrollTo('pricing')} className="text-gray-500 hover:text-gray-900 text-[10px] sm:text-sm font-medium transition-colors px-1.5 sm:px-2 py-1">Pricing</button>
            <button onClick={() => scrollToHero(true)} className="text-gray-500 hover:text-gray-900 text-[10px] sm:text-sm font-medium transition-colors px-1.5 sm:px-2 py-1">Login</button>
            <button onClick={() => scrollToHero(false)} className="landing-cta-glow btn-press h-7 sm:h-8 px-3 sm:px-4 rounded-full text-[10px] sm:text-xs font-semibold ml-0.5 sm:ml-1">Get Started</button>
          </div>
        </div>
      </nav>

      {/* ━━━━━━━━━━ 2. HERO ━━━━━━━━━━ */}
      <section className="relative z-10 pt-28 sm:pt-36 pb-8 sm:pb-12 px-4 page-enter">
        <div className="max-w-6xl mx-auto">
          {/* Headline */}
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="landing-heading mx-auto">
              Create content. Get paid.<br />
              <span className="bg-gradient-to-r from-purple-500 via-violet-500 to-sky-400 bg-clip-text text-transparent">Card to crypto, instantly.</span>
            </h1>
            <p className="landing-subheading mx-auto mt-4 sm:mt-5">
              The creator platform that lets your subscribers pay with card and sends you crypto in real-time. No middlemen, no delays.
            </p>
          </div>

          {/* Glass card */}
          <div ref={heroRef} className="relative w-full max-w-[960px] mx-auto">
            {/* 67 — 3D centered watermark behind the glass card */}
            <div className="landing-67-scene select-none" aria-hidden="true">
              <div className="landing-67-surface">
                <div className="landing-67-glow" />
                <div className="landing-67-blur">67</div>
                <span className="landing-67">67</span>
                <div className="landing-67-reflect"><span>67</span></div>
              </div>
            </div>

            <div className="relative z-10 landing-glass rounded-[24px] overflow-hidden flex flex-col md:flex-row">
              {/* Left: Creator Spotlight */}
              <div className="md:w-[48%] p-7 sm:p-9 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-200/60">
                <div>
                  <h2 className="text-gray-900 text-lg font-semibold tracking-tight mb-5">Creator Spotlight</h2>
                  <div className="flex gap-3 mb-5">
                    {SPOTLIGHTS.map((s) => (
                      <div key={s.name} className="flex flex-col items-center gap-1.5">
                        <div className="w-12 h-12 rounded-full ring-2 ring-indigo-400/40 ring-offset-2 ring-offset-transparent overflow-hidden">
                          <img src={s.img} alt={s.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[10px] text-gray-500 font-medium">{s.name}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-900 text-xl font-bold leading-snug tracking-tight">
                    Avg. creator income<br />over 12 months
                  </p>
                </div>
                <div className="mt-6 -mx-2">
                  <ResponsiveContainer width="100%" height={170}>
                    <AreaChart data={CHART_DATA}>
                      <defs>
                        <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#6366f1" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(0,0,0,0.04)" strokeDasharray="3 3" />
                      <XAxis dataKey="month" tick={{ fill: 'rgba(0,0,0,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: 'rgba(0,0,0,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${v >= 1000 ? `${(v/1000).toFixed(1)}k` : v}`} />
                      <Tooltip contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} itemStyle={{ color: '#7c3aed' }} labelStyle={{ color: '#6b7280' }} formatter={(v: number) => [`$${v.toLocaleString()}`, 'Avg. Income']} />
                      <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fill="url(#chartGlow)" name="Income" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Right: Auth Form */}
              <div className="md:w-[52%] p-7 sm:p-9 flex flex-col">
                <div className="flex items-center gap-2.5 mb-7">
                  <button onClick={handleGoogleAuth} className="flex items-center gap-2 h-10 px-4 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    One-Tap Login
                  </button>
                  <button className="h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                    <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-gray-700"><path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 21.99 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 21.99C7.78997 22.03 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/></svg>
                  </button>
                  <button className="h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                    <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-gray-700"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  </button>
                </div>

                <h2 className="text-gray-900 text-2xl font-bold tracking-tight mb-1">
                  {isLogin ? 'Welcome Back' : 'Join SixSevenCreator'}
                </h2>
                {!isLogin && <p className="text-gray-500 text-sm mb-5">{signupStep}/3: {signupStep === 1 ? 'Your Identity' : signupStep === 2 ? 'Security' : 'Confirm'}</p>}
                {isLogin && <div className="mb-5" />}

                {error && (
                  <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2.5">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 flex-1">
                  {isLogin ? (
                    <>
                      <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required disabled={loading} className="w-full h-12 px-4 landing-input-white text-sm" />
                      <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required disabled={loading} className="w-full h-12 px-4 landing-input-white text-sm" />
                    </>
                  ) : renderSignupFields()}
                  <div className="flex-1" />
                  <Button type="submit" disabled={loading} className="w-full h-12 rounded-full landing-cta-glow btn-press font-semibold text-sm mt-2" size="lg">
                    {loading ? 'Please wait...' : isLogin ? 'Login' : signupStep < 3 ? 'Next Step' : 'Create Account'}
                    {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
                  </Button>
                </form>

                <button onClick={() => { setIsLogin(!isLogin); setSignupStep(1); setError(''); }} className="mt-4 text-xs text-gray-400 hover:text-gray-600 transition-colors text-center">
                  {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
                </button>
                <p className="text-[11px] text-gray-400 text-center mt-4 leading-relaxed">
                  By signing up, agree our <span className="text-indigo-500/70 hover:text-indigo-600 cursor-pointer">Terms of Service</span> & <span className="text-indigo-500/70 hover:text-indigo-600 cursor-pointer">Privacy Policy</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━ 3. FEATURES ━━━━━━━━━━ */}
      <section id="features" ref={revealFeatures} className="landing-section reveal">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-3">Why creators choose us</p>
            <h2 className="landing-heading">Everything you need to<br />monetize your content</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="landing-feature-card">
                <div className="landing-feature-icon">
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="text-gray-900 font-semibold text-sm mb-1.5">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━ 4. SOCIAL PROOF ━━━━━━━━━━ */}
      <section ref={revealSocial} className="landing-section pt-0 sm:pt-0 reveal">
        <div className="max-w-5xl mx-auto">
          <div className="landing-feature-card flex flex-col sm:flex-row items-center gap-8 sm:gap-12 py-8 px-8 sm:px-12">
            {/* Avatar stack */}
            <div className="flex items-center flex-shrink-0">
              <div className="flex -space-x-3">
                {SPOTLIGHTS.map((s, i) => (
                  <div key={s.name} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden" style={{ zIndex: 5 - i }}>
                    <img src={s.img} alt={s.name} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <span className="ml-3 text-gray-500 text-sm font-medium">Trusted by creators worldwide</span>
            </div>
            {/* Stats */}
            <div className="flex items-center gap-8 sm:gap-12">
              {[
                { val: '1M+', label: 'Creators' },
                { val: '150+', label: 'Countries' },
                { val: '$10M+', label: 'Earned' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-gray-900 text-2xl sm:text-3xl font-bold tracking-tight">{s.val}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━ 5. PRICING ━━━━━━━━━━ */}
      <section id="pricing" ref={revealPricing} className="landing-section reveal">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-3">Pricing</p>
            <h2 className="landing-heading">Start free, upgrade anytime</h2>
            <p className="landing-subheading mx-auto mt-3">Every plan includes a 1-month free trial. No credit card required.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {/* Free */}
            <div className="landing-price-card">
              <h3 className="text-gray-900 font-semibold text-lg">Free Trial</h3>
              <p className="text-gray-400 text-xs mt-1 mb-6">Try it out</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900 tracking-tight">$0</span>
                <span className="text-gray-400 text-sm ml-1">/ 1 month</span>
              </div>
              <button onClick={() => scrollToHero(false)} className="w-full h-11 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-semibold text-sm transition-all mb-6 btn-press">Start Free Trial</button>
              <div className="space-y-3 flex-1">
                {FREE_FEATURES.map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0"><svg className="w-2.5 h-2.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div>
                    <span className="text-sm text-gray-500">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro (featured) */}
            <div className="landing-price-card featured relative">
              <div className="absolute -top-3 left-4">
                <span className="inline-flex items-center gap-1 text-white text-[11px] font-semibold px-3 py-1 rounded-full landing-cta-glow">
                  Recommended
                </span>
              </div>
              <h3 className="text-gray-900 font-semibold text-lg">Pro</h3>
              <p className="text-gray-400 text-xs mt-1 mb-6">Everything included</p>
              <div className="mb-1">
                <span className="text-4xl font-bold text-gray-900 tracking-tight">$9.99</span>
                <span className="text-gray-400 text-sm ml-1">/ month</span>
              </div>
              <p className="text-gray-400 text-xs mb-6">After free trial</p>
              <button onClick={() => window.open('https://checkout.example.com', '_blank')} className="w-full h-11 rounded-xl landing-cta-glow btn-press font-semibold text-sm mb-6">Get Pro</button>
              <div className="space-y-3 flex-1">
                {PRO_FEATURES.map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0"><svg className="w-2.5 h-2.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div>
                    <span className="text-sm text-gray-500">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Business */}
            <div className="landing-price-card">
              <h3 className="text-gray-900 font-semibold text-lg">Business</h3>
              <p className="text-gray-400 text-xs mt-1 mb-6">$4.99/mo for 12 months</p>
              <div className="mb-1">
                <span className="text-4xl font-bold text-gray-900 tracking-tight">$4.99</span>
                <span className="text-gray-400 text-sm ml-1">/ month</span>
              </div>
              <p className="text-gray-400 text-xs mb-6">12-month commitment</p>
              <button onClick={() => window.open('https://checkout.example.com/business', '_blank')} className="w-full h-11 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-semibold text-sm transition-all mb-6 btn-press">Get Business</button>
              <div className="space-y-3 flex-1">
                {BIZ_FEATURES.map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0"><svg className="w-2.5 h-2.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div>
                    <span className="text-sm text-gray-500">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━ 6. FAQ ━━━━━━━━━━ */}
      <section ref={revealFaq} className="landing-section reveal">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-3">FAQ</p>
            <h2 className="landing-heading">Common questions</h2>
          </div>
          <div>
            {FAQS.map((faq, i) => (
              <div key={i} className="landing-faq-item">
                <button
                  className="landing-faq-trigger"
                  aria-expanded={openFaq === i}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {faq.q}
                  <Plus className="w-4 h-4" />
                </button>
                <div className={`landing-faq-answer ${openFaq === i ? 'open' : ''}`}>
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━ 7. FOOTER ━━━━━━━━━━ */}
      <footer className="landing-footer">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="brand-wordmark">
            <span className="brand-accent">Six</span><span className="text-gray-500">Seven</span><span className="brand-accent">Creator</span>
          </div>
          <div className="flex items-center gap-5 text-xs text-gray-400">
            <span className="hover:text-gray-600 cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-gray-600 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-gray-600 cursor-pointer transition-colors">support@sixsevencreator.com</span>
          </div>
          <p className="text-xs text-gray-300">&copy; 2025 SixSevenCreator</p>
        </div>
      </footer>

      {/* ━━━━━━━━━━ COOKIE POPUP ━━━━━━━━━━ */}
      {!showCookies ? (
        <button onClick={() => setShowCookies(true)} className="fixed bottom-6 left-6 w-11 h-11 rounded-full bg-white border border-gray-200 flex items-center justify-center z-[100] hover:bg-gray-50 transition-colors shadow-md" title="Cookie Settings">
          <Cookie className="w-4.5 h-4.5 text-indigo-500" />
        </button>
      ) : (
        <div className="fixed bottom-6 left-6 max-w-sm rounded-2xl bg-white/95 backdrop-blur-xl border border-gray-200 p-5 z-[100] shadow-2xl">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-900 text-sm">Cookie Settings</h4>
            <button onClick={() => setShowCookies(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="w-4 h-4" /></button>
          </div>
          <p className="text-xs text-gray-500 mb-4 leading-relaxed">We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.</p>
          <div className="flex flex-col gap-2">
            <button onClick={() => setShowCookies(false)} className="w-full h-9 rounded-lg landing-cta-glow text-xs font-medium">Accept All Cookies</button>
            <button onClick={() => setShowCookies(false)} className="w-full h-9 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 text-xs font-medium transition-colors">Essential Only</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;
