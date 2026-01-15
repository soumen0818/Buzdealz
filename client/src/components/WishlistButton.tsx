import { Heart, Loader2 } from 'lucide-react';
import { useAddToWishlist, useRemoveFromWishlist, useIsInWishlist } from '../hooks/useWishlist';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'wouter';
import { useState } from 'react';

interface WishlistButtonProps {
  dealId: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function WishlistButton({ dealId, size = 'md', showLabel = false }: WishlistButtonProps) {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const isInWishlist = useIsInWishlist(dealId);
  const addMutation = useAddToWishlist();
  const removeMutation = useRemoveFromWishlist();
  const [isAnimating, setIsAnimating] = useState(false);

  const isLoading = addMutation.isPending || removeMutation.isPending;

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    // Check if user is authenticated
    if (!isAuthenticated) {
      alert('Please login to add items to your wishlist');
      setLocation('/login');
      return;
    }

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);

    try {
      if (isInWishlist) {
        await removeMutation.mutateAsync(dealId);
      } else {
        await addMutation.mutateAsync({ dealId });
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        ${showLabel ? 'px-4 py-2 rounded-lg' : `${sizeClasses[size]} rounded-full`}
        flex items-center justify-center gap-2
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${isAnimating ? 'scale-110' : 'scale-100'}
        ${
          isInWishlist
            ? 'bg-red-50 text-red-600 hover:bg-red-100'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }
      `}
      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {isLoading ? (
        <Loader2 className={`${iconSizes[size]} animate-spin`} />
      ) : (
        <Heart
          className={`${iconSizes[size]} transition-all ${
            isInWishlist ? 'fill-current scale-110' : 'scale-100'
          }`}
        />
      )}
      {showLabel && (
        <span className="font-medium">{isInWishlist ? 'Saved' : 'Save Deal'}</span>
      )}
    </button>
  );
}
