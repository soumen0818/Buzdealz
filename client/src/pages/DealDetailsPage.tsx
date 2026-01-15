import { useParams, useLocation, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ExternalLink, Loader2, AlertCircle, Tag, Store, Calendar, TrendingDown } from 'lucide-react';
import WishlistButton from '../components/WishlistButton';
import api from '../lib/axios';
import type { Deal } from '../types';

export default function DealDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();

  const { data: deal, isLoading, error } = useQuery<Deal>({
    queryKey: ['deal', id],
    queryFn: async () => {
      const response = await api.get<{ deal: Deal }>(`/deals/${id}`);
      return response.data.deal;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto" />
          <p className="text-gray-600">Loading deal details...</p>
        </div>
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900">Deal not found</h2>
          <p className="text-gray-600">This deal may have been removed or doesn't exist.</p>
          <Link href="/">
            <a className="btn-primary inline-flex mx-auto">
              Back to Deals
            </a>
          </Link>
        </div>
      </div>
    );
  }

  const isExpired = deal.expiresAt ? new Date(deal.expiresAt) < new Date() : false;
  const isDisabled = !deal.isActive;

  return (
    <div className="animate-fade-in max-w-6xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => setLocation('/')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Deals</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="relative">
          <div className="card overflow-hidden">
            <img
              src={deal.imageUrl || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=600&fit=crop'}
              alt={deal.title}
              className="w-full h-96 lg:h-[500px] object-cover"
            />
            {deal.discountPercentage && deal.discountPercentage > 0 && (
              <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                -{deal.discountPercentage}% OFF
              </div>
            )}
            {(isExpired || isDisabled) && (
              <div className="absolute inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <p className="text-white text-2xl font-bold">
                    {isExpired ? 'Deal Expired' : 'No Longer Available'}
                  </p>
                  <p className="text-gray-300 text-sm">This offer has ended</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          {/* Category Badge */}
          {deal.category && (
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-gray-500" />
              <span className="badge bg-primary-100 text-primary-700">{deal.category}</span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900">{deal.title}</h1>

          {/* Price Section */}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-primary-600">${deal.price}</span>
            {deal.originalPrice && (
              <span className="text-2xl text-gray-400 line-through">${deal.originalPrice}</span>
            )}
          </div>

          {/* Savings */}
          {deal.originalPrice && parseFloat(deal.originalPrice) > parseFloat(deal.price) && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
              <TrendingDown className="w-5 h-5" />
              <span className="font-semibold">
                You save ${(parseFloat(deal.originalPrice) - parseFloat(deal.price)).toFixed(2)}
              </span>
            </div>
          )}

          {/* Description */}
          {deal.description && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Description</h3>
              <p className="text-gray-600 leading-relaxed">{deal.description}</p>
            </div>
          )}

          {/* Merchant */}
          {deal.merchant && (
            <div className="flex items-center gap-2 text-gray-600">
              <Store className="w-5 h-5" />
              <span>Sold by <span className="font-medium text-gray-900">{deal.merchant}</span></span>
            </div>
          )}

          {/* Expiry Date */}
          {deal.expiresAt && (
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-5 h-5" />
              <span>
                {isExpired ? 'Expired on' : 'Valid until'}{' '}
                <span className={`font-medium ${isExpired ? 'text-red-600' : 'text-gray-900'}`}>
                  {new Date(deal.expiresAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <WishlistButton dealId={deal.id} size="lg" showLabel />
            {deal.link && !isExpired && !isDisabled && (
              <a
                href={deal.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-5 h-5" />
                View Deal on Store
              </a>
            )}
          </div>

          {(isExpired || isDisabled) && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                This deal is no longer active. Check out our other amazing deals!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
