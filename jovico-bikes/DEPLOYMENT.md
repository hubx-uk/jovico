# Jovico Bikes - Deployment Guide

## Overview

This guide covers deploying the Jovico Bikes eBike platform to Hostinger or other hosting providers. The application consists of a React/Next.js frontend and a Node.js/Express backend with MySQL database.

## Prerequisites

- Node.js 18+ and pnpm
- MySQL 8.0+ database
- Hostinger account (or equivalent hosting provider)
- Environment variables configured

## Project Structure

```
jovico-bikes/
├── client/              # React frontend (Vite)
├── server/              # Node.js/Express backend (tRPC)
├── drizzle/             # Database schema and migrations
├── shared/              # Shared types and constants
├── storage/             # S3 storage helpers
├── package.json         # Root dependencies
└── drizzle.config.ts    # Database configuration
```

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Database
DATABASE_URL=mysql://user:password@host:port/database_name

# Authentication
JWT_SECRET=your-secure-jwt-secret-key-here
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im

# Application
VITE_APP_ID=your-app-id
VITE_APP_TITLE=Jovico Bikes
VITE_APP_LOGO=https://cdn.example.com/logo.png

# Admin WhatsApp Contact
ADMIN_WHATSAPP_NUMBER=+234XXXXXXXXXX

# S3 Storage (if using Manus storage)
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your-api-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=your-frontend-api-key

# Node Environment
NODE_ENV=production
```

## Database Setup

### 1. Create Database

```bash
mysql -u root -p
CREATE DATABASE jovico_bikes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'jovico_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON jovico_bikes.* TO 'jovico_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Run Migrations

```bash
# Generate migrations from schema
pnpm drizzle-kit generate

# Apply migrations to database
pnpm drizzle-kit migrate
```

## Local Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Type check
pnpm check

# Format code
pnpm format
```

## Production Build

```bash
# Build frontend and backend
pnpm build

# Start production server
pnpm start
```

## Hostinger Deployment

### Option 1: Using Hostinger's Node.js Hosting

1. **Create Node.js Application**
   - Log into Hostinger control panel
   - Navigate to Node.js Applications
   - Click "Create Application"
   - Select Node.js version (18+)
   - Set application root to project directory

2. **Configure Environment**
   - Set all environment variables in the control panel
   - Ensure DATABASE_URL points to your Hostinger MySQL database

3. **Deploy**
   - Connect your Git repository (GitHub, GitLab, Bitbucket)
   - Set build command: `pnpm install && pnpm build`
   - Set start command: `pnpm start`
   - Deploy branch: main

4. **Database**
   - Create MySQL database in Hostinger
   - Run migrations after first deployment

### Option 2: Using SSH/FTP

1. **Connect via SSH**
   ```bash
   ssh user@your-hostinger-domain.com
   ```

2. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/jovico-bikes.git
   cd jovico-bikes
   ```

3. **Install Dependencies**
   ```bash
   pnpm install
   ```

4. **Build Application**
   ```bash
   pnpm build
   ```

5. **Set Up Environment**
   - Create `.env.local` with production variables
   - Ensure database credentials are correct

6. **Start Application**
   - Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start "pnpm start" --name "jovico-bikes"
   pm2 startup
   pm2 save
   ```

7. **Configure Reverse Proxy**
   - Set up Nginx or Apache to proxy requests to Node.js server (port 3000)

## Database Backup

### Automated Backups

```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/path/to/backups"
DB_NAME="jovico_bikes"
DB_USER="jovico_user"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

mysqldump -u $DB_USER -p $DB_NAME > $BACKUP_DIR/backup_$TIMESTAMP.sql
gzip $BACKUP_DIR/backup_$TIMESTAMP.sql

# Keep only last 30 days of backups
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete
EOF

chmod +x backup.sh

# Add to crontab for daily backups at 2 AM
crontab -e
# Add: 0 2 * * * /path/to/backup.sh
```

## SSL/HTTPS

Hostinger typically provides free SSL certificates via Let's Encrypt. Ensure:
- SSL is enabled in Hostinger control panel
- All traffic is redirected to HTTPS
- Update `OAUTH_SERVER_URL` and other URLs to use HTTPS

## Performance Optimization

### Frontend
- Enable Gzip compression
- Minify CSS and JavaScript
- Use CDN for static assets
- Implement lazy loading for images

### Backend
- Enable database query caching
- Use connection pooling
- Implement rate limiting
- Add monitoring and logging

### Database
- Create indexes on frequently queried columns
- Optimize queries
- Regular maintenance and optimization

## Monitoring and Logging

### Application Logs
```bash
# View application logs
pm2 logs jovico-bikes

# View error logs
tail -f /var/log/nodejs/jovico-bikes.log
```

### Database Monitoring
```bash
# Check database size
mysql -u jovico_user -p -e "SELECT table_schema, ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS size_mb FROM information_schema.tables GROUP BY table_schema;"
```

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL format
- Check MySQL service is running
- Ensure user has correct privileges
- Test connection: `mysql -u user -p -h host -D database_name`

### Application Won't Start
- Check Node.js version: `node --version`
- Review error logs: `pm2 logs`
- Verify all environment variables are set
- Run `pnpm build` locally to catch build errors

### Performance Issues
- Check database query performance
- Monitor server resources (CPU, memory)
- Review application logs for slow operations
- Optimize database indexes

## Maintenance

### Regular Tasks
- Monitor application logs
- Check database backups
- Update dependencies: `pnpm update`
- Review error tracking
- Monitor server resources

### Security
- Keep Node.js and dependencies updated
- Rotate JWT secrets periodically
- Use strong database passwords
- Enable HTTPS everywhere
- Implement rate limiting
- Validate all user inputs

## Support and Documentation

- **Frontend Framework**: [React Documentation](https://react.dev)
- **Backend Framework**: [tRPC Documentation](https://trpc.io)
- **Database ORM**: [Drizzle ORM](https://orm.drizzle.team)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)

## Rollback Procedure

If deployment fails:

1. Check logs for errors
2. Revert to previous version: `git revert HEAD`
3. Rebuild and restart: `pnpm build && pm2 restart jovico-bikes`
4. Verify application is running
5. Check database integrity

## Contact

For deployment issues or questions, contact the development team.
