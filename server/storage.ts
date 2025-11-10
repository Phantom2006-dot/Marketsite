import { eq, desc, sql, and } from "drizzle-orm";
import { db } from "./db";
import {
  type User,
  type InsertUser,
  type Category,
  type InsertCategory,
  type CategoryImage,
  type InsertCategoryImage,
  type Product,
  type InsertProduct,
  type ProductImage,
  type InsertProductImage,
  type SiteSetting,
  type InsertSiteSetting,
  type HeroImage,
  type InsertHeroImage,
  users,
  categories,
  categoryImages,
  products,
  productImages,
  siteSettings,
  heroImages,
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Category operations
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;

  // Category image operations
  getCategoryImages(categoryId: number): Promise<CategoryImage[]>;
  createCategoryImage(image: InsertCategoryImage): Promise<CategoryImage>;
  deleteCategoryImage(id: number): Promise<boolean>;

  // Product operations
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Product image operations
  getProductImages(productId: number): Promise<ProductImage[]>;
  createProductImage(image: InsertProductImage): Promise<ProductImage>;
  deleteProductImage(id: number): Promise<boolean>;

  // Hero image operations
  getHeroImages(): Promise<HeroImage[]>;
  createHeroImage(image: InsertHeroImage): Promise<HeroImage>;
  deleteHeroImage(id: number): Promise<boolean>;

  // Site settings operations
  getSiteSettings(): Promise<SiteSetting | undefined>;
  updateSiteSettings(settings: Partial<InsertSiteSetting>): Promise<SiteSetting>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    const categoryImagesRanked = db
      .select({
        id: categoryImages.id,
        url: categoryImages.url,
        categoryId: categoryImages.categoryId,
        rank: sql<number>`row_number() over (partition by ${categoryImages.categoryId} order by ${categoryImages.order} asc, ${categoryImages.id} asc)`.as('rank')
      })
      .from(categoryImages)
      .as("category_images_ranked");

    const rows = await db
      .select({
        category: categories,
        primaryImageUrl: categoryImagesRanked.url,
      })
      .from(categories)
      .leftJoin(
        categoryImagesRanked,
        and(
          eq(categoryImagesRanked.categoryId, categories.id),
          eq(categoryImagesRanked.rank, 1)
        ),
      )
      .orderBy(categories.order, categories.name);

    return rows.map(({ category, primaryImageUrl }) => ({
      ...category,
      primaryImageUrl: primaryImageUrl ?? undefined,
    }));
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.id, id));
    return result[0];
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.slug, slug));
    return result[0];
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const result = await db.insert(categories).values(category).returning();
    return result[0];
  }

  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const result = await db
      .update(categories)
      .set({ ...category, updatedAt: new Date() })
      .where(eq(categories.id, id))
      .returning();
    return result[0];
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id)).returning();
    return result.length > 0;
  }

  // Category image operations
  async getCategoryImages(categoryId: number): Promise<CategoryImage[]> {
    return db.select().from(categoryImages).where(eq(categoryImages.categoryId, categoryId)).orderBy(categoryImages.order);
  }

  async createCategoryImage(image: InsertCategoryImage): Promise<CategoryImage> {
    const result = await db.insert(categoryImages).values(image).returning();
    return result[0];
  }

  async deleteCategoryImage(id: number): Promise<boolean> {
    const result = await db.delete(categoryImages).where(eq(categoryImages.id, id)).returning();
    return result.length > 0;
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    const productImagesRanked = db
      .select({
        id: productImages.id,
        url: productImages.url,
        productId: productImages.productId,
        rank: sql<number>`row_number() over (partition by ${productImages.productId} order by ${productImages.order} asc, ${productImages.id} asc)`.as('rank')
      })
      .from(productImages)
      .as("product_images_ranked");

    const rows = await db
      .select({
        product: products,
        primaryImageUrl: productImagesRanked.url,
      })
      .from(products)
      .leftJoin(
        productImagesRanked,
        and(
          eq(productImagesRanked.productId, products.id),
          eq(productImagesRanked.rank, 1)
        ),
      )
      .orderBy(desc(products.createdAt));

    return rows.map(({ product, primaryImageUrl }) => ({
      ...product,
      primaryImageUrl: primaryImageUrl ?? undefined,
    }));
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id));
    return result[0];
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.slug, slug));
    return result[0];
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return db.select().from(products).where(eq(products.categoryId, categoryId));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const result = await db.insert(products).values(product).returning();
    return result[0];
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const result = await db
      .update(products)
      .set({ ...product, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return result[0];
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id)).returning();
    return result.length > 0;
  }

  // Product image operations
  async getProductImages(productId: number): Promise<ProductImage[]> {
    return db.select().from(productImages).where(eq(productImages.productId, productId)).orderBy(productImages.order);
  }

  async createProductImage(image: InsertProductImage): Promise<ProductImage> {
    const result = await db.insert(productImages).values(image).returning();
    return result[0];
  }

  async deleteProductImage(id: number): Promise<boolean> {
    const result = await db.delete(productImages).where(eq(productImages.id, id)).returning();
    return result.length > 0;
  }

  // Hero image operations
  async getHeroImages(): Promise<HeroImage[]> {
    return db.select().from(heroImages).orderBy(heroImages.order);
  }

  async createHeroImage(image: InsertHeroImage): Promise<HeroImage> {
    const result = await db.insert(heroImages).values(image).returning();
    return result[0];
  }

  async deleteHeroImage(id: number): Promise<boolean> {
    const result = await db.delete(heroImages).where(eq(heroImages.id, id)).returning();
    return result.length > 0;
  }

  // Site settings operations
  async getSiteSettings(): Promise<SiteSetting | undefined> {
    const result = await db.select().from(siteSettings).limit(1);
    if (result.length === 0) {
      const newSettings = await db.insert(siteSettings).values({}).returning();
      return newSettings[0];
    }
    return result[0];
  }

  async updateSiteSettings(settings: Partial<InsertSiteSetting>): Promise<SiteSetting> {
    const existing = await this.getSiteSettings();
    if (!existing) {
      const result = await db.insert(siteSettings).values(settings).returning();
      return result[0];
    }
    const result = await db
      .update(siteSettings)
      .set({ ...settings, updatedAt: new Date() })
      .where(eq(siteSettings.id, existing.id))
      .returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();
