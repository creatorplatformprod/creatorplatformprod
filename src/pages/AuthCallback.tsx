import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('Signing you in...');

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      setMessage('Authentication failed. Please try again.');
      setTimeout(() => navigate('/'), 1500);
      return;
    }

    if (!token) {
      setMessage('No token received. Redirecting...');
      setTimeout(() => navigate('/'), 1500);
      return;
    }

    localStorage.setItem('token', token);
    setMessage('Success! Redirecting to dashboard...');
    setTimeout(() => navigate('/dashboard'), 500);
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="post-card rounded-xl p-6 sm:p-8 text-center max-w-md w-full">
        <h1 className="text-xl sm:text-2xl font-semibold mb-3">Signing in</h1>
        <p className="text-sm sm:text-base text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

export default AuthCallback;
