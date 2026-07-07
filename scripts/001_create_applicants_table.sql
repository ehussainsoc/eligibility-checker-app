-- Run this in the Supabase SQL editor to create the applicants table.

create table if not exists public.applicants (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  date_of_birth date not null,
  age integer not null,
  employment_status text,
  universal_credit boolean not null default false,
  universal_credit_duration integer not null default 0,
  seeking_work_duration integer not null default 0,
  care_leaver boolean not null default false,
  applying_for_apprenticeship boolean not null default false,
  youth_jobs_grant boolean not null default false,
  care_leaver_bursary boolean not null default false,
  sme_incentive boolean not null default false,
  total_funding integer not null default 0,
  reasons jsonb not null default '{}'::jsonb,
  status text not null default 'pending'
);

alter table public.applicants enable row level security;

-- Allow public (anon) users to submit applications.
create policy "Anyone can submit an application"
  on public.applicants
  for insert
  to anon, authenticated
  with check (true);

-- Allow reads (used by the staff dashboard). Tighten this in production
-- if you move staff auth to Supabase Auth.
create policy "Applicants are readable"
  on public.applicants
  for select
  to anon, authenticated
  using (true);
