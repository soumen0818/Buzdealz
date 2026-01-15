export interface Deal {
  id: string;
  title: string;
  description: string | null;
  price: string;
  originalPrice: string;
  imageUrl: string | null;
  category: string | null;
  merchant: string | null;
  link: string | null;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  isExpired?: boolean;
  isDisabled?: boolean;
  discountPercentage?: number;
}

export interface WishlistItem {
  id: string;
  dealId: string;
  alertEnabled: boolean;
  createdAt: string;
  deal: Deal | null;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isSubscriber: boolean;
}

export interface WishlistResponse {
  wishlist: WishlistItem[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

export interface ApiError {
  error: string;
  code?: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}
