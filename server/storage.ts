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
    const mockProducts: InsertProduct[] = [
      {
        name: "Barcelona Home 2010/11 - Messi #10",
        slug: "barcelona-home-2010-11-messi-10",
        club: "Barcelona",
        league: "La Liga",
        player: "Lionel Messi",
        nationalTeam: null,
        price: "149.99",
        imageUrl: "https://i.imgur.com/8KxYvQh.jpg",
        imageHoverUrl: "https://i.imgur.com/8KxYvQh.jpg",
        images: ["https://i.imgur.com/8KxYvQh.jpg"],
        description: "Historic Barcelona 2010/11 season shirt, autographed by Lionel Messi. Special edition with authenticity certificate. Iconic shirt from one of the club's greatest seasons.",
        season: "2010/11",
        type: "Home",
        category: "football-tops",
        condition: "New with tags",
        brand: "Nike",
        gender: "Men",
        sizes: ["M", "L", "XL"],
        isAutographed: true,
        isMatchWorn: false,
        isLimitedEdition: true,
        hasCertificate: true,
        isNumbered: true,
        hasSpecialPatches: true,
        inStock: true,
        featured: true,
      },
      {
        name: "Manchester United Home 1999 - Beckham #7",
        slug: "manchester-united-home-1999-beckham-7",
        club: "Manchester United",
        league: "Premier League",
        player: "David Beckham",
        nationalTeam: null,
        price: "179.99",
        imageUrl: "https://i.imgur.com/9mNpQxR.jpg",
        imageHoverUrl: null,
        images: [],
        description: "Autographed David Beckham shirt from Manchester United's historic treble-winning 1998/99 season. Collector's piece with authenticity certificate.",
        season: "1998/99",
        type: "Home",
        category: "football-tops",
        condition: "Excellent condition",
        brand: "Umbro",
        gender: "Men",
        sizes: ["L", "XL"],
        isAutographed: true,
        isMatchWorn: false,
        isLimitedEdition: true,
        hasCertificate: true,
        isNumbered: false,
        hasSpecialPatches: true,
        inStock: true,
        featured: true,
      },
      {
        name: "Real Madrid Home 2016/17 - Cristiano Ronaldo #7",
        slug: "real-madrid-home-2016-17-ronaldo-7",
        club: "Real Madrid",
        league: "La Liga",
        player: "Cristiano Ronaldo",
        nationalTeam: null,
        price: "159.99",
        imageUrl: "https://images.unsplash.com/photo-1622737133809-d95047b9e673?w=800&q=80",
        imageHoverUrl: null,
        images: [],
        description: "Autographed Cristiano Ronaldo shirt from the 2016/17 season when Real Madrid won the Champions League. Premium collector's item.",
        season: "2016/17",
        type: "Home",
        category: "football-tops",
        condition: "New with tags",
        brand: "Adidas",
        gender: "Men",
        sizes: ["M", "L", "XL"],
        isAutographed: true,
        isMatchWorn: false,
        isLimitedEdition: true,
        hasCertificate: true,
        isNumbered: true,
        hasSpecialPatches: true,
        inStock: true,
        featured: false,
      },
      {
        name: "Brasil Copa do Mundo 2002 - Ronaldo #9",
        slug: "brasil-copa-2002-ronaldo-9",
        club: "Brazil National Team",
        league: "World Cup",
        player: "Ronaldo",
        nationalTeam: "Brazil",
        price: "229.99",
        imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80",
        imageHoverUrl: null,
        images: [],
        description: "Autographed Brazil national team shirt from the 2002 World Cup champions. Ronaldo, top scorer with 8 goals. Extremely rare collector's piece.",
        season: "2002",
        type: "Home",
        category: "football-tops",
        condition: "Vintage",
        brand: "Nike",
        gender: "Men",
        sizes: ["M", "L"],
        isAutographed: true,
        isMatchWorn: false,
        isLimitedEdition: true,
        hasCertificate: true,
        isNumbered: true,
        hasSpecialPatches: true,
        inStock: true,
        featured: true,
      },
      {
        name: "Liverpool Home 2018/19 - Salah #11",
        slug: "liverpool-home-2018-19-salah-11",
        club: "Liverpool",
        league: "Premier League",
        player: "Mohamed Salah",
        nationalTeam: null,
        price: "119.99",
        imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
        imageHoverUrl: null,
        images: [],
        description: "Autographed Liverpool shirt from the 2018/19 Champions League winning season. Mohamed Salah, Egyptian star. Authenticity certificate included.",
        season: "2018/19",
        type: "Home",
        category: "football-tops",
        condition: "New without tags",
        brand: "New Balance",
        gender: "Men",
        sizes: ["S", "M", "L", "XL"],
        isAutographed: true,
        isMatchWorn: false,
        isLimitedEdition: false,
        hasCertificate: true,
        isNumbered: false,
        hasSpecialPatches: true,
        inStock: true,
        featured: false,
      },
      {
        name: "Bayern Munich Home 2013 - Schweinsteiger #31",
        slug: "bayern-munich-home-2013-schweinsteiger-31",
        club: "Bayern Munich",
        league: "Bundesliga",
        player: "Bastian Schweinsteiger",
        nationalTeam: null,
        price: "134.99",
        imageUrl: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=80",
        imageHoverUrl: null,
        images: [],
        description: "Autographed shirt from Bayern Munich's historic treble-winning 2012/13 season. Schweinsteiger, German club legend.",
        season: "2012/13",
        type: "Home",
        category: "football-tops",
        condition: "Excellent condition",
        brand: "Adidas",
        gender: "Men",
        sizes: ["M", "L", "XL"],
        isAutographed: true,
        isMatchWorn: false,
        isLimitedEdition: true,
        hasCertificate: true,
        isNumbered: false,
        hasSpecialPatches: true,
        inStock: true,
        featured: false,
      },
      {
        name: "PSG Home 2021/22 - Messi #30",
        slug: "psg-home-2021-22-messi-30",
        club: "Paris Saint-Germain",
        league: "Ligue 1",
        player: "Lionel Messi",
        nationalTeam: null,
        price: "164.99",
        imageUrl: "https://images.unsplash.com/photo-1614632537423-03c2d4b50d1a?w=800&q=80",
        imageHoverUrl: null,
        images: [],
        description: "Historic shirt from Messi's first season at PSG. Autographed by the Argentine star. Limited and numbered edition.",
        season: "2021/22",
        type: "Home",
        category: "football-tops",
        condition: "New with tags",
        brand: "Nike",
        gender: "Men",
        sizes: ["M", "L", "XL", "XXL"],
        isAutographed: true,
        isMatchWorn: false,
        isLimitedEdition: true,
        hasCertificate: true,
        isNumbered: true,
        hasSpecialPatches: false,
        inStock: true,
        featured: true,
      },
      {
        name: "Juventus Home 1996/97 - Del Piero #10",
        slug: "juventus-home-1996-97-del-piero-10",
        club: "Juventus",
        league: "Serie A",
        player: "Alessandro Del Piero",
        nationalTeam: null,
        price: "149.99",
        imageUrl: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&q=80",
        imageHoverUrl: null,
        images: [],
        description: "Vintage autographed shirt from icon Alessandro Del Piero. Juventus 1996/97 season. Rare collector's piece.",
        season: "1996/97",
        type: "Home",
        category: "football-tops",
        condition: "Vintage",
        brand: "Umbro",
        gender: "Men",
        sizes: ["M", "L"],
        isAutographed: true,
        isMatchWorn: false,
        isLimitedEdition: true,
        hasCertificate: true,
        isNumbered: false,
        hasSpecialPatches: false,
        inStock: true,
        featured: false,
      },
      {
        name: "Inter Milan Away 2009/10 - Sneijder #10",
        slug: "inter-milan-away-2009-10-sneijder-10",
        club: "Inter Milan",
        league: "Serie A",
        player: "Wesley Sneijder",
        nationalTeam: null,
        price: "139.99",
        imageUrl: "https://images.unsplash.com/photo-1521731978332-9e9e714bdd20?w=800&q=80",
        imageHoverUrl: null,
        images: [],
        description: "Shirt from Inter Milan's treble-winning 2009/10 season. Autographed by Wesley Sneijder. Iconic away shirt.",
        season: "2009/10",
        type: "Away",
        category: "football-tops",
        condition: "Excellent condition",
        brand: "Nike",
        gender: "Men",
        sizes: ["M", "L", "XL"],
        isAutographed: true,
        isMatchWorn: false,
        isLimitedEdition: true,
        hasCertificate: true,
        isNumbered: true,
        hasSpecialPatches: true,
        inStock: true,
        featured: false,
      },
      {
        name: "Arsenal Invincibles 2003/04 - Henry #14",
        slug: "arsenal-invincibles-2003-04-henry-14",
        club: "Arsenal",
        league: "Premier League",
        player: "Thierry Henry",
        nationalTeam: null,
        price: "199.99",
        imageUrl: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&q=80",
        imageHoverUrl: null,
        images: [],
        description: "Legendary Arsenal Invincibles 2003/04 shirt. Autographed by Thierry Henry. One of the most iconic shirts in English football history.",
        season: "2003/04",
        type: "Home",
        category: "football-tops",
        condition: "Vintage",
        brand: "Nike",
        gender: "Men",
        sizes: ["L", "XL"],
        isAutographed: true,
        isMatchWorn: false,
        isLimitedEdition: true,
        hasCertificate: true,
        isNumbered: true,
        hasSpecialPatches: true,
        inStock: true,
        featured: true,
      },
      {
        name: "Chelsea Home 2012 - Lampard #8",
        slug: "chelsea-home-2012-lampard-8",
        club: "Chelsea",
        league: "Premier League",
        player: "Frank Lampard",
        nationalTeam: null,
        price: "124.99",
        imageUrl: "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=800&q=80",
        imageHoverUrl: null,
        images: [],
        description: "Autographed shirt from Chelsea's 2011/12 Champions League winning season. Frank Lampard, Blues legend.",
        season: "2011/12",
        type: "Home",
        category: "football-tops",
        condition: "Good condition",
        brand: "Adidas",
        gender: "Men",
        sizes: ["M", "L", "XL"],
        isAutographed: true,
        isMatchWorn: false,
        isLimitedEdition: false,
        hasCertificate: true,
        isNumbered: false,
        hasSpecialPatches: true,
        inStock: true,
        featured: false,
      },
      {
        name: "AC Milan Home 2006/07 - Kaká #22",
        slug: "ac-milan-home-2006-07-kaka-22",
        club: "AC Milan",
        league: "Serie A",
        player: "Kaká",
        nationalTeam: null,
        price: "154.99",
        imageUrl: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=80",
        imageHoverUrl: null,
        images: [],
        description: "Autographed Milan shirt from the 2006/07 season when Kaká won the Ballon d'Or. Champions League patch included.",
        season: "2006/07",
        type: "Home",
        category: "football-tops",
        condition: "New without tags",
        brand: "Adidas",
        gender: "Men",
        sizes: ["M", "L"],
        isAutographed: true,
        isMatchWorn: false,
        isLimitedEdition: true,
        hasCertificate: true,
        isNumbered: true,
        hasSpecialPatches: true,
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
