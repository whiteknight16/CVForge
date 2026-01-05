/**
 * Test database connection script
 * Run with: npx tsx scripts/test-db-connection.ts
 * Or: ts-node scripts/test-db-connection.ts
 */

import postgres from "postgres";

async function testConnection() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("❌ DATABASE_URL environment variable is not set");
    console.log("\nPlease create a .env file with:");
    console.log("DATABASE_URL=postgresql://username:password@localhost:5432/database_name");
    process.exit(1);
  }

  console.log("🔍 Testing database connection...");
  console.log("📍 Connection string:", databaseUrl.replace(/:[^:@]+@/, ":****@"));

  try {
    const client = postgres(databaseUrl, {
      max: 1, // Only one connection for testing
    });

    // Test the connection
    const result = await client`SELECT version()`;
    console.log("✅ Connection successful!");
    console.log("📊 PostgreSQL version:", result[0].version);

    await client.end();
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Connection failed!");
    
    if (error.code === '28P01') {
      console.error("\n🔐 Authentication failed. Please check:");
      console.error("  - Username is correct");
      console.error("  - Password is correct");
      console.error("  - User has access to the database");
    } else if (error.code === 'ECONNREFUSED') {
      console.error("\n🔌 Cannot connect to database server. Please check:");
      console.error("  - PostgreSQL is running");
      console.error("  - Host and port are correct (default: localhost:5432)");
    } else if (error.code === '3D000') {
      console.error("\n📦 Database does not exist. Please create it first:");
      console.error("  CREATE DATABASE your_database_name;");
    } else {
      console.error("\n❌ Error:", error.message);
    }
    
    process.exit(1);
  }
}

testConnection();

