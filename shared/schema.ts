import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  club: text("club").notNull(),
  league: text("league").notNull(),
  player: text("player"),
  nationalTeam: text("national_team"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url").notNull(),
  imageHoverUrl: text("image_hover_url"),
  images: text("images").array().notNull().default(sql`ARRAY[]::text[]`),
  description: text("description").notNull(),
  season: text("season").notNull(),
  type: text("type").notNull(),
  condition: text("condition").notNull(),
  brand: text("brand").notNull(),
  gender: text("gender").notNull(),
  sizes: text("sizes").array().notNull(),
  isAutographed: boolean("is_autographed").notNull().default(false),
  isMatchWorn: boolean("is_match_worn").notNull().default(false),
  isLimitedEdition: boolean("is_limited_edition").notNull().default(false),
  hasCertificate: boolean("has_certificate").notNull().default(false),
  isNumbered: boolean("is_numbered").notNull().default(false),
  hasSpecialPatches: boolean("has_special_patches").notNull().default(false),
  inStock: boolean("in_stock").notNull().default(true),
  featured: boolean("featured").notNull().default(false),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const cartItems = pgTable("cart_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull(),
  size: text("size").notNull(),
  quantity: integer("quantity").notNull().default(1),
});

export const favorites = pgTable("favorites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
});

export const insertFavoriteSchema = createInsertSchema(favorites).omit({
  id: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;

export interface CartItemWithProduct extends CartItem {
  product: Product;
}

export interface FilterOptions {
  leagues?: string[];
  clubs?: string[];
  nationalTeams?: string[];
  players?: string[];
  sizes?: string[];
  seasons?: string[];
  types?: string[];
  conditions?: string[];
  brands?: string[];
  genders?: string[];
  minPrice?: number;
  maxPrice?: number;
  isAutographed?: boolean;
  isMatchWorn?: boolean;
  isLimitedEdition?: boolean;
  hasCertificate?: boolean;
  isNumbered?: boolean;
  hasSpecialPatches?: boolean;
  search?: string;
}

export interface SortOptions {
  sortBy?: 'relevance' | 'price-asc' | 'price-desc' | 'newest' | 'popular' | 'name-asc' | 'name-desc';
  itemsPerPage?: number;
  page?: number;
}
