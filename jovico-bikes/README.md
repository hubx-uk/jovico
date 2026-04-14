# Jovico Bikes 🚴⚡

Lagos's premier eBike retailer and service centre — built with **Next.js 15**, **shadcn/ui**, **Biome**, **Prisma**, and **MySQL**.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| UI Components | shadcn/ui + Radix UI |
| Styling | Tailwind CSS |
| Linting/Formatting | Biome |
| Database ORM | Prisma |
| Database | MySQL (Hostinger) |
| Auth | JWT + Iron Session (cookie-based) |
| Animation | Framer Motion |
| Notifications | Sonner toast |
| Fonts | Sora (Google Fonts) |

---

## Project Structure

```
jovico-bikes/
├── app/
│   ├── main/                  # Public-facing pages
│   │   ├── page.tsx           # Homepage
│   │   ├── shop/              # Shop listing + product detail
│   │   ├── services/          # Services + booking form
│   │   ├── accessories/       # Accessories listing
│   │   ├── about/             # About, team, location
│   │   ├── blog/              # Blog listing + post detail
│   │   ├── contact/           # Contact page
│   │   ├── privacy/           # Privacy policy
│   │   └── terms/             # Terms of service
│   ├── admin/                 # Admin dashboard (auth-protected)
│   │   ├── page.tsx           # Dashboard overview
│   │   ├── login/             # Login page
│   │   ├── blog/              # Blog CRUD
│   │   ├── shop/              # Products CRUD
│   │   ├── orders/            # Order management
│   │   ├── bookings/          # Service booking management
│   │   ├── enquiries/         # Contact message inbox
│   │   ├── subscribers/       # Newsletter subscribers
│   │   └── settings/          # Site settings
│   ├── api/                   # REST API routes
│   │   ├── auth/              # Login/logout/session
│   │   ├── products/          # Products CRUD
│   │   ├── blog/              # Posts CRUD
│   │   ├── bookings/          # Booking management
│   │   ├── contact/           # Contact form
│   │   ├── orders/            # Order processing
│   │   ├── settings/          # Site settings
│   │   └── subscribers/       # Newsletter + CSV export
│   ├── layout.tsx             # Root layout
│   ├── not-found.tsx          # 404 page
│   └── globals.css            # Global styles + Tailwind
├── components/
│   ├── layout/                # Navbar, Footer
│   ├── admin/                 # Admin UI components
│   ├── shop/                  # Cart, product components
│   └── home/                  # Forms, interactive components
├── lib/
│   ├── prisma.ts              # Prisma client singleton
│   ├── auth.ts                # JWT auth utilities
│   └── utils.ts               # Shared helpers
├── prisma/
│   ├── schema.prisma          # Database schema (MySQL)
│   └── seed.ts                # Database seeder
├── middleware.ts              # Admin route protection
├── biome.json                 # Biome linter/formatter config
├── tailwind.config.ts         # Tailwind + brand tokens
└── next.config.ts             # Next.js config
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# MySQL database (Hostinger)
DATABASE_URL="mysql://USERNAME:PASSWORD@HOST:3306/jovico_bikes"

# Auth secrets — generate strong random strings
JWT_SECRET="your-super-secret-jwt-key-min-32-characters"
SESSION_SECRET="your-session-secret-key-32chars!!"

# Site URL
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 3. Create the Database

On **Hostinger**, create a new MySQL database via the hPanel, then note the:
- Host (usually `localhost` or a specific MySQL host)
- Username
- Password
- Database name

### 4. Push Schema & Seed

```bash
# Generate Prisma client
pnpm run db:generate

# Push schema to MySQL
pnpm run db:push

# Seed with sample data
pnpm run db:seed
```

This creates:
- ✅ Admin account: `admin@jovicobikes.com` / `jovico@admin2024`
- ✅ 5 sample bikes
- ✅ 6 services
- ✅ 3 blog posts
- ✅ Site settings

### 5. Run Development Server

```bash
pnpm run dev
```

Visit:
- 🌐 Site: `http://localhost:3000`
- 🔐 Admin: `http://localhost:3000/admin`

