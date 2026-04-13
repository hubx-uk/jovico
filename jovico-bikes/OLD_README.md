# Jovico Bikes - Premium eBike Platform

A full-stack e-commerce platform for Jovico Bikes, an eBike seller and servicing company based in Lagos, Nigeria. Built with React, Node.js, Express, and MySQL, featuring a premium, mobile-first design with white/black/forest-green color scheme.

## Features

### Public Storefront
- **Premium Homepage** - Hero section with call-to-action, featured products showcase, and services overview
- **Product Shop** - Browse eBikes and accessories with filtering, pagination, and detailed product information
- **Product Details** - Full product pages with image gallery, specifications, and add-to-cart functionality
- **Blog** - Read articles and updates about eBikes and services
- **Checkout Flow** - Multi-step checkout with customer details, payment method selection, and proof of payment upload
- **Contact Page** - Get in touch with the Jovico Bikes team
- **Mobile-First Design** - Fully responsive across all devices

### Admin Dashboard
- **Orders Management** - View all orders, filter by status, update order status, and manage customer details
- **Products Management** - Create, edit, and delete products (eBikes and accessories)
- **Blog Management** - Create, edit, publish/unpublish blog posts
- **Videos Management** - Upload and manage promotional videos for the homepage
- **Dashboard Home** - Key metrics including total orders, revenue, products, and blog posts
- **Role-Based Access Control** - Admin-only access with Manus OAuth authentication

### Order Processing
- **WhatsApp Integration** - Order details automatically sent to admin via WhatsApp (wa.me deep links)
- **Payment Proof Upload** - Customers upload payment screenshots during checkout
- **Order Status Tracking** - Admin manually updates order status (pending → confirmed → processing → shipped → delivered)
- **Database Persistence** - All orders and payment proofs stored securely in MySQL

### Design & UX
- **Premium Aesthetic** - White and black primary colors with forest green and amber accents
- **Tailwind CSS 4** - Modern utility-first styling with custom design tokens
- **shadcn/ui Components** - High-quality, accessible UI components
- **Mobile-First Approach** - Optimized for mobile devices first, then scaled up
- **Smooth Animations** - Framer Motion for polished micro-interactions

## Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - Component library
- **Wouter** - Lightweight routing
- **tRPC** - Type-safe API communication
- **Framer Motion** - Animations

### Backend
- **Node.js** - Runtime
- **Express 4** - Web framework
- **tRPC 11** - RPC framework
- **Drizzle ORM** - Database ORM
- **MySQL 2** - Database driver

### Database
- **MySQL** - Relational database
- **Drizzle Kit** - Schema management and migrations

### Testing
- **Vitest** - Unit testing framework
- **29 passing tests** - Comprehensive backend test coverage

## Project Structure

```
jovico-bikes/
├── client/                      # React frontend
│   ├── src/
│   │   ├── pages/              # Page components (Home, Shop, Blog, Admin, etc.)
│   │   ├── components/         # Reusable UI components
│   │   ├── lib/                # Utilities and helpers
│   │   ├── App.tsx             # Main app component with routing
│   │   └── index.css           # Global styles and design tokens
│   ├── index.html              # HTML entry point
│   └── dist/                   # Built frontend (production)
├── server/                      # Express backend
│   ├── routers.ts              # tRPC procedure definitions
│   ├── db.ts                   # Database query helpers
│   ├── whatsapp.ts             # WhatsApp notification helpers
│   ├── _core/                  # Framework infrastructure
│   └── *.test.ts               # Backend tests
├── drizzle/                     # Database schema and migrations
│   ├── schema.ts               # Table definitions
│   └── *.sql                   # Migration files
├── shared/                      # Shared types and constants
├── storage/                     # S3 storage helpers
├── dist/                        # Built backend (production)
├── package.json                # Dependencies and scripts
├── DEPLOYMENT.md               # Deployment guide
├── HOSTINGER_DEPLOYMENT.md     # Hostinger-specific deployment
└── README.md                   # This file
```

## Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- MySQL 5.7+ or compatible database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jovico-bikes
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the project root:
   ```env
   # Database
   DATABASE_URL=mysql://user:password@localhost:3306/jovico_bikes

   # Authentication
   JWT_SECRET=your_secure_jwt_secret_here
   OAUTH_SERVER_URL=https://api.manus.im

   # OAuth Configuration
   VITE_APP_ID=your_app_id
   VITE_OAUTH_PORTAL_URL=https://portal.manus.im

   # Owner Information
   OWNER_NAME=Your Name
   OWNER_OPEN_ID=your_open_id

   # Manus APIs
   BUILT_IN_FORGE_API_URL=https://api.manus.im
   BUILT_IN_FORGE_API_KEY=your_api_key
   VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
   VITE_FRONTEND_FORGE_API_KEY=your_frontend_api_key

   # App Configuration
   VITE_APP_TITLE=Jovico Bikes
   VITE_APP_LOGO=https://your-cdn-url/logo.png

   # WhatsApp Admin Phone
   ADMIN_WHATSAPP_PHONE=+234XXXXXXXXXX
   ```

