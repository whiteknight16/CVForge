CREATE TABLE "resume" (
	"resume_id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"resume_name" text NOT NULL,
	"skils" jsonb NOT NULL,
	"professional_summary" text,
	"languages" jsonb,
	"links" jsonb,
	"personal_details" jsonb,
	"employment_history" jsonb,
	"education" jsonb,
	"projects" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "resume" ADD CONSTRAINT "resume_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;