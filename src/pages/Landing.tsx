import { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, X, Cookie, Plus, Check } from 'lucide-react';
import { api } from '@/lib/api';
import { useFeedbackToasts } from '@/hooks/useFeedbackToasts';

const CREATOR_FILES = Array.from({ length: 10 }, (_, i) =>
  `/creators/creator-${String(i + 1).padStart(2, '0')}.avif`
);

function shuffleInPlace<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ─────────────────── Static content ─────────────────── */

const PLAN_FEATURES = [
  'Card → crypto payouts',
  'Unlimited uploads',
  'Custom domain',
  'Real-time analytics',
  'DMCA protection',
  'Two-factor auth',
  'No platform commission',
  'Cancel anytime',
];

const FAQS = [
  { q: 'What is card to crypto?',
    a: 'Fans pay with a normal card or Apple Pay / Google Pay. You receive stablecoin or on-chain payout in the same moment. They never see a wallet flow.' },
  { q: 'Do fans need crypto?',
    a: 'No. Checkout looks like any other shop.' },
  { q: 'What is the free month?',
    a: 'Full paid plan for 30 days, no card to start. We email before it ends.' },
  { q: 'Can I cancel?',
    a: 'Yes, anytime. Your page becomes read-only; pending sales still settle to you.' },
  { q: 'Is my content protected?',
    a: 'Signed URLs, 2FA, and DMCA tooling with leak-network monitoring.' },
  { q: 'How do payouts work?',
    a: 'Card payments settle to USDC in your wallet (ETH/SOL supported). Add your address once; we handle the rest.' },
];

/* ─────────────────── Component ─────────────────── */