4. **Set up the database**
   ```bash
   pnpm db:push
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:3000`

## Development

### Running Tests
```bash
pnpm test
```

### Building for Production
```bash
pnpm build
```

### Starting Production Server
```bash
pnpm start
```

### Code Formatting
```bash
pnpm format
```

### Type Checking
```bash
pnpm check
```

## Database Schema

The application uses the following main tables:

- **users** - User accounts with role-based access (admin/user)
- **products** - eBikes and accessories catalog
- **orders** - Customer orders with status tracking
- **blog_posts** - Blog articles with publish status
- **pages** - Static pages (About, Services, etc.)
- **videos** - Promotional videos for homepage
- **media_assets** - Uploaded media files (images, videos)

## API Endpoints

All API communication uses tRPC with type-safe procedures:

### Public Procedures
- `products.list` - Get products with filtering
- `blogPosts.list` - Get published blog posts
- `orders.create` - Create a new order
- `pages.getBySlug` - Get page content

### Protected Procedures (Admin Only)
- `orders.list` - List all orders
- `orders.updateStatus` - Update order status
- `products.create/update/delete` - Manage products
- `blogPosts.create/update/delete` - Manage blog posts
- `videos.list/create/delete` - Manage videos

## WhatsApp Integration

Orders are automatically sent to the admin via WhatsApp using deep links:

1. **Order Notification** - When a customer completes checkout, order details are formatted and sent via `wa.me` link
2. **Payment Proof** - Customer uploads payment screenshot during checkout
3. **Manual Status Updates** - Admin updates order status from the dashboard

Example WhatsApp link format:
```
https://wa.me/+234XXXXXXXXXX?text=Order%20%23ABC123%20from%20John%20Doe...
```

## Deployment

### Hostinger Deployment

See [HOSTINGER_DEPLOYMENT.md](./HOSTINGER_DEPLOYMENT.md) for detailed instructions.

**Quick Summary:**
1. Build the application (`pnpm build`)
2. Upload to Hostinger via SFTP or File Manager
3. Set up Node.js application in Hostinger control panel
4. Configure environment variables
5. Run database migrations
6. Set up reverse proxy to localhost:3000
7. Configure SSL certificate

### Other Hosting Providers

The application can be deployed to any Node.js hosting provider:
- Railway
- Render
- Heroku
- AWS EC2
- DigitalOcean

## Performance Optimization

- **Database Connection Pooling** - Configured for production (20 connections) and development (5 connections)
- **Lazy Loading** - Database connections created on-demand
- **Caching** - Browser caching headers for static assets
- **Compression** - Response compression for smaller payloads
- **Image Optimization** - CDN URLs for all media assets

## Security

- **Authentication** - Manus OAuth for secure user authentication
- **Authorization** - Role-based access control (admin/user)
- **Database** - Parameterized queries to prevent SQL injection
- **Environment Variables** - Sensitive data stored in `.env` file
- **HTTPS** - SSL/TLS encryption in production
- **CORS** - Cross-origin request handling

## Testing

The project includes comprehensive test coverage:
- **29 passing tests** - Backend procedure tests
- **Unit tests** - Individual function testing
- **Integration tests** - API endpoint testing
- **Auth tests** - Authentication flow testing

Run tests with:
```bash
pnpm test
```

## Troubleshooting

### Database Connection Error
- Verify `DATABASE_URL` is correct
- Check MySQL server is running
- Ensure database user has proper permissions

### Port Already in Use
- Change port in `server/_core/index.ts`
- Or kill process using port 3000: `lsof -ti:3000 | xargs kill -9`

### Build Errors
- Clear node_modules: `rm -rf node_modules && pnpm install`
- Clear build cache: `rm -rf dist client/dist`
- Run `pnpm check` to verify TypeScript

### WhatsApp Links Not Working
- Verify `ADMIN_WHATSAPP_PHONE` is set correctly
- Ensure phone number includes country code (+234 for Nigeria)
- Test link format: `https://wa.me/234XXXXXXXXXX?text=Hello`

## Contributing

To contribute to the project:
1. Create a feature branch
2. Make your changes
3. Run tests to ensure everything passes
4. Submit a pull request

## License

This project is proprietary software for Jovico Bikes.

## Support

For support and inquiries:
- **Email** - support@jovicobikes.com
- **WhatsApp** - +234XXXXXXXXXX
- **Website** - https://jovicobikes.com

## Changelog

### Version 1.0.0 (Initial Release)
- Complete e-commerce platform for eBike sales
- Admin dashboard with full CRUD operations
- WhatsApp order integration
- Mobile-first responsive design
- 29 passing backend tests
- Production-ready deployment configuration
