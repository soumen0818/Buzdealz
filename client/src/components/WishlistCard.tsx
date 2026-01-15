import { Bell, BellOff, Trash2, AlertCircle, Calendar, ExternalLink, Tag, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useRemoveFromWishlist, useUpdateWishlist } from '../hooks/useWishlist';
import type { WishlistItem } from '../types';

interface WishlistCardProps {
  item: WishlistItem;
}

export default function WishlistCard({ item }: WishlistCardProps) {
  const removeMutation = useRemoveFromWishlist();
  const updateMutation = useUpdateWishlist();
  const [showAlertError, setShowAlertError] = useState(false);

  const { deal } = item;
  if (!deal) return null;

  const isExpired = deal.isExpired || deal.isDisabled;
  const discount = deal.discountPercentage || 0;

  const formatDate = (date: string | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleToggleAlert = async () => {
    try {
      setShowAlertError(false);
      await updateMutation.mutateAsync({
        dealId: deal.id,
        alertEnabled: !item.alertEnabled,
      });
    } catch (error: any) {
      if (error.response?.data?.code === 'SUBSCRIBER_ONLY') {
        setShowAlertError(true);
        setTimeout(() => setShowAlertError(false), 5000);
      }
    }
  };

  const handleRemove = async () => {
    if (window.confirm('Remove this deal from your wishlist?')) {
      await removeMutation.mutateAsync(deal.id);
    }
  };

  return (
    <div className="card animate-slide-up">
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        {/* Image */}
        <div className="relative w-full sm:w-48 aspect-video sm:aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0">
          {deal.imageUrl ? (
            <img
              src={deal.imageUrl}
              alt={deal.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Tag className="w-12 h-12 text-gray-400" />
            </div>
          )}

          {/* Discount Badge */}
          {discount > 0 && !isExpired && (
            <div className="absolute top-2 left-2">
              <span className="badge bg-red-600 text-white text-xs font-bold px-2 py-1 shadow-lg">
                {discount}% OFF
              </span>
            </div>
          )}

          {/* Expired Overlay */}
          {isExpired && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="badge bg-red-600 text-white text-sm font-bold px-3 py-1">
                {deal.isDisabled ? 'Unavailable' : 'Expired'}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div className="space-y-2">
            {/* Merchant */}
            {deal.merchant && (
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                {deal.merchant}
              </div>
            )}

            {/* Title */}
            <h3 className="font-semibold text-gray-900 text-lg line-clamp-2">
              {deal.title}
            </h3>

            {/* Description */}
            {deal.description && (
              <p className="text-sm text-gray-600 line-clamp-2">{deal.description}</p>
            )}

            {/* Pricing */}
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary-600">
                ${parseFloat(deal.price).toFixed(2)}
              </span>
              {parseFloat(deal.originalPrice) > parseFloat(deal.price) && (
                <span className="text-sm text-gray-400 line-through">
                  ${parseFloat(deal.originalPrice).toFixed(2)}
                </span>
              )}
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
              {deal.category && (
                <span className="badge bg-gray-100 text-gray-700">{deal.category}</span>
              )}
              {deal.expiresAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Ends {formatDate(deal.expiresAt)}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Added {formatDate(item.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Alert Status */}
          {!isExpired && (
            <div className="mt-4">
              <button
                onClick={handleToggleAlert}
                disabled={updateMutation.isPending}
                className={`
                  inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                  ${
                    item.alertEnabled
                      ? 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {updateMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : item.alertEnabled ? (
                  <Bell className="w-4 h-4 fill-current" />
                ) : (
                  <BellOff className="w-4 h-4" />
                )}
                <span>{item.alertEnabled ? 'Alerts On' : 'Enable Alerts'}</span>
              </button>

              {showAlertError && (
                <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Subscribe to enable price alerts
                </p>
              )}
            </div>
          )}

          {/* Warning for Expired */}
          {isExpired && (
            <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>This deal is no longer available</span>
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            {!isExpired && deal.link && (
              <a
                href={deal.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <span>View Deal</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            <button
              onClick={handleRemove}
              disabled={removeMutation.isPending}
              className="btn-secondary flex items-center gap-2 px-4"
            >
              {removeMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Remove</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
