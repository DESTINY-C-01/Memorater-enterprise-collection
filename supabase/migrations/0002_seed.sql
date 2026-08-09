-- ============================================================
-- Demo seed data — safe to delete/modify before going live
-- ============================================================
insert into categories (name, slug, sort_order) values
  ('Heels', 'heels', 1),
  ('Sneakers', 'sneakers', 2),
  ('Sandals', 'sandals', 3),
  ('Slippers', 'slippers', 4),
  ('Bags', 'bags', 5),
  ('Accessories', 'accessories', 6);

-- Sample product (attach real images via the admin dashboard or Supabase Storage)
insert into products (category_id, name, slug, description, product_code, base_price, discount_percent, sizes, colors, is_featured, is_new_arrival, is_best_seller)
select id, 'Aurora Satin Heels', 'aurora-satin-heels',
  'Elegant satin heels with a comfortable block heel — perfect for evening occasions.',
  'MEC-HL-001', 45000, 10, array['36','37','38','39','40'], array['Black','Gold','Blush'],
  true, true, false
from categories where slug = 'heels';
