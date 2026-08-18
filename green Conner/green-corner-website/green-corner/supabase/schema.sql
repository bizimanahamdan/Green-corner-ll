-- Green Corner — Supabase schema
-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query).

create extension if not exists "pgcrypto";

-- ---------- business_info (single row) ----------
create table if not exists business_info (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Green Corner',
  tagline text,
  description text,
  phone text,
  whatsapp text,
  instagram text,
  neighborhood text,
  city text,
  price_range text,
  google_rating numeric,
  google_review_count integer,
  maps_query text
);

-- ---------- hours ----------
create table if not exists hours (
  id uuid primary key default gen_random_uuid(),
  day text not null,
  open text not null,
  close text not null,
  note text,
  sort_order integer default 0
);

-- ---------- menu_categories ----------
create table if not exists menu_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sort_order integer default 0
);

-- ---------- menu_items ----------
create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references menu_categories(id) on delete cascade,
  name text not null,
  description text,
  price text,
  image_url text,
  is_available boolean default true,
  is_specialty boolean default false,
  sort_order integer default 0
);

-- ---------- gallery ----------
create table if not exists gallery (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  caption text,
  category text,
  sort_order integer default 0
);

-- ---------- specials ----------
create table if not exists specials (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  tag text,
  image_url text,
  active boolean default true,
  sort_order integer default 0
);

-- ---------- reservations (customer-submitted) ----------
create table if not exists reservations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  date date not null,
  time text not null,
  guests integer default 1,
  message text,
  status text default 'new',
  created_at timestamptz default now()
);

-- ---------- inquiries (customer-submitted) ----------
create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text not null,
  message text not null,
  status text default 'new',
  created_at timestamptz default now()
);

-- ================= Row Level Security =================

alter table business_info enable row level security;
alter table hours enable row level security;
alter table menu_categories enable row level security;
alter table menu_items enable row level security;
alter table gallery enable row level security;
alter table specials enable row level security;
alter table reservations enable row level security;
alter table inquiries enable row level security;

-- Public (anon) can READ content tables
create policy "public read business_info" on business_info for select using (true);
create policy "public read hours" on hours for select using (true);
create policy "public read menu_categories" on menu_categories for select using (true);
create policy "public read menu_items" on menu_items for select using (true);
create policy "public read gallery" on gallery for select using (true);
create policy "public read specials" on specials for select using (true);

-- Public (anon) can INSERT into reservations & inquiries, but not read/update/delete
create policy "public insert reservations" on reservations for insert with check (true);
create policy "public insert inquiries" on inquiries for insert with check (true);

-- Authenticated (logged-in admin) can do everything on every table
create policy "admin full business_info" on business_info for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin full hours" on hours for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin full menu_categories" on menu_categories for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin full menu_items" on menu_items for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin full gallery" on gallery for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin full specials" on specials for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin full reservations" on reservations for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin full inquiries" on inquiries for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ================= Seed data =================
-- Menu names/prices below are the owner-confirmed grill pub list.
-- Phone, WhatsApp, hours, gallery and promotions are left empty on purpose.

insert into business_info (name, tagline, description, phone, whatsapp, instagram, neighborhood, city, price_range, google_rating, google_review_count, maps_query)
values (
  'The Green Corner',
  'Fire-grilled fish & brochettes in Nyamirambo',
  'The Green Corner is a grill pub in Nyamirambo, Kigali, known for fire-grilled fish, goat and beef brochettes, and an ice-cold selection of local beers. A lively, no-frills spot to eat well and unwind.',
  '',
  '',
  '',
  'Nyamirambo',
  'Kigali, Rwanda',
  '',
  null,
  null,
  'Nyamirambo, Kigali, Rwanda'
);

-- Hours are not seeded. Add them from Admin → Hours once the owner confirms them.

insert into menu_categories (id, name, sort_order) values
  ('a1111111-1111-1111-1111-111111111111', 'Signature Fish', 1),
  ('a2222222-2222-2222-2222-222222222222', 'Grilled Meats', 2),
  ('a3333333-3333-3333-3333-333333333333', 'Sides', 3),
  ('a4444444-4444-4444-4444-444444444444', 'Drinks', 4);

insert into menu_items (category_id, name, description, price, image_url, is_specialty, sort_order) values
  ('a1111111-1111-1111-1111-111111111111', 'Legendary Big Grilled Fish (Amafi Manini)', 'A massive, fire-grilled fish smothered in onions, garlic, and local spices.', '18,500', 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?q=80&w=800', true, 1),
  ('a2222222-2222-2222-2222-222222222222', 'Classic Goat Brochette (Zingalo)', 'Tender goat meat, marinated and grilled over an open flame.', '1,500', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800', true, 1),
  ('a2222222-2222-2222-2222-222222222222', 'Beef Brochette', 'Premium cuts of beef, seasoned with Rwandan spices.', '1,200', 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?q=80&w=800', false, 2),
  ('a3333333-3333-3333-3333-333333333333', 'Whole Roasted Potatoes (Ibirayi)', 'Deep-fried, whole savory potatoes crispy on the outside.', '2,000', 'https://images.unsplash.com/photo-1633494541571-0814fdbfa54b?q=80&w=800', false, 1),
  ('a3333333-3333-3333-3333-333333333333', 'Fried Plantains (Mizuzu)', 'Sweet, golden-brown fried plantains.', '2,500', 'https://images.unsplash.com/photo-1662993888358-db809fdb89a9?q=80&w=800', false, 2),
  ('a4444444-4444-4444-4444-444444444444', 'Ice Cold Local Beers', 'Perfectly chilled Skol, Mutzig, or Primus.', '1,500', 'https://images.unsplash.com/photo-1608270586620-248524c67de9?q=80&w=800', false, 1);