---

## Pages

### Public Site
| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, featured bikes, services, blog preview |
| `/shop` | Full product listing with category filters + search |
| `/shop/[slug]` | Individual product detail with specs table |
| `/services` | Services listing + inline booking form |
| `/accessories` | Accessories shop |
| `/about` | Company story, team, location |
| `/blog` | Blog listing with category filter |
| `/blog/[slug]` | Full blog post with sidebar and related posts |
| `/contact` | Contact info + message form |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

### Admin Dashboard (`/admin`)
| Route | Description |
|-------|-------------|
| `/admin` | Dashboard overview with stats and recent activity |
| `/admin/shop` | Product list with publish toggle + delete |
| `/admin/shop/new` | Add new product with specs editor |
| `/admin/shop/[id]` | Edit product |
| `/admin/blog` | Blog post list with publish toggle |
| `/admin/blog/new` | Rich text blog post editor |
| `/admin/blog/[id]` | Edit blog post |
| `/admin/orders` | Order list with status updater |
| `/admin/bookings` | Service bookings with status management |
| `/admin/enquiries` | Contact message inbox with mark-read |
| `/admin/subscribers` | Newsletter subscribers + CSV export |
| `/admin/settings` | Site-wide settings (contact info, social links) |

---

## Deploying to Hostinger

### 1. Build Locally

```bash
pnpm run build
```

### 2. Upload via FTP or Git

Hostinger supports Node.js apps via their **Node.js** or **Business Hosting** plans. You can:

**Option A: Git Deploy**
1. Push to GitHub
2. In hPanel → Git → Link repository
3. Set build command: `pnpm install && pnpm run build`
4. Set start command: `pnpm start`

**Option B: FTP Upload**
1. Run `pnpm run build`
2. Upload the entire project folder (including `.next/`, `public/`, `prisma/`, `node_modules/`)
3. Set entry point to `node_modules/.bin/next start`

### 3. Environment Variables on Hostinger

In hPanel → Node.js → Environment Variables, add all variables from `.env.example`.

### 4. MySQL Setup on Hostinger

1. hPanel → Databases → MySQL Databases
2. Create database: `jovico_bikes`
3. Create user with full privileges
4. Note the connection details for `DATABASE_URL`
5. Once deployed, run `pnpm run db:push && pnpm run db:seed` via SSH

---

## Customisation

### Brand Colors
Edit `tailwind.config.ts` → `theme.extend.colors.brand`:
```ts
accent: "#22C55E",      // Change to your accent colour
accentDark: "#16A34A",
```

### Adding Product Images
Replace placeholder emoji with real images by:
1. Upload images to `/public/images/bikes/`
2. Update `ProductImage` records in the database
3. Use `next/image` in product components

### Rich Text Editor
Currently uses a plain `<textarea>` for content. To add a WYSIWYG editor, install `@tiptap/react` or `react-quill` and replace the `BlogPostEditor` textarea.

### Payment Integration
Add Paystack or Flutterwave by:
1. Install their Node.js SDK
2. Create `/api/payments/route.ts` for webhook handling
3. Update order flow in checkout

---

## Scripts

```bash
pnpm run dev          # Start dev server
pnpm run build        # Build for production
pnpm run start        # Start production server
pnpm run db:push      # Push schema to database
pnpm run db:generate  # Regenerate Prisma client
pnpm run db:migrate   # Create + run migrations
pnpm run db:seed      # Seed sample data
pnpm run db:studio    # Open Prisma Studio (GUI)
pnpm run check        # Run Biome lint + format check
pnpm run format       # Format all files with Biome
```

---

## Default Admin Credentials

> ⚠️ **Change these immediately after first login!**

- Email: `admin@jovicobikes.com`
- Password: `jovico@admin2024`

---

## Support

Built with ❤️ for Jovico Bikes, Lagos Nigeria.
