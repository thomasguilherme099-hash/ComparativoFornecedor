import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  type: text("type").notNull(), // latex, esmalte, verniz, primer
  size: text("size").notNull(), // 900ml, 3.6L, 18L
  color: text("color").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const competitors = pgTable("competitors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  location: text("location"),
  website: text("website"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const competitorPrices = pgTable("competitor_prices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull().references(() => products.id),
  competitorId: varchar("competitor_id").notNull().references(() => competitors.id),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
});

export const priceHistory = pgTable("price_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull().references(() => products.id),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  competitorId: varchar("competitor_id").references(() => competitors.id), // null for own prices
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCompetitorSchema = createInsertSchema(competitors).omit({
  id: true,
  createdAt: true,
});

export const insertCompetitorPriceSchema = createInsertSchema(competitorPrices).omit({
  id: true,
  recordedAt: true,
});

export const insertPriceHistorySchema = createInsertSchema(priceHistory).omit({
  id: true,
  recordedAt: true,
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Competitor = typeof competitors.$inferSelect;
export type InsertCompetitor = z.infer<typeof insertCompetitorSchema>;
export type CompetitorPrice = typeof competitorPrices.$inferSelect;
export type InsertCompetitorPrice = z.infer<typeof insertCompetitorPriceSchema>;
export type PriceHistory = typeof priceHistory.$inferSelect;
export type InsertPriceHistory = z.infer<typeof insertPriceHistorySchema>;

// Extended types for API responses
export type ProductWithCompetitorPrices = Product & {
  competitorPrices: (CompetitorPrice & { competitor: Competitor })[];
  lowestCompetitorPrice?: number;
  competitivenessPercentage?: number;
};

export type DashboardKPIs = {
  totalProducts: number;
  competitiveProducts: number;
  totalCompetitors: number;
  productsWithCompetitorPrices: number;
  lowestPriceCompetitor: { name: string; avgPrice: number } | null;
  priceAdjustmentOpportunities: number;
  competitiveProductsChange: number;
};
