import { Request, Response, NextFunction } from 'express';
import { db } from '../../db';
import { deals } from '../../db/schema';
import { desc, eq, and, or, sql } from 'drizzle-orm';
import { z } from 'zod';

const createDealSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/),
  originalPrice: z.string().regex(/^\d+(\.\d{1,2})?$/),
  imageUrl: z.string().url().optional(),
  category: z.string().optional(),
  merchant: z.string().optional(),
  link: z.string().url().optional(),
  expiresAt: z.string().datetime().optional(),
});

export class DealsController {
  async getAllDeals(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const category = req.query.category as string;
      const search = req.query.search as string;
      const activeOnly = req.query.activeOnly !== 'false'; // Default true

      // Build where conditions
      const conditions = [];
      
      if (activeOnly) {
        conditions.push(eq(deals.isActive, true));
      }
      
      if (category) {
        conditions.push(eq(deals.category, category));
      }
      
      if (search) {
        conditions.push(
          or(
            sql`LOWER(${deals.title}) LIKE LOWER(${'%' + search + '%'})`,
            sql`LOWER(${deals.description}) LIKE LOWER(${'%' + search + '%'})`
          )
        );
      }

      let query = db.select().from(deals);

      if (conditions.length > 0) {
        query = query.where(and(...conditions)) as any;
      }

      const allDeals = await query
        .orderBy(desc(deals.createdAt))
        .limit(limit)
        .offset(offset);

      // Enrich with computed properties
      const enrichedDeals = allDeals.map((deal) => {
        const now = new Date();
        const isExpired = deal.expiresAt ? new Date(deal.expiresAt) < now : false;
        const discount = calculateDiscount(
          parseFloat(deal.originalPrice),
          parseFloat(deal.price)
        );

        return {
          ...deal,
          isExpired,
          isDisabled: !deal.isActive,
          discountPercentage: discount,
        };
      });

      return res.json({
        deals: enrichedDeals,
        pagination: {
          limit,
          offset,
          total: enrichedDeals.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getDealById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const [deal] = await db
        .select()
        .from(deals)
        .where(eq(deals.id, id))
        .limit(1);

      if (!deal) {
        return res.status(404).json({ error: 'Deal not found' });
      }

      const now = new Date();
      const isExpired = deal.expiresAt ? new Date(deal.expiresAt) < now : false;
      const discount = calculateDiscount(
        parseFloat(deal.originalPrice),
        parseFloat(deal.price)
      );

      return res.json({
        deal: {
          ...deal,
          isExpired,
          isDisabled: !deal.isActive,
          discountPercentage: discount,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async createDeal(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createDealSchema.parse(req.body);

      const [newDeal] = await db
        .insert(deals)
        .values({
          ...data,
          expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        })
        .returning();

      return res.status(201).json({ deal: newDeal });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid input', details: error.errors });
      }
      next(error);
    }
  }
}

function calculateDiscount(originalPrice: number, currentPrice: number): number {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}
