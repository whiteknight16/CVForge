# CVForge

A modern resume builder application built with Next.js, TypeScript, and Drizzle ORM.

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up your environment variables:

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
```

Replace `username`, `password`, `localhost`, `5432`, and `database_name` with your actual PostgreSQL credentials.

### Database Setup

The project uses Drizzle ORM with PostgreSQL. The drizzle config is located at `db/drizzle.config.ts`.

#### Generate Migrations

Generate database migrations from your schema:

```bash
npm run db:generate
# or
npx drizzle-kit generate --config=db/drizzle.config.ts
```

#### Run Migrations

Apply migrations to your database:

```bash
npm run db:migrate
# or
npx drizzle-kit migrate --config=db/drizzle.config.ts
```

#### Other Drizzle Commands

- **Push schema changes** (for development):
```bash
npm run db:push
# or
npx drizzle-kit push --config=db/drizzle.config.ts
```

- **Open Drizzle Studio** (database GUI):
```bash
npm run db:studio
# or
npx drizzle-kit studio --config=db/drizzle.config.ts
```

- **Introspect database** (generate schema from existing database):
```bash
npm run db:introspect
# or
npx drizzle-kit introspect --config=db/drizzle.config.ts
```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
