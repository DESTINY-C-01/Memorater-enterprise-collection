-- ============================================================
-- Storage bucket for product images, banners, etc.
-- ============================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('banners', 'banners', true)
on conflict (id) do nothing;

-- Public read access to both buckets
create policy "public read product-images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "public read banners"
  on storage.objects for select
  using (bucket_id = 'banners');

-- Only authenticated admins can write
create policy "admin write product-images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "admin update product-images"
  on storage.objects for update
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "admin delete product-images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "admin write banners"
  on storage.objects for insert
  with check (bucket_id = 'banners' and auth.role() = 'authenticated');
