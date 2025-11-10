import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, doublePrecision, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  order: integer("order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const categoryImages = pgTable("category_images", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  url: text("url").notNull(),
  categoryId: integer("category_id").notNull().references(() => categories.id, { onDelete: "cascade" }),
  order: integer("order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  price: doublePrecision("price").notNull(),
  size: text("size"),
  weight: text("weight"),
  quantity: integer("quantity"),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const productImages = pgTable("product_images", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  url: text("url").notNull(),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  order: integer("order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const siteSettings = pgTable("site_settings", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  storeName: text("store_name").default("AL-MUSLIMAH CLOTHINGS & SHOES").notNull(),
  whatsapp: text("whatsapp").default("07016342022"),
  telegram: text("telegram").default("07016342022"),
  facebook: text("facebook"),
  locationKontagora: text("location_kontagora").default("1st floor by LAPO office, Madengene plaza, Opposite Korna amala, Kontagora, Niger state."),
  locationAbuja: text("location_abuja").default("Opposite Zahra bread, Compensation lay out, Old kutunku, Gwagwalada FCT, Abuja."),
  heroImageUrl: text("hero_image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const heroImages = pgTable("hero_images", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  url: text("url").notNull(),
  order: integer("order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users, {
  id: () => z.number().optional(),
  createdAt: () => z.date().optional(),
}).omit({
  id: true,
  createdAt: true,
});

export const insertCategorySchema = createInsertSchema(categories, {
  id: () => z.number().optional(),
  createdAt: () => z.date().optional(),
  updatedAt: () => z.date().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCategoryImageSchema = createInsertSchema(categoryImages, {
  id: () => z.number().optional(),
  createdAt: () => z.date().optional(),
}).omit({
  id: true,
  createdAt: true,
});

export const insertProductSchema = createInsertSchema(products, {
  id: () => z.number().optional(),
  createdAt: () => z.date().optional(),
  updatedAt: () => z.date().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductImageSchema = createInsertSchema(productImages, {
  id: () => z.number().optional(),
  createdAt: () => z.date().optional(),
}).omit({
  id: true,
  createdAt: true,
});

export const insertSiteSettingSchema = createInsertSchema(siteSettings, {
  id: () => z.number().optional(),
  createdAt: () => z.date().optional(),
  updatedAt: () => z.date().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHeroImageSchema = createInsertSchema(heroImages, {
  id: () => z.number().optional(),
  createdAt: () => z.date().optional(),
}).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertCategoryImage = z.infer<typeof insertCategoryImageSchema>;
export type CategoryImage = typeof categoryImages.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertProductImage = z.infer<typeof insertProductImageSchema>;
export type ProductImage = typeof productImages.$inferSelect;

export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;
export type SiteSetting = typeof siteSettings.$inferSelect;

export type InsertHeroImage = z.infer<typeof insertHeroImageSchema>;
export type HeroImage = typeof heroImages.$inferSelect;
