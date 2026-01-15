import { pgTable, uuid, timestamp, boolean, index } from 'drizzle-orm/pg-core';
import { users } from './users'; // Import your existing users table
import { deals } from './deals'; // Import your existing deals table

/**
 * Wishlist Table Schema
 * Stores user's saved deals with optional price alert functionality
 */
export const wishlist = pgTable(
  'wishlist',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    dealId: uuid('deal_id')
      .notNull()
      .references(() => deals.id, { onDelete: 'cascade' }),
    alertEnabled: boolean('alert_enabled').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    // Indexes for performance optimization
    userIdIdx: index('wishlist_user_id_idx').on(table.userId),
    dealIdIdx: index('wishlist_deal_id_idx').on(table.dealId),
    createdAtIdx: index('wishlist_created_at_idx').on(table.createdAt),
  })
);

// TypeScript type inference
export type Wishlist = typeof wishlist.$inferSelect;
export type NewWishlist = typeof wishlist.$inferInsert;
