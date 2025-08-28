import { 
  type Product, 
  type InsertProduct, 
  type Competitor, 
  type InsertCompetitor,
  type CompetitorPrice,
  type InsertCompetitorPrice,
  type PriceHistory,
  type InsertPriceHistory,
  type ProductWithCompetitorPrices,
  type DashboardKPIs
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  // Competitors
  getCompetitors(): Promise<Competitor[]>;
  getCompetitor(id: string): Promise<Competitor | undefined>;
  createCompetitor(competitor: InsertCompetitor): Promise<Competitor>;
  updateCompetitor(id: string, competitor: Partial<InsertCompetitor>): Promise<Competitor | undefined>;
  deleteCompetitor(id: string): Promise<boolean>;

  // Competitor Prices
  getCompetitorPrices(productId?: string): Promise<CompetitorPrice[]>;
  createCompetitorPrice(price: InsertCompetitorPrice): Promise<CompetitorPrice>;
  updateCompetitorPrice(id: string, price: Partial<InsertCompetitorPrice>): Promise<CompetitorPrice | undefined>;

  // Price History
  getPriceHistory(productId?: string): Promise<PriceHistory[]>;
  createPriceHistoryEntry(entry: InsertPriceHistory): Promise<PriceHistory>;
  addPriceHistory(productId: string, price: string, recordedAt?: string): Promise<PriceHistory>;
  updatePriceHistory(id: string, data: { price: string }): Promise<PriceHistory | undefined>;
  deletePriceHistory(id: string): Promise<boolean>;

  // Analytics
  getProductsWithCompetitorPrices(): Promise<ProductWithCompetitorPrices[]>;
  getDashboardKPIs(): Promise<DashboardKPIs>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private competitors: Map<string, Competitor>;
  private competitorPrices: Map<string, CompetitorPrice>;
  private priceHistory: Map<string, PriceHistory>;

  constructor() {
    this.products = new Map();
    this.competitors = new Map();
    this.competitorPrices = new Map();
    this.priceHistory = new Map();
    
    // Add sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Add sample competitors
    const competitor1: Competitor = {
      id: "comp1",
      name: "Casa das Tintas",
      location: "Centro",
      website: "www.casadastintas.com",
      createdAt: new Date()
    };
    const competitor2: Competitor = {
      id: "comp2", 
      name: "Tintas Express",
      location: "Zona Sul",
      website: "www.tintasexpress.com",
      createdAt: new Date()
    };
    const competitor3: Competitor = {
      id: "comp3",
      name: "MegaTintas",
      location: "Zona Norte", 
      website: "www.megatintas.com",
      createdAt: new Date()
    };

    this.competitors.set("comp1", competitor1);
    this.competitors.set("comp2", competitor2);
    this.competitors.set("comp3", competitor3);

    // Add sample products
    const products = [
      {
        id: "prod1",
        name: "Látex Premium Branco",
        brand: "Suvinil",
        type: "Látex",
        size: "18L",
        color: "Branco Neve",
        price: "185.50",
        imageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "prod2", 
        name: "Esmalte Sintético Azul",
        brand: "Coral",
        type: "Esmalte",
        size: "3.6L",
        color: "Azul Royal",
        price: "89.90",
        imageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "prod3",
        name: "Tinta Acrílica Amarela",
        brand: "Sherwin Williams", 
        type: "Tinta Acrílica",
        size: "18L",
        color: "Amarelo Canário",
        price: "165.00",
        imageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "prod4",
        name: "Primer Branco",
        brand: "Tintas Renner",
        type: "Primer", 
        size: "18L",
        color: "Branco",
        price: "98.50",
        imageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "prod5",
        name: "Verniz Incolor",
        brand: "Eucatex",
        type: "Verniz",
        size: "3.6L", 
        color: "Incolor",
        price: "125.80",
        imageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    products.forEach(product => {
      this.products.set(product.id, product);
    });

    // Add competitive prices
    const competitorPrices = [
      // Product 1 - Latex Premium Branco (yours: R$185.50)
      { id: "cp1", productId: "prod1", competitorId: "comp1", price: "179.90", recordedAt: new Date() },
      { id: "cp2", productId: "prod1", competitorId: "comp2", price: "175.50", recordedAt: new Date() },
      { id: "cp3", productId: "prod1", competitorId: "comp3", price: "182.00", recordedAt: new Date() },
      
      // Product 2 - Esmalte Sintético Azul (yours: R$89.90)
      { id: "cp4", productId: "prod2", competitorId: "comp1", price: "92.50", recordedAt: new Date() },
      { id: "cp5", productId: "prod2", competitorId: "comp2", price: "88.00", recordedAt: new Date() },
      { id: "cp6", productId: "prod2", competitorId: "comp3", price: "95.90", recordedAt: new Date() },
      
      // Product 3 - Tinta Acrílica Amarela (yours: R$165.00)
      { id: "cp7", productId: "prod3", competitorId: "comp1", price: "158.90", recordedAt: new Date() },
      { id: "cp8", productId: "prod3", competitorId: "comp2", price: "162.50", recordedAt: new Date() },
      
      // Product 4 - Primer Branco (yours: R$98.50)
      { id: "cp9", productId: "prod4", competitorId: "comp1", price: "105.00", recordedAt: new Date() },
      { id: "cp10", productId: "prod4", competitorId: "comp3", price: "102.90", recordedAt: new Date() },
      
      // Product 5 - Verniz Incolor (yours: R$125.80)
      { id: "cp11", productId: "prod5", competitorId: "comp1", price: "129.90", recordedAt: new Date() },
      { id: "cp12", productId: "prod5", competitorId: "comp2", price: "118.50", recordedAt: new Date() }
    ];

    competitorPrices.forEach(cp => {
      this.competitorPrices.set(cp.id, cp);
    });

    // Add sample price history data for simulation
    const priceHistoryEntries = [
      // Product 1 - Látex Premium Branco - Price evolution over 6 months
      {
        id: "ph1",
        productId: "prod1",
        price: "165.00",
        competitorId: null, // Our price
        recordedAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000), // 5 months ago
        changeType: "initial",
        previousPrice: null
      },
      {
        id: "ph2", 
        productId: "prod1",
        price: "172.50",
        competitorId: null,
        recordedAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), // 4 months ago
        changeType: "increase",
        previousPrice: "165.00"
      },
      {
        id: "ph3",
        productId: "prod1", 
        price: "168.90",
        competitorId: null,
        recordedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 3 months ago
        changeType: "decrease",
        previousPrice: "172.50"
      },
      {
        id: "ph4",
        productId: "prod1",
        price: "175.00", 
        competitorId: null,
        recordedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 2 months ago
        changeType: "increase",
        previousPrice: "168.90"
      },
      {
        id: "ph5",
        productId: "prod1",
        price: "179.90",
        competitorId: null,
        recordedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
        changeType: "increase", 
        previousPrice: "175.00"
      },
      {
        id: "ph6",
        productId: "prod1",
        price: "185.50",
        competitorId: null,
        recordedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        changeType: "increase",
        previousPrice: "179.90"
      },

      // Product 2 - Esmalte Sintético Azul - More volatile pricing
      {
        id: "ph7",
        productId: "prod2",
        price: "95.00",
        competitorId: null,
        recordedAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000), // ~3 months ago
        changeType: "initial",
        previousPrice: null
      },
      {
        id: "ph8",
        productId: "prod2", 
        price: "88.50",
        competitorId: null,
        recordedAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000),
        changeType: "decrease",
        previousPrice: "95.00"
      },
      {
        id: "ph9",
        productId: "prod2",
        price: "92.00",
        competitorId: null,
        recordedAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000),
        changeType: "increase",
        previousPrice: "88.50"
      },
      {
        id: "ph10", 
        productId: "prod2",
        price: "89.90",
        competitorId: null,
        recordedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        changeType: "decrease",
        previousPrice: "92.00"
      },

      // Product 3 - Tinta Acrílica Amarela - Steady increase trend
      {
        id: "ph11",
        productId: "prod3",
        price: "145.00",
        competitorId: null,
        recordedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        changeType: "initial", 
        previousPrice: null
      },
      {
        id: "ph12",
        productId: "prod3",
        price: "152.50",
        competitorId: null,
        recordedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        changeType: "increase",
        previousPrice: "145.00"
      },
      {
        id: "ph13",
        productId: "prod3",
        price: "158.90", 
        competitorId: null,
        recordedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
        changeType: "increase",
        previousPrice: "152.50"
      },
      {
        id: "ph14",
        productId: "prod3",
        price: "165.00",
        competitorId: null,
        recordedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        changeType: "increase",
        previousPrice: "158.90"
      },

      // Product 4 - Primer Branco - Price decrease strategy
      {
        id: "ph15",
        productId: "prod4",
        price: "108.00",
        competitorId: null,
        recordedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        changeType: "initial",
        previousPrice: null
      },
      {
        id: "ph16",
        productId: "prod4", 
        price: "102.90",
        competitorId: null,
        recordedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        changeType: "decrease",
        previousPrice: "108.00"
      },
      {
        id: "ph17",
        productId: "prod4",
        price: "98.50",
        competitorId: null,
        recordedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        changeType: "decrease",
        previousPrice: "102.90"
      },

      // Add competitor price history for comparison
      // Competitor 1 (Casa das Tintas) - Product 1 prices
      {
        id: "ph18",
        productId: "prod1",
        price: "170.00",
        competitorId: "comp1",
        recordedAt: new Date(Date.now() - 140 * 24 * 60 * 60 * 1000),
        changeType: "initial",
        previousPrice: null
      },
      {
        id: "ph19",
        productId: "prod1", 
        price: "175.90",
        competitorId: "comp1",
        recordedAt: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000),
        changeType: "increase",
        previousPrice: "170.00"
      },
      {
        id: "ph20",
        productId: "prod1",
        price: "179.90",
        competitorId: "comp1",
        recordedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        changeType: "increase",
        previousPrice: "175.90"
      },

      // Competitor 2 (Tintas Express) - Product 1 prices  
      {
        id: "ph21",
        productId: "prod1",
        price: "168.50",
        competitorId: "comp2",
        recordedAt: new Date(Date.now() - 130 * 24 * 60 * 60 * 1000),
        changeType: "initial",
        previousPrice: null
      },
      {
        id: "ph22",
        productId: "prod1",
        price: "172.00",
        competitorId: "comp2", 
        recordedAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000),
        changeType: "increase",
        previousPrice: "168.50"
      },
      {
        id: "ph23",
        productId: "prod1",
        price: "175.50",
        competitorId: "comp2",
        recordedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
        changeType: "increase",
        previousPrice: "172.00"
      },

      // Competitor prices for Product 2
      {
        id: "ph24",
        productId: "prod2",
        price: "93.00",
        competitorId: "comp1",
        recordedAt: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000),
        changeType: "initial",
        previousPrice: null
      },
      {
        id: "ph25",
        productId: "prod2",
        price: "92.50",
        competitorId: "comp1",
        recordedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        changeType: "decrease", 
        previousPrice: "93.00"
      }
    ];

    priceHistoryEntries.forEach(ph => {
      this.priceHistory.set(ph.id, ph as PriceHistory);
    });
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const now = new Date();
    const product: Product = {
      ...insertProduct,
      id,
      createdAt: now,
      updatedAt: now,
      imageUrl: insertProduct.imageUrl || null,
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updateData: Partial<InsertProduct>): Promise<Product | undefined> {
    const existing = this.products.get(id);
    if (!existing) return undefined;

    const updated: Product = {
      ...existing,
      ...updateData,
      updatedAt: new Date(),
    };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  async getCompetitors(): Promise<Competitor[]> {
    return Array.from(this.competitors.values());
  }

  async getCompetitor(id: string): Promise<Competitor | undefined> {
    return this.competitors.get(id);
  }

  async createCompetitor(insertCompetitor: InsertCompetitor): Promise<Competitor> {
    const id = randomUUID();
    const competitor: Competitor = {
      ...insertCompetitor,
      id,
      createdAt: new Date(),
      location: insertCompetitor.location || null,
      website: insertCompetitor.website || null,
    };
    this.competitors.set(id, competitor);
    return competitor;
  }

  async updateCompetitor(id: string, updateData: Partial<InsertCompetitor>): Promise<Competitor | undefined> {
    const existing = this.competitors.get(id);
    if (!existing) return undefined;

    const updated: Competitor = {
      ...existing,
      ...updateData,
    };
    this.competitors.set(id, updated);
    return updated;
  }

  async deleteCompetitor(id: string): Promise<boolean> {
    return this.competitors.delete(id);
  }

  async getCompetitorPrices(productId?: string): Promise<CompetitorPrice[]> {
    const prices = Array.from(this.competitorPrices.values());
    return productId ? prices.filter(p => p.productId === productId) : prices;
  }

  async createCompetitorPrice(insertPrice: InsertCompetitorPrice): Promise<CompetitorPrice> {
    const id = randomUUID();
    const price: CompetitorPrice = {
      ...insertPrice,
      id,
      recordedAt: new Date(),
    };
    this.competitorPrices.set(id, price);
    return price;
  }

  async updateCompetitorPrice(id: string, updateData: Partial<InsertCompetitorPrice>): Promise<CompetitorPrice | undefined> {
    const existing = this.competitorPrices.get(id);
    if (!existing) return undefined;

    const updated: CompetitorPrice = {
      ...existing,
      ...updateData,
    };
    this.competitorPrices.set(id, updated);
    return updated;
  }

  async getPriceHistory(productId?: string): Promise<PriceHistory[]> {
    const history = Array.from(this.priceHistory.values());
    return productId ? history.filter(h => h.productId === productId) : history;
  }

  async createPriceHistoryEntry(insertEntry: InsertPriceHistory): Promise<PriceHistory> {
    const id = randomUUID();
    const entry: PriceHistory = {
      ...insertEntry,
      id,
      recordedAt: new Date(),
      competitorId: insertEntry.competitorId || null,
    };
    this.priceHistory.set(id, entry);
    return entry;
  }

  async getProductsWithCompetitorPrices(): Promise<ProductWithCompetitorPrices[]> {
    const products = await this.getProducts();
    const competitors = await this.getCompetitors();
    
    return products.map(product => {
      const productCompetitorPrices = Array.from(this.competitorPrices.values())
        .filter(cp => cp.productId === product.id)
        .map(cp => ({
          ...cp,
          competitor: competitors.find(c => c.id === cp.competitorId)!
        }))
        .filter(cp => cp.competitor);

      const lowestCompetitorPrice = productCompetitorPrices.length > 0 
        ? Math.min(...productCompetitorPrices.map(cp => parseFloat(cp.price)))
        : undefined;

      const competitivenessPercentage = lowestCompetitorPrice 
        ? ((lowestCompetitorPrice - parseFloat(product.price)) / lowestCompetitorPrice) * 100
        : undefined;

      return {
        ...product,
        competitorPrices: productCompetitorPrices,
        lowestCompetitorPrice,
        competitivenessPercentage,
      };
    });
  }

  async addPriceHistory(productId: string, price: string, recordedAt?: string): Promise<PriceHistory> {
    const entry: PriceHistory = {
      id: randomUUID(),
      productId,
      price,
      recordedAt: recordedAt ? new Date(recordedAt) : new Date(),
    };
    this.priceHistory.set(entry.id, entry);
    return entry;
  }

  async updatePriceHistory(id: string, data: { price: string }): Promise<PriceHistory | undefined> {
    const entry = this.priceHistory.get(id);
    if (!entry) return undefined;
    
    const updated: PriceHistory = {
      ...entry,
      price: data.price,
      recordedAt: new Date(), // Update timestamp when price is changed
    };
    
    this.priceHistory.set(id, updated);
    return updated;
  }

  async deletePriceHistory(id: string): Promise<boolean> {
    return this.priceHistory.delete(id);
  }

  async getDashboardKPIs(): Promise<DashboardKPIs> {
    const productsWithPrices = await this.getProductsWithCompetitorPrices();
    const allCompetitors = await this.getCompetitors();
    
    const totalProducts = productsWithPrices.length;
    
    // Produtos competitivos (preço igual ou menor que concorrência)
    const competitiveProducts = productsWithPrices.filter(p => 
      p.competitivenessPercentage && p.competitivenessPercentage <= 0
    ).length;

    // Total de concorrentes cadastrados
    const totalCompetitors = allCompetitors.length;

    // Produtos que têm preços de concorrentes cadastrados
    const productsWithCompetitorPrices = productsWithPrices.filter(p => 
      p.competitorPrices.length > 0
    ).length;

    // Concorrente com menor preço médio
    let lowestPriceCompetitor = null;
    if (allCompetitors.length > 0) {
      const competitorAvgPrices = allCompetitors.map(competitor => {
        const competitorPrices = Array.from(this.competitorPrices.values())
          .filter(cp => cp.competitorId === competitor.id)
          .map(cp => parseFloat(cp.price));
        
        const avgPrice = competitorPrices.length > 0 
          ? competitorPrices.reduce((sum, price) => sum + price, 0) / competitorPrices.length
          : 0;
        
        return { name: competitor.name, avgPrice };
      }).filter(c => c.avgPrice > 0);

      if (competitorAvgPrices.length > 0) {
        lowestPriceCompetitor = competitorAvgPrices.reduce((lowest, current) => 
          current.avgPrice < lowest.avgPrice ? current : lowest
        );
      }
    }

    // Oportunidades de ajuste (produtos que precisam de análise de preços)
    const priceAdjustmentOpportunities = productsWithPrices.filter(p => 
      p.competitorPrices.length === 0 // produtos sem preços de concorrentes
    ).length;

    return {
      totalProducts,
      competitiveProducts,
      totalCompetitors,
      productsWithCompetitorPrices,
      lowestPriceCompetitor,
      priceAdjustmentOpportunities,
      competitiveProductsChange: 12, // TODO: Calculate based on historical data
    };
  }
}

export const storage = new MemStorage();
