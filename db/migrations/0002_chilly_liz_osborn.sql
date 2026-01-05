ALTER TABLE "resume" RENAME COLUMN "skils" TO "skills";--> statement-breakpoint
ALTER TABLE "resume" ADD COLUMN "order" jsonb;