import { ExternalLink, Calendar, Tag, AlertCircle, Eye } from 'lucide-react';
import { Link } from 'wouter';
import type { Deal } from '../types';
import WishlistButton from './WishlistButton';

interface DealCardProps {
  deal: Deal;
  onClick?: () => void;
}

export default function DealCard({ deal, onClick }: DealCardProps) {
  const discount = deal.discountPercentage || 0;
  const isExpired = deal.isExpired || deal.isDisabled;

  const formatDate = (date: string | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div
      onClick={onClick}
      className="card-hover cursor-pointer group animate-fade-in"
    >
      {/* Image */}
      <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {deal.imageUrl ? (
          <img
            src={deal.imageUrl}
            alt={deal.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Tag className="w-16 h-16 text-gray-400" />
          </div>
        )}

        {/* Discount Badge */}
        {discount > 0 && !isExpired && (
          <div className="absolute top-3 left-3">
            <span className="badge bg-red-600 text-white text-sm font-bold px-3 py-1 shadow-lg">
              {discount}% OFF
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <div className="absolute top-3 right-3">
          <WishlistButton dealId={deal.id} />
        </div>

        {/* Expired Overlay */}
        {isExpired && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="text-center">
              <AlertCircle className="w-8 h-8 text-white mx-auto mb-2" />
              <span className="badge bg-red-600 text-white text-sm font-bold px-4 py-1.5">
                {deal.isDisabled ? 'Unavailable' : 'Expired'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Merchant */}
        {deal.merchant && (
          <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
            {deal.merchant}
          </div>
        )}

        {/* Title */}
        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
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

        {/* Category & Expiry */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          {deal.category && (
            <span className="badge bg-gray-100 text-gray-700">{deal.category}</span>
          )}
          {deal.expiresAt && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Ends {formatDate(deal.expiresAt)}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {!isExpired && (
          <div className="space-y-2 mt-4">
            <Link href={`/deals/${deal.id}`}>
              <a className="btn-primary w-full flex items-center justify-center gap-2">
                <Eye className="w-4 h-4" />
                View Details
              </a>
            </Link>
            {deal.link && (
              <a
                href={deal.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="btn-secondary w-full flex items-center justify-center gap-2 text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                Visit Store
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
