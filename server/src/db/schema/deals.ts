import { pgTable, uuid, varchar, text, numeric, boolean, timestamp } from 'drizzle-orm/pg-core';

export const deals = pgTable('deals', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  originalPrice: numeric('original_price', { precision: 10, scale: 2 }).notNull(),
  imageUrl: varchar('image_url', { length: 500 }),
  category: varchar('category', { length: 100 }),
  merchant: varchar('merchant', { length: 255 }),
  link: varchar('link', { length: 500 }),
  isActive: boolean('is_active').default(true).notNull(),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Deal = typeof deals.$inferSelect;
export type NewDeal = typeof deals.$inferInsert;
