CREATE TABLE IF NOT EXISTS "users" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid () NOT NULL,
    "email" varchar(255) NOT NULL,
    "name" varchar(255) NOT NULL,
    "password" varchar(255) NOT NULL,
    "is_subscriber" boolean DEFAULT false NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "users_email_unique" UNIQUE ("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "deals" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid () NOT NULL,
    "title" varchar(255) NOT NULL,
    "description" text,
    "price" numeric(10, 2) NOT NULL,
    "original_price" numeric(10, 2) NOT NULL,
    "image_url" varchar(500),
    "category" varchar(100),
    "merchant" varchar(255),
    "link" varchar(500),
    "is_active" boolean DEFAULT true NOT NULL,
    "expires_at" timestamp,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users" ("email");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "deals_category_idx" ON "deals" ("category");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "deals_merchant_idx" ON "deals" ("merchant");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "deals_is_active_idx" ON "deals" ("is_active");