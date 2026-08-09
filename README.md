# Memorater Enterprise Collection

A premium product-ordering website (not e-commerce — no online payments). Customers
browse products, build a bag, and check out by sending a pre-filled order summary
straight to your WhatsApp.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · Framer Motion ·
Supabase (Postgres, Auth, Storage) · Zustand · Vercel

---

## 1. What's included in this scaffold

- Full folder structure (`app`, `components`, `lib`, `hooks`, `services`, `actions`, `types`, `supabase`)
- Complete SQL schema: `admins`, `customers`, `products`, `product_images`, `categories`,
  `orders`, `order_items`, `inventory`, `banners`, `reviews`, `settings`, `currencies`,
  `activity_logs` — with foreign keys, indexes, Row Level Security, soft deletes, and
  `updated_at` triggers
- Storage bucket policies for product images and banners
- Multi-currency support (NGN / GHS / XOF) with a header switcher and live price conversion
- Customer site: homepage (hero, featured/new/best-seller grids), product listing with
  search & category filter, product detail with size/color/quantity selection, cart,
  wishlist placeholder, about, contact, FAQ
- **WhatsApp ordering flow**: cart → checkout form → order saved to Supabase → customer
  redirected to `wa.me` with a complete, formatted order summary
- Admin dashboard: protected via Supabase Auth + middleware, login page, overview stats,
  order management with status updates, product creation with multi-image upload,
  categories/banners/reviews/settings views
- SEO: metadata API, Open Graph tags, `sitemap.ts`, `robots.ts`
- Security: Row Level Security on every table, service-role client isolated to server
  actions only, protected `/admin` routes via middleware

This is a solid, working foundation — not every conceivable admin edit/delete screen is
built out (e.g. product editing, category creation forms, inventory management UI). Those
follow the same patterns already established (see `actions/manage-products.ts` and
`components/admin/product-form.tsx`) and are the natural next step.

---

## 2. Setup

### a) Install dependencies

```bash
npm install
```

### b) Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → New Project.
2. In the SQL Editor, run the migrations **in order**:
   - `supabase/migrations/0001_init.sql`
   - `supabase/migrations/0002_seed.sql` (optional demo data)
   - `supabase/migrations/0003_storage.sql`
3. Under **Authentication → Users**, create your admin user (email + password).
4. In the SQL Editor, insert that user into the `admins` table so they can log in:

```sql
insert into admins (id, full_name, email, role)
values ('<paste-the-user-uuid-here>', 'Your Name', 'you@example.com', 'owner');
```

### c) Environment variables

Copy `.env.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=...          # Project Settings → API
NEXT_PUBLIC_SUPABASE_ANON_KEY=...     # Project Settings → API
SUPABASE_SERVICE_ROLE_KEY=...         # Project Settings → API (keep secret!)
NEXT_PUBLIC_WHATSAPP_NUMBER=234XXXXXXXXXX   # digits only, country code first, no + or spaces
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### d) Run locally

```bash
npm run dev
```

Visit `http://localhost:3000` for the storefront and `http://localhost:3000/admin/login`
for the admin panel.

---

## 3. How the WhatsApp ordering flow works

1. Customer adds items to their bag (`hooks/use-cart.ts`, persisted in `localStorage`).
2. On the cart page, they fill in name, phone, and delivery location.
3. `actions/create-order.ts` validates the input, saves the order + order items to
   Supabase (via the service-role client so it works even though this is a public,
   unauthenticated action), and builds the WhatsApp message with
   `services/whatsapp-order.ts`.
4. The browser redirects to `https://wa.me/<your-number>?text=<order-summary>`.
5. You receive the message on WhatsApp, confirm stock, and share payment details manually.
6. You update the order's status from the admin dashboard as it progresses.

---

## 4. Deployment (Vercel)

1. Push this project to a GitHub repo.
2. Import it in [vercel.com](https://vercel.com/new).
3. Add the same environment variables from `.env.local` in the Vercel project settings.
4. Deploy. Update `NEXT_PUBLIC_SITE_URL` to your production domain and redeploy.

---

## 5. Suggested next steps

- Build out product **edit** and **delete** flows (reuse `ProductForm`)
- Add category create/edit forms and drag-to-reorder banners
- Wire the Settings page to actually update the `settings` table
- Add inventory-level tracking to disable out-of-stock size/color combinations
- Add pagination controls to the products page (the query already supports it)
- Add a real image carousel/lightbox on the product detail page
- Connect `reviews` submission to a public form on the product page
