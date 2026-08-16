# The Green Corner — Website & Admin Dashboard

A premium website + real admin dashboard for The Green Corner, a smoothie &
salad bar in Nyamirambo, Kigali. Built with React (Vite) + Tailwind CSS on the
frontend and Supabase (Postgres + Auth + Storage) on the backend.

The public site works immediately with placeholder content — nothing to set up.
Connecting Supabase (free tier, ~5 minutes) turns on the admin dashboard,
reservation/order storage, real image uploads, and lets the site pull live
content instead of demo data.

**A note on content:** this project originally started as a bar & grill
concept based on a different Kigali business's public listing. It was pivoted
to a smoothie & salad bar once the real logo was provided. Because of that,
we don't have a verified Google listing for this version — phone number,
hours, prices and every menu item are placeholders clearly marked
`PLACEHOLDER` throughout the code and the UI. None of it should be shown to
a real customer until the owner confirms it.

---

## 1. Run it locally

```bash
npm install
npm run dev
```

Open the printed local URL. The whole public site works right away on demo data.

## 2. Deploy for free (Netlify)

1. Push this folder to a GitHub repo.
2. In Netlify: **Add new site → Import an existing project → pick the repo.**
3. Build command: `npm run build` — Publish directory: `dist` (already set in `netlify.toml`).
4. Deploy. You'll get a free `*.netlify.app` URL for demos.

## 3. Connect Supabase (turns on the real admin dashboard)

1. Go to [supabase.com](https://supabase.com) → New project (free tier is enough).
2. Open **SQL Editor → New query**, paste the entire contents of
   `supabase/schema.sql`, and run it. Then run `supabase/002_media.sql` the
   same way — this adds logo/hero-video support, a storage bucket for
   uploads, and sets sensible default hero images. Then run
   `supabase/004_reviews_and_social.sql` — this adds the reviews table and
   Facebook/TikTok fields.
   - **Already ran an older version of this schema?** If your admin dashboard
     or live site is still showing old bar & grill content (grilled fish,
     "booth seating", etc.), also run `supabase/003_reset_content.sql` — it
     clears the old placeholder rows and replaces them with the current
     smoothie & salad bar placeholders.
3. Go to **Project Settings → API** and copy the **Project URL** and **anon public key**.
4. In this project, copy `.env.example` to `.env` and paste those two values in.
5. In Netlify, add the same two variables under **Site settings → Environment variables**,
   then redeploy.
6. Create your admin login: Supabase dashboard → **Authentication → Users → Add user**
   (use the owner's email + a password). That's what you'll log in with at `/admin`.

Once connected:
- The public site automatically switches from demo data to live Supabase data.
- `/admin` becomes a real, working dashboard — no more "not connected" message.
- Order/inquiry forms save directly to the database.
- The **Logo & Hero Media** admin page lets you upload real photos or a short
  video to replace the illustrated placeholders.

## 4. Using the admin dashboard

Go to `yoursite.com/admin`, log in with the email/password you created in step 6 above.

You can manage, without touching code:
- Menu categories & items (name, description, price, image, availability)
- Gallery images
- Specials / promotions (activate or deactivate)
- Opening hours
- Business info (phone, WhatsApp, Instagram, description)
- Logo and hero photos/video (real file uploads via Supabase Storage)
- Reviews — add real customer testimonials with a star rating, show/hide individually
- Facebook and TikTok links (Instagram was already there)
- Incoming order requests (mark confirmed/cancelled)
- Incoming customer inquiries (mark replied/closed)

The dashboard is responsive and fully usable from a phone.

## 5. What the real business owner needs to provide

- Real phone number and WhatsApp number
- Confirmed opening hours
- Real menu items, ingredients and prices (everything is currently a sample)
- Real food/interior photography, or a short hero video, to replace the
  illustrated placeholders
- Confirmation this is in fact the business's logo and concept
- The correct pinned Google Maps location

## 6. Known placeholders (clearly marked in the UI, not hidden)

- All menu items and prices
- Phone number and price range
- Opening hours
- Gallery images (flat illustrations, not real photos)
- The two "specials" — sample ideas only
- Google rating (not shown until a real one is confirmed)

## 7. Other features

- **Live "Open Now / Closed" badge** on the homepage, computed automatically from your opening hours — no manual toggling needed.
- **English / Kinyarwanda language switcher** (top right of the nav). This translates the site's own text (navigation, buttons, section headers, form labels) — content you type into the admin dashboard (menu items, descriptions, reviews) stays in whichever language you entered it in. The Kinyarwanda translations are a first pass — have a native speaker review them before launch.
- **Sticky mobile action bar** (Call / WhatsApp / Order) fixed to the bottom of the screen on phones, so the most important actions are always one tap away.

## 8. SEO

The site includes:
- Per-page titles, meta descriptions, canonical URLs and Open Graph/Twitter tags (`src/components/SEO.jsx`, used on every page)
- `LocalBusiness`/`Restaurant` structured data on the homepage (`src/components/LocalBusinessSchema.jsx`) — it only includes fields that aren't marked `PLACEHOLDER`, so it won't tell Google incorrect information
- `robots.txt` and `sitemap.xml` in `/public`, with `/admin` excluded from indexing
- Semantic heading structure (one `<h1>` per page), descriptive `alt` text on every image

**Before this goes live, update the placeholder domain** in three places —
search for `the-green-corner.netlify.app` and replace with your real URL:
- `src/lib/siteConfig.js` (`SITE_URL`)
- `public/robots.txt`
- `public/sitemap.xml`
- `index.html` (canonical link)

As real menu items, hours, and a phone number are added via the admin
dashboard, the structured data on the homepage will automatically pick them
up — no code changes needed.

## Tech stack

- React 18 + Vite + React Router
- Tailwind CSS (palette sampled from the real logo)
- Supabase (Postgres, Auth, Storage, Row Level Security)
- Deploy target: Netlify (free tier)
