# Jovico Bikes - Admin Setup Guide

This guide provides step-by-step instructions for setting up and using the Jovico Bikes admin dashboard.

## Admin Access

### First-Time Admin Setup

1. **Create Admin User**
   - The first user to sign in via Manus OAuth will be automatically created as a regular user
   - To promote a user to admin, execute the following SQL command in your database:

   ```sql
   UPDATE users SET role = 'admin' WHERE openId = 'USER_OPEN_ID';
   ```

   Replace `USER_OPEN_ID` with the user's Manus OAuth ID (visible in the database after first login)

2. **Admin Login**
   - Visit your website and click "Login"
   - Complete Manus OAuth authentication
   - If promoted to admin, you'll have access to `/admin` dashboard

### Admin Dashboard Navigation

Once logged in as admin, navigate to:
- **Dashboard** (`/admin`) - Overview with key metrics
- **Orders** (`/admin/orders`) - Manage customer orders
- **Products** (`/admin/products`) - Manage eBikes and accessories
- **Blog** (`/admin/blog`) - Manage blog posts
- **Videos** (`/admin/videos`) - Manage homepage videos
- **Pages** (`/admin/pages`) - Manage static pages

## Managing Orders

### View Orders
1. Go to **Orders** page
2. See all orders with customer details, amounts, and status
3. Filter by status (pending, confirmed, processing, shipped, delivered)

### Update Order Status
1. Click on an order to view details
2. Select new status from dropdown
3. Click "Update Status"
4. Status changes are immediately reflected in the database

### Order Workflow
- **Pending** - Order received, awaiting confirmation
- **Confirmed** - Admin confirmed order, payment received
- **Processing** - Order being prepared for shipment
- **Shipped** - Order sent to customer
- **Delivered** - Order received by customer

### WhatsApp Integration
- When a customer places an order, they receive a WhatsApp message with order details
- Customer sends payment proof via WhatsApp to the admin phone number
- Admin confirms payment and updates order status to "Confirmed"

## Managing Products

### Add New Product
1. Go to **Products** page
2. Click "New Product"
3. Fill in product details:
   - **Name** - Product name (e.g., "Jovico Pro X1")
   - **Slug** - URL-friendly name (e.g., "jovico-pro-x1")
   - **Category** - eBike or Accessory
   - **Price** - Product price in Naira (₦)
   - **Discount Price** - Optional discounted price
   - **Description** - Detailed product description
   - **Stock** - Quantity available
   - **Image** - Product image URL
   - **Images** - Additional images (JSON array format)
4. Click "Create Product"

### Edit Product
1. Go to **Products** page
2. Find product in list
3. Click edit icon
4. Update details
5. Click "Update Product"

### Delete Product
1. Go to **Products** page
2. Find product in list
3. Click delete icon
4. Confirm deletion

### Product Categories
- **eBike** - Electric bicycles
- **Accessory** - Helmets, locks, lights, etc.

## Managing Blog

### Create Blog Post
1. Go to **Blog** page
2. Click "New Post"
3. Fill in post details:
   - **Title** - Post title
   - **Slug** - URL-friendly slug (e.g., "ebike-tips")
   - **Content** - Full post content (supports markdown)
   - **Excerpt** - Short summary for listing page
   - **Author** - Author name
   - **Featured Image** - Post cover image URL
   - **Meta Description** - SEO description
4. Click "Create Post"

### Publish/Unpublish Post
1. Go to **Blog** page
2. Find post in list
3. Toggle "Published" status
4. Published posts appear on public blog page

### Edit Blog Post
1. Go to **Blog** page
2. Find post in list
3. Click edit icon
4. Update content
5. Click "Update Post"

### Delete Blog Post
1. Go to **Blog** page
2. Find post in list
3. Click delete icon
4. Confirm deletion

## Managing Videos

### Upload Video
1. Go to **Videos** page
2. Click "Upload Video"
3. Select video file from computer
4. Enter video title
5. Click "Upload"

### Replace Video
1. Go to **Videos** page
2. Find video to replace
3. Click "Replace"
4. Select new video file
5. Click "Replace"

### Delete Video
1. Go to **Videos** page
2. Find video to delete
3. Click delete icon
4. Confirm deletion

### Video Guidelines
- **Format** - MP4, WebM, or OGG
- **Size** - Keep under 50MB for optimal performance
- **Resolution** - 1920x1080 (Full HD) recommended
- **Duration** - 15-60 seconds for hero section

## Managing Pages

### Create Static Page
1. Go to **Pages** page
2. Click "New Page"
3. Fill in page details:
   - **Title** - Page title (e.g., "Return Policy")
   - **Slug** - URL slug (e.g., "return-policy")
   - **Content** - Page content
   - **Meta Description** - SEO description
4. Click "Create Page"

### Edit Page
1. Go to **Pages** page
2. Find page in list
3. Click edit icon
4. Update content
5. Click "Update Page"

### Delete Page
1. Go to **Pages** page
2. Find page in list
3. Click delete icon
4. Confirm deletion

### Publish/Unpublish Page
- Published pages appear in navigation and are publicly accessible
- Unpublished pages are hidden from public view

## Dashboard Metrics

The admin dashboard home page displays:
- **Total Orders** - Number of orders received
- **Total Revenue** - Sum of all order amounts
- **Total Products** - Number of products in catalog
- **Total Blog Posts** - Number of published blog posts
- **Pending Orders** - Orders awaiting confirmation

## Best Practices

### Order Management
- Check orders regularly for new submissions
- Confirm payment before updating status to "Confirmed"
- Keep customers informed via WhatsApp about order progress
- Update status promptly to reflect current order state

### Product Management
- Keep product descriptions detailed and accurate
- Use high-quality product images
- Update stock levels regularly
- Mark out-of-stock items appropriately

### Blog Management
- Post regularly to keep content fresh
- Use SEO-friendly titles and descriptions
- Include relevant keywords in content
- Add featured images to all posts

### Video Management
- Use high-quality videos for better presentation
- Keep videos short and engaging
- Test videos on mobile devices
- Replace outdated promotional videos regularly

## Troubleshooting

### Can't Access Admin Dashboard
- Verify you're logged in (check "Login" button)
- Verify your user has admin role in database
- Try logging out and logging back in

### Orders Not Appearing
- Refresh the page
- Check database connection
- Verify orders were successfully created

### Images Not Loading
- Verify image URLs are correct and publicly accessible
- Check image file format (JPG, PNG, WebP supported)
- Ensure images are not too large

### WhatsApp Messages Not Sending
- Verify admin WhatsApp phone number is set in environment variables
- Check phone number format includes country code (+234 for Nigeria)
- Verify customer entered correct order details

## Support

For technical support or issues with the admin dashboard:
1. Check the troubleshooting section above
2. Review application logs in `.manus-logs/` directory
3. Contact technical support with error details

## Security Notes

- Keep your admin credentials secure
- Don't share admin login information
- Regularly update products and content
- Monitor orders for suspicious activity
- Use strong passwords for your Manus OAuth account
