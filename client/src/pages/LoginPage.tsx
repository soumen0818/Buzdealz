import { useState, FormEvent } from 'react';
import { Link, useLocation } from 'wouter';
import { LogIn, Loader2, AlertCircle, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/axios';

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      login(data.token, data.user);
      setLocation('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <a className="inline-flex items-center space-x-2 text-3xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
              <Heart className="w-8 h-8 fill-current" />
              <span>Buzdealz</span>
            </a>
          </Link>
          <p className="mt-2 text-gray-600">Welcome back! Log in to your account</p>
        </div>

        {/* Login Card */}
        <div className="card p-8 animate-slide-up">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Log In</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                disabled={loading}
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Log In</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup">
              <a className="text-primary-600 hover:text-primary-700 font-medium">
                Sign up
              </a>
            </Link>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs font-semibold text-gray-700 mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p>📧 user@example.com</p>
              <p>🔑 password123</p>
              <p className="mt-2 pt-2 border-t border-gray-200">
                Or try subscriber@example.com for premium features
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-4 text-center">
          <Link href="/">
            <a className="text-sm text-gray-600 hover:text-gray-900">
              ← Back to Home
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
