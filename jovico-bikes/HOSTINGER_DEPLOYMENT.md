# Jovico Bikes - Hostinger Deployment Guide

This guide provides step-by-step instructions for deploying the Jovico Bikes application on Hostinger.

## Prerequisites

- Hostinger hosting account with Node.js support
- MySQL database (provided by Hostinger)
- SSH access to your hosting account
- Domain name (optional, but recommended)

## Step 1: Prepare Your Application

### Build the Application

```bash
cd /home/ubuntu/jovico-bikes
pnpm install
pnpm build
```

This creates:
- `dist/` - Compiled backend server
- `client/dist/` - Built frontend assets

### Create Environment File

Create a `.env` file in the project root with the following variables:

```env
# Database
DATABASE_URL=mysql://username:password@host:port/database_name

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

# Analytics (optional)
VITE_ANALYTICS_ENDPOINT=your_analytics_endpoint
VITE_ANALYTICS_WEBSITE_ID=your_website_id

# App Configuration
VITE_APP_TITLE=Jovico Bikes
VITE_APP_LOGO=https://your-cdn-url/logo.png

# WhatsApp Admin Phone (for order notifications)
ADMIN_WHATSAPP_PHONE=+234XXXXXXXXXX
```

## Step 2: Upload to Hostinger

### Using SSH/SFTP

1. Connect to your Hostinger server via SSH:
   ```bash
   ssh username@your-hostinger-domain.com
   ```

2. Navigate to your public directory:
   ```bash
   cd public_html
   ```

3. Upload the project files using SFTP or SCP:
   ```bash
   scp -r /home/ubuntu/jovico-bikes/* username@your-hostinger-domain.com:~/public_html/
   ```

### Using Hostinger File Manager

1. Log in to your Hostinger control panel
2. Navigate to File Manager
3. Upload the `dist/` and `client/dist/` directories
4. Upload `package.json` and `package-lock.json`

## Step 3: Install Dependencies on Hostinger

SSH into your Hostinger server and run:

```bash
cd public_html
npm install --production
```

## Step 4: Set Up the Database

### Create Database

1. In Hostinger control panel, go to Databases
2. Create a new MySQL database
3. Create a database user with full privileges

### Run Migrations

SSH into your server and run:

```bash
cd public_html
npm run db:push
```

Or manually execute the migration SQL from `drizzle/0001_*.sql` using phpMyAdmin or command line.

## Step 5: Configure Node.js Application

### Using Hostinger's Node.js Manager

1. In Hostinger control panel, go to Node.js Applications
2. Create a new Node.js application:
   - **Application root:** `/public_html`
   - **Application startup file:** `dist/index.js`
   - **Node.js version:** 18+ (or latest available)
   - **Environment variables:** Add all variables from your `.env` file

### Or Using PM2 (Alternative)

SSH into your server and:

```bash
cd public_html
npm install -g pm2
pm2 start dist/index.js --name "jovico-bikes"
pm2 startup
pm2 save
```

## Step 6: Configure Reverse Proxy

Your Node.js application runs on `localhost:3000`. Configure Hostinger's reverse proxy to forward requests:

- **Public domain:** `your-domain.com`
- **Forward to:** `localhost:3000`

This is usually done automatically by Hostinger's Node.js manager.

## Step 7: Set Up SSL Certificate

1. In Hostinger control panel, go to SSL/TLS
2. Install a free Let's Encrypt certificate
3. Enable HTTPS redirect

## Step 8: Configure Domain

1. In Hostinger control panel, go to Domains
2. Point your domain to the Node.js application
3. Update DNS records if necessary

## Step 9: Verify Deployment

1. Visit your domain in a browser
2. Test the homepage loads correctly
3. Test navigation to Shop, Blog, Contact pages
4. Test admin login at `/admin`
5. Test order creation flow
6. Verify WhatsApp notifications are sent

## Troubleshooting

### Application Won't Start

Check logs in Hostinger control panel or via SSH:
```bash
tail -f ~/.pm2/logs/jovico-bikes-error.log
```

### Database Connection Error

Verify `DATABASE_URL` is correct:
```bash
mysql -h host -u username -p database_name
```

### Environment Variables Not Loading

Ensure all variables are set in Hostinger's Node.js application settings or in the `.env` file.

### Port Already in Use

If port 3000 is in use, change it in `server/_core/index.ts`:
```ts
const PORT = process.env.PORT || 3000;
```

## Performance Optimization

### Enable Caching

Add caching headers in `server/_core/index.ts`:
```ts
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=3600');
  next();
});
```

### Compress Responses

```bash
npm install compression
```

Add to server:
```ts
import compression from 'compression';
app.use(compression());
```

### Database Connection Pooling

The MySQL2 driver already uses connection pooling. Adjust pool size in `server/db.ts` if needed.

## Monitoring

### Set Up Error Logging

Use Hostinger's built-in logging or integrate with a service like Sentry:

```bash
npm install @sentry/node
```

### Monitor Uptime

Use a service like Uptime Robot to monitor your application.

## Backup Strategy

1. **Database:** Set up automatic backups in Hostinger control panel
2. **Files:** Use Hostinger's backup feature or set up automated backups
3. **Version Control:** Keep your code in a Git repository

## Maintenance

### Regular Updates

```bash
cd public_html
npm update
npm audit fix
```

### Monitor Logs

Check application logs regularly for errors:
```bash
tail -f ~/.pm2/logs/jovico-bikes-error.log
tail -f ~/.pm2/logs/jovico-bikes-out.log
```

## Support

For Hostinger-specific issues, contact Hostinger support.
For application issues, check the logs and verify all environment variables are set correctly.

## Additional Resources

- [Hostinger Node.js Documentation](https://support.hostinger.com/en/articles/4195650-how-to-install-nodejs-and-npm)
- [Express.js Documentation](https://expressjs.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
