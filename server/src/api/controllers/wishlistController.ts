import { Request, Response, NextFunction } from 'express';
import { db } from '../../db';
import { wishlist, deals } from '../../db/schema';
import { eq, and, desc } from 'drizzle-orm';
import type { AddToWishlistInput, UpdateWishlistInput } from '../validators/wishlistValidator';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    isSubscriber: boolean;
  };
}

export class WishlistController {
  async getWishlist(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      // Fetch wishlist items with deal details
      const items = await db
        .select({
          id: wishlist.id,
          dealId: wishlist.dealId,
          alertEnabled: wishlist.alertEnabled,
          createdAt: wishlist.createdAt,
          deal: deals,
        })
        .from(wishlist)
        .leftJoin(deals, eq(wishlist.dealId, deals.id))
        .where(eq(wishlist.userId, userId))
        .orderBy(desc(wishlist.createdAt))
        .limit(limit)
        .offset(offset);

      // Enrich with computed properties
      const enrichedItems = items.map((item) => {
        const now = new Date();
        const isExpired = item.deal?.expiresAt ? new Date(item.deal.expiresAt) < now : false;
        const isDisabled = !item.deal?.isActive;

        return {
          id: item.id,
          dealId: item.dealId,
          alertEnabled: item.alertEnabled,
          createdAt: item.createdAt,
          deal: item.deal ? {
            ...item.deal,
            isExpired,
            isDisabled,
            discountPercentage: calculateDiscount(
              parseFloat(item.deal.originalPrice),
              parseFloat(item.deal.price)
            ),
          } : null,
        };
      });

      return res.json({
        wishlist: enrichedItems,
        pagination: {
          limit,
          offset,
          total: items.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async addToWishlist(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { dealId, alertEnabled } = req.body as AddToWishlistInput;

      // Check if user is subscriber for alert feature
      if (alertEnabled && !req.user?.isSubscriber) {
        return res.status(403).json({
          error: 'Only subscribers can enable price alerts',
          code: 'SUBSCRIBER_ONLY',
        });
      }

      // Verify deal exists and is active
      const [deal] = await db
        .select()
        .from(deals)
        .where(eq(deals.id, dealId))
        .limit(1);

      if (!deal) {
        return res.status(404).json({ error: 'Deal not found' });
      }

      if (!deal.isActive) {
        return res.status(400).json({ error: 'Deal is no longer active' });
      }

      // Idempotent insert (upsert)
      const [item] = await db
        .insert(wishlist)
        .values({
          userId,
          dealId,
          alertEnabled: alertEnabled || false,
        })
        .onConflictDoUpdate({
          target: [wishlist.userId, wishlist.dealId],
          set: { alertEnabled: alertEnabled || false },
        })
        .returning();

      // Track analytics
      await trackAnalytics('wishlist_add', { userId, dealId, alertEnabled });

      return res.status(201).json({
        wishlist: item,
        deal,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateWishlist(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { dealId } = req.params;
      const { alertEnabled } = req.body as UpdateWishlistInput;

      // Check if user is subscriber for alert feature
      if (alertEnabled && !req.user?.isSubscriber) {
        return res.status(403).json({
          error: 'Only subscribers can enable price alerts',
          code: 'SUBSCRIBER_ONLY',
        });
      }

      const [updated] = await db
        .update(wishlist)
        .set({ alertEnabled })
        .where(and(eq(wishlist.userId, userId), eq(wishlist.dealId, dealId)))
        .returning();

      if (!updated) {
        return res.status(404).json({ error: 'Wishlist item not found' });
      }

      await trackAnalytics(alertEnabled ? 'alert_enabled' : 'alert_disabled', {
        userId,
        dealId,
      });

      return res.json({ wishlist: updated });
    } catch (error) {
      next(error);
    }
  }

  async removeFromWishlist(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { dealId } = req.params;

      const [deleted] = await db
        .delete(wishlist)
        .where(and(eq(wishlist.userId, userId), eq(wishlist.dealId, dealId)))
        .returning();

      if (!deleted) {
        return res.status(404).json({ error: 'Wishlist item not found' });
      }

      // Track analytics
      await trackAnalytics('wishlist_remove', { userId, dealId });

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getWishlistCount(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const items = await db
        .select({ id: wishlist.id })
        .from(wishlist)
        .where(eq(wishlist.userId, userId));

      return res.json({ count: items.length });
    } catch (error) {
      next(error);
    }
  }
}

// Helper functions
function calculateDiscount(originalPrice: number, currentPrice: number): number {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

async function trackAnalytics(event: string, data: Record<string, any>) {
  // Implement analytics tracking here
  // For now, just log to console
  console.log(`[Analytics] ${event}:`, data);
  
  // In production, you would send this to your analytics service
  // e.g., Google Analytics, Mixpanel, Segment, etc.
}
