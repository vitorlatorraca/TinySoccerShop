import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCartItemSchema, insertFavoriteSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/products", async (req, res) => {
    try {
      const filters = {
        leagues: req.query.leagues ? JSON.parse(req.query.leagues as string) : undefined,
        clubs: req.query.clubs ? JSON.parse(req.query.clubs as string) : undefined,
        nationalTeams: req.query.nationalTeams ? JSON.parse(req.query.nationalTeams as string) : undefined,
        seasons: req.query.seasons ? JSON.parse(req.query.seasons as string) : undefined,
        players: req.query.players ? JSON.parse(req.query.players as string) : undefined,
        sizes: req.query.sizes ? JSON.parse(req.query.sizes as string) : undefined,
        types: req.query.types ? JSON.parse(req.query.types as string) : undefined,
        conditions: req.query.conditions ? JSON.parse(req.query.conditions as string) : undefined,
        brands: req.query.brands ? JSON.parse(req.query.brands as string) : undefined,
        genders: req.query.genders ? JSON.parse(req.query.genders as string) : undefined,
        categories: req.query.categories ? JSON.parse(req.query.categories as string) : undefined,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        isAutographed: req.query.isAutographed === 'true',
        isMatchWorn: req.query.isMatchWorn === 'true',
        isLimitedEdition: req.query.isLimitedEdition === 'true',
        hasCertificate: req.query.hasCertificate === 'true',
        search: req.query.search as string,
      };

      const sortOptions = {
        sortBy: req.query.sortBy as any,
        itemsPerPage: req.query.itemsPerPage ? Number(req.query.itemsPerPage) : undefined,
        page: req.query.page ? Number(req.query.page) : undefined,
      };

      const products = await storage.getAllProducts(filters, sortOptions);
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/products/:slug", async (req, res) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/cart", async (req, res) => {
    try {
      const cartItems = await storage.getAllCartItems();
      const itemsWithProducts = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          return { ...item, product };
        })
      );
      res.json(itemsWithProducts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const validatedData = insertCartItemSchema.parse(req.body);
      
      const allCartItems = await storage.getAllCartItems();
      const existingItem = allCartItems.find(
        (item) => item.productId === validatedData.productId && item.size === validatedData.size
      );

      if (existingItem) {
        const updatedItem = await storage.updateCartItem(
          existingItem.id,
          existingItem.quantity + (validatedData.quantity ?? 1)
        );
        if (!updatedItem) {
          return res.status(404).json({ error: "Cart item not found" });
        }
        const product = await storage.getProduct(updatedItem.productId);
        return res.json({ ...updatedItem, product });
      }

      const cartItem = await storage.createCartItem(validatedData);
      const product = await storage.getProduct(cartItem.productId);
      res.json({ ...cartItem, product });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/cart/:id", async (req, res) => {
    try {
      const { quantity } = req.body;
      if (typeof quantity !== 'number' || quantity < 1) {
        return res.status(400).json({ error: "Invalid quantity" });
      }

      const updatedItem = await storage.updateCartItem(req.params.id, quantity);
      if (!updatedItem) {
        return res.status(404).json({ error: "Cart item not found" });
      }

      const product = await storage.getProduct(updatedItem.productId);
      res.json({ ...updatedItem, product });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCartItem(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Cart item not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/favorites", async (req, res) => {
    try {
      const favorites = await storage.getAllFavorites();
      res.json(favorites);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/favorites", async (req, res) => {
    try {
      const validatedData = insertFavoriteSchema.parse(req.body);
      
      const existingFavorite = await storage.getFavoriteByProductId(validatedData.productId);
      if (existingFavorite) {
        return res.status(400).json({ error: "Product already in favorites" });
      }

      const favorite = await storage.createFavorite(validatedData);
      res.json(favorite);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/favorites/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteFavorite(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Favorite not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/favorites/product/:productId", async (req, res) => {
    try {
      const favorite = await storage.getFavoriteByProductId(req.params.productId);
      if (!favorite) {
        return res.status(404).json({ error: "Favorite not found" });
      }
      
      const deleted = await storage.deleteFavorite(favorite.id);
      res.json({ success: deleted });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