const Landing = () => {
  const navigate = useNavigate();
  const formRef = useRef<HTMLDivElement>(null);

  const [isLogin, setIsLogin] = useState(false);
  const [signupStep, setSignupStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', displayName: '' });
  const [showCookies, setShowCookies] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const proCheckoutUrl = String(import.meta.env.VITE_BILLING_PRO_URL || '').trim();
  const businessCheckoutUrl = String(import.meta.env.VITE_BILLING_BUSINESS_URL || '').trim();
  useFeedbackToasts({ error });

  const shuffledCreators = useMemo(() => shuffleInPlace([...CREATOR_FILES]), []);
  const heroFaces = shuffledCreators.slice(0, 6);
  const mockGridIds = Array.from({ length: 6 }, (_, i) => shuffledCreators[(i + 4) % shuffledCreators.length]);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const focusForm = (login: boolean) => {
    setIsLogin(login);
    setSignupStep(1);
    setError('');
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!isLogin && signupStep < 3) {
      setSignupStep(signupStep + 1);
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        const r = await api.login(formData.email, formData.password);
        if (r.success && r.token) { localStorage.setItem('token', r.token); navigate('/dashboard'); }
        else setError(r.error || 'Login failed');
      } else {
        const r = await api.register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          displayName: formData.displayName,
        });
        if (r.success && r.token) { localStorage.setItem('token', r.token); navigate('/dashboard'); }
        else setError(r.error || 'Registration failed');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => api.googleAuth();
  const openPlanCheckout = (url: string) => {
    if (!url) {
      setError('Billing checkout URL is not configured yet.');
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const year = new Date().getFullYear();

  const renderSignupFields = () => {
    switch (signupStep) {
      case 1:
        return (
          <>
            <input type="text" placeholder="username" value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required disabled={loading} className="lp-input" />
            <input type="text" placeholder="display name" value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              required disabled={loading} className="lp-input" />
            <input type="email" placeholder="email" value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required disabled={loading} className="lp-input" />
          </>
        );
      case 2:
        return (
          <>
            <input type="password" placeholder="password" value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required disabled={loading} className="lp-input" />
            <p className="lp-form-hint">At least 8 characters. One uppercase. One number.</p>
          </>
        );
      case 3:
        return (
          <div className="lp-form-confirm">
            <p className="lp-form-confirm-l">Account ready</p>
            <p className="lp-form-confirm-n">{formData.displayName || formData.username}</p>
            <p className="lp-form-confirm-e">{formData.email}</p>
          </div>
        );
      default:
        return null;
    }
  };

  /* ─────────────────── Render ─────────────────── */
  return (
    <div className="lp-canvas vault-ui">
      {/* ─── Nav ─── */}
      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="lp-brand" type="button">
            <span className="lp-brand-wordmark">sixsevencreator</span>
          </button>
          <div className="lp-nav-links">
            <button onClick={() => scrollTo('product')} className="lp-nav-link">Product</button>
            <button onClick={() => scrollTo('pricing')} className="lp-nav-link">Pricing</button>
            <button onClick={() => scrollTo('faq')} className="lp-nav-link">FAQ</button>
          </div>
          <div className="lp-nav-cta">
            <button onClick={() => focusForm(true)} className="lp-btn lp-btn-ghost lp-btn-sm">Sign in</button>
            <button onClick={() => focusForm(false)} className="lp-btn lp-btn-primary lp-btn-sm">
              Sign up
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="lp-hero">
        <div className="lp-shell">
          <div className="lp-hero-grid">
            <div>
              <h1 className="lp-h1">
                Card in. Crypto out.
              </h1>

              <p className="lp-lede" style={{ marginTop: '1.25rem' }}>
                Your page. Their card. Your wallet — same second. No platform commission.
              </p>

              <div className="lp-hero-actions">
                <button onClick={() => focusForm(false)} className="lp-btn lp-btn-primary lp-btn-lg">
                  Create account
                </button>
                <button onClick={() => scrollTo('product')} className="lp-btn lp-btn-secondary lp-btn-lg">
                  See the product
                </button>
              </div>

              <p style={{ marginTop: '1.4rem', fontSize: '0.8125rem', color: 'var(--lp-fg-muted)' }}>
                Free for the first 30 days. $19.99 / month after.
              </p>
              <div className="lp-hero-creators" aria-label="Creators on the platform">
                {heroFaces.map((src) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    width={52}
                    height={52}
                    loading="lazy"
                    decoding="async"
                  />
                ))}
              </div>
            </div>

            {/* Right: sign-up form */}
            <div ref={formRef} className="lp-form-card">
              <p className="lp-form-title" style={{ marginBottom: '1.25rem' }}>
                {isLogin ? 'Sign in' : 'Create your account'}
              </p>

              <button onClick={handleGoogleAuth} className="lp-google-btn" type="button">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>

              <div className="lp-form-divider">or email</div>

              {error && <div className="lp-form-error">{error}</div>}

              <form onSubmit={handleSubmit} className="lp-form-stack">
                {isLogin ? (
                  <>
                    <input type="email" placeholder="email" value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required disabled={loading} className="lp-input" />
                    <input type="password" placeholder="password" value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required disabled={loading} className="lp-input" />
                  </>
                ) : (
                  renderSignupFields()
                )}

                <button type="submit" disabled={loading}
                  className="lp-btn lp-btn-primary lp-btn-block"
                  style={{ height: '40px', marginTop: '0.4rem' }}>
                  {loading
                    ? 'One moment'
                    : isLogin ? 'Sign in'
                      : signupStep < 3 ? 'Continue'
                        : 'Create account'}
                  {!loading && <ArrowRight className="w-3.5 h-3.5 ml-1" />}
                </button>
              </form>

              <button onClick={() => { setIsLogin(!isLogin); setSignupStep(1); setError(''); }}
                className="lp-form-swap" type="button">
                {isLogin ? "Don't have an account? Create one." : 'Already a creator? Sign in.'}
              </button>

              <p className="lp-form-legal">
                By continuing you agree to our <a>Terms</a> and <a>Privacy</a>.
                We email you about your account, never marketing.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-section" style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem' }}>
        <div className="lp-shell">
          <p className="lp-vault-callout">
            <strong>Card → crypto</strong> — fans stay on familiar checkout; you still settle on-chain or in stablecoin.
          </p>
        </div>
      </section>

      {/* ─── What it is — README style ─── */}
      <section id="product" className="lp-section">
        <div className="lp-shell">
          <div className="lp-row-2">
            <div>
              <h2 className="lp-h2">How it works</h2>
            </div>
            <ul className="lp-readme">
              <li>
                <span className="lp-readme-num">01</span>
                <span>
                  Your <strong>page</strong>, your URL. Upload photos, video, audio — whatever you sell.
                </span>
              </li>
              <li>
                <span className="lp-readme-num">02</span>
                <span>
                  Set <strong>prices</strong> per collection, post, or an unlock-everything bundle.
                </span>
              </li>
              <li>
                <span className="lp-readme-num">03</span>
                <span>
                  Fans pay with <strong>card or tap</strong> (Apple Pay, Google Pay). No app, no wallet for them.
                </span>
              </li>
              <li>
                <span className="lp-readme-num">04</span>
                <span>
                  <strong>You</strong> get paid <strong>the same second</strong> — stablecoin or chain — the card-to-crypto path is on your side only.
                </span>
              </li>
              <li>
                <span className="lp-readme-num">05</span>
                <span>
                  <strong>Analytics</strong>, DMCA tooling, and CSV export when you need it.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ─── Product detail: feature blocks with real mocks ─── */}
      <section className="lp-section">
        <div className="lp-shell">
          <div className="lp-feature-list">
            {/* Feature 1: Page builder */}
            <article className="lp-feature-item">
              <div className="lp-feature-text">
                <h3 className="lp-h3">Your page.</h3>
                <p className="lp-body" style={{ marginTop: '0.6rem' }}>
                  Domain, theme, cover, collections, posts — live in minutes.
                </p>
              </div>
              <div className="lp-feature-art">
                <div className="lp-mock">
                  <div className="lp-mock-body" style={{ padding: '1.5rem 1.4rem' }}>
                    <p className="lp-mock-h">Your Studio</p>
                    <p className="lp-mock-sub">Photographer · 14 collections · 286 posts</p>
                    <div className="lp-mock-section-divider" />
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '6px',
                      }}
                    >
                      {mockGridIds.map((src) => (
                        <img
                          key={src}
                          src={src}
                          alt=""
                          width={200}
                          height={200}
                          loading="lazy"
                          decoding="async"
                          style={{
                            aspectRatio: '1',
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '4px',
                            filter: 'grayscale(1) contrast(1.05)',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Feature 2: Checkout */}
            <article className="lp-feature-item is-flipped">
              <div className="lp-feature-text">
                <h3 className="lp-h3">Their card.</h3>
                <p className="lp-body" style={{ marginTop: '0.6rem' }}>
                  Checkout they already know — card, Apple Pay, Google Pay. Nothing new to install.
                </p>
              </div>
              <div className="lp-feature-art">
                <div className="lp-mock">
                  <div className="lp-mock-body" style={{ padding: '1.5rem 1.4rem' }}>
                    <p className="lp-mock-h lp-tnum">$ 12.00</p>
                    <p className="lp-mock-sub">Unlock — 38 items</p>
                    <div className="lp-mock-section-divider" />
                    <div
                      style={{
                        height: '38px',
                        border: '1px solid var(--lp-line)',
                        borderRadius: '6px',
                        padding: '0 0.7rem',
                        display: 'flex',
                        alignItems: 'center',
                        fontFamily: 'ui-monospace, monospace',
                        fontSize: '0.8125rem',
                        color: 'var(--lp-fg-muted)',
                      }}
                    >
                      •••• •••• •••• 4242
                    </div>
                    <button
                      type="button"
                      className="lp-btn lp-btn-primary"
                      style={{
                        width: '100%',
                        height: '38px',
                        marginTop: '0.5rem',
                        pointerEvents: 'none',
                      }}
                    >
                      Pay $12.00
                    </button>
                  </div>
                </div>
              </div>
            </article>

            {/* Feature 3: Paid instantly */}
            <article className="lp-feature-item">
              <div className="lp-feature-text">
                <h3 className="lp-h3">Your wallet, instantly.</h3>
                <p className="lp-body" style={{ marginTop: '0.6rem' }}>
                  Card in from fans; crypto or stablecoin out to you — same moment. No holds, no commission.
                </p>
              </div>
              <div className="lp-feature-art">
                <div className="lp-mock">
                  <div className="lp-mock-body" style={{ padding: '1.5rem 1.4rem' }}>
                    <p className="lp-mock-h lp-tnum">$ 4,218.40</p>
                    <p className="lp-mock-sub">This month · 42 sales</p>
                    <div className="lp-mock-section-divider" />
                    <div className="lp-mock-row">
                      <span className="lp-mock-who">@aria</span>
                      <span className="lp-mock-amt">+ $248.00</span>
                      <span className="lp-mock-meta">2s</span>
                    </div>
                    <div className="lp-mock-row">
                      <span className="lp-mock-who">@studiomaya</span>
                      <span className="lp-mock-amt">+ $42.00</span>
                      <span className="lp-mock-meta">11s</span>
                    </div>
                    <div className="lp-mock-row">
                      <span className="lp-mock-who">@niapaints</span>
                      <span className="lp-mock-amt">+ $120.00</span>
                      <span className="lp-mock-meta">34s</span>
                    </div>
                    <div className="lp-mock-row">
                      <span className="lp-mock-who">@okayfern</span>
                      <span className="lp-mock-amt">+ $60.00</span>
                      <span className="lp-mock-meta">2m</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section id="pricing" className="lp-section">
        <div className="lp-shell">
          <header style={{ maxWidth: '720px', marginBottom: '2.5rem' }}>
            <h2 className="lp-h2">$19.99 after a free month</h2>
            <p className="lp-body" style={{ marginTop: '1rem' }}>
              Same features everywhere. Card → crypto on every plan. No commission on fan payments.
            </p>
          </header>

          <div className="lp-plans">
              <div className="lp-plan lp-plan-featured">
                <div className="lp-plan-name">Free month</div>
                <div className="lp-plan-sub">Full access. No card to start.</div>
                <div className="lp-plan-price">
                  <span className="lp-plan-amount lp-tnum">$0</span>
                  <span className="lp-plan-period">30 days</span>
                </div>
                <div className="lp-plan-after">then $19.99 / month</div>
                <button onClick={() => focusForm(false)} className="lp-btn lp-btn-primary">
                  Start
                </button>
                <ul className="lp-plan-list">
                  {PLAN_FEATURES.map((f) => (
                    <li key={f}><Check className="w-3.5 h-3.5" strokeWidth={2.2} /> {f}</li>
                  ))}
                </ul>
              </div>

              <div className="lp-plan">
                <div className="lp-plan-name">Monthly</div>
                <div className="lp-plan-sub">Pay month to month.</div>
                <div className="lp-plan-price">
                  <span className="lp-plan-amount lp-tnum">$19.99</span>
                  <span className="lp-plan-period">/ mo</span>
                </div>
                <div className="lp-plan-after">billed monthly</div>
                <button onClick={() => openPlanCheckout(proCheckoutUrl)} className="lp-btn lp-btn-secondary">
                  Choose
                </button>
                <ul className="lp-plan-list">
                  {PLAN_FEATURES.map((f) => (
                    <li key={f}><Check className="w-3.5 h-3.5" strokeWidth={2.2} /> {f}</li>
                  ))}
                </ul>
              </div>

              <div className="lp-plan">
                <div className="lp-plan-name">Yearly</div>
                <div className="lp-plan-sub">Save about 33%.</div>
                <div className="lp-plan-price">
                  <span className="lp-plan-amount lp-tnum">$159</span>
                  <span className="lp-plan-period">/ yr</span>
                </div>
                <div className="lp-plan-after">$13.25 / month</div>
                <button onClick={() => openPlanCheckout(businessCheckoutUrl || proCheckoutUrl)} className="lp-btn lp-btn-secondary">
                  Choose
                </button>
                <ul className="lp-plan-list">
                  {PLAN_FEATURES.map((f) => (
                    <li key={f}><Check className="w-3.5 h-3.5" strokeWidth={2.2} /> {f}</li>
                  ))}
                </ul>
              </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="lp-section">
        <div className="lp-shell">
          <div className="lp-row-2">
            <div>
              <h2 className="lp-h2">FAQ</h2>
              <p className="lp-body" style={{ marginTop: '1rem' }}>
                Email us at <a href="mailto:support@sixsevencreator.com">support@sixsevencreator.com</a> if
                you don't see it here. We read everything.
              </p>
            </div>

            <div className="lp-faq">
              {FAQS.map((f, i) => (
                <div key={i} className={`lp-faq-row ${openFaq === i ? 'is-open' : ''}`}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="lp-faq-trigger"
                    aria-expanded={openFaq === i}
                  >
                    <span>{f.q}</span>
                    <Plus className="w-4 h-4 lp-faq-icon" />
                  </button>
                  <div className="lp-faq-answer">
                    <p>{f.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="lp-footer">
        <div className="lp-shell">
          <div className="lp-footer-top">
            <div>
              <span className="lp-brand" style={{ cursor: 'default' }}>
                <span className="lp-brand-wordmark">sixsevencreator</span>
              </span>
              <p className="lp-footer-tagline">
                Card to crypto for creators. Small team, Lisbon and Brooklyn.
              </p>
            </div>
            <div className="lp-footer-col">
              <p className="lp-footer-col-h">Product</p>
              <a>Features</a>
              <a>Pricing</a>
              <a>Changelog</a>
            </div>
            <div className="lp-footer-col">
              <p className="lp-footer-col-h">Company</p>
              <a>About</a>
              <a>Press kit</a>
              <a href="mailto:support@sixsevencreator.com">Email us</a>
            </div>
            <div className="lp-footer-col">
              <p className="lp-footer-col-h">Legal</p>
              <a>Terms</a>
              <a>Privacy</a>
              <a>DMCA</a>
            </div>
          </div>
          <div className="lp-footer-bottom">
            <span>© {year} SixSevenCreator</span>
            <a href="mailto:support@sixsevencreator.com" style={{ color: 'inherit' }}>support@sixsevencreator.com</a>
          </div>
        </div>
      </footer>

      {/* ─── Cookie nudge ─── */}
      {!showCookies ? (
        <button
          onClick={() => setShowCookies(true)}
          className="lp-cookie-fab"
          aria-label="Cookie settings"
        >
          <Cookie className="w-3.5 h-3.5" />
        </button>
      ) : (
        <div className="lp-cookie-popup" role="dialog">
          <div className="lp-cookie-head">
            <h4>Cookies</h4>
            <button onClick={() => setShowCookies(false)} aria-label="Close">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p>One cookie to keep you signed in, one for anonymous traffic stats. That's it.</p>
          <div className="lp-cookie-actions">
            <button onClick={() => setShowCookies(false)} className="lp-btn lp-btn-primary lp-btn-sm lp-btn-block">Accept</button>
            <button onClick={() => setShowCookies(false)} className="lp-btn lp-btn-secondary lp-btn-sm lp-btn-block">Essentials only</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;
