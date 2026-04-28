# FieldCRM Agent

Voice-first field sales CRM for pharma teams. FieldCRM combines a Next.js dashboard, Supabase authentication, Prisma/PostgreSQL data storage, Bolna voice-call automation, Gemini-powered transcript extraction, and mock SMS confirmations into one workflow for tracking medical representative activity.

## What It Does

FieldCRM helps managers track field visits without forcing reps to fill long forms. A manager can add reps, trigger an AI voice call, receive a Bolna webhook with the call transcript, extract structured visit details, store the visit in PostgreSQL, and review activity from a dashboard.

Core workflows:

- Manager signs up or signs in with Supabase Auth.
- Manager adds sales reps with phone numbers and zones.
- Manager triggers a Bolna voice call for a rep.
- Bolna calls the rep and sends the transcript to the webhook.
- Gemini extracts doctor name, products discussed, samples given, follow-up date, notes, and sentiment.
- Prisma stores the structured visit.
- The app records a mock SMS confirmation for demo visibility.
- Dashboard, visits, alerts, territory, reps, and SMS log pages update from the database.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase Auth
- PostgreSQL through Supabase
- Prisma 7
- Bolna API for voice-call automation
- Google Gemini for transcript entity extraction
- Leaflet and React Leaflet for territory maps
- Base UI primitives and lucide-react icons

## App Pages

| Route | Purpose |
| --- | --- |
| `/` | Auth-aware redirect to `/dashboard` or `/login` |
| `/login` | Manager sign-in |
| `/signup` | Manager account creation |
| `/dashboard` | Summary stats and recent visits |
| `/visits` | Visit list |
| `/visits/[id]` | Visit detail page |
| `/reps` | Field rep directory |
| `/reps/new` | Add a new rep |
| `/reps/[id]` | Rep profile and activity |
| `/territory` | Zone coverage and map |
| `/alerts` | Inactive reps and negative sentiment alerts |
| `/sms` | Mock SMS log |

## API Routes

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/reps` | `GET` | List reps |
| `/api/reps` | `POST` | Create a rep |
| `/api/visits` | `GET` | List visits, optionally filtered by rep |
| `/api/agent/trigger` | `POST` | Trigger a Bolna call for a rep |
| `/api/webhook/bolna` | `POST` | Receive Bolna transcript, extract entities, create visit, send mock SMS |
| `/api/sms/send` | `POST` | Send and store a mock SMS |
| `/api/territory` | `GET` | Return zone-level visit coverage |

## Database Models

The Prisma schema contains four main models:

- `Rep`: sales representative profile with phone, email, zone, and visits.
- `Outlet`: optional clinic/outlet metadata with doctor, address, zone, and coordinates.
- `Visit`: structured visit record linked to a rep and optionally an outlet.
- `MockSMS`: demo SMS log entry.

Main visit fields include:

- `doctorName`
- `productsDiscussed`
- `samplesGiven`
- `followUpDate`
- `notes`
- `sentiment`
- `transcript`
- `smsSent`

## Environment Variables

Create `.env` or `.env.local` in the project root. These files are ignored by Git.

```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

DATABASE_URL="postgres://postgres.your-project-ref:your-db-password@aws-0-your-region.pooler.supabase.com:5432/postgres"
DIRECT_URL="postgres://postgres.your-project-ref:your-db-password@aws-0-your-region.pooler.supabase.com:5432/postgres"

GEMINI_API_KEY="your-gemini-api-key"
BOLNA_API_KEY="your-bolna-api-key"
BOLNA_AGENT_ID="your-bolna-agent-id"
WEBHOOK_SECRET="optional-webhook-secret"
```

### Supabase Connection Note

For Prisma commands such as `prisma db push`, use Supabase's **Session Pooler** URL:

- host should look like `aws-...pooler.supabase.com`
- port should be `5432`
- username should look like `postgres.your-project-ref`

Avoid using `db.your-project-ref.supabase.co:6543` for local Prisma schema pushes if your network cannot reach the direct database host.

If your database password contains special characters such as `@`, `#`, `/`, or `%`, URL-encode the password before placing it in `DATABASE_URL`.

## Local Setup

Install dependencies:

```bash
npm install
```

Push the Prisma schema to Supabase:

```bash
npm run db:push
```

Generate the Prisma client:

```bash
npm run db:generate
```

Optional seed data:

```bash
npm run seed
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server after build |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push Prisma schema to the configured database |
| `npm run db:validate` | Validate the Prisma schema |
| `npm run db:generate` | Generate Prisma client |
| `npm run seed` | Seed demo data |

## Authentication Flow

Authentication is powered by Supabase.

- Unauthenticated users are redirected to `/login`.
- New users can create an account at `/signup`.
- If Supabase email confirmation is enabled, users must confirm their email before signing in.
- Authenticated users visiting `/login` or `/signup` are redirected to `/dashboard`.

Route protection is handled by `src/proxy.ts`, which is the Next.js 16 replacement for the old `middleware.ts` convention.

## Voice Visit Flow

1. A manager creates or selects a rep.
2. The app calls `/api/agent/trigger`.
3. The server sends a call request to Bolna with the rep phone number.
4. Bolna calls the rep.
5. Bolna posts the transcript to `/api/webhook/bolna`.
6. The webhook finds the rep by phone number.
7. Gemini extracts structured visit fields from the transcript.
8. Prisma stores the visit.
9. A mock SMS is written to the database.
10. The dashboard and visit views reflect the new activity.

## Territory and Alerts

The territory page groups visits by configured zones:

- Mumbai North
- Mumbai South
- Pune
- Nashik
- Nagpur
- Aurangabad

The alerts page highlights:

- reps with no recent activity
- negative sentiment visits from the last week
- active reps

## Troubleshooting

### Prisma P1001: Cannot reach database server

Use the Supabase Session Pooler connection string on port `5432`.

Check that your URL looks like:

```text
postgres://postgres.project-ref:password@aws-...pooler.supabase.com:5432/postgres
```

Then run:

```bash
npm run db:push
```

### Redirects straight to sign-in

That is expected when there is no active Supabase session. Create an account from `/signup`, confirm your email if Supabase requires it, then sign in.

### Cannot sign in after signup

Check Supabase Auth settings. If email confirmation is enabled, the account will not be usable until the confirmation link is clicked.

### Next dev says another server is running

Stop the old server process or use the URL printed by Next. On Windows, Next may show a message like:

```text
Another next dev server is already running.
Run taskkill /PID <pid> /F to stop it.
```

### Build or dev fails with `spawn EPERM`

On Windows, this can happen when the shell cannot spawn Next worker processes. Run the terminal as an administrator or stop stale Node/Next processes and retry.

## Project Structure

```text
prisma/
  schema.prisma
  seed.ts
src/
  app/
    (auth)/
    (dashboard)/
    api/
    page.tsx
  components/
    dashboard/
    maps/
    reps/
    shared/
    ui/
    visits/
  config/
  hooks/
  lib/
  store/
  types/
  proxy.ts
```

## Validation

Before pushing changes, run:

```bash
npm run lint
npm run build
```

For type checking:

```bash
npm exec tsc --noEmit
```

## Repository

GitHub:

```text
https://github.com/gautam0222/Field-CRM-Agent.git
```
