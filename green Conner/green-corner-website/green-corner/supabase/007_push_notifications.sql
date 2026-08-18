-- Green Corner — migration 007: background Web Push
-- Run this in the Supabase SQL editor after 006.

alter table reservations add column if not exists notified_at timestamptz;
alter table inquiries add column if not exists notified_at timestamptz;

create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_id uuid references auth.users(id) on delete cascade,
  user_agent text,
  created_at timestamptz default now(),
  last_seen_at timestamptz default now()
);

alter table push_subscriptions enable row level security;

drop policy if exists "admin insert own push" on push_subscriptions;
drop policy if exists "admin read own push" on push_subscriptions;
drop policy if exists "admin update own push" on push_subscriptions;
drop policy if exists "admin delete own push" on push_subscriptions;

create policy "admin insert own push"
  on push_subscriptions for insert to authenticated
  with check (auth.uid() = user_id);

create policy "admin read own push"
  on push_subscriptions for select to authenticated
  using (auth.uid() = user_id);

create policy "admin update own push"
  on push_subscriptions for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "admin delete own push"
  on push_subscriptions for delete to authenticated
  using (auth.uid() = user_id);

-- Optional: Database → Webhooks → insert on reservations / inquiries
-- POST to https://YOUR-SITE.netlify.app/.netlify/functions/push-notify
-- Header x-webhook-secret = PUSH_WEBHOOK_SECRET
-- That path still works if the customer's browser closes after submit.
