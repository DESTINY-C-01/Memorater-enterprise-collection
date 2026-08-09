-- ============================================================
-- Memorater Enterprise Collection — Initial Schema
-- ============================================================
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- ENUMS
-- ------------------------------------------------------------
create type order_status as enum ('pending', 'confirmed', 'processing', 'shipped', 'completed', 'cancelled');
create type currency_code as enum ('NGN', 'GHS', 'XOF');
create type admin_role as enum ('owner', 'staff');

-- ------------------------------------------------------------
-- ADMINS  (linked to Supabase auth.users)
-- ------------------------------------------------------------
create table admins (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  role admin_role not null default 'staff',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- CURRENCIES
-- ------------------------------------------------------------
create table currencies (
  code currency_code primary key,
  symbol text not null,
  name text not null,
  rate_to_base numeric(12,6) not null default 1, -- base currency = NGN
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

insert into currencies (code, symbol, name, rate_to_base) values
  ('NGN', '₦', 'Nigerian Naira', 1),
  ('GHS', 'GH₵', 'Ghanaian Cedi', 0.011),
  ('XOF', 'CFA', 'West African CFA Franc', 0.85);

-- ------------------------------------------------------------
-- CATEGORIES
-- ------------------------------------------------------------
create table categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_categories_slug on categories(slug) where deleted_at is null;

-- ------------------------------------------------------------
-- PRODUCTS
-- ------------------------------------------------------------
create table products (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  product_code text unique,
  base_price numeric(12,2) not null,          -- stored in base currency (NGN)
  discount_percent numeric(5,2) default 0,
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  is_featured boolean not null default false,
  is_new_arrival boolean not null default false,
  is_best_seller boolean not null default false,
  is_available boolean not null default true,
  view_count int not null default 0,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_products_slug on products(slug) where deleted_at is null;
create index idx_products_category on products(category_id) where deleted_at is null;
create index idx_products_featured on products(is_featured) where deleted_at is null;
create index idx_products_search on products using gin (to_tsvector('english', name || ' ' || coalesce(description, '')));

-- ------------------------------------------------------------
-- PRODUCT IMAGES
-- ------------------------------------------------------------
create table product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  image_url text not null,
  alt_text text,
  sort_order int not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_product_images_product on product_images(product_id);

-- ------------------------------------------------------------
-- INVENTORY (per size/color variant)
-- ------------------------------------------------------------
create table inventory (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  size text,
  color text,
  quantity int not null default 0,
  low_stock_threshold int not null default 3,
  updated_at timestamptz not null default now(),
  unique (product_id, size, color)
);

create index idx_inventory_product on inventory(product_id);

-- ------------------------------------------------------------
-- CUSTOMERS
-- ------------------------------------------------------------
create table customers (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  phone_number text not null,
  whatsapp_number text,
  email text,
  delivery_location text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_customers_phone on customers(phone_number);

-- ------------------------------------------------------------
-- ORDERS
-- ------------------------------------------------------------
create table orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text not null unique,
  customer_id uuid references customers(id) on delete set null,
  customer_name text not null,
  phone_number text not null,
  delivery_location text not null,
  currency currency_code not null default 'NGN',
  subtotal numeric(12,2) not null,
  total_amount numeric(12,2) not null,
  status order_status not null default 'pending',
  notes text,
  whatsapp_message text,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_orders_status on orders(status) where deleted_at is null;
create index idx_orders_customer on orders(customer_id);
create index idx_orders_created on orders(created_at desc);

-- ------------------------------------------------------------
-- ORDER ITEMS
-- ------------------------------------------------------------
create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text not null,   -- snapshot at time of order
  size text,
  color text,
  quantity int not null default 1,
  unit_price numeric(12,2) not null,
  line_total numeric(12,2) not null,
  created_at timestamptz not null default now()
);

create index idx_order_items_order on order_items(order_id);

-- ------------------------------------------------------------
-- BANNERS
-- ------------------------------------------------------------
create table banners (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  subtitle text,
  image_url text not null,
  link_url text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- REVIEWS
-- ------------------------------------------------------------
create table reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  customer_name text not null,
  rating int not null check (rating between 1 and 5),
  comment text,
  is_approved boolean not null default false,
  deleted_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_reviews_product on reviews(product_id) where deleted_at is null;

-- ------------------------------------------------------------
-- SETTINGS (single-row key/value style table)
-- ------------------------------------------------------------
create table settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

insert into settings (key, value) values
  ('site_info', '{"name": "Memorater Enterprise Collection", "tagline": "Premium Fashion, Delivered Personally"}'),
  ('whatsapp_number', '"234XXXXXXXXXX"'),
  ('base_currency', '"NGN"');

-- ------------------------------------------------------------
-- ACTIVITY LOGS
-- ------------------------------------------------------------
create table activity_logs (
  id uuid primary key default uuid_generate_v4(),
  admin_id uuid references admins(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index idx_activity_logs_admin on activity_logs(admin_id);
create index idx_activity_logs_created on activity_logs(created_at desc);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table admins enable row level security;
alter table currencies enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table inventory enable row level security;
alter table customers enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table banners enable row level security;
alter table reviews enable row level security;
alter table settings enable row level security;
alter table activity_logs enable row level security;

-- Helper: is the current user an active admin?
create or replace function is_admin() returns boolean as $$
  select exists (
    select 1 from admins where id = auth.uid() and is_active = true
  );
$$ language sql security definer stable;

-- Public read access: categories, products, product_images, inventory (qty only via view ideally),
-- banners, approved reviews, currencies, settings
create policy "public read categories" on categories for select using (deleted_at is null and is_active = true);
create policy "admin full categories" on categories for all using (is_admin()) with check (is_admin());

create policy "public read products" on products for select using (deleted_at is null and is_available = true);
create policy "admin full products" on products for all using (is_admin()) with check (is_admin());

create policy "public read product_images" on product_images for select using (true);
create policy "admin full product_images" on product_images for all using (is_admin()) with check (is_admin());

create policy "public read inventory" on inventory for select using (true);
create policy "admin full inventory" on inventory for all using (is_admin()) with check (is_admin());

create policy "public read banners" on banners for select using (is_active = true);
create policy "admin full banners" on banners for all using (is_admin()) with check (is_admin());

create policy "public read approved reviews" on reviews for select using (deleted_at is null and is_approved = true);
create policy "anyone can submit review" on reviews for insert with check (true);
create policy "admin full reviews" on reviews for all using (is_admin()) with check (is_admin());

create policy "public read currencies" on currencies for select using (is_active = true);
create policy "admin full currencies" on currencies for all using (is_admin()) with check (is_admin());

create policy "public read settings" on settings for select using (true);
create policy "admin full settings" on settings for all using (is_admin()) with check (is_admin());

-- Customers & Orders: customers can be created by anyone (checkout flow uses service role
-- via a server action), but only admins can read/manage the full list.
create policy "admin full customers" on customers for all using (is_admin()) with check (is_admin());
create policy "admin full orders" on orders for all using (is_admin()) with check (is_admin());
create policy "admin full order_items" on order_items for all using (is_admin()) with check (is_admin());

-- Admins table: admins can read their own row; owners manage all
create policy "admin read self" on admins for select using (id = auth.uid() or is_admin());
create policy "owner manage admins" on admins for all using (
  exists (select 1 from admins where id = auth.uid() and role = 'owner')
) with check (
  exists (select 1 from admins where id = auth.uid() and role = 'owner')
);

create policy "admin read logs" on activity_logs for select using (is_admin());
create policy "admin write logs" on activity_logs for insert with check (is_admin());

-- ============================================================
-- TRIGGERS: updated_at auto-touch
-- ============================================================
create or replace function touch_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_admins_updated before update on admins for each row execute function touch_updated_at();
create trigger trg_categories_updated before update on categories for each row execute function touch_updated_at();
create trigger trg_products_updated before update on products for each row execute function touch_updated_at();
create trigger trg_customers_updated before update on customers for each row execute function touch_updated_at();
create trigger trg_orders_updated before update on orders for each row execute function touch_updated_at();
create trigger trg_banners_updated before update on banners for each row execute function touch_updated_at();
create trigger trg_inventory_updated before update on inventory for each row execute function touch_updated_at();
