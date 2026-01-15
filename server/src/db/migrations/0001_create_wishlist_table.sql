CREATE TABLE IF NOT EXISTS "wishlist" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid () NOT NULL,
    "user_id" uuid NOT NULL,
    "deal_id" uuid NOT NULL,
    "alert_enabled" boolean DEFAULT false NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "wishlist_user_deal_unique" UNIQUE ("user_id", "deal_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_deal_id_fkey" FOREIGN KEY ("deal_id") REFERENCES "deals"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "wishlist_user_id_idx" ON "wishlist" ("user_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "wishlist_deal_id_idx" ON "wishlist" ("deal_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "wishlist_created_at_idx" ON "wishlist" ("created_at");