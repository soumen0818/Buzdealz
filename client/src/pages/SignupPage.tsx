import { useState, FormEvent } from 'react';
import { Link, useLocation } from 'wouter';
import { UserPlus, Loader2, AlertCircle, Heart, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/axios';

export default function SignupPage() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubscriber, setIsSubscriber] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/register', {
        name,
        email,
        password,
        isSubscriber,
      });
      
      login(data.token, data.user);
      setLocation('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <a className="inline-flex items-center space-x-2 text-3xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
              <Heart className="w-8 h-8 fill-current" />
              <span>Buzdealz</span>
            </a>
          </Link>
          <p className="mt-2 text-gray-600">Create your account to start saving deals</p>
        </div>

        {/* Signup Card */}
        <div className="card p-8 animate-slide-up">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign Up</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="John Doe"
                disabled={loading}
                minLength={2}
              />
            </div>

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
              <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
            </div>

            {/* Subscriber Option */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={isSubscriber}
                  onChange={(e) => setIsSubscriber(e.target.checked)}
                  disabled={loading}
                  className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <div className="flex-1">
                  <span className="block text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                    Join as Premium Subscriber
                  </span>
                  <p className="text-xs text-gray-600 mt-1">
                    Enable price alerts and get notified when deals drop
                  </p>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login">
              <a className="text-primary-600 hover:text-primary-700 font-medium">
                Log in
              </a>
            </Link>
          </div>

          {/* Features */}
          <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
            <p className="text-xs font-semibold text-gray-700 mb-3">What you get:</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Check className="w-4 h-4 text-green-500" />
                <span>Save unlimited deals</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Check className="w-4 h-4 text-green-500" />
                <span>Wishlist management</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Check className="w-4 h-4 text-green-500" />
                <span>Price drop alerts (subscribers only)</span>
              </div>
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
