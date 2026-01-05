/**
 * Script to manually apply the migration for new user columns
 * Run with: npx tsx scripts/apply-migration.ts
 */

import postgres from 'postgres'

async function applyMigration() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable is not set')
    process.exit(1)
  }

  const client = postgres(databaseUrl)

  try {
    console.log('🔄 Applying migration...')

    // Apply the migration SQL
    await client`
      ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL;
    `
    console.log('✅ Made password column optional')

    await client`
      ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "provider" text DEFAULT 'email';
    `
    console.log('✅ Added provider column')

    await client`
      ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "google_id" text;
    `
    console.log('✅ Added google_id column')

    await client`
      ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "name" text;
    `
    console.log('✅ Added name column')

    await client`
      ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "image" text;
    `
    console.log('✅ Added image column')

    console.log('\n✅ Migration applied successfully!')
    console.log('You can now try Google OAuth again.')
  } catch (error: any) {
    if (error.code === '42701') {
      console.log('⚠️  Column already exists, skipping...')
    } else {
      console.error('❌ Error applying migration:', error.message)
      throw error
    }
  } finally {
    await client.end()
  }
}

applyMigration()

