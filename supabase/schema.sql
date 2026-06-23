-- Artifex schema for Supabase (Postgres).
-- Run this in the Supabase SQL editor once, then add the env vars (see .env.example).

create table if not exists profiles (
  email text primary key,
  credits integer not null default 200,
  stripe_customer_id text,
  created_at timestamptz not null default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_email text not null references profiles(email) on delete cascade,
  name text not null,
  color text not null default '#7C5CFF',
  created_at timestamptz not null default now()
);

create table if not exists assets (
  id text primary key,
  user_email text not null references profiles(email) on delete cascade,
  project_id uuid references projects(id) on delete cascade,
  type text not null,
  title text not null,
  format text not null,
  image_url text not null,
  file_url text,
  prompt text,
  provider text,
  width integer,
  height integer,
  meta jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists projects_user_idx on projects(user_email);
create index if not exists assets_user_idx on assets(user_email);

-- Atomic credit increment used by the Stripe webhook.
create or replace function increment_credits(p_email text, p_amount integer)
returns void language sql as $$
  update profiles set credits = credits + p_amount where email = p_email;
$$;

-- These tables are accessed only server-side via the service-role key, which
-- bypasses RLS. Enable RLS with NO public policies so the anon key can't touch them.
alter table profiles enable row level security;
alter table projects enable row level security;
alter table assets   enable row level security;
