import { Link, useLocation } from 'wouter';
import { Heart, Menu, X, LogOut, User, LogIn, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useWishlistCount } from '../hooks/useWishlist';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { user, logout, isAuthenticated } = useAuth();
  const { data: countData } = useWishlistCount(isAuthenticated);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setLocation('/');
    setMobileMenuOpen(false);
    setProfileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center space-x-2 text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
              <Heart className="w-6 h-6 fill-current" />
              <span>Buzdealz</span>
            </a>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Deals Link */}
            <Link href="/">
              <a
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  location === '/'
                    ? 'text-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                Deals
                {location === '/' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full" />
                )}
              </a>
            </Link>

            {/* Wishlist Link with Icon */}
            <Link href="/wishlist">
              <a
                className={`relative px-3 py-2 text-sm font-medium transition-colors flex items-center gap-2 ${
                  location === '/wishlist'
                    ? 'text-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>Wishlist</span>
                {countData && countData.count > 0 && (
                  <span className="bg-primary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {countData.count}
                  </span>
                )}
                {location === '/wishlist' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full" />
                )}
              </a>
            </Link>

            {/* Auth Section - Desktop */}
            {user ? (
              <div className="relative pl-4 border-l border-gray-200" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-600" />
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 animate-fade-in">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.email}</p>
                      {user.isSubscriber && (
                        <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                          Premium Member
                        </span>
                      )}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <Link href="/login">
                  <a className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </a>
                </Link>
                <Link href="/signup">
                  <a className="btn-primary text-sm px-4 py-1.5">
                    Sign Up
                  </a>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 animate-fade-in">
            {/* User Info - Mobile */}
            {user && (
              <div className="px-4 py-3 mb-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-900">{user.email}</span>
                  {user.isSubscriber && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                      Premium
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">{user.email}</p>
              </div>
            )}

            {/* Deals Link */}
            <Link href="/">
              <a
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location === '/'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Deals
              </a>
            </Link>

            {/* Wishlist Link */}
            <Link href="/wishlist">
              <a
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location === '/wishlist'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    <span>Wishlist</span>
                  </div>
                  {countData && countData.count > 0 && (
                    <span className="bg-primary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {countData.count}
                    </span>
                  )}
                </div>
              </a>
            </Link>

            {/* Auth Buttons - Mobile */}
            <div className="pt-2 mt-2 border-t border-gray-200 space-y-2">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              ) : (
                <>
                  <Link href="/login">
                    <a
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <LogIn className="w-4 h-4" />
                        <span>Login</span>
                      </div>
                    </a>
                  </Link>
                  <Link href="/signup">
                    <a
                      onClick={() => setMobileMenuOpen(false)}
                      className="block btn-primary text-sm text-center"
                    >
                      Sign Up
                    </a>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
