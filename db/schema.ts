import { pgTable, serial, text, timestamp,uuid,jsonb } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
    user_id: uuid('user_id').defaultRandom().notNull().primaryKey(),
    email: text('email').notNull().unique(),
    password: text('password'), // Optional for Google OAuth users
    provider: text('provider').default('email'), // 'email' or 'google'
    google_id: text('google_id'), // Google user ID for OAuth users
    name: text('name'), // User's name from Google
    image: text('image'), // User's profile image from Google
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
})

export type personal_details={
    name: string;
    photo_url?: string;
    dob?: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
}

export type employment_history={
    company_name: string;
    position: string;
    start_date: string;
    end_date?: string;
    description?: string;
    type?: 'full-time' | 'part-time' | 'freelance' | 'internship' | 'volunteer';
}

export type education={
    school_name: string;
    degree: string;
    field_of_study: string;
    start_date: string;
    end_date?: string;
    description?: string;
}

export type projects={
    project_name: string;
    description: string;
    technologies?: string[];
    links?:{}
}

export type resume_section_order = (
    'personal_details' | 
    'professional_summary' | 
    'employment_history' | 
    'education' | 
    'projects' | 
    'languages' | 
    'links'|
    'skills'
)[]

export const resume = pgTable('resume', {
    resume_id: uuid('resume_id').primaryKey().notNull(), // UUID comes from URL, no default
    user_id: uuid('user_id').references(() => users.user_id).notNull(),
    resume_name: text('resume_name').notNull(),
    skills:jsonb('skills').notNull(),
    professional_summary:text('professional_summary'),
    languages:jsonb('languages'),
    links:jsonb('links'),
    personal_details: jsonb('personal_details'),
    employment_history: jsonb('employment_history'),
    education: jsonb('education'),
    projects: jsonb('projects'),
    order: jsonb('order'), // Stores the order of sections: ['personal_details', 'professional_summary', 'employment_history', 'education', 'projects', 'languages', 'links']
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
})