# Jovico Bikes — Full-Stack eBike Platform

A production-ready Next.js 15 eCommerce and content platform built for a Lagos-based eBike retailer. Features a public storefront, customer account dashboard, and a full-featured admin panel — all driven by a single MySQL database.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Feature Overview](#feature-overview)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Deployment](#deployment)
  - [Option A — Vercel + TiDB Serverless](#option-a--vercel--tidb-serverless)
  - [Option B — Vercel + Aiven MySQL](#option-b--vercel--aiven-mysql)
  - [Option C — Netlify + TiDB Serverless](#option-c--netlify--tidb-serverless)
  - [Option D — Hostinger VPS Self-Hosted](#option-d--hostinger-vps-self-hosted)
- [Default Credentials](#default-credentials)
- [Admin Panel Guide](#admin-panel-guide)
- [Customer Account Guide](#customer-account-guide)
- [Site Settings System](#site-settings-system)
- [Image Upload](#image-upload)
- [Architecture Decisions](#architecture-decisions)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 App Router, React Server Components |
| Language | TypeScript — zero `any` types throughout |
| Styling | Tailwind CSS v4 (CSS-first config) + custom design tokens |
| ORM | Prisma 5 |
| Database | MySQL 8 (TiDB / Aiven / Hostinger MySQL) |
| Auth | JWT via `jose` — separate admin + customer sessions, HTTP-only cookies |
| Passwords | bcryptjs (12 rounds) |
| Rich Text | TipTap v2 with StarterKit, Underline, Link, Placeholder, CharacterCount |
| Toasts | Sonner |
| Linting | Biome |
| Icons | Lucide React |

---

## Feature Overview

### Public Storefront

**Homepage**
- Full-screen hero with floating animated stats pills
- Looping autoplay video panel — URL, title, and subtitle configurable from admin Settings; hidden when URL is blank
- Featured bikes grid rendered from live DB data
- "Why Jovico" section with stat counters
- Services preview with workshop image
- Testimonials carousel
- Blog post preview (3 latest published posts)
- **eBike vs Petrol ROI/Savings Calculator** — fully client-side, live computation with range sliders and number inputs; calculates annual savings, monthly savings, break-even months, cost per km, and CO₂ saved
- Newsletter CTA
- Floating WhatsApp button (number from Settings)

**Shop**
- Server-rendered filtering via URL search params — shareable, bookmarkable, SEO-friendly
- Search, category filter, sort (price asc/desc, newest)
- Product detail with **multi-image slider**: touch swipe, keyboard arrow navigation, dot indicators, thumbnail strip, fullscreen lightbox
- Technical specs table
- Add to Cart (localStorage, dispatches `cart-updated` event for Navbar badge)
- WhatsApp Enquire button (number from Settings)

**Services**
- All services with pricing, duration, and featured badge
- Inline booking form with automatic prefill from customer session

**Blog**
- Category-filtered listing with hero featured post
- Article pages with TipTap-rendered HTML, reading time, view counter
- Share buttons (Twitter, WhatsApp)
- Related posts sidebar

**Account (Customer)**
- Register / Sign in — JWT, 30-day HTTP-only cookie
- Dashboard with order stats (total, delivered, in-progress)
- Order list with stacked item thumbnails
- Order detail with **live progress tracker** (step indicator), cancel button for PENDING orders, WhatsApp support link
- Profile editor: name, phone, delivery address
- Password change (requires current password verification)
- Soft account deletion

**Contact Forms — All Three Prefill from Session**

| Form | Fields prefilled | Email behaviour |
|---|---|---|
| Checkout | name, email, phone, delivery address | locked when signed in |
| Booking | name, email, phone | locked when signed in |
| Contact | name, email, phone | locked when signed in |

Each form shows a "Booking/Checking out/Sending as [Name]" indicator when signed in and a "Sign in" nudge for guests.

### Admin Panel

**Dashboard** — Revenue (paid orders), order count, product count, customer count (amber), unread messages, pending bookings, recent orders table, recent enquiries.

**Products** — Create/edit/delete, specs builder, publish toggle with instant `revalidatePath`.

**Product Images** — Per-product drag-and-drop upload or URL input. Set primary via DB transaction (ensures only one primary at a time). Delete removes DB record and file from disk. Primary badge shown on listing.

**Blog** — TipTap rich text editor with H2/H3, bold/italic/underline/code, bullet/numbered lists, blockquote, divider, link picker. Live word count + read time in toolbar. Save Draft or Publish in one click. Featured toggle (amber star).

**Customers** — Paginated list with search (name/email/phone) and filter (All/Active/Deleted). Stat cards. Customer detail: full order history with links, total spent, collapsible inline edit form, account actions (disable → soft-delete; restore; permanently delete).

**Orders** — List with inline status/payment dropdowns. Detail page: items, totals, customer info, shipping address, inline status selectors, WhatsApp customer shortcut.

**Services, Bookings, Enquiries, Subscribers, Analytics, Notifications** — Full CRUD and status management.

**Settings** — Phone, email, address, WhatsApp, social links, homepage video (URL, poster, title, subtitle). Save triggers `revalidatePath("/", "layout")` — no rebuild needed.

---

## Project Structure

```
app/
  (main)/
    (account-public)/account/    # Login + register — outside auth layout
    account/                     # Auth-guarded dashboard (layout redirects if no session)
      orders/[id]/
      profile/
      security/
    blog/[slug]/
    cart/                        # Server wrapper passes whatsapp prop to CartClient
    checkout/                    # "use client" — prefills from session on mount
    shop/[slug]/                 # Fetches settings for whatsapp prop
    services/ accessories/ about/ contact/ privacy/ terms/
    page.tsx                     # Homepage — fetches video settings + all sections
  admin/
    customers/[id]/
    orders/[id]/
    shop/[id]/ blog/[id]/ services/[id]/
    ...
  api/
    admin/customers/[id]/        # Admin: GET profile+orders, PATCH edit/restore/hard-delete, DELETE soft-delete
    admin/customers/             # Admin: GET list with search + filter + pagination + stats
    auth/                        # Admin JWT login/logout/session
    customer/auth/               # Customer register/login/logout/session
    customer/profile/            # GET, PATCH (edit + password change), DELETE (soft-delete)
    customer/orders/[id]/        # GET detail, PATCH (cancel PENDING only)
    customer/orders/             # GET list
    blog/[id]/ blog/             # CRUD + revalidatePath
    products/[id]/images/[imageId]/  # PATCH set-primary, DELETE
    products/[id]/images/        # GET list, POST upload (multipart or URL)
    products/[id]/ products/     # CRUD + revalidatePath
    orders/[id]/ orders/         # POST resolves customerId from session cookie
    services/[id]/ services/
    settings/                    # POST saves + revalidatePath layout
    subscribers/export/
    bookings/[id]/ bookings/
    contact/[id]/ contact/

components/
  account/     # AccountSidebar, CancelOrderButton, CustomerLoginForm, DeleteAccountButton, PasswordForm, ProfileForm
  admin/       # All admin UI: editors, toggles, status selects, image manager, customer actions
  home/        # BookingForm, ContactForm, EBikeROICalculator, HomepageVideoSection
  layout/      # Navbar, Footer, SiteSettingsProvider
  shop/        # AddToCartButton, CartClient, EnquireButton, ProductImageSlider, ShopFilters

lib/
  auth.ts          # Admin JWT: signToken, verifyToken, requireAuth
  customerAuth.ts  # Customer JWT + bcrypt: register, login, getCustomerSession, requireCustomer
  getSettings.ts   # Server-side typed settings helper with fallbacks + waNumber()
  prisma.ts        # Singleton PrismaClient
  utils.ts         # formatNaira, formatDate, createSlug, generateOrderNumber, getReadTime, cn

types/index.ts     # CartItem, ProductEditorData, ServiceEditorData, PostEditorData,
                   # OrderWithItems, ShippingAddress, AdminSession, CustomerSession, SiteSettingsMap

middleware.ts      # Guards /admin/* (admin JWT) and /account/* (customer JWT)
prisma/
  schema.prisma    # Customer, Admin, Product, ProductImage, Service, Booking, Post,
                   # Order (customerId FK), OrderItem, ContactMessage, Subscriber, SiteSetting
  seed.ts          # 4 customers, 8 products (6 bikes + 2 accessories), 7 orders, 6 services,
                   # 6 blog posts, 6 bookings, 4 messages, 6 subscribers, all site settings
```

---

## Environment Variables

```bash
# .env (never commit this file)

# MySQL connection string
DATABASE_URL="mysql://user:password@host:3306/jovico_bikes"

# JWT secrets — generate with: openssl rand -base64 32
JWT_SECRET="your-admin-jwt-secret-min-32-chars"
CUSTOMER_JWT_SECRET="your-customer-jwt-secret-min-32-chars"

# Public app URL (no trailing slash)
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
```

A `.env.example` file is included in the repo with all keys listed but no values.

---

## Local Development

```bash
git clone https://github.com/yourname/jovico-bikes.git
cd jovico-bikes
npm install
cp .env.example .env
# Fill in .env with your DATABASE_URL and JWT secrets
npm run db:push
npm run db:seed
npm run dev
```

Open http://localhost:3000. Admin at http://localhost:3000/admin.

**Scripts:**

```bash
npm run dev          # Turbopack dev server
npm run build        # Production build
npm run start        # Production server
npm run db:push      # Push schema (no migration files)
npm run db:migrate   # Create and run migrations
npm run db:seed      # Seed demo data
npm run db:studio    # Prisma Studio visual DB browser
npm run lint         # Biome linter
```

---

## Deployment

### Option A — Vercel + TiDB Serverless

**Recommended for most deployments.** TiDB Serverless has a generous free tier (5 GB storage, 50M row reads/month) and is MySQL-compatible with Prisma out of the box.

**Step 1 — Create TiDB Serverless cluster**

1. Sign up at [tidbcloud.com](https://tidbcloud.com)
2. New Cluster → Serverless → choose region (`ap-southeast-1` is closest to Nigeria)
3. Once running: Connect → Prisma → copy the connection string
4. Format: `mysql://username.root:password@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/jovico_bikes?ssl={"rejectUnauthorized":true}`
5. Create the database if it doesn't exist: in TiDB console → SQL Editor → `CREATE DATABASE jovico_bikes;`

**Step 2 — Push schema**

```bash
# Locally, pointing at TiDB
DATABASE_URL="mysql://..." npm run db:push
DATABASE_URL="mysql://..." npm run db:seed
```

**Step 3 — Deploy to Vercel**

```bash
npm i -g vercel
vercel
```

Or via the dashboard: New Project → Import GitHub repo → Framework: Next.js.

**Step 4 — Environment variables in Vercel**

In Project → Settings → Environment Variables, add:

| Key | Value |
|---|---|
| `DATABASE_URL` | Your TiDB connection string |
| `JWT_SECRET` | Random 32+ char string |
| `CUSTOMER_JWT_SECRET` | Different random 32+ char string |
| `NEXT_PUBLIC_SITE_URL` | `https://yourproject.vercel.app` |

**Step 5 — Build command (optional but recommended)**

In project settings, set the build command to:
```
prisma generate && prisma db push && next build
```
This ensures Prisma client is regenerated on every deploy.

**Step 6 — Custom domain**

Project → Domains → Add your domain → update DNS as shown.

---

### Option B — Vercel + Aiven MySQL

Aiven provides a managed MySQL service with automated backups, point-in-time recovery, and fine-grained access control.

**Step 1 — Create Aiven MySQL service**

1. Sign up at [aiven.io](https://aiven.io)
2. New Service → MySQL → choose cloud + region → Start Free Trial
3. Service Overview → Connection Information → URI
4. Go to Databases tab → Create database: `jovico_bikes`
5. Update the URI to use `jovico_bikes` instead of `defaultdb`

Connection string format:
```
mysql://avnadmin:password@mysql-xxxxx.aivencloud.com:19784/jovico_bikes?ssl-mode=REQUIRED
```

**Step 2 — Configure Prisma for Aiven SSL**

Aiven requires SSL. The `ssl-mode=REQUIRED` query param in the connection string handles this. No other changes to `schema.prisma` are needed.

**Step 3 — Push schema and seed**

```bash
DATABASE_URL="mysql://avnadmin:...aivencloud.com.../jovico_bikes?ssl-mode=REQUIRED" npm run db:push
DATABASE_URL="mysql://avnadmin:..." npm run db:seed
```

**Step 4 — Deploy to Vercel**

Follow the same steps as Option A, using your Aiven `DATABASE_URL`.

---

### Option C — Netlify + TiDB Serverless

**Step 1 — Create TiDB cluster** — same as Option A.

**Step 2 — Add Netlify Next.js plugin**

```bash
npm i @netlify/plugin-nextjs
```

Create `netlify.toml` in the project root:

```toml
[build]
  command   = "npm run build"
  publish   = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "20"
```

**Step 3 — Deploy**

```bash
npm i -g netlify-cli
netlify login
netlify init        # link to new site
netlify deploy --prod
```

Or connect via GitHub in the Netlify dashboard.

**Step 4 — Environment variables**

Site → Site Configuration → Environment Variables → Add:

```
DATABASE_URL         = mysql://...
JWT_SECRET           = ...
CUSTOMER_JWT_SECRET  = ...
NEXT_PUBLIC_SITE_URL = https://yoursite.netlify.app
```

**Step 5 — Run DB setup**

```bash
npm run db:push
npm run db:seed
```

> Note: Netlify's serverless functions have a 10-second timeout by default. If your DB connection is slow, upgrade to Netlify Pro for 26-second timeouts, or use Edge Functions for critical paths.

---

### Option D — Hostinger VPS Self-Hosted

Full control, persistent file storage for product image uploads, and use of Hostinger's included MySQL database.

**Prerequisites:** Hostinger VPS KVM 2 (2 vCPU, 8 GB RAM) or higher, Ubuntu 22.04, SSH access.

**Step 1 — Provision the server**

```bash
ssh root@your-vps-ip

apt update && apt upgrade -y

# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# PM2 process manager
npm i -g pm2

# Nginx reverse proxy
apt install -y nginx

# Certbot for SSL
apt install -y certbot python3-certbot-nginx
```

**Step 2 — Create the MySQL database**

**Via Hostinger hPanel (recommended):**
1. hPanel → Hosting → Databases → MySQL
2. Create database: `jovico_bikes`
3. Create database user, assign strong password
4. Add user to database with All Privileges

Connection string:
```
DATABASE_URL="mysql://jovico_user:yourpassword@localhost:3306/jovico_bikes"
```

**Via SSH (if running your own MySQL):**
```bash
apt install -y mysql-server
mysql_secure_installation
mysql -u root -p -e "
  CREATE DATABASE jovico_bikes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  CREATE USER 'jovico_user'@'localhost' IDENTIFIED BY 'yourpassword';
  GRANT ALL ON jovico_bikes.* TO 'jovico_user'@'localhost';
  FLUSH PRIVILEGES;
"
```

**Step 3 — Deploy the app**

```bash
mkdir -p /var/www/jovico-bikes
cd /var/www/jovico-bikes
git clone https://github.com/yourname/jovico-bikes.git .

# Create environment file
cat > .env << EOF
DATABASE_URL="mysql://jovico_user:yourpassword@localhost:3306/jovico_bikes"
JWT_SECRET="$(openssl rand -base64 32)"
CUSTOMER_JWT_SECRET="$(openssl rand -base64 32)"
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
NODE_ENV="production"
EOF

npm install
npm run db:push
npm run db:seed
npm run build

# Create uploads directory
mkdir -p public/uploads/products
chmod 755 public/uploads
```

**Step 4 — Configure PM2**

```bash
pm2 start npm --name "jovico-bikes" -- start
pm2 save
pm2 startup  # run the command it outputs
```

Useful PM2 commands:
```bash
pm2 status              # check if running
pm2 logs jovico-bikes   # tail logs
pm2 reload jovico-bikes # zero-downtime reload after deploy
pm2 stop jovico-bikes   # stop
```

**Step 5 — Configure Nginx**

```bash
cat > /etc/nginx/sites-available/jovico-bikes << 'NGINX'
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    client_max_body_size 20M;

    location / {
        proxy_pass         http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
    }

    # Serve uploaded product images as static files — much faster
    location /uploads/ {
        alias   /var/www/jovico-bikes/public/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
NGINX

ln -s /etc/nginx/sites-available/jovico-bikes /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

**Step 6 — Enable HTTPS**

```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
# Follow the prompts. Certbot auto-configures Nginx and sets up auto-renewal.
```

**Step 7 — Deployment script**

Create `/var/www/jovico-bikes/deploy.sh`:

```bash
#!/bin/bash
set -e
cd /var/www/jovico-bikes
echo "Pulling latest..."
git pull origin main
echo "Installing dependencies..."
npm install
echo "Building..."
npm run build
echo "Reloading PM2..."
pm2 reload jovico-bikes
echo "Done at $(date)"
```

```bash
chmod +x deploy.sh
./deploy.sh   # run manually after pushing to GitHub
```

---

## Default Credentials

After `npm run db:seed`:

| Role | Email | Password |
|---|---|---|
| Admin (Super) | admin@jovicobikes.com | jovico@admin2024 |
| Admin (Editor) | editor@jovicobikes.com | jovico@admin2024 |
| Customer | emeka@gmail.com | customer123 |
| Customer | ngozi@hotmail.com | customer123 |
| Customer | tunde@yahoo.com | customer123 |
| Customer | amara@gmail.com | customer123 |

**Change all passwords immediately after first login in production.**

---

## Admin Panel Guide

All admin routes are at `/admin` and protected by middleware JWT verification.

### Products

1. Create a product → fill name, SKU, price, stock, category, type, specs
2. After saving → go to the product's edit page → use the **Image Manager** section below the product form
3. Drag and drop multiple images, or click "Add URL" for external images
4. Click the star icon on any image to make it primary (used in listings and at the top of the product page)
5. Use the Publish toggle — changes appear on the site immediately, no rebuild

### Blog

The editor uses **TipTap** — write content like in Notion or Google Docs.

- Toolbar: Undo/Redo | H2 H3 | **B** *I* U `code` | lists | blockquote | — | link
- Live word count and read time shown in the toolbar
- **Save Draft** — saves without publishing
- **Save & Publish** / **Update & Keep Published** — publishes immediately

### Customers

- Search by name, email, or phone in real time (server-rendered)
- Filter: All / Active / Deleted accounts
- On a customer detail page, click "Edit Profile" to expand the inline editor
- **Disable Account** → soft-delete (locked out, data preserved, reversible)
- **Restore Account** → instantly re-enables
- **Permanently Delete** → only available on already-disabled accounts; removes personal data, keeps order records

### Settings

- All changes apply site-wide instantly — no rebuild or deployment required
- WhatsApp number: international format, no spaces (e.g. `+2348012345678`)
- Homepage Video URL: direct `.mp4` link. Leave blank to hide the video section.

### Notifications

- Shows all PENDING orders, unconfirmed bookings, and unread messages in chronological order
- Each card is a direct link to the relevant admin detail page
- Uses `force-dynamic` — always fresh data

---

## Customer Account Guide

**Registration:** `/account/register` — name, email, optional phone, password (min 8 chars)

**Session:** 30-day JWT stored as HTTP-only cookie, verified in middleware on every `/account/*` request

**What customers can do:**
- View all orders and order detail with progress tracker
- Cancel PENDING orders (two-step confirmation)
- Edit name, phone, delivery address
- Change password (current password required)
- Soft-delete their account (cannot log in again; admin can restore)

**Order linking:** When a signed-in customer places an order, the server reads the `jovico_customer_session` cookie and attaches `customerId` to the order automatically. No client-side data is trusted for this.

**Form prefill:** On Checkout, Booking, and Contact pages, a `GET /api/customer/profile` call on mount populates the form fields. The email field is locked (`readOnly`) when signed in.

---

## Site Settings System

Settings live in the `SiteSetting` table (key/value pairs). Supported keys:

| Key | Default | Used in |
|---|---|---|
| `site_name` | Jovico Bikes | Footer, about page, page titles |
| `tagline` | Ride Electric. Ride Lagos. | Footer |
| `phone` | +234 801 234 5678 | Footer, contact, about |
| `email` | hello@jovicobikes.com | Footer, contact, about, privacy, terms |
| `address` | 14 Adeola Odeku... | Footer, contact, about |
| `whatsapp` | +2348012345678 | All WhatsApp links, floating button, cart, shop |
| `instagram` | https://instagram.com/... | Footer |
| `twitter` | https://twitter.com/... | Footer |
| `facebook` | https://facebook.com/... | Footer |
| `hero_video_url` | (empty) | Homepage video section; hidden when blank |
| `hero_video_poster` | (empty) | Video thumbnail before load |
| `hero_video_title` | Feel the Electric Difference | Video overlay heading |
| `hero_video_subtitle` | See what riding... | Video overlay subtext |

**In client components** (inside `(main)` layout):
```tsx
const s = useSiteSettings(); // from SiteSettingsProvider context
```

**In server components** (anywhere):
```tsx
const s = await getSettings(["phone", "whatsapp"]);
const wa = waNumber(s); // digits only for wa.me links
```

---

## Image Upload

Product images upload to `public/uploads/products/` and are served at `/uploads/products/filename.jpg`.

**On Hostinger VPS:** this works as-is. Files persist across deployments as long as the directory is not deleted.

**On Vercel / Netlify (serverless):** the filesystem is ephemeral — uploaded files will disappear after the next deployment. You need object storage. Example migration to **Cloudflare R2**:

1. Add the AWS S3 SDK: `npm i @aws-sdk/client-s3`

2. Update `app/api/products/[id]/images/route.ts`:

```typescript
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CF_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CF_SECRET_ACCESS_KEY!,
  },
});

// Replace the writeFile call with:
const key = `products/${productId}-${Date.now()}.${ext}`;
await r2.send(new PutObjectCommand({
  Bucket: process.env.CF_BUCKET_NAME!,
  Key: key,
  Body: buffer,
  ContentType: file.type,
}));
const url = `${process.env.CF_PUBLIC_URL}/${key}`;
```

3. Add to `.env`:
```
CF_ACCOUNT_ID=...
CF_ACCESS_KEY_ID=...
CF_SECRET_ACCESS_KEY=...
CF_BUCKET_NAME=jovico-products
CF_PUBLIC_URL=https://pub-xxxx.r2.dev
```

---

## Architecture Decisions

**Route groups for auth isolation.** Login and register live in `app/(main)/(account-public)/account/` — a parallel route group at the same URL level as the auth-guarded `app/(main)/account/`. This means `/account/login` resolves but does not inherit the `account/layout.tsx` auth redirect, preventing an infinite loop.

**Two completely independent JWT systems.** Admin (`jovico_admin_session`) and customer (`jovico_customer_session`) sessions use separate secrets, separate helper files (`lib/auth.ts` vs `lib/customerAuth.ts`), and separate cookies. A compromised customer token can never grant admin access.

**Soft delete everywhere.** `Customer.deletedAt` and the admin restore/hard-delete flow ensure data is never accidentally lost. Order history is always preserved. Hard delete is a deliberate two-step action available only on already-disabled accounts.

**Settings as DB rows.** All customer-facing contact details (phone, email, WhatsApp, address) live in `SiteSetting` rows rather than environment variables. A non-technical admin can change the phone number in the Settings page without touching code or environment variables. `revalidatePath("/", "layout")` after save means changes go live on the next request.

**Server-first rendering.** All data fetching happens in server components using `async/await` directly — no `useEffect` + `fetch` waterfalls for initial page data. Client components only call APIs when responding to user interaction (checkout prefill, cart updates, form submissions).

**`customerId` resolved server-side.** The orders API reads the `jovico_customer_session` cookie in the POST handler and attaches `customerId` to the order automatically. The client never sends a user ID — it cannot be spoofed.

**Dual accent system.** `--jv-green (#22C55E)` for primary actions, published state, delivered status. `--jv-amber (#F59E0B)` for pending status, SALE badges, customer avatars, the customers stat card. Both available as `.jv-btn-green`, `.jv-btn-amber`, and `.jv-badge-amber` utility classes.
