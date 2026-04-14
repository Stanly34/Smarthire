# Supabase Database Setup

SmartHire uses Supabase as hosted PostgreSQL only. Keep the existing Express/JWT authentication and do not enable Supabase Auth for this app.

## 1. Copy The Connection String

In the Supabase Dashboard, open the existing project, choose **Connect**, and copy the **Transaction pooler** URI. Use the pooled URI for Vercel/serverless deployments, usually on port `6543`.

For this project, the validated pooler URI shape is:

```env
DATABASE_URL=postgresql://postgres.uvyibxbwpzmpqbkbdvsk:YOUR_URL_ENCODED_DB_PASSWORD@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres
DATABASE_SSL=false
```

If your database password contains special characters such as `@`, URL-encode them before putting the password into `DATABASE_URL`.

## 2. Apply The Schema

Open **SQL Editor** in Supabase and run the full contents of:

```text
backend/db/schema.sql
```

This creates the SmartHire tables and seeds the default admin, skills, and sample coding problems.

## 3. Configure Vercel

Set these environment variables in the Vercel project:

```env
DATABASE_URL=postgresql://postgres.uvyibxbwpzmpqbkbdvsk:YOUR_URL_ENCODED_DB_PASSWORD@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres
DATABASE_SSL=false
JWT_SECRET=replace_with_a_strong_secret
NODE_ENV=production
```

After the first successful deployment, optionally set:

```env
FRONTEND_URL=https://your-vercel-domain.vercel.app
```

Do not set `VITE_API_URL` on Vercel. The frontend should call the backend through same-domain `/api`.

## 4. Validate Locally

If you want to test from this machine, place the Supabase values in `backend/.env`, then run:

```bash
npm run db:check
```

Expected result:

```text
SmartHire database check
Connected using SSL: yes
Tables found: 11/11
PASS default admin: 1 row(s)
PASS skills: 34 row(s)
PASS coding problems: 5 row(s)
```

For the currently validated Supabase pooler, the expected SSL line is `Connected using SSL: no` because `DATABASE_SSL=false` is required for this pooler endpoint.

Never commit `backend/.env`, Supabase credentials, Vercel tokens, or `.vercel/`.
