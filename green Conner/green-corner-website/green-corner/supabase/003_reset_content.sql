-- Green Corner — migration 003: reset content to the smoothie & salad bar concept
--
-- Run this ONLY if your Supabase project already has the old "bar & grill"
-- seed data in it (grilled fish, booth seating, "the bar and lounge area",
-- etc. showing up in the admin dashboard or on the live site).
--
-- This clears menu items/categories, gallery, specials and hours, then
-- re-inserts them with the current smoothie & salad bar placeholder content.
-- Your business_info row is updated in place rather than deleted, so it
-- keeps its id and any edits you've already made to fields not listed below.

delete from menu_items;
delete from menu_categories;
delete from gallery;
delete from specials;
delete from hours;

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

-- Update business_info in place (works whether or not you'd already customized it)
update business_info set
  name = 'The Green Corner',
  tagline = 'Fresh smoothies, salads & juices in Nyamirambo',
  description = 'The Green Corner is a smoothie and salad bar in Nyamirambo, Kigali, built around fresh, whole ingredients — cold-pressed juices, blended smoothies, and salads made to order. A bright, easy stop for something that actually makes you feel good.',
  neighborhood = 'Nyamirambo',
  city = 'Kigali, Rwanda',
  maps_query = 'Nyamirambo, Kigali, Rwanda',
  google_rating = null,
  google_review_count = null,
  logo_url = '/images/logo.png',
  hero_media_type = 'images',
  hero_image_1 = '/images/illustrations/smoothie-glass.svg',
  hero_image_2 = '/images/illustrations/salad-bowl.svg',
  hero_image_3 = '/images/illustrations/citrus-slice.svg';
