ALTER TABLE "users" ADD COLUMN "dietary_preferences" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "allergies" jsonb DEFAULT '[]'::jsonb NOT NULL;