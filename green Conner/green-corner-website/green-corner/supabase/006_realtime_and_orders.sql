-- Green Corner — migration 006: order line items, service chips, realtime
-- Run this in the Supabase SQL editor after 005.

alter table reservations add column if not exists order_items jsonb;
alter table business_info add column if not exists service_options text[];

update business_info
set service_options = array['Grilled Fish', 'Brochettes', 'Cold Drinks']
where service_options is null;

-- Hide leftover dummy contact details from earlier seeds.
update business_info
set
  phone = case when phone ilike 'PLACEHOLDER%' or phone = '250700000000' then '' else phone end,
  whatsapp = case when whatsapp ilike 'PLACEHOLDER%' or whatsapp = '250700000000' then '' else whatsapp end,
  instagram = case when instagram = '@greencorner.rw' then '' else instagram end,
  price_range = case when price_range ilike 'PLACEHOLDER%' then '' else price_range end,
  hero_image_1 = coalesce(nullif(hero_image_1, ''), '/images/hero-embers.jpg');

-- Realtime so the admin dashboard updates without refresh.
do $$
begin
  begin
    alter publication supabase_realtime add table reservations;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table inquiries;
  exception when duplicate_object then null;
  end;
end $$;
