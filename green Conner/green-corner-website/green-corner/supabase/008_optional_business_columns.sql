-- Optional. Safe to run if business info save mentioned missing columns.
alter table business_info add column if not exists facebook_url text;
alter table business_info add column if not exists tiktok_url text;
alter table business_info add column if not exists service_options text[];
