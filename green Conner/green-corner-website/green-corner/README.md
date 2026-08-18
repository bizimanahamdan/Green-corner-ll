# The Green Corner — Website & Admin Dashboard

A production website and admin dashboard for **The Green Corner**, a grill pub
in Nyamirambo, Kigali. React (Vite) + Tailwind on the frontend, Supabase
(Postgres + Auth + Storage + Realtime) on the backend.

The public site runs immediately on confirmed menu content. Connecting
Supabase turns on the admin dashboard, live content, order storage, image
uploads, realtime inbox updates, and browser notifications.

**What is confirmed:** the grill-pub concept, neighborhood, and the Signature
Fish / Grilled Meats / Sides / Drinks menu (names, prices, descriptions).

**What is deliberately empty until the owner adds it in Admin:** phone,
WhatsApp, Instagram, Facebook, TikTok, opening hours, promotions, reviews,
and venue photography. Those fields stay hidden on the public site rather
than showing placeholder copy.

The bundled logo still reads “Smoothie & Salad Bar” because that is the file
in this repository. Upload a current lockup from **Admin → Logo & Hero Media**
when you have one.

---

## 1. Run it locally

```bash
npm install
npm run dev
```

Open the printed URL. The public site works on local demo data.

## 2. Deploy (Netlify)

1. Set the site’s base directory to `green Conner/green-corner-website/green-corner`
   (or deploy from that folder).
2. Build command: `npm run build` — publish directory: `dist`.
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` if you have them.

## 3. Connect Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. SQL Editor → run, in order:
   - `supabase/schema.sql`
   - `supabase/002_media.sql`
   - `supabase/004_reviews_and_social.sql`
   - `supabase/005_reset_content_grill_pub.sql` (if this project already had older seed data)
   - `supabase/006_realtime_and_orders.sql`
3. Copy **Project URL** and **anon public key** into `.env` (see `.env.example`).
   Never put the service-role key in the frontend.
4. Authentication → Users → Add user. That login is `/admin`.

`003_reset_content.sql` is outdated (smoothie/salad seed). Do not run it.

## 4. Admin dashboard

`yoursite.com/admin`

- Menu, gallery, specials, reviews, hours, business info, logo/hero media
- Incoming pickup orders (with line items when the customer built a cart)
- Incoming messages
- Browser notifications + optional chime (**Notifications**)

Notifications only fire while the admin tab is open. They are not background
push. Enabling them asks the browser for permission first.

## 5. What the owner still needs to provide

- Real phone number and WhatsApp number (digits with country code, e.g. `2507…`)
- Confirmed opening hours
- Real food / interior photos (menu photos are stock stand-ins)
- A current logo if the smoothie-bar lockup is retired
- The exact Google Maps pin
- Any promotions or customer quotes they have permission to publish

Public listings for a Green Corner in Nyamirambo often show
`+250 788 752 721`. That number is **not** written into this site. Confirm it
in Admin → Business Info before it goes live.

## 6. Customer features

- English / Kinyarwanda chrome
- Live Open / Closed badge once hours exist
- Menu with add-to-order
- Order-ahead form (saved to Supabase when connected)
- Smart WhatsApp flows (order, group/tonight, catering, question) — only if a
  real WhatsApp number is set
- Sticky mobile actions

## 7. SEO

Per-page titles, descriptions, canonicals, Open Graph, `LocalBusiness`
structured data (only confirmed fields), `robots.txt`, `sitemap.xml`.
Replace `the-green-corner.netlify.app` in `src/lib/siteConfig.js`,
`public/robots.txt`, `public/sitemap.xml`, and `index.html` when the real
domain is known.

## Tech stack

- React 18 + Vite + React Router
- Tailwind CSS (green / ember palette from the logo)
- Supabase (Postgres, Auth, Storage, RLS, Realtime)
- Deploy target: Netlify
