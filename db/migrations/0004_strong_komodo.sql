ALTER TABLE "resume" ALTER COLUMN "resume_id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "resume" ADD COLUMN "customization" jsonb;