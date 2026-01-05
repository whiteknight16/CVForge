import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/db/schema";

export async function GET() {
  try {
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { 
          success: false, 
          error: "DATABASE_URL environment variable is not set",
          message: "Please create a .env file with your DATABASE_URL. See .env.example for reference."
        },
        { status: 500 }
      );
    }

    const result = await db.select().from(users);
    return NextResponse.json({ success: true, data: result, count: result.length });
  } catch (error: any) {
    console.error("Database error:", error);
    
    // Provide more helpful error messages
    let errorMessage = "Failed to fetch users";
    let suggestion = "";
    
    if (error?.cause?.code === '28P01') {
      errorMessage = "Database authentication failed. Please check your DATABASE_URL credentials in .env file.";
    } else if (error?.cause?.code === 'ECONNREFUSED') {
      errorMessage = "Cannot connect to database. Please ensure PostgreSQL is running and DATABASE_URL is correct.";
    } else if (error?.cause?.code === '3D000') {
      errorMessage = "Database does not exist. Please create the database first.";
    } else if (error?.cause?.code === '42P01' || error.message?.includes('does not exist') || error.message?.includes('relation "users"')) {
      errorMessage = "Table 'users' does not exist. Please run database migrations first.";
      suggestion = "Run: npm run db:migrate";
    }

    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        suggestion: suggestion,
        errorCode: error?.cause?.code,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
