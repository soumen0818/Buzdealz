import { Heart, Loader2, AlertCircle, LogIn } from 'lucide-react';
import { Link } from 'wouter';
import { useWishlist } from '../hooks/useWishlist';
import { useAuth } from '../contexts/AuthContext';
import WishlistCard from '../components/WishlistCard';

export default function WishlistPage() {
  const { isAuthenticated } = useAuth();
  const { data, isLoading, error } = useWishlist();

  // If user is not logged in, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center space-y-6 max-w-md">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-primary-50 rounded-full">
            <Heart className="w-12 h-12 text-primary-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Login to view your wishlist</h2>
          <p className="text-gray-600">
            Sign in to save your favorite deals and get notified about price drops
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/login">
              <a className="btn-primary inline-flex items-center gap-2">
                <LogIn className="w-5 h-5" />
                Login
              </a>
            </Link>
            <Link href="/signup">
              <a className="btn-secondary inline-flex">
                Sign Up
              </a>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto" />
          <p className="text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900">Failed to load wishlist</h2>
          <p className="text-gray-600">
            {(error as any)?.response?.data?.error || 'Something went wrong. Please try again.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary mx-auto"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const wishlist = data?.wishlist || [];

  if (wishlist.length === 0) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center space-y-6 max-w-md">
          <div className="relative">
            <Heart className="w-32 h-32 text-gray-200 mx-auto" />
            <Heart className="w-16 h-16 text-gray-300 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Your wishlist is empty</h2>
          <p className="text-gray-600">
            Start saving your favorite deals to keep track of amazing offers!
          </p>
          <Link href="/">
            <a className="btn-primary inline-flex mx-auto">
              Browse Deals
            </a>
          </Link>
        </div>
      </div>
    );
  }

  const activeDeals = wishlist.filter((item) => !item.deal?.isExpired && !item.deal?.isDisabled);
  const expiredDeals = wishlist.filter((item) => item.deal?.isExpired || item.deal?.isDisabled);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Wishlist</h1>
        <p className="text-gray-600">
          {wishlist.length} {wishlist.length === 1 ? 'deal' : 'deals'} saved
          {activeDeals.length > 0 && ` • ${activeDeals.length} active`}
        </p>
      </div>

      {/* Active Deals */}
      {activeDeals.length > 0 && (
        <div className="space-y-4 mb-8">
          {activeDeals.map((item) => (
            <WishlistCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Expired Deals Section */}
      {expiredDeals.length > 0 && (
        <div className="mt-12">
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-gray-400" />
              Expired Deals
            </h2>
            <p className="text-gray-600 mb-6">
              These deals are no longer available
            </p>
            <div className="space-y-4 opacity-75">
              {expiredDeals.map((item) => (
                <WishlistCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
