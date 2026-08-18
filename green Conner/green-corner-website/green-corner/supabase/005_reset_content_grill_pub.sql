-- Green Corner — migration 005: reset content to the grill pub concept
--
-- Run this if your Supabase project still has the earlier smoothie & salad
-- bar seed data in it (from migration 003), and you want the database to
-- match the current grill pub concept (fire-grilled fish, brochettes, sides,
-- drinks) instead.
--
-- This clears menu items/categories, gallery and specials, then re-inserts
-- them with the current grill pub content. Menu items and gallery photos use
-- Unsplash stock photography as placeholders until real photos of the venue
-- are uploaded via the admin dashboard. Hours are left untouched since they
-- aren't concept-specific. Your business_info row is updated in place rather
-- than deleted, so it keeps its id and any edits you've already made to
-- fields not listed below (phone, WhatsApp number, price range, etc).

delete from menu_items;
delete from menu_categories;
delete from gallery;
delete from specials;

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

insert into gallery (url, caption, category, sort_order) values
  ('https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?q=80&w=800', 'PLACEHOLDER — the big grilled fish', 'Fish', 1),
  ('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800', 'PLACEHOLDER — goat brochettes on the grill', 'Grilled Meats', 2),
  ('https://images.unsplash.com/photo-1603360946369-dc9bb6258143?q=80&w=800', 'PLACEHOLDER — beef brochette', 'Grilled Meats', 3),
  ('https://images.unsplash.com/photo-1633494541571-0814fdbfa54b?q=80&w=800', 'PLACEHOLDER — roasted potatoes', 'Sides', 4),
  ('https://images.unsplash.com/photo-1608270586620-248524c67de9?q=80&w=800', 'PLACEHOLDER — cold local beer', 'Drinks', 5);

insert into specials (title, description, tag, image_url, active, sort_order) values
  ('Happy Hour Brochettes', 'PLACEHOLDER — sample idea: discounted brochettes during early evening hours. Confirm timing and pricing with the owner.', 'Sample idea', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800', true, 1),
  ('Fish & Beer Combo', 'PLACEHOLDER — sample idea: grilled fish plus a cold beer for a set combo price. Confirm concept and pricing with the owner.', 'Sample idea', 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?q=80&w=800', true, 2),
  ('Weekend Grill Night', 'PLACEHOLDER — sample idea: extended grill menu and live atmosphere on weekend evenings. Confirm concept with the owner.', 'Sample idea', 'https://images.unsplash.com/photo-1608270586620-248524c67de9?q=80&w=800', true, 3);

-- Update business_info in place (works whether or not you'd already customized it)
update business_info set
  name = 'The Green Corner',
  tagline = 'Fire-grilled fish & brochettes in Nyamirambo',
  description = 'The Green Corner is a grill pub in Nyamirambo, Kigali, known for fire-grilled fish, goat and beef brochettes, and an ice-cold selection of local beers. A lively, no-frills spot to eat well and unwind.',
  neighborhood = 'Nyamirambo',
  city = 'Kigali, Rwanda',
  maps_query = 'Nyamirambo, Kigali, Rwanda',
  logo_url = '/images/logo.png',
  hero_media_type = 'images',
  hero_image_1 = 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?q=80&w=800',
  hero_image_2 = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800',
  hero_image_3 = 'https://images.unsplash.com/photo-1608270586620-248524c67de9?q=80&w=800';
