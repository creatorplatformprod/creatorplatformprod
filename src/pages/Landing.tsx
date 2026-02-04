import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen feed-bg flex items-center justify-center">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          
          {/* Left Side - Happy Creator Image */}
          <div className="flex-1 hidden lg:block">
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Happy creator looking at phone"
                className="w-full max-w-md mx-auto rounded-2xl shadow-2xl object-cover"
                style={{ aspectRatio: '3/4' }}
              />
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Right - Auth Form with 67 on top */}
          <div className="w-full max-w-md relative">
            {/* 67 Behind the form - centered on top, 77% opacity */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 -top-16 sm:-top-20 select-none pointer-events-none z-0"
              style={{ opacity: 0.77 }}
            >
              <span 
                className="text-[140px] sm:text-[180px] lg:text-[200px] font-black leading-none"
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

            {/* Form Card */}
            <div className="relative z-10 post-card rounded-2xl p-5 sm:p-6 md:p-8 shadow-2xl border border-border/60 bg-background/95 backdrop-blur-sm mt-16 sm:mt-20">
              {/* Tabs */}
              <div className="flex gap-2 mb-5">
                <Button
                  variant={!isLogin ? 'default' : 'ghost'}
                  onClick={() => setIsLogin(false)}
                  className="flex-1 text-sm sm:text-base"
                >
                  Sign Up
                </Button>
                <Button
                  variant={isLogin ? 'default' : 'ghost'}
                  onClick={() => setIsLogin(true)}
                  className="flex-1 text-sm sm:text-base"
                >
                  Login
                </Button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                {!isLogin && (
                  <>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-foreground mb-1.5 block">
                        Username
                      </label>
                      <Input
                        type="text"
                        placeholder="Choose a username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                        disabled={loading}
                        className="text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-foreground mb-1.5 block">
                        Display Name
                      </label>
                      <Input
                        type="text"
                        placeholder="Your display name"
                        value={formData.displayName}
                        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                        required
                        disabled={loading}
                        className="text-sm sm:text-base"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="text-xs sm:text-sm font-medium text-foreground mb-1.5 block">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={loading}
                    className="text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-medium text-foreground mb-1.5 block">
                    Password
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    disabled={loading}
                    className="text-sm sm:text-base"
                  />
                </div>

                <Button type="submit" className="w-full text-sm sm:text-base" size="lg" disabled={loading}>
                  {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Get Started')}
                  {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </form>

              <div className="mt-5">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-3 text-muted-foreground">or</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-4 text-sm sm:text-base"
                  onClick={handleGoogleAuth}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" viewBox="0 0 24 24">
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

              <p className="text-[10px] sm:text-xs text-muted-foreground text-center mt-5">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
