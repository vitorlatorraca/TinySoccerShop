import {
  type Product,
  type InsertProduct,
  type CartItem,
  type InsertCartItem,
  type Favorite,
  type InsertFavorite,
  type FilterOptions,
  type SortOptions,
  type CartItemWithProduct,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getAllProducts(filters?: FilterOptions, sort?: SortOptions): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  getAllCartItems(): Promise<CartItem[]>;
  getCartItem(id: string): Promise<CartItem | undefined>;
  createCartItem(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  deleteCartItem(id: string): Promise<boolean>;
  
  getAllFavorites(): Promise<Favorite[]>;
  getFavorite(id: string): Promise<Favorite | undefined>;
  createFavorite(favorite: InsertFavorite): Promise<Favorite>;
  deleteFavorite(id: string): Promise<boolean>;
  getFavoriteByProductId(productId: string): Promise<Favorite | undefined>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private cartItems: Map<string, CartItem>;
  private favorites: Map<string, Favorite>;

  constructor() {
    this.products = new Map();
    this.cartItems = new Map();
    this.favorites = new Map();
    this.seedProducts();
  }

  private seedProducts() {
    // Floodlit Archives: a deliberately tiny, curated drop (5 shirts, no catalog).
    const mockProducts: InsertProduct[] = [
      {
        name: "Manchester United Home Shirt 1998/99",
        slug: "manchester-united-home-shirt-1998-99",
        club: "Manchester United",
        league: "Premier League",
        player: null,
        nationalTeam: null,
        price: "189.00",
        imageUrl: "/jerseys/manchester-united.png",
        imageHoverUrl: null,
        images: [],
        description:
          "Late‑90s Umbro United: sharp lines, heavy expectation. A season of belief and endings — when the league became a sprint and the stadium learned to wait for the last minute.",
        season: "1998/99",
        type: "Home",
        category: "football-tops",
        condition: "Excellent",
        brand: "Umbro",
        gender: "Men",
        sizes: ["M", "L", "XL"],
        isAutographed: false,
        isMatchWorn: false,
        isLimitedEdition: true,
        hasCertificate: true,
        isNumbered: true,
        hasSpecialPatches: false,
        inStock: true,
        featured: true,
      },
      {
        name: "AC Milan Home Shirt 1989",
        slug: "ac-milan-home-shirt-1989",
        club: "AC Milan",
        league: "Serie A",
        player: null,
        nationalTeam: null,
        price: "240.00",
        imageUrl: "/jerseys/ac-milan.png",
        imageHoverUrl: null,
        images: [],
        description:
          "Red and black as a standard. Sacchi’s Milan didn’t just win — it changed how power looked: a high line, a press, and a European Cup final that felt like certainty under floodlights.",
        season: "1989",
        type: "Home",
        category: "football-tops",
        condition: "Excellent",
        brand: "Adidas",
        gender: "Men",
        sizes: ["S", "M", "L", "XL"],
        isAutographed: false,
        isMatchWorn: false,
        isLimitedEdition: true,
        hasCertificate: true,
        isNumbered: false,
        hasSpecialPatches: true,
        inStock: true,
        featured: false,
      },
      {
        name: "Barcelona Home Shirt 2010/11",
        slug: "barcelona-home-shirt-2010-11",
        club: "Barcelona",
        league: "La Liga",
        player: null,
        nationalTeam: null,
        price: "165.00",
        imageUrl: "/jerseys/barcelona.png",
        imageHoverUrl: null,
        images: [],
        description:
          "A shirt that reads like a manifesto. Barcelona at its peak was rhythm and ideology — possession as identity, color as language, pressure as art.",
        season: "2010/11",
        type: "Home",
        category: "football-tops",
        condition: "New",
        brand: "Nike",
        gender: "Men",
        sizes: ["M", "L", "XL"],
        isAutographed: false,
        isMatchWorn: false,
        isLimitedEdition: false,
        hasCertificate: true,
        isNumbered: false,
        hasSpecialPatches: false,
        inStock: true,
        featured: false,
      },
      {
        name: "Chelsea Home Shirt 2011/12",
        slug: "chelsea-home-shirt-2011-12",
        club: "Chelsea",
        league: "Premier League",
        player: null,
        nationalTeam: null,
        price: "155.00",
        imageUrl: "/jerseys/chelsea.png",
        imageHoverUrl: null,
        images: [],
        description:
          "Deep blue, deep belief. Munich made the story immortal — survival football, set‑piece grit, and the moment a club’s gravity changed overnight.",
        season: "2011/12",
        type: "Home",
        category: "football-tops",
        condition: "Good",
        brand: "Adidas",
        gender: "Men",
        sizes: ["S", "M", "L", "XL"],
        isAutographed: false,
        isMatchWorn: false,
        isLimitedEdition: false,
        hasCertificate: true,
        isNumbered: false,
        hasSpecialPatches: true,
        inStock: true,
        featured: false,
      },
      {
        name: "Corinthians Home Shirt 2012",
        slug: "corinthians-home-shirt-2012",
        club: "Corinthians",
        league: "Brasileirão",
        player: null,
        nationalTeam: null,
        price: "145.00",
        imageUrl: "/jerseys/corinthians.png",
        imageHoverUrl: null,
        images: [],
        description:
          "South America doesn’t do quiet. Libertadores pressure, city devotion, and a shirt that feels heavier than fabric when the whole crowd moves with it.",
        season: "2012",
        type: "Home",
        category: "football-tops",
        condition: "Excellent",
        brand: "Nike",
        gender: "Men",
        sizes: ["M", "L"],
        isAutographed: false,
        isMatchWorn: false,
        isLimitedEdition: true,
        hasCertificate: true,
        isNumbered: false,
        hasSpecialPatches: false,
        inStock: true,
        featured: false,
      },
    ];

    mockProducts.forEach((product) => {
      const id = randomUUID();
      const fullProduct: Product = {
        ...product,
        category: product.category ?? "football-tops",
        player: product.player ?? null,
        nationalTeam: product.nationalTeam ?? null,
        imageHoverUrl: product.imageHoverUrl ?? null,
        images: product.images ?? [],
        isAutographed: product.isAutographed ?? false,
        isMatchWorn: product.isMatchWorn ?? false,
        isLimitedEdition: product.isLimitedEdition ?? false,
        hasCertificate: product.hasCertificate ?? false,
        isNumbered: product.isNumbered ?? false,
        hasSpecialPatches: product.hasSpecialPatches ?? false,
        inStock: product.inStock ?? true,
        featured: product.featured ?? false,
        id,
        createdAt: new Date().toISOString(),
      };
      this.products.set(id, fullProduct);
    });
  }

  async getAllProducts(filters?: FilterOptions, sort?: SortOptions): Promise<Product[]> {
    let products = Array.from(this.products.values());

    if (filters) {
      if (filters.leagues && filters.leagues.length > 0) {
        products = products.filter((p) => filters.leagues!.includes(p.league));
      }
      if (filters.clubs && filters.clubs.length > 0) {
        products = products.filter((p) => filters.clubs!.includes(p.club));
      }
      if (filters.nationalTeams && filters.nationalTeams.length > 0) {
        products = products.filter((p) => p.nationalTeam && filters.nationalTeams!.includes(p.nationalTeam));
      }
      if (filters.seasons && filters.seasons.length > 0) {
        products = products.filter((p) => filters.seasons!.includes(p.season));
      }
      if (filters.players && filters.players.length > 0) {
        products = products.filter((p) => p.player && filters.players!.includes(p.player));
      }
      if (filters.sizes && filters.sizes.length > 0) {
        products = products.filter((p) =>
          p.sizes.some((size) => filters.sizes!.includes(size))
        );
      }
      if (filters.types && filters.types.length > 0) {
        products = products.filter((p) => filters.types!.includes(p.type));
      }
      if (filters.conditions && filters.conditions.length > 0) {
        products = products.filter((p) => filters.conditions!.includes(p.condition));
      }
      if (filters.brands && filters.brands.length > 0) {
        products = products.filter((p) => filters.brands!.includes(p.brand));
      }
      if (filters.genders && filters.genders.length > 0) {
        products = products.filter((p) => filters.genders!.includes(p.gender));
      }
      if (filters.categories && filters.categories.length > 0) {
        products = products.filter((p) => p.category && filters.categories!.includes(p.category));
      }
      if (filters.minPrice !== undefined) {
        products = products.filter((p) => parseFloat(p.price) >= filters.minPrice!);
      }
      if (filters.maxPrice !== undefined) {
        products = products.filter((p) => parseFloat(p.price) <= filters.maxPrice!);
      }
      if (filters.isAutographed) {
        products = products.filter((p) => p.isAutographed);
      }
      if (filters.isMatchWorn) {
        products = products.filter((p) => p.isMatchWorn);
      }
      if (filters.isLimitedEdition) {
        products = products.filter((p) => p.isLimitedEdition);
      }
      if (filters.hasCertificate) {
        products = products.filter((p) => p.hasCertificate);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        products = products.filter(
          (p) =>
            p.name.toLowerCase().includes(searchLower) ||
            p.club.toLowerCase().includes(searchLower) ||
            (p.player && p.player.toLowerCase().includes(searchLower))
        );
      }
    }

    if (sort?.sortBy) {
      switch (sort.sortBy) {
        case "price-asc":
          products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
          break;
        case "price-desc":
          products.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
          break;
        case "newest":
          products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case "name-asc":
          products.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "name-desc":
          products.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case "popular":
          products.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
          break;
        default:
          products.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      }
    }

    return products;
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find((p) => p.slug === slug);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = {
      ...insertProduct,
      category: insertProduct.category ?? "football-tops",
      player: insertProduct.player ?? null,
      nationalTeam: insertProduct.nationalTeam ?? null,
      imageHoverUrl: insertProduct.imageHoverUrl ?? null,
      images: insertProduct.images ?? [],
      isAutographed: insertProduct.isAutographed ?? false,
      isMatchWorn: insertProduct.isMatchWorn ?? false,
      isLimitedEdition: insertProduct.isLimitedEdition ?? false,
      hasCertificate: insertProduct.hasCertificate ?? false,
      isNumbered: insertProduct.isNumbered ?? false,
      hasSpecialPatches: insertProduct.hasSpecialPatches ?? false,
      inStock: insertProduct.inStock ?? true,
      featured: insertProduct.featured ?? false,
      id,
      createdAt: new Date().toISOString(),
    };
    this.products.set(id, product);
    return product;
  }

  async getAllCartItems(): Promise<CartItem[]> {
    return Array.from(this.cartItems.values());
  }

  async getCartItem(id: string): Promise<CartItem | undefined> {
    return this.cartItems.get(id);
  }

  async createCartItem(insertItem: InsertCartItem): Promise<CartItem> {
    const id = randomUUID();
    const item: CartItem = { 
      ...insertItem, 
      quantity: insertItem.quantity ?? 1,
      id 
    };
    this.cartItems.set(id, item);
    return item;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteCartItem(id: string): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async getAllFavorites(): Promise<Favorite[]> {
    return Array.from(this.favorites.values());
  }

  async getFavorite(id: string): Promise<Favorite | undefined> {
    return this.favorites.get(id);
  }

  async createFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    const id = randomUUID();
    const favorite: Favorite = { ...insertFavorite, id };
    this.favorites.set(id, favorite);
    return favorite;
  }

  async deleteFavorite(id: string): Promise<boolean> {
    return this.favorites.delete(id);
  }

  async getFavoriteByProductId(productId: string): Promise<Favorite | undefined> {
    return Array.from(this.favorites.values()).find((f) => f.productId === productId);
  }
}

export const storage = new MemStorage();
