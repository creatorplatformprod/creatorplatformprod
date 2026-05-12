import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';

const PLAN_FEATURES = [
  'Unlimited uploads',
  'Card to crypto, native',
  'Custom domain',
  'Real-time analytics',
  'DMCA + 2FA',
  'No platform commission',
  'Cancel anytime',
];

const FREE_FEATURES = [
  'Unlimited uploads',
  'Creator profile',
  'Basic analytics',
  'Email support',
];

const BUSINESS_FEATURES = [
  'Everything in Pro',
  'Billed monthly for 12 months',
  'Lower monthly rate',
  'Card to crypto payouts',
  'Priority support',
  'Cancel anytime',
];

const Pricing = () => {
  const navigate = useNavigate();
  const proCheckoutUrl = String(import.meta.env.VITE_BILLING_PRO_URL || '').trim();
  const businessCheckoutUrl = String(import.meta.env.VITE_BILLING_BUSINESS_URL || '').trim();

  const handleStartTrial = () => navigate('/');
  const handleCheckoutPro = () => proCheckoutUrl && window.open(proCheckoutUrl, '_blank', 'noopener,noreferrer');
  const handleCheckoutBusiness = () => businessCheckoutUrl && window.open(businessCheckoutUrl, '_blank', 'noopener,noreferrer');

  return (
    <div className="lp-canvas vault-ui">
      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <button onClick={() => navigate('/')} className="lp-btn lp-btn-ghost lp-btn-sm">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
          <button onClick={() => navigate('/')} className="lp-brand">
            <span className="lp-brand-mark">67</span>
            <span className="lp-brand-tag">/ creator</span>
          </button>
          <span className="lp-nav-link" style={{ pointerEvents: 'none' }}>Pricing</span>
        </div>
      </nav>

      <main className="lp-shell" style={{ paddingTop: '3.5rem', paddingBottom: '5rem' }}>
        <header style={{ marginBottom: '3rem', maxWidth: '720px' }}>
          <p className="lp-section-label lp-mono">03 — Pricing</p>
          <h1 className="lp-h1" style={{ marginTop: '0.6rem' }}>
            Simple pricing
          </h1>
          <p className="lp-body" style={{ marginTop: '1.25rem' }}>
            One free month, then $19.99. Card → crypto on every tier. No commission on what fans pay.
          </p>
        </header>

        <div className="lp-plans">
          <div className="lp-plan">
            <div className="lp-plan-name">Free trial</div>
            <div className="lp-plan-sub">Try the platform, no card asked.</div>
            <div className="lp-plan-price">
              <span className="lp-plan-amount lp-tnum">$0</span>
              <span className="lp-plan-period">30 days</span>
            </div>
            <div className="lp-plan-after">Full Pro features included</div>
            <button onClick={handleStartTrial} className="lp-btn lp-btn-secondary">
              Start free trial
            </button>
            <ul className="lp-plan-list">
              {FREE_FEATURES.map((f) => (
                <li key={f}><Check className="w-3.5 h-3.5" strokeWidth={2.2} /> {f}</li>
              ))}
            </ul>
          </div>

          <div className="lp-plan lp-plan-featured">
            <div className="lp-plan-name">Pro</div>
            <div className="lp-plan-sub">Everything to publish, paid in crypto.</div>
            <div className="lp-plan-price">
              <span className="lp-plan-amount lp-tnum">$9.99</span>
              <span className="lp-plan-period">/ mo</span>
            </div>
            <div className="lp-plan-after">After the first 30 days</div>
            <button
              onClick={handleCheckoutPro}
              disabled={!proCheckoutUrl}
              className="lp-btn lp-btn-primary"
            >
              Get Pro
            </button>
            <ul className="lp-plan-list">
              {PLAN_FEATURES.map((f) => (
                <li key={f}><Check className="w-3.5 h-3.5" strokeWidth={2.2} /> {f}</li>
              ))}
            </ul>
          </div>

          <div className="lp-plan">
            <div className="lp-plan-name">Business</div>
            <div className="lp-plan-sub">Best value for committed creators.</div>
            <div className="lp-plan-price">
              <span className="lp-plan-amount lp-tnum">$4.99</span>
              <span className="lp-plan-period">/ mo</span>
            </div>
            <div className="lp-plan-after">12-month commitment</div>
            <button
              onClick={handleCheckoutBusiness}
              disabled={!businessCheckoutUrl}
              className="lp-btn lp-btn-secondary"
            >
              Get Business
            </button>
            <ul className="lp-plan-list">
              {BUSINESS_FEATURES.map((f) => (
                <li key={f}><Check className="w-3.5 h-3.5" strokeWidth={2.2} /> {f}</li>
              ))}
            </ul>
          </div>
        </div>

        <p className="lp-body" style={{ marginTop: '3rem', fontSize: '0.8125rem' }}>
          Questions? <a href="mailto:support@sixsevencreator.com">support@sixsevencreator.com</a>
        </p>
      </main>
    </div>
  );
};

export default Pricing;
