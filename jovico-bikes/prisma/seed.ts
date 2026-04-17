// prisma/seed.ts
import { hashPassword } from "@/lib/utils";
// import { PrismaClient, ProductCategory, ProductType, PostCategory, AdminRole, OrderStatus, PaymentStatus, BookingStatus } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { ProductCategory, ProductType, PostCategory, OrderStatus, PaymentStatus, BookingStatus, AdminRole } from "./generated/prisma/client";

// const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Jovico Bikes database...");

  // ─── Admin ──────────────────────────────────────────────────
  const hashedAdminPass = await hashPassword("jovico@admin2024");
  await prisma.admin.upsert({
    where: { email: "admin@jovicoworld.com" },
    update: {},
    create: { email: "admin@jovicoworld.com", password: hashedAdminPass, name: "Jovico Admin", role: AdminRole.SUPER_ADMIN },
  });
  await prisma.admin.upsert({
    where: { email: "editor@jovicoworld.com" },
    update: {},
    create: { email: "editor@jovicoworld.com", password: hashedAdminPass, name: "Chidi Editor", role: AdminRole.EDITOR },
  });
  console.log("✅ Admins created");

  // ─── Customers ──────────────────────────────────────────────
  const customerPass = await hashPassword("customer123");
  const customers = await Promise.all([
    prisma.customer.upsert({
      where: { email: "emeka@gmail.com" },
      update: {},
      create: { name: "Emeka Okafor", email: "emeka@gmail.com", password: customerPass, phone: "+2348012345001", address: "14 Adeola Odeku, Victoria Island, Lagos" },
    }),
    prisma.customer.upsert({
      where: { email: "ngozi@hotmail.com" },
      update: {},
      create: { name: "Ngozi Adeyemi", email: "ngozi@hotmail.com", password: customerPass, phone: "+2348012345002", address: "22 Bode Thomas St, Surulere, Lagos" },
    }),
    prisma.customer.upsert({
      where: { email: "tunde@yahoo.com" },
      update: {},
      create: { name: "Tunde Fashola", email: "tunde@yahoo.com", password: customerPass, phone: "+2348012345003", address: "5 Kofo Abayomi St, Victoria Island, Lagos" },
    }),
    prisma.customer.upsert({
      where: { email: "amara@gmail.com" },
      update: {},
      create: { name: "Amara Eze", email: "amara@gmail.com", password: customerPass, phone: "+2348012345004", address: "18 Awolowo Road, Ikoyi, Lagos" },
    }),
  ]);
  console.log("✅ Customers created — password: customer123");

  // ─── Services ───────────────────────────────────────────────
  const servicesData = [
    { name: "Basic Tune-Up", slug: "basic-tune-up", shortDesc: "Keep your eBike running smoothly", description: "A thorough inspection and adjustment of all key components including brakes, gears, tyres, and battery health check.", price: 8500, priceNote: null, duration: "2–3 hours", icon: "wrench", featured: true, order: 1 },
    { name: "Full Service & Overhaul", slug: "full-service-overhaul", shortDesc: "Complete deep-service for your eBike", description: "Complete disassembly, cleaning, lubrication, and reassembly. Includes motor diagnostics and battery calibration.", price: 25000, priceNote: null, duration: "1–2 days", icon: "settings", featured: true, order: 2 },
    { name: "Battery Diagnostics & Replacement", slug: "battery-diagnostics", shortDesc: "Expert battery care and replacement", description: "Full battery health assessment, cell balancing, firmware updates, and replacement if required.", price: 5000, priceNote: "Diagnostics fee. Replacement billed separately.", duration: "3–4 hours", icon: "battery", featured: true, order: 3 },
    { name: "Tyre & Tube Replacement", slug: "tyre-tube-replacement", shortDesc: "Puncture repair and tyre swaps", description: "Fast and reliable tyre and tube replacement service with puncture-resistant tyres.", price: 4500, priceNote: null, duration: "1 hour", icon: "circle", featured: false, order: 4 },
    { name: "Motor & Electronics Repair", slug: "motor-electronics-repair", shortDesc: "Specialist motor and controller repair", description: "Expert repair of hub motors, mid-drive systems, controllers, and displays.", price: 15000, priceNote: "Starting from. Quote given after diagnosis.", duration: "2–5 days", icon: "zap", featured: false, order: 5 },
    { name: "Brake Adjustment & Bleed", slug: "brake-adjustment-bleed", shortDesc: "Precision brake servicing", description: "Hydraulic and mechanical brake adjustment, pad replacement, and hydraulic bleed service.", price: 6000, priceNote: null, duration: "1–2 hours", icon: "shield", featured: false, order: 6 },
  ];
  const services: typeof servicesData = [];
  for (const s of servicesData) {
    const created = await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: { ...s, published: true } as any,
    });
    services.push(created as any);
  }
  console.log("✅ Services created");

  // ─── Products ───────────────────────────────────────────────
  const bikeSpecs = {
    cityCruiser: { motor: "500W Rear Hub", battery: "36V 12Ah Li-Ion", range: "60km", topSpeed: "35km/h", chargeTime: "4–5 hrs", weight: "22kg", frame: "6061 Aluminium", brakes: "Hydraulic Disc", gears: "Shimano 7-speed", display: "LCD Smart Display" },
    explorer750: { motor: "750W Bafang Mid-Drive", battery: "48V 17.5Ah Samsung", range: "80km", topSpeed: "45km/h", chargeTime: "5–6 hrs", weight: "28kg", frame: "7005 Aluminium", brakes: "4-Piston Hydraulic", gears: "Shimano Deore 10-sp", display: "Bafang DPC-18 Colour", suspension: "100mm Fork" },
    cargoRunner: { motor: "500W Rear Hub", battery: "48V 20Ah Li-Ion", range: "70km", topSpeed: "30km/h", payload: "250kg", weight: "32kg", frame: "Heavy-Duty Steel", brakes: "Hydraulic Disc", gears: "Shimano 7-speed", rack: "Extended Rear Rack" },
    foldGo: { motor: "250W Rear Hub", battery: "36V 7.8Ah Li-Ion", range: "40km", topSpeed: "25km/h", foldedSize: "75×35×65cm", weight: "16kg", frame: "Magnesium Alloy", brakes: "Mechanical Disc", wheels: "20\"" },
    streetGlide: { motor: "350W Bosch Active Line+", battery: "500Wh Integrated", range: "100km", topSpeed: "35km/h", weight: "20kg", frame: "Premium 6061 Al", brakes: "Shimano Hydraulic", drivetrain: "Gates Carbon Belt", display: "Bosch Purion 200", lights: "Integrated LED" },
  };

  const productsData = [
    { name: "Jovico City Cruiser Pro", slug: "jovico-city-cruiser-pro", description: "The ultimate Lagos urban commuter. 500W rear hub motor, 36V 12Ah battery, 60km range. Handles Lekki-Ajah in style.", price: 485000, salePrice: null, sku: "JVC-CC-PRO-001", stock: 8, category: ProductCategory.CITY_BIKE, type: ProductType.BIKE, brand: "Jovico", specs: bikeSpecs.cityCruiser, featured: true },
    { name: "Jovico Explorer 750X", slug: "jovico-explorer-750x", description: "Built for Lagos terrain and beyond. 750W Bafang mid-drive, 48V 17.5Ah, 80km range for serious off-road adventures.", price: 720000, salePrice: null, sku: "JVC-EXP-750X-001", stock: 5, category: ProductCategory.MOUNTAIN_BIKE, type: ProductType.BIKE, brand: "Jovico", specs: bikeSpecs.explorer750, featured: true },
    { name: "Jovico Cargo Runner", slug: "jovico-cargo-runner", description: "Nigeria's premier delivery and family eBike. 250kg payload capacity, 500W motor, 70km range.", price: 550000, salePrice: null, sku: "JVC-CARGO-001", stock: 4, category: ProductCategory.CARGO_BIKE, type: ProductType.BIKE, brand: "Jovico", specs: bikeSpecs.cargoRunner, featured: true },
    { name: "Jovico Fold & Go", slug: "jovico-fold-go", description: "Compact, lightweight, ultra-portable. Fits in your boot or under your desk. 250W motor, 20\" wheels.", price: 295000, salePrice: 275000, sku: "JVC-FOLD-001", stock: 12, category: ProductCategory.FOLDING_BIKE, type: ProductType.BIKE, brand: "Jovico", specs: bikeSpecs.foldGo, featured: false },
    { name: "Jovico Street Glide S1", slug: "jovico-street-glide-s1", description: "Sleek, fast, stylish. Integrated battery, Gates carbon belt drive, Bosch motor. 100km range.", price: 890000, salePrice: null, sku: "JVC-SG-S1-001", stock: 3, category: ProductCategory.CITY_BIKE, type: ProductType.BIKE, brand: "Jovico", specs: bikeSpecs.streetGlide, featured: true },
    { name: "Jovico TrailBlaze 29", slug: "jovico-trailblaze-29", description: "29\" trail-ready hardtail. Powerful 1000W hub motor, full air suspension fork, Shimano XT drivetrain.", price: 980000, salePrice: null, sku: "JVC-TB-29-001", stock: 2, category: ProductCategory.MOUNTAIN_BIKE, type: ProductType.BIKE, brand: "Jovico", specs: { motor: "1000W Hub Motor", battery: "52V 20Ah", range: "90km", topSpeed: "50km/h", suspension: "150mm Fork", brakes: "Shimano XT 4-piston", gears: "Shimano XT 12-speed", weight: "30kg" }, featured: false },
    { name: "Premium Helmet — Matte Black", slug: "premium-helmet-matte-black", description: "CPSC-certified full-face helmet with integrated visor. Lightweight polycarbonate shell, EPS liner.", price: 35000, salePrice: 28000, sku: "ACC-HELM-001", stock: 25, category: ProductCategory.ACCESSORY, type: ProductType.ACCESSORY, brand: "Jovico", specs: { certification: "CPSC / CE", weight: "550g", sizes: "S, M, L, XL", ventilation: "12 vents" }, featured: false },
    { name: "Smart eBike Lock — Fingerprint", slug: "smart-ebike-lock-fingerprint", description: "Fingerprint + Bluetooth lock. 120dB alarm, IP67 waterproof, 6-month battery life.", price: 22000, salePrice: null, sku: "ACC-LOCK-001", stock: 40, category: ProductCategory.ACCESSORY, type: ProductType.ACCESSORY, brand: "Jovico", specs: { unlock: "Fingerprint / App / Key", alarm: "120dB", waterproof: "IP67", battery: "6 months" }, featured: false },
  ];

  const createdProducts: { id: string; slug: string }[] = [];
  for (const p of productsData) {
    const prod = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: { ...p, published: true } as any,
    });
    createdProducts.push({ id: prod.id, slug: prod.slug });
  }
  console.log("✅ Products created");

  // ─── Blog Posts ─────────────────────────────────────────────
  const postsData = [
    {
      title: "Why eBikes Are the Future of Lagos Transportation",
      slug: "ebikes-future-lagos-transportation",
      excerpt: "Lagos traffic is legendary. Discover why thousands of Lagosians are switching to eBikes as their primary mode of urban transport.",
      content: "<h2>The Lagos Traffic Problem</h2><p>Anyone who has lived in Lagos knows the struggle. Hours spent in gridlock on Third Mainland Bridge, the chaos of Oshodi interchange, the perpetual bottleneck of Victoria Island during rush hour. The average Lagosian spends 30+ hours per week in traffic.</p><h2>The eBike Solution</h2><p>Electric bicycles offer a compelling answer to this uniquely Lagos challenge. A 15km commute that might take 90 minutes by car can be completed in under 35 minutes on a Jovico eBike, with zero fuel costs and zero emissions.</p><h2>Economic Benefits</h2><p>With fuel prices continuing to rise, the economic case for eBikes has never been stronger. A full charge costs approximately ₦200–400 compared to ₦3,000–5,000 for equivalent fuel costs.</p>",
      category: PostCategory.GUIDE, tags: "lagos,ebike,transport,commuting", author: "Emeka Jovita", published: true, featured: true, views: 1847, readTime: 6, publishedAt: new Date("2024-09-15"),
    },
    {
      title: "Maintaining Your eBike in Nigeria's Climate",
      slug: "ebike-maintenance-nigeria-climate",
      excerpt: "Nigeria's heat, humidity, and dusty roads present unique challenges. Our expert guide to keeping your bike in peak condition year-round.",
      content: "<h2>Understanding the Nigerian Climate Challenge</h2><p>High humidity, intense heat, occasional flooding, and dusty harmattan conditions all take their toll on eBike components. With the right maintenance routine, your Jovico eBike will thrive for years.</p><h2>Battery Care in the Heat</h2><p>Lithium-ion batteries are sensitive to extreme temperatures. Always store your battery in a cool, shaded location. Charge to 80% for daily use rather than 100% — this extends cell life significantly in hot conditions.</p><h2>Harmattan Season Tips</h2><p>The harmattan brings fine dust that infiltrates every component. During this season, clean your bike more frequently and use a dry lubricant rather than wet lubricant to avoid attracting dust.</p>",
      category: PostCategory.TIPS, tags: "maintenance,tips,nigeria,battery", author: "Seun Okonkwo", published: true, featured: false, views: 1102, readTime: 7, publishedAt: new Date("2024-10-02"),
    },
    {
      title: "Jovico Bikes Opens Lagos Island Flagship Showroom",
      slug: "jovico-opens-lagos-island-showroom",
      excerpt: "We are thrilled to announce the opening of our brand new flagship showroom on Victoria Island, Lagos.",
      content: "<h2>A New Home for Jovico Bikes</h2><p>We are beyond excited to announce the opening of our flagship showroom at 14 Adeola Odeku Street, Victoria Island. The showroom spans 450 square metres across two floors featuring our full range of eBikes, all available for test rides.</p><h2>What to Expect</h2><p>The ground floor houses our complete bike range. Upstairs, you will find our fully equipped service workshop staffed by certified eBike technicians. The showroom also features a dedicated accessories section and a charging station for customers who arrive on their own eBikes.</p>",
      category: PostCategory.COMPANY, tags: "news,lagos,showroom,opening", author: "Jovico Team", published: true, featured: true, views: 2341, readTime: 4, publishedAt: new Date("2024-10-20"),
    },
    {
      title: "Jovico Explorer 750X — Full Review",
      slug: "jovico-explorer-750x-review",
      excerpt: "We put the Explorer 750X through its paces on Lagos roads and Ogun State trails. Here is our honest verdict.",
      content: "<h2>First Impressions</h2><p>The Explorer 750X arrives in a sleek matte black and green colourway that turns heads on Lagos streets. The build quality is immediately apparent — the welds are clean, the cable routing is thoughtful, and every component feels premium.</p><h2>On-Road Performance</h2><p>The Bafang M500 mid-drive motor delivers smooth, natural power assistance. Climbing the steep ramps on Lekki-Epe Expressway flyovers was effortless. The motor integrates seamlessly with the Shimano Deore 10-speed gearing.</p><h2>Verdict</h2><p>At ₦720,000, the Explorer 750X represents excellent value for serious eBike riders. The combination of a powerful mid-drive motor, high-capacity Samsung battery, and quality components makes this our top recommendation for Lagos commuters who also want weekend adventure capability.</p>",
      category: PostCategory.REVIEW, tags: "review,explorer,mountain-bike,test", author: "Tayo Adeleke", published: true, featured: false, views: 763, readTime: 8, publishedAt: new Date("2024-11-05"),
    },
    {
      title: "5 Routes to Try on Your eBike in Lagos",
      slug: "5-ebike-routes-lagos",
      excerpt: "From scenic coastal rides to urban shortcuts, these are our favourite routes to explore on your Jovico eBike.",
      content: "<h2>1. Victoria Island to Lekki Phase 1</h2><p>The dedicated lane on Ozumba Mbadiwe Avenue makes this one of Lagos's most pleasant eBike commutes. Early morning rides offer stunning harbour views with minimal traffic.</p><h2>2. Ikoyi Bridge Loop</h2><p>Cross Falomo Bridge, loop through Ikoyi, and return via the Five Cowrie Creek bridge. About 12km, perfect for weekend recreational riding.</p><h2>3. Ajah to Sangotedo Market Run</h2><p>A practical route for Lekki corridor residents making market runs. The flat terrain and wide shoulders make it ideal for cargo eBikes.</p><h2>4. Apapa Quays Sunrise Ride</h2><p>Early risers can enjoy the industrial港 port area before traffic builds. The unobstructed sea breeze makes for excellent riding conditions from 5–7am.</p><h2>5. Badagry Heritage Trail</h2><p>For those willing to venture further, the road from Mile 2 to Badagry is smooth, flat, and offers rich historical sights along Nigeria's slave route heritage.</p>",
      category: PostCategory.GUIDE, tags: "routes,lagos,cycling,guide", author: "Adaeze Nwosu", published: true, featured: false, views: 1429, readTime: 5, publishedAt: new Date("2024-11-12"),
    },
    {
      title: "The Economics of Going Electric in 2025",
      slug: "economics-going-electric-2025",
      excerpt: "With petrol prices at historic highs, we crunch the numbers on eBike ownership costs versus petrol alternatives in Nigeria.",
      content: "<h2>The Petrol Price Reality</h2><p>Nigerian petrol prices have risen dramatically in recent years following subsidy removal. At current prices, a typical motorbike commuter in Lagos spends ₦25,000–40,000 per month on fuel alone.</p><h2>eBike Running Costs</h2><p>An eBike covering the same distance costs approximately ₦2,500–4,500 per month in electricity. That is a saving of ₦20,000–35,000 every single month — enough to pay off a mid-range Jovico eBike in under 24 months.</p><h2>Total Cost of Ownership</h2><p>Factor in reduced maintenance costs (no oil changes, spark plugs, or exhaust repairs) and most Jovico eBike owners find their bikes cost-neutral within 18–22 months of purchase.</p>",
      category: PostCategory.NEWS, tags: "economics,petrol,savings,2025", author: "Kemi Oladele", published: false, featured: false, views: 0, readTime: 6, publishedAt: null,
    },
  ];
  for (const post of postsData) {
    await prisma.post.upsert({ where: { slug: post.slug }, update: {}, create: post });
  }
  console.log("✅ Blog posts created");

  // ─── Orders ─────────────────────────────────────────────────
  const ordersData = [
    { customer: customers[0], product: createdProducts[0], qty: 1, status: OrderStatus.DELIVERED, payment: PaymentStatus.PAID, addr: { street: "14 Adeola Odeku St", city: "Victoria Island", state: "Lagos" }, num: "JVB-ORDER-001" },
    { customer: customers[0], product: createdProducts[6], qty: 2, status: OrderStatus.DELIVERED, payment: PaymentStatus.PAID, addr: { street: "14 Adeola Odeku St", city: "Victoria Island", state: "Lagos" }, num: "JVB-ORDER-002" },
    { customer: customers[1], product: createdProducts[2], qty: 1, status: OrderStatus.SHIPPED, payment: PaymentStatus.PAID, addr: { street: "22 Bode Thomas St", city: "Surulere", state: "Lagos" }, num: "JVB-ORDER-003" },
    { customer: customers[2], product: createdProducts[4], qty: 1, status: OrderStatus.PROCESSING, payment: PaymentStatus.UNPAID, addr: { street: "5 Kofo Abayomi St", city: "Victoria Island", state: "Lagos" }, num: "JVB-ORDER-004" },
    { customer: customers[3], product: createdProducts[1], qty: 1, status: OrderStatus.PENDING, payment: PaymentStatus.UNPAID, addr: { street: "18 Awolowo Road", city: "Ikoyi", state: "Lagos" }, num: "JVB-ORDER-005" },
    { customer: customers[1], product: createdProducts[3], qty: 1, status: OrderStatus.CANCELLED, payment: PaymentStatus.REFUNDED, addr: { street: "22 Bode Thomas St", city: "Surulere", state: "Lagos" }, num: "JVB-ORDER-006" },
    { customer: customers[3], product: createdProducts[7], qty: 3, status: OrderStatus.DELIVERED, payment: PaymentStatus.PAID, addr: { street: "18 Awolowo Road", city: "Ikoyi", state: "Lagos" }, num: "JVB-ORDER-007" },
  ];

  for (const o of ordersData) {
    const prod = await prisma.product.findFirst({ where: { slug: o.product.slug } });
    if (!prod) continue;
    const price = Number(prod.price);
    const subtotal = price * o.qty;
    const shipping = subtotal > 100000 ? 0 : 5000;
    await prisma.order.upsert({
      where: { orderNumber: o.num },
      update: {},
      create: {
        orderNumber: o.num,
        customerName: o.customer.name,
        customerEmail: o.customer.email,
        customerPhone: o.customer.phone ?? "+2348000000000",
        shippingAddress: o.addr,
        subtotal,
        shipping,
        total: subtotal + shipping,
        status: o.status,
        paymentStatus: o.payment,
        customerId: o.customer.id,
        items: {
          create: [{ productId: prod.id, name: prod.name, price, quantity: o.qty }],
        },
      },
    });
  }
  console.log("✅ Orders created");

  // ─── Bookings ───────────────────────────────────────────────
  const futureDate = (days: number) => new Date(Date.now() + days * 86400000);
  const bookingsData = [
    { name: "Emeka Okafor", email: "emeka@gmail.com", phone: "+2348012345001", serviceSlug: "basic-tune-up", date: futureDate(2), status: BookingStatus.CONFIRMED, notes: "Shimano gears slipping on 3rd" },
    { name: "Ngozi Adeyemi", email: "ngozi@hotmail.com", phone: "+2348012345002", serviceSlug: "battery-diagnostics", date: futureDate(4), status: BookingStatus.PENDING, notes: "Battery draining faster than usual" },
    { name: "Chukwuma Peters", email: "chukwuma@gmail.com", phone: "+2348056781234", serviceSlug: "full-service-overhaul", date: futureDate(7), status: BookingStatus.PENDING, notes: "Annual full service — bike is 14 months old" },
    { name: "Tunde Fashola", email: "tunde@yahoo.com", phone: "+2348012345003", serviceSlug: "tyre-tube-replacement", date: futureDate(-3), status: BookingStatus.COMPLETED, notes: "Front tyre puncture" },
    { name: "Amaka Obi", email: "amaka@icloud.com", phone: "+2348099887766", serviceSlug: "motor-electronics-repair", date: futureDate(10), status: BookingStatus.CONFIRMED, notes: "Motor making clicking sound above 20km/h" },
    { name: "Segun Martins", email: "segun.m@gmail.com", phone: "+2348055443322", serviceSlug: "brake-adjustment-bleed", date: futureDate(1), status: BookingStatus.PENDING, notes: "Front hydraulic disc feels spongy" },
  ];
  for (const b of bookingsData) {
    const service = await prisma.service.findUnique({ where: { slug: b.serviceSlug } });
    if (!service) continue;
    const existing = await prisma.booking.findFirst({ where: { email: b.email, serviceId: service.id } });
    if (!existing) {
      await prisma.booking.create({
        data: { name: b.name, email: b.email, phone: b.phone, serviceId: service.id, date: b.date, status: b.status, notes: b.notes },
      });
    }
  }
  console.log("✅ Bookings created");

  // ─── Contact messages ────────────────────────────────────────
  const messagesData = [
    { name: "Bisi Adewale", email: "bisi@gmail.com", phone: "+2348011223344", subject: "Product Enquiry", message: "Hi, is the City Cruiser Pro available in red? And do you offer installmental payment?", read: false },
    { name: "Femi Ogunlana", email: "femi.o@yahoo.com", phone: null, subject: "Service Booking", message: "Can I drop off my bike without an appointment for a quick tyre change?", read: false },
    { name: "Chioma Nzeka", email: "chioma@gmail.com", phone: "+2348077889900", subject: "Order Status", message: "My order JVB-ORDER-003 has been in shipped status for 4 days. When should I expect delivery?", read: true },
    { name: "Rotimi Adebayo", email: "rotimi.a@outlook.com", phone: null, subject: "Partnership", message: "We run a corporate fleet management company and are interested in bulk purchasing 20+ eBikes for our staff. Can we schedule a meeting?", read: false },
  ];
  for (const m of messagesData) {
    const exists = await prisma.contactMessage.findFirst({ where: { email: m.email } });
    if (!exists) {
      await prisma.contactMessage.create({ data: m as any });
    }
  }
  console.log("✅ Contact messages created");

  // ─── Newsletter subscribers ───────────────────────────────────
  const subscribersData = [
    { email: "john.doe@gmail.com", name: "John Doe" },
    { email: "mary.johnson@yahoo.com", name: "Mary Johnson" },
    { email: "david.eze@gmail.com", name: "David Eze" },
    { email: "funke.bello@hotmail.com", name: "Funke Bello" },
    { email: "ibrahim.musa@gmail.com", name: "Ibrahim Musa" },
    { email: "adunola@icloud.com", name: "Adunola Akin" },
  ];
  for (const s of subscribersData) {
    await prisma.subscriber.upsert({ where: { email: s.email }, update: {}, create: { ...s, active: true } });
  }
  console.log("✅ Subscribers created");

  // ─── Site Settings ────────────────────────────────────────────
  const settingsData = [
    { key: "site_name", value: "Jovico Bikes" },
    { key: "tagline", value: "Ride Electric. Ride Lagos." },
    { key: "phone", value: "+234 801 234 5678" },
    { key: "email", value: "hello@jovicoworld.com" },
    { key: "address", value: "14 Adeola Odeku Street, Victoria Island, Lagos" },
    { key: "instagram", value: "https://instagram.com/jovicoworld" },
    { key: "twitter", value: "https://twitter.com/jovicoworld" },
    { key: "facebook", value: "https://facebook.com/jovicoworld" },
    { key: "whatsapp", value: "+2348012345678" },
    { key: "hero_video_url", value: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" },
    { key: "hero_video_poster", value: "" },
    { key: "hero_video_title", value: "Feel the Electric Difference" },
    { key: "hero_video_subtitle", value: "See what riding a Jovico eBike through Lagos truly feels like." },
  ];
  for (const s of settingsData) {
    await prisma.siteSetting.upsert({ where: { key: s.key }, update: { value: s.value }, create: s });
  }
  console.log("✅ Site settings seeded");

  console.log("\n✨ Database seeded successfully!");
  console.log("─────────────────────────────────────────");
  console.log("🔐 Admin:    admin@jovicoworld.com / jovico@admin2024");
  console.log("👤 Customer: emeka@gmail.com / customer123");
  console.log("─────────────────────────────────────────");
}

main().catch(console.error).finally(() => prisma.$disconnect());
