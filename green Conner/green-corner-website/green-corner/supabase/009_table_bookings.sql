-- Green Corner — migration 009: table booking requests
-- Run this in the Supabase SQL editor after 007 (or 008 if you used that).
--
-- This is a request inbox, not a seating chart. The house still confirms
-- by phone or WhatsApp. Do not invent table counts in the app.

create table if not exists table_bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  date date not null,
  time text not null,
  guests integer not null default 2,
  occasion text,
  message text,
  status text default 'new',
  notified_at timestamptz,
  created_at timestamptz default now(),
  constraint table_bookings_guests_range check (guests >= 1 and guests <= 30)
);

alter table table_bookings enable row level security;

drop policy if exists "public insert table_bookings" on table_bookings;
drop policy if exists "admin full table_bookings" on table_bookings;

create policy "public insert table_bookings"
  on table_bookings for insert
  with check (true);

create policy "admin full table_bookings"
  on table_bookings for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

do $$
begin
  begin
    alter publication supabase_realtime add table table_bookings;
  exception when duplicate_object then null;
  end;
end $$;

-- Optional: Database → Webhooks → INSERT on table_bookings
-- POST to https://YOUR-SITE.netlify.app/.netlify/functions/push-notify
-- Header x-webhook-secret = PUSH_WEBHOOK_SECRET
