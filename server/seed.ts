import { db } from "./db";
import { categories, products, users, siteSettings } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

async function seed() {
  console.log("🌱 Starting database seed...");
  console.log("===========================");

  try {
    // First test connection
    console.log("🔄 Testing database connection...");
    await db.execute(`SELECT 1`);
    console.log("✅ Database connection successful");

    // Create admin user (password: admin123)
    console.log("\n👤 Creating admin user...");
    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    // Check if admin already exists
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.username, "admin"))
      .limit(1);
    
    if (existingAdmin.length > 0) {
      // Update existing admin password
      await db
        .update(users)
        .set({ password: hashedPassword })
        .where(eq(users.username, "admin"));
      console.log("✓ Admin user password updated");
    } else {
      // Create new admin user
      await db
        .insert(users)
        .values({
          username: "admin",
          password: hashedPassword,
        });
      console.log("✓ Admin user created");
    }

    // Create categories
    console.log("\n📁 Creating categories...");
    const categoryData = [
      {
        name: "Hijabs & Veils",
        slug: "hijabs-veils",
        description: "Premium quality hijabs and veils in various styles and colors",
        imageUrl: "https://images.unsplash.com/photo-1583391733981-5afc8f5ca2f8?w=400&h=300&fit=crop",
        order: 1,
      },
      {
        name: "Abayas",
        slug: "abayas",
        description: "Elegant and modest abayas for everyday wear",
        imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=300&fit=crop",
        order: 2,
      },
      {
        name: "Islamic Footwear",
        slug: "islamic-footwear",
        description: "Comfortable and stylish shoes for Muslim women",
        imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=300&fit=crop",
        order: 3,
      },
      {
        name: "Prayer Accessories",
        slug: "prayer-accessories",
        description: "Prayer mats, beads, and other essentials",
        imageUrl: "https://images.unsplash.com/photo-1591604129926-37eb1ff5c2f7?w=400&h=300&fit=crop",
        order: 4,
      },
    ];

    const createdCategories = await db
      .insert(categories)
      .values(categoryData)
      .onConflictDoNothing()
      .returning();
    
    console.log(`✓ ${createdCategories.length} categories created`);

    // Create products
    console.log("\n📦 Creating products...");
    const productData = [
      {
        name: "Premium Cotton Hijab",
        slug: "premium-cotton-hijab",
        description: "Soft, breathable cotton hijab perfect for daily wear",
        price: 2500,
        size: "Standard (180cm x 70cm)",
        quantity: 25,
        categoryId: createdCategories[0]?.id || 1,
      },
      {
        name: "Silk Blend Hijab - Navy",
        slug: "silk-blend-hijab-navy",
        description: "Luxurious silk blend hijab with elegant drape",
        price: 4500,
        size: "Standard (180cm x 70cm)",
        quantity: 15,
        categoryId: createdCategories[0]?.id || 1,
      },
      {
        name: "Chiffon Hijab Set (3 Pack)",
        slug: "chiffon-hijab-set",
        description: "Set of 3 lightweight chiffon hijabs in complementary colors",
        price: 6000,
        size: "Standard (180cm x 70cm)",
        quantity: 10,
        categoryId: createdCategories[0]?.id || 1,
      },
      {
        name: "Classic Black Abaya",
        slug: "classic-black-abaya",
        description: "Timeless black abaya with elegant cut",
        price: 12000,
        size: "Available in S, M, L, XL",
        quantity: 20,
        categoryId: createdCategories[1]?.id || 2,
      },
      {
        name: "Embroidered Abaya - Beige",
        slug: "embroidered-abaya-beige",
        description: "Beautiful beige abaya with delicate embroidery",
        price: 15000,
        size: "Available in S, M, L, XL",
        quantity: 12,
        categoryId: createdCategories[1]?.id || 2,
      },
      {
        name: "Casual Abaya with Pockets",
        slug: "casual-abaya-pockets",
        description: "Practical abaya with side pockets for everyday comfort",
        price: 10000,
        size: "Available in S, M, L, XL",
        quantity: 18,
        categoryId: createdCategories[1]?.id || 2,
      },
      {
        name: "Comfort Leather Sandals",
        slug: "comfort-leather-sandals",
        description: "Genuine leather sandals with cushioned footbed",
        price: 8500,
        size: "Available in sizes 36-42",
        quantity: 30,
        categoryId: createdCategories[2]?.id || 3,
      },
      {
        name: "Indoor Prayer Slippers",
        slug: "indoor-prayer-slippers",
        description: "Soft slippers perfect for prayer and indoor use",
        price: 3500,
        size: "Available in sizes 36-42",
        quantity: 40,
        categoryId: createdCategories[2]?.id || 3,
      },
      {
        name: "Premium Prayer Mat",
        slug: "premium-prayer-mat",
        description: "Plush prayer mat with built-in compass",
        price: 5500,
        size: "110cm x 70cm",
        quantity: 25,
        categoryId: createdCategories[3]?.id || 4,
      },
      {
        name: "Tasbih Prayer Beads",
        slug: "tasbih-prayer-beads",
        description: "Traditional 99-bead tasbih in various colors",
        price: 1500,
        quantity: 50,
        categoryId: createdCategories[3]?.id || 4,
      },
    ];

    const createdProducts = await db
      .insert(products)
      .values(productData)
      .onConflictDoNothing()
      .returning();
    
    console.log(`✓ ${createdProducts.length} products created`);

    // Ensure site settings exist
    console.log("\n⚙️  Checking site settings...");
    const existingSettings = await db.select().from(siteSettings).limit(1);
    if (existingSettings.length === 0) {
      await db.insert(siteSettings).values({});
      console.log("✓ Site settings created");
    } else {
      console.log("✓ Site settings already exist");
    }

    console.log("\n=================================");
    console.log("✅ Database seeded successfully!");
    console.log("=================================");
    console.log("\n🔑 You can now login to the admin panel with:");
    console.log("   Username: admin");
    console.log("   Password: admin123");
    console.log("\n📊 Summary:");
    console.log(`   👤 Users: 1 (admin)`);
    console.log(`   📁 Categories: ${createdCategories.length}`);
    console.log(`   📦 Products: ${createdProducts.length}`);
    
  } catch (error: any) {
    console.error("\n❌ Seed failed!");
    console.error("   Error:", error.message);
    
    if (error.code === '28P01') {
      console.error("\n🔑 AUTHENTICATION ERROR:");
      console.error("   Your database credentials are incorrect.");
      console.error("   Check your DATABASE_URL environment variable.");
      console.error("   Make sure the username and password are correct.");
    } else if (error.code === '3D000') {
      console.error("\n🗄️ DATABASE ERROR:");
      console.error("   The database doesn't exist.");
      console.error("   Create the database in your Neon/Render dashboard.");
    } else if (error.code === 'ECONNREFUSED') {
      console.error("\n🌐 CONNECTION ERROR:");
      console.error("   Could not connect to the database.");
      console.error("   Check if the database server is running.");
      console.error("   Verify your DATABASE_URL hostname and port.");
    }
    
    process.exit(1);
  }
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
