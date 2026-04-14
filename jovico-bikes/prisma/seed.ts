// prisma/seed.ts
// import { PrismaClient, ProductCategory, ProductType, PostCategory, AdminRole } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from '../lib/prisma'
import { AdminRole, PostCategory, ProductCategory, ProductType } from "./generated/prisma/enums";

// const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Jovico Bikes database...");

  // Admin user
  const hashedPassword = await bcrypt.hash("jovico@admin2024", 12);
  await prisma.admin.upsert({
    where: { email: "admin@jovicobikes.com" },
    update: {},
    create: {
      email: "admin@jovicobikes.com",
      password: hashedPassword,
      name: "Jovico Admin",
      role: AdminRole.SUPER_ADMIN,
    },
  });
  console.log("✅ Admin created");

  // Services
  const services = [
    {
      name: "Basic Tune-Up",
      slug: "basic-tune-up",
      shortDesc: "Keep your eBike running smoothly",
      description: "A thorough inspection and adjustment of all key components including brakes, gears, tyres, and battery health check. Perfect for regular maintenance.",
      price: 8500,
      priceNote: "Prices in NGN",
      duration: "2-3 hours",
      icon: "wrench",
      featured: true,
      order: 1,
    },
    {
      name: "Full Service & Overhaul",
      slug: "full-service-overhaul",
      shortDesc: "Complete deep-service for your eBike",
      description: "Complete disassembly, cleaning, lubrication, and reassembly of all mechanical components. Includes motor diagnostics and battery calibration.",
      price: 25000,
      priceNote: "Prices in NGN",
      duration: "1-2 days",
      icon: "settings",
      featured: true,
      order: 2,
    },
    {
      name: "Battery Diagnostics & Replacement",
      slug: "battery-diagnostics",
      shortDesc: "Expert battery care and replacement",
      description: "Full battery health assessment, cell balancing, firmware updates, and replacement if required. We stock batteries for all major eBike brands.",
      price: 5000,
      priceNote: "Diagnostics fee. Replacement billed separately.",
      duration: "3-4 hours",
      icon: "battery",
      featured: true,
      order: 3,
    },
    {
      name: "Tyre & Tube Replacement",
      slug: "tyre-tube-replacement",
      shortDesc: "Puncture repair and tyre swaps",
      description: "Fast and reliable tyre and tube replacement service. We carry puncture-resistant tyres suitable for Lagos roads.",
      price: 4500,
      duration: "1 hour",
      icon: "circle",
      order: 4,
    },
    {
      name: "Motor & Electronics Repair",
      slug: "motor-electronics-repair",
      shortDesc: "Specialist motor and controller repair",
      description: "Expert repair of hub motors, mid-drive systems, controllers, and displays. Our technicians are certified for all major eBike platforms.",
      price: 15000,
      priceNote: "Starting from. Quote given after diagnosis.",
      duration: "2-5 days",
      icon: "zap",
      order: 5,
    },
    {
      name: "Brake Adjustment & Bleed",
      slug: "brake-adjustment-bleed",
      shortDesc: "Precision brake servicing",
      description: "Hydraulic and mechanical brake adjustment, pad replacement, and hydraulic bleed service for maximum stopping power on Lagos streets.",
      price: 6000,
      duration: "1-2 hours",
      icon: "shield",
      order: 6,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: {
        ...service,
        price: service.price as unknown as any,
      },
    });
  }
  console.log("✅ Services seeded");

  // Products
  const bikes = [
    {
      name: "Jovico City Cruiser Pro",
      slug: "jovico-city-cruiser-pro",
      description: "The ultimate urban commuter. Lightweight aluminium frame, 36V 12Ah battery, 500W rear hub motor. Perfect for Lagos traffic with a 60km range per charge.",
      price: 485000,
      sku: "JVC-CC-PRO-001",
      stock: 8,
      category: ProductCategory.CITY_BIKE,
      type: ProductType.BIKE,
      brand: "Jovico",
      featured: true,
      specs: {
        motor: "500W Rear Hub Motor",
        battery: "36V 12Ah Lithium-Ion",
        range: "60km",
        topSpeed: "35km/h",
        chargeTime: "4-5 hours",
        weight: "22kg",
        frame: "6061 Aluminium",
        brakes: "Hydraulic Disc",
        gears: "Shimano 7-speed",
        display: "LCD Smart Display",
      },
      images: {
        create: [
          { url: "/images/bikes/city-cruiser-pro-1.jpg", alt: "Jovico City Cruiser Pro", isPrimary: true },
        ],
      },
    },
    {
      name: "Jovico Explorer 750X",
      slug: "jovico-explorer-750x",
      description: "Built for Lagos terrain and beyond. The Explorer 750X features a powerful 750W mid-drive motor and 48V 17.5Ah battery for 80km+ of off-road adventures.",
      price: 720000,
      sku: "JVC-EXP-750X-001",
      stock: 5,
      category: ProductCategory.MOUNTAIN_BIKE,
      type: ProductType.BIKE,
      brand: "Jovico",
      featured: true,
      specs: {
        motor: "750W Bafang Mid-Drive",
        battery: "48V 17.5Ah Samsung Cells",
        range: "80km",
        topSpeed: "45km/h",
        chargeTime: "5-6 hours",
        weight: "28kg",
        frame: "7005 Aluminium",
        brakes: "4-Piston Hydraulic Disc",
        gears: "Shimano Deore 10-speed",
        display: "Bafang DPC-18 Color Display",
        suspension: "100mm Front Fork",
      },
      images: {
        create: [
          { url: "/images/bikes/explorer-750x-1.jpg", alt: "Jovico Explorer 750X", isPrimary: true },
        ],
      },
    },
    {
      name: "Jovico Cargo Runner",
      slug: "jovico-cargo-runner",
      description: "Nigeria's favourite delivery and family eBike. 250kg payload capacity, extended rear rack, and a 500W motor to handle any load across Lagos.",
      price: 550000,
      sku: "JVC-CARGO-001",
      stock: 4,
      category: ProductCategory.CARGO_BIKE,
      type: ProductType.BIKE,
      brand: "Jovico",
      featured: true,
      specs: {
        motor: "500W Rear Hub Motor",
        battery: "48V 20Ah Lithium-Ion",
        range: "70km",
        topSpeed: "30km/h",
        payload: "250kg",
        weight: "32kg",
        frame: "Heavy-Duty Steel",
        brakes: "Hydraulic Disc",
        gears: "Shimano 7-speed",
        rack: "Extended Rear Rack",
      },
      images: {
        create: [
          { url: "/images/bikes/cargo-runner-1.jpg", alt: "Jovico Cargo Runner", isPrimary: true },
        ],
      },
    },
    {
      name: "Jovico Fold & Go",
      slug: "jovico-fold-go",
      description: "Compact, lightweight, and ultra-portable. The Fold & Go fits in your boot or under your desk. 250W motor with 20\" wheels for city riding.",
      price: 295000,
      sku: "JVC-FOLD-001",
      stock: 12,
      category: ProductCategory.FOLDING_BIKE,
      type: ProductType.BIKE,
      brand: "Jovico",
      featured: false,
      specs: {
        motor: "250W Rear Hub Motor",
        battery: "36V 7.8Ah Lithium-Ion",
        range: "40km",
        topSpeed: "25km/h",
        foldedSize: "75x35x65cm",
        weight: "16kg",
        frame: "Magnesium Alloy",
        brakes: "Mechanical Disc",
        wheels: "20\"",
      },
      images: {
        create: [
          { url: "/images/bikes/fold-go-1.jpg", alt: "Jovico Fold & Go", isPrimary: true },
        ],
      },
    },
    {
      name: "Jovico Street Glide S1",
      slug: "jovico-street-glide-s1",
      description: "Sleek, fast, and stylish. The Street Glide S1 is our premium city eBike with a fully integrated battery, carbon belt drive, and Gates CDX drivetrain.",
      price: 890000,
      sku: "JVC-SG-S1-001",
      stock: 3,
      category: ProductCategory.CITY_BIKE,
      type: ProductType.BIKE,
      brand: "Jovico",
      featured: true,
      specs: {
        motor: "350W Bosch Active Line Plus",
        battery: "500Wh Integrated Frame Battery",
        range: "100km",
        topSpeed: "35km/h",
        weight: "20kg",
        frame: "Premium 6061 Aluminium",
        brakes: "Shimano Hydraulic Disc",
        drivetrain: "Gates Carbon Belt Drive",
        display: "Bosch Purion 200",
        lights: "Integrated LED Front & Rear",
      },
      images: {
        create: [
          { url: "/images/bikes/street-glide-s1-1.jpg", alt: "Jovico Street Glide S1", isPrimary: true },
        ],
      },
    },
  ];

  for (const bike of bikes) {
    await prisma.product.upsert({
      where: { slug: bike.slug },
      update: {},
      create: bike as any,
    });
  }
  console.log("✅ Products seeded");

  // Blog posts
  const posts = [
    {
      title: "Why eBikes Are the Future of Lagos Transportation",
      slug: "ebikes-future-lagos-transportation",
      excerpt: "Lagos traffic is legendary. Discover why thousands of Lagosians are switching to eBikes as their primary mode of urban transport.",
      content: `<h2>The Lagos Traffic Problem</h2><p>Anyone who has lived in Lagos knows the struggle. Hours spent in gridlock on Third Mainland Bridge, the chaos of Oshodi interchange, the perpetual bottleneck of Victoria Island during rush hour. The average Lagosian spends 30+ hours per week in traffic — time that could be spent with family, building a business, or simply living.</p><h2>The eBike Solution</h2><p>Electric bicycles offer a compelling answer to this uniquely Lagos challenge. With the ability to navigate traffic lanes, take shortcuts through neighbourhoods, and travel at up to 45km/h without the constraints of gridlock, eBikes are genuinely transforming how people move across the city.</p><p>The numbers speak for themselves: a 15km commute that might take 90 minutes by car during peak hours can be completed in under 35 minutes on a Jovico eBike, with zero fuel costs and zero emissions.</p><h2>Economic Benefits</h2><p>With fuel prices continuing to rise, the economic case for eBikes has never been stronger. A full charge costs approximately ₦200-400 on average Nigerian electricity tariffs, compared to ₦3,000-5,000 for equivalent fuel costs in a car or keke.</p><h2>The Infrastructure is Catching Up</h2><p>Lagos State Government has been investing in cycling infrastructure, with dedicated lanes appearing on Ozumba Mbadiwe Avenue and other key routes. This trend is set to continue as the city pursues its smart city ambitions.</p>`,
      category: PostCategory.GUIDE,
      tags: "lagos,ebike,transport,commuting",
      author: "Jovico Team",
      published: true,
      featured: true,
      views: 1240,
      readTime: 6,
      publishedAt: new Date("2024-10-15"),
    },
    {
      title: "Maintaining Your eBike in Nigeria's Climate",
      slug: "ebike-maintenance-nigeria-climate",
      excerpt: "Nigeria's heat, humidity, and dusty roads present unique challenges for eBike maintenance. Our expert guide to keeping your bike in peak condition.",
      content: `<h2>Understanding the Nigerian Climate Challenge</h2><p>Nigeria's climate is uniquely challenging for mechanical and electronic equipment. High humidity, intense heat, occasional flooding, and dusty harmattan conditions all take their toll on eBike components. The good news: with the right maintenance routine, your Jovico eBike will thrive for years.</p><h2>Battery Care in the Heat</h2><p>Lithium-ion batteries are sensitive to extreme temperatures. In Lagos's climate, which regularly reaches 35°C+, proper battery care is essential. Always store your battery in a cool, shaded location when not in use. Avoid leaving your bike in direct sunlight for extended periods. Charge your battery to 80% for daily use rather than 100% — this extends cell life significantly in hot conditions.</p><h2>Protecting Against Humidity</h2><p>The coastal humidity in Lagos can accelerate corrosion on metal components. Regular lubrication of the chain and pivot points with a quality wet-weather lubricant will significantly extend component life. After riding in rain or through flooded areas, dry your bike thoroughly before storage.</p><h2>Harmattan Season Tips</h2><p>The harmattan brings fine dust that infiltrates every component. During this season, clean your bike more frequently, paying special attention to brake pads and cable housings. Use a dry lubricant rather than wet lubricant during harmattan to avoid attracting dust.</p>`,
      category: PostCategory.TIPS,
      tags: "maintenance,tips,nigeria,battery",
      author: "Jovico Team",
      published: true,
      featured: false,
      views: 856,
      readTime: 7,
      publishedAt: new Date("2024-11-02"),
    },
    {
      title: "Jovico Bikes Opens New Lagos Island Showroom",
      slug: "jovico-opens-lagos-island-showroom",
      excerpt: "We are thrilled to announce the opening of our brand new showroom on Victoria Island, Lagos. Come test ride the full Jovico range.",
      content: `<h2>A New Home for Jovico Bikes</h2><p>We are beyond excited to announce the opening of our flagship showroom at 14 Adeola Odeku Street, Victoria Island, Lagos. After months of building and fitting, our doors are officially open to the public.</p><h2>What to Expect</h2><p>The new showroom spans 450 square metres across two floors. The ground floor houses our full range of eBikes — all available for test rides on our dedicated indoor track. Upstairs, you'll find our fully equipped service workshop, staffed by our team of certified eBike technicians.</p><p>The showroom features a dedicated accessories section, a consultation lounge for one-on-one buying advice, and a charging station for customers who arrive on their own eBikes.</p><h2>Opening Hours</h2><p>We are open Monday to Saturday, 9am to 6pm, and Sundays by appointment. Our team of knowledgeable sales staff is ready to help you find the perfect eBike for your Lagos lifestyle.</p><h2>Grand Opening Event</h2><p>Join us this Saturday for our grand opening celebration. Free test rides, refreshments, and special launch pricing on selected models. Bring a friend and receive an accessories voucher worth ₦15,000.</p>`,
      category: PostCategory.COMPANY,
      tags: "news,lagos,showroom,opening",
      author: "Jovico Team",
      published: true,
      featured: true,
      views: 2100,
      readTime: 4,
      publishedAt: new Date("2024-11-20"),
    },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }
  console.log("✅ Blog posts seeded");

  // Site settings
  const settings = [
    { key: "site_name", value: "Jovico Bikes" },
    { key: "tagline", value: "Ride Electric. Ride Lagos." },
    { key: "phone", value: "+234 801 234 5678" },
    { key: "email", value: "hello@jovicobikes.com" },
    { key: "address", value: "14 Adeola Odeku Street, Victoria Island, Lagos" },
    { key: "instagram", value: "https://instagram.com/jovicobikes" },
    { key: "twitter", value: "https://twitter.com/jovicobikes" },
    { key: "facebook", value: "https://facebook.com/jovicobikes" },
    { key: "whatsapp", value: "+2348012345678" },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log("✅ Site settings seeded");

  console.log("\n✨ Database seeded successfully!");
  console.log("📧 Admin login: admin@jovicobikes.com");
  console.log("🔑 Admin password: jovico@admin2024");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
  