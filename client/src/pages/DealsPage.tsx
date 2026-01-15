import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, Loader2, AlertCircle } from 'lucide-react';
import DealCard from '../components/DealCard';
import api from '../lib/axios';
import type { Deal } from '../types';

export default function DealsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Fetch deals from API
  const { data, isLoading, error } = useQuery({
    queryKey: ['deals', selectedCategory, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);
      params.append('activeOnly', 'true');
      
      const response = await api.get<{ deals: Deal[] }>(`/deals?${params}`);
      return response.data.deals;
    },
    staleTime: 30000, // 30 seconds
  });

  const deals = data || [];
  const categories = ['all', ...new Set(deals.map((d) => d.category).filter(Boolean))] as string[];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Hot Deals</h1>
        <p className="text-gray-600">Discover amazing deals and save big on your favorite products</p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search deals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-12 w-full max-w-md"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-gray-700">
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-sm font-medium">Filter:</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category as string)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {(category as string).charAt(0).toUpperCase() + (category as string).slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      {!isLoading && !error && (
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            {deals.length} {deals.length === 1 ? 'deal' : 'deals'} found
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-32">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto" />
            <p className="text-gray-600">Loading amazing deals...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center py-32">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Failed to load deals</h2>
            <p className="text-gray-600">
              {error instanceof Error ? error.message : 'Something went wrong. Please try again.'}
            </p>
          </div>
        </div>
      )}

      {/* Deals Grid */}
      {!isLoading && !error && deals.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && deals.length === 0 && (
        <div className="flex items-center justify-center py-32">
          <div className="text-center space-y-4">
            <Search className="w-16 h-16 text-gray-300 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">No deals found</h2>
            <p className="text-gray-600">
              Try adjusting your search or filters to find what you're looking for
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="btn-primary mx-auto mt-4"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
