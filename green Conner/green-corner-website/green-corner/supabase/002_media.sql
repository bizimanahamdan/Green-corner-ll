-- Green Corner — migration 002: logo + hero media
-- Run this in the Supabase SQL editor AFTER schema.sql.

-- New editable media fields on business_info
alter table business_info add column if not exists logo_url text;
alter table business_info add column if not exists hero_media_type text default 'images'; -- 'images' or 'video'
alter table business_info add column if not exists hero_video_url text;
alter table business_info add column if not exists hero_image_1 text;
alter table business_info add column if not exists hero_image_2 text;
alter table business_info add column if not exists hero_image_3 text;

-- Storage bucket for admin-uploaded media (logo, hero photos/video)
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Anyone can view files in the media bucket (needed so the public site can display them)
create policy "public read media bucket"
  on storage.objects for select
  using (bucket_id = 'media');

-- Only logged-in admins can upload, replace, or delete files
create policy "admin upload media bucket"
  on storage.objects for insert
  with check (bucket_id = 'media' and auth.role() = 'authenticated');

create policy "admin update media bucket"
  on storage.objects for update
  using (bucket_id = 'media' and auth.role() = 'authenticated');

create policy "admin delete media bucket"
  on storage.objects for delete
  using (bucket_id = 'media' and auth.role() = 'authenticated');

-- Default logo + hero images so the site looks complete immediately.
-- These point at the illustrated placeholders bundled in /public/images —
-- replace them with real uploads from /admin/media whenever you're ready.
update business_info set
  logo_url = '/images/logo.png',
  hero_media_type = 'images',
  hero_image_1 = '/images/illustrations/smoothie-glass.svg',
  hero_image_2 = '/images/illustrations/salad-bowl.svg',
  hero_image_3 = '/images/illustrations/citrus-slice.svg';
