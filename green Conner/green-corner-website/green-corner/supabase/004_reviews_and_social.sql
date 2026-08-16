-- Green Corner — migration 004: reviews + social links
-- Run this in the Supabase SQL editor after 003 (or after 002 if you never ran 003).

-- ---------- reviews (admin-curated, not scraped) ----------
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  rating integer not null default 5,
  quote text not null,
  visible boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

alter table reviews enable row level security;

create policy "public read visible reviews" on reviews for select using (visible = true);
create policy "admin full reviews" on reviews for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ---------- social links on business_info ----------
alter table business_info add column if not exists facebook_url text;
alter table business_info add column if not exists tiktok_url text;

-- One starter review so the section isn't empty — replace or delete from Admin → Reviews.
insert into reviews (author_name, rating, quote, visible, sort_order) values
  ('A regular customer', 5, 'PLACEHOLDER — replace with a real customer quote, or delete this from Admin → Reviews.', true, 1);
