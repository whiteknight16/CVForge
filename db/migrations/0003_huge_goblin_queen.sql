-- First, drop the primary key constraint
ALTER TABLE "resume" DROP CONSTRAINT IF EXISTS "resume_pkey";

-- Add a new UUID column (no default - we'll use UUIDs from URL)
ALTER TABLE "resume" ADD COLUMN "resume_id_new" uuid;

-- Generate UUIDs for existing rows (if any) - only for existing data
UPDATE "resume" SET "resume_id_new" = gen_random_uuid() WHERE "resume_id_new" IS NULL;

-- Drop the old serial column
ALTER TABLE "resume" DROP COLUMN "resume_id";

-- Rename the new column
ALTER TABLE "resume" RENAME COLUMN "resume_id_new" TO "resume_id";

-- Make it NOT NULL and set as primary key (no default - UUID comes from URL)
ALTER TABLE "resume" ALTER COLUMN "resume_id" SET NOT NULL;
ALTER TABLE "resume" ADD PRIMARY KEY ("resume_id");
