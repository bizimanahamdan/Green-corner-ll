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

-- ================= Seed data (placeholders — confirm all facts with the real owner) =================
-- NOTE: This project pivoted from an earlier "bar & grill" concept to a
-- smoothie & salad bar based on the business's actual logo. We do not have a
-- verified Google Business listing for this version, so every fact below
-- (phone, hours, prices, menu) is a placeholder for the owner to replace.

insert into business_info (name, tagline, description, phone, whatsapp, instagram, neighborhood, city, price_range, google_rating, google_review_count, maps_query)
values (
  'The Green Corner',
  'Fresh smoothies, salads & juices in Nyamirambo',
  'The Green Corner is a smoothie and salad bar in Nyamirambo, Kigali, built around fresh, whole ingredients — cold-pressed juices, blended smoothies, and salads made to order. A bright, easy stop for something that actually makes you feel good.',
  'PLACEHOLDER — add real phone number',
  '250700000000',
  '@greencorner.rw',
  'Nyamirambo',
  'Kigali, Rwanda',
  'PLACEHOLDER — confirm pricing',
  null,
  null,
  'Nyamirambo, Kigali, Rwanda'
);

insert into hours (day, open, close, sort_order) values
  ('Monday', '7:00 AM', '8:00 PM', 1),
  ('Tuesday', '7:00 AM', '8:00 PM', 2),
  ('Wednesday', '7:00 AM', '8:00 PM', 3),
  ('Thursday', '7:00 AM', '8:00 PM', 4),
  ('Friday', '7:00 AM', '9:00 PM', 5),
  ('Saturday', '8:00 AM', '9:00 PM', 6),
  ('Sunday', '8:00 AM', '6:00 PM', 7);

insert into menu_categories (id, name, sort_order) values
  ('11111111-1111-1111-1111-111111111111', 'Smoothies', 1),
  ('22222222-2222-2222-2222-222222222222', 'Cold-Pressed Juices', 2),
  ('33333333-3333-3333-3333-333333333333', 'Salads', 3),
  ('44444444-4444-4444-4444-444444444444', 'Smoothie Bowls', 4),
  ('55555555-5555-5555-5555-555555555555', 'Extras & Add-ons', 5);

insert into menu_items (category_id, name, description, price, image_url, is_specialty, sort_order) values
  ('11111111-1111-1111-1111-111111111111', 'Green Corner Classic', 'PLACEHOLDER — spinach, banana, mango, coconut water.', '3,500', '/images/illustrations/smoothie-glass.svg', true, 1),
  ('11111111-1111-1111-1111-111111111111', 'Berry Boost', 'PLACEHOLDER — mixed berries, banana, yogurt.', '3,500', null, true, 2),
  ('11111111-1111-1111-1111-111111111111', 'Tropical Mango', 'PLACEHOLDER — mango, pineapple, passion fruit.', '3,000', null, false, 3),
  ('22222222-2222-2222-2222-222222222222', 'Carrot Ginger', 'PLACEHOLDER — carrot, ginger, orange.', '2,500', '/images/illustrations/juice-bottle.svg', true, 1),
  ('22222222-2222-2222-2222-222222222222', 'Beet & Apple', 'PLACEHOLDER — beetroot, apple, lemon.', '2,500', null, false, 2),
  ('22222222-2222-2222-2222-222222222222', 'Pure Passion', 'PLACEHOLDER — fresh passion fruit juice.', '2,000', null, false, 3),
  ('33333333-3333-3333-3333-333333333333', 'House Green Salad', 'PLACEHOLDER — mixed greens, avocado, tomato, house dressing.', '4,500', '/images/illustrations/salad-bowl.svg', true, 1),
  ('33333333-3333-3333-3333-333333333333', 'Grilled Chicken Salad', 'PLACEHOLDER — greens, grilled chicken, seasonal vegetables.', '5,500', null, false, 2),
  ('33333333-3333-3333-3333-333333333333', 'Avocado & Quinoa Bowl', 'PLACEHOLDER — quinoa, avocado, roasted vegetables.', '5,000', null, false, 3),
  ('44444444-4444-4444-4444-444444444444', 'Acai Berry Bowl', 'PLACEHOLDER — acai blend topped with granola and fresh fruit.', '4,000', '/images/illustrations/berry-bowl.svg', true, 1),
  ('44444444-4444-4444-4444-444444444444', 'Tropical Bowl', 'PLACEHOLDER — mango-pineapple blend, coconut flakes.', '4,000', null, false, 2),
  ('55555555-5555-5555-5555-555555555555', 'Protein Boost', 'PLACEHOLDER — add a scoop of protein to any smoothie.', '1,000', null, false, 1),
  ('55555555-5555-5555-5555-555555555555', 'Chia Seeds', 'PLACEHOLDER — add chia seeds to any bowl or smoothie.', '500', null, false, 2);

-- Illustrated placeholders — replace with real food photography via the admin Gallery page.
insert into gallery (url, caption, category, sort_order) values
  ('/images/illustrations/smoothie-glass.svg', 'PLACEHOLDER — signature smoothie', 'Smoothies', 1),
  ('/images/illustrations/salad-bowl.svg', 'PLACEHOLDER — house salad', 'Salads', 2),
  ('/images/illustrations/berry-bowl.svg', 'PLACEHOLDER — acai/berry bowl', 'Bowls', 3),
  ('/images/illustrations/juice-bottle.svg', 'PLACEHOLDER — cold-pressed juice', 'Juices', 4),
  ('/images/illustrations/citrus-slice.svg', 'PLACEHOLDER — fresh citrus', 'Ingredients', 5);

insert into specials (title, description, tag, image_url, active, sort_order) values
  ('Morning Fresh Combo', 'PLACEHOLDER — sample idea: any smoothie + any juice for a set combo price before 10am.', 'Sample idea', '/images/illustrations/smoothie-glass.svg', true, 1),
  ('Salad of the Week', 'PLACEHOLDER — a rotating seasonal salad. Confirm concept and pricing with the owner.', 'Sample idea', '/images/illustrations/salad-bowl.svg', true, 2),
  ('Bring Your Own Cup', 'PLACEHOLDER — sample sustainability idea: a small discount for guests who bring a reusable cup.', 'Sample idea', '/images/illustrations/juice-bottle.svg', true, 3);
