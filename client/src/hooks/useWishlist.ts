import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import type { WishlistResponse, WishlistItem } from '../types';

export function useWishlist() {
  return useQuery<WishlistResponse>({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const { data } = await api.get('/wishlist');
      return data;
    },
    retry: false,
    throwOnError: false,
  });
}

export function useWishlistCount(enabled: boolean = true) {
  return useQuery<{ count: number }>({
    queryKey: ['wishlist', 'count'],
    queryFn: async () => {
      const { data } = await api.get('/wishlist/count');
      return data;
    },
    retry: false,
    throwOnError: false,
    placeholderData: { count: 0 },
    enabled, // Only fetch if enabled (i.e., user is authenticated)
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      dealId,
      alertEnabled = false,
    }: {
      dealId: string;
      alertEnabled?: boolean;
    }) => {
      const { data } = await api.post('/wishlist', { dealId, alertEnabled });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
}

export function useUpdateWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      dealId,
      alertEnabled,
    }: {
      dealId: string;
      alertEnabled: boolean;
    }) => {
      const { data } = await api.patch(`/wishlist/${dealId}`, { alertEnabled });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dealId: string) => {
      await api.delete(`/wishlist/${dealId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
}

export function useIsInWishlist(dealId: string): boolean {
  const { data } = useWishlist();
  return data?.wishlist.some((item) => item.dealId === dealId) ?? false;
}
