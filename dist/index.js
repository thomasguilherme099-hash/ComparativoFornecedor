// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  products;
  competitors;
  competitorPrices;
  priceHistory;
  constructor() {
    this.products = /* @__PURE__ */ new Map();
    this.competitors = /* @__PURE__ */ new Map();
    this.competitorPrices = /* @__PURE__ */ new Map();
    this.priceHistory = /* @__PURE__ */ new Map();
    this.initializeSampleData();
  }
  initializeSampleData() {
    const competitor1 = {
      id: "comp1",
      name: "Casa das Tintas",
      location: "Centro",
      website: "www.casadastintas.com",
      createdAt: /* @__PURE__ */ new Date()
    };
    const competitor2 = {
      id: "comp2",
      name: "Tintas Express",
      location: "Zona Sul",
      website: "www.tintasexpress.com",
      createdAt: /* @__PURE__ */ new Date()
    };
    const competitor3 = {
      id: "comp3",
      name: "MegaTintas",
      location: "Zona Norte",
      website: "www.megatintas.com",
      createdAt: /* @__PURE__ */ new Date()
    };
    this.competitors.set("comp1", competitor1);
    this.competitors.set("comp2", competitor2);
    this.competitors.set("comp3", competitor3);
    const products2 = [
      {
        id: "prod1",
        name: "L\xE1tex Premium Branco",
        brand: "Suvinil",
        type: "L\xE1tex",
        size: "18L",
        color: "Branco Neve",
        price: "185.50",
        imageUrl: null,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      },
      {
        id: "prod2",
        name: "Esmalte Sint\xE9tico Azul",
        brand: "Coral",
        type: "Esmalte",
        size: "3.6L",
        color: "Azul Royal",
        price: "89.90",
        imageUrl: null,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      },
      {
        id: "prod3",
        name: "Tinta Acr\xEDlica Amarela",
        brand: "Sherwin Williams",
        type: "Tinta Acr\xEDlica",
        size: "18L",
        color: "Amarelo Can\xE1rio",
        price: "165.00",
        imageUrl: null,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
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
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
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
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      }
    ];
    products2.forEach((product) => {
      this.products.set(product.id, product);
    });
    const competitorPrices2 = [
      // Product 1 - Latex Premium Branco (yours: R$185.50)
      { id: "cp1", productId: "prod1", competitorId: "comp1", price: "179.90", recordedAt: /* @__PURE__ */ new Date() },
      { id: "cp2", productId: "prod1", competitorId: "comp2", price: "175.50", recordedAt: /* @__PURE__ */ new Date() },
      { id: "cp3", productId: "prod1", competitorId: "comp3", price: "182.00", recordedAt: /* @__PURE__ */ new Date() },
      // Product 2 - Esmalte Sintético Azul (yours: R$89.90)
      { id: "cp4", productId: "prod2", competitorId: "comp1", price: "92.50", recordedAt: /* @__PURE__ */ new Date() },
      { id: "cp5", productId: "prod2", competitorId: "comp2", price: "88.00", recordedAt: /* @__PURE__ */ new Date() },
      { id: "cp6", productId: "prod2", competitorId: "comp3", price: "95.90", recordedAt: /* @__PURE__ */ new Date() },
      // Product 3 - Tinta Acrílica Amarela (yours: R$165.00)
      { id: "cp7", productId: "prod3", competitorId: "comp1", price: "158.90", recordedAt: /* @__PURE__ */ new Date() },
      { id: "cp8", productId: "prod3", competitorId: "comp2", price: "162.50", recordedAt: /* @__PURE__ */ new Date() },
      // Product 4 - Primer Branco (yours: R$98.50)
      { id: "cp9", productId: "prod4", competitorId: "comp1", price: "105.00", recordedAt: /* @__PURE__ */ new Date() },
      { id: "cp10", productId: "prod4", competitorId: "comp3", price: "102.90", recordedAt: /* @__PURE__ */ new Date() },
      // Product 5 - Verniz Incolor (yours: R$125.80)
      { id: "cp11", productId: "prod5", competitorId: "comp1", price: "129.90", recordedAt: /* @__PURE__ */ new Date() },
      { id: "cp12", productId: "prod5", competitorId: "comp2", price: "118.50", recordedAt: /* @__PURE__ */ new Date() }
    ];
    competitorPrices2.forEach((cp) => {
      this.competitorPrices.set(cp.id, cp);
    });
    const priceHistoryEntries = [
      // Product 1 - Látex Premium Branco - Price evolution over 6 months
      {
        id: "ph1",
        productId: "prod1",
        price: "165.00",
        competitorId: null,
        // Our price
        recordedAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1e3),
        // 5 months ago
        changeType: "initial",
        previousPrice: null
      },
      {
        id: "ph2",
        productId: "prod1",
        price: "172.50",
        competitorId: null,
        recordedAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1e3),
        // 4 months ago
        changeType: "increase",
        previousPrice: "165.00"
      },
      {
        id: "ph3",
        productId: "prod1",
        price: "168.90",
        competitorId: null,
        recordedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1e3),
        // 3 months ago
        changeType: "decrease",
        previousPrice: "172.50"
      },
      {
        id: "ph4",
        productId: "prod1",
        price: "175.00",
        competitorId: null,
        recordedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1e3),
        // 2 months ago
        changeType: "increase",
        previousPrice: "168.90"
      },
      {
        id: "ph5",
        productId: "prod1",
        price: "179.90",
        competitorId: null,
        recordedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1e3),
        // 1 month ago
        changeType: "increase",
        previousPrice: "175.00"
      },
      {
        id: "ph6",
        productId: "prod1",
        price: "185.50",
        competitorId: null,
        recordedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1e3),
        // 1 week ago
        changeType: "increase",
        previousPrice: "179.90"
      },
      // Product 2 - Esmalte Sintético Azul - More volatile pricing
      {
        id: "ph7",
        productId: "prod2",
        price: "95.00",
        competitorId: null,
        recordedAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1e3),
        // ~3 months ago
        changeType: "initial",
        previousPrice: null
      },
      {
        id: "ph8",
        productId: "prod2",
        price: "88.50",
        competitorId: null,
        recordedAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1e3),
        changeType: "decrease",
        previousPrice: "95.00"
      },
      {
        id: "ph9",
        productId: "prod2",
        price: "92.00",
        competitorId: null,
        recordedAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1e3),
        changeType: "increase",
        previousPrice: "88.50"
      },
      {
        id: "ph10",
        productId: "prod2",
        price: "89.90",
        competitorId: null,
        recordedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1e3),
        changeType: "decrease",
        previousPrice: "92.00"
      },
      // Product 3 - Tinta Acrílica Amarela - Steady increase trend
      {
        id: "ph11",
        productId: "prod3",
        price: "145.00",
        competitorId: null,
        recordedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1e3),
        changeType: "initial",
        previousPrice: null
      },
      {
        id: "ph12",
        productId: "prod3",
        price: "152.50",
        competitorId: null,
        recordedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1e3),
        changeType: "increase",
        previousPrice: "145.00"
      },
      {
        id: "ph13",
        productId: "prod3",
        price: "158.90",
        competitorId: null,
        recordedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1e3),
        changeType: "increase",
        previousPrice: "152.50"
      },
      {
        id: "ph14",
        productId: "prod3",
        price: "165.00",
        competitorId: null,
        recordedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1e3),
        changeType: "increase",
        previousPrice: "158.90"
      },
      // Product 4 - Primer Branco - Price decrease strategy
      {
        id: "ph15",
        productId: "prod4",
        price: "108.00",
        competitorId: null,
        recordedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1e3),
        changeType: "initial",
        previousPrice: null
      },
      {
        id: "ph16",
        productId: "prod4",
        price: "102.90",
        competitorId: null,
        recordedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1e3),
        changeType: "decrease",
        previousPrice: "108.00"
      },
      {
        id: "ph17",
        productId: "prod4",
        price: "98.50",
        competitorId: null,
        recordedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1e3),
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
        recordedAt: new Date(Date.now() - 140 * 24 * 60 * 60 * 1e3),
        changeType: "initial",
        previousPrice: null
      },
      {
        id: "ph19",
        productId: "prod1",
        price: "175.90",
        competitorId: "comp1",
        recordedAt: new Date(Date.now() - 110 * 24 * 60 * 60 * 1e3),
        changeType: "increase",
        previousPrice: "170.00"
      },
      {
        id: "ph20",
        productId: "prod1",
        price: "179.90",
        competitorId: "comp1",
        recordedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1e3),
        changeType: "increase",
        previousPrice: "175.90"
      },
      // Competitor 2 (Tintas Express) - Product 1 prices  
      {
        id: "ph21",
        productId: "prod1",
        price: "168.50",
        competitorId: "comp2",
        recordedAt: new Date(Date.now() - 130 * 24 * 60 * 60 * 1e3),
        changeType: "initial",
        previousPrice: null
      },
      {
        id: "ph22",
        productId: "prod1",
        price: "172.00",
        competitorId: "comp2",
        recordedAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1e3),
        changeType: "increase",
        previousPrice: "168.50"
      },
      {
        id: "ph23",
        productId: "prod1",
        price: "175.50",
        competitorId: "comp2",
        recordedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1e3),
        changeType: "increase",
        previousPrice: "172.00"
      },
      // Competitor prices for Product 2
      {
        id: "ph24",
        productId: "prod2",
        price: "93.00",
        competitorId: "comp1",
        recordedAt: new Date(Date.now() - 85 * 24 * 60 * 60 * 1e3),
        changeType: "initial",
        previousPrice: null
      },
      {
        id: "ph25",
        productId: "prod2",
        price: "92.50",
        competitorId: "comp1",
        recordedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1e3),
        changeType: "decrease",
        previousPrice: "93.00"
      }
    ];
    priceHistoryEntries.forEach((ph) => {
      this.priceHistory.set(ph.id, ph);
    });
  }
  async getProducts() {
    return Array.from(this.products.values());
  }
  async getProduct(id) {
    return this.products.get(id);
  }
  async createProduct(insertProduct) {
    const id = randomUUID();
    const now = /* @__PURE__ */ new Date();
    const product = {
      ...insertProduct,
      id,
      createdAt: now,
      updatedAt: now,
      imageUrl: insertProduct.imageUrl || null
    };
    this.products.set(id, product);
    return product;
  }
  async updateProduct(id, updateData) {
    const existing = this.products.get(id);
    if (!existing) return void 0;
    const updated = {
      ...existing,
      ...updateData,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.products.set(id, updated);
    return updated;
  }
  async deleteProduct(id) {
    return this.products.delete(id);
  }
  async getCompetitors() {
    return Array.from(this.competitors.values());
  }
  async getCompetitor(id) {
    return this.competitors.get(id);
  }
  async createCompetitor(insertCompetitor) {
    const id = randomUUID();
    const competitor = {
      ...insertCompetitor,
      id,
      createdAt: /* @__PURE__ */ new Date(),
      location: insertCompetitor.location || null,
      website: insertCompetitor.website || null
    };
    this.competitors.set(id, competitor);
    return competitor;
  }
  async updateCompetitor(id, updateData) {
    const existing = this.competitors.get(id);
    if (!existing) return void 0;
    const updated = {
      ...existing,
      ...updateData
    };
    this.competitors.set(id, updated);
    return updated;
  }
  async deleteCompetitor(id) {
    return this.competitors.delete(id);
  }
  async getCompetitorPrices(productId) {
    const prices = Array.from(this.competitorPrices.values());
    return productId ? prices.filter((p) => p.productId === productId) : prices;
  }
  async createCompetitorPrice(insertPrice) {
    const id = randomUUID();
    const price = {
      ...insertPrice,
      id,
      recordedAt: /* @__PURE__ */ new Date()
    };
    this.competitorPrices.set(id, price);
    return price;
  }
  async updateCompetitorPrice(id, updateData) {
    const existing = this.competitorPrices.get(id);
    if (!existing) return void 0;
    const updated = {
      ...existing,
      ...updateData
    };
    this.competitorPrices.set(id, updated);
    return updated;
  }
  async getPriceHistory(productId) {
    const history = Array.from(this.priceHistory.values());
    return productId ? history.filter((h) => h.productId === productId) : history;
  }
  async createPriceHistoryEntry(insertEntry) {
    const id = randomUUID();
    const entry = {
      ...insertEntry,
      id,
      recordedAt: /* @__PURE__ */ new Date(),
      competitorId: insertEntry.competitorId || null
    };
    this.priceHistory.set(id, entry);
    return entry;
  }
  async getProductsWithCompetitorPrices() {
    const products2 = await this.getProducts();
    const competitors2 = await this.getCompetitors();
    return products2.map((product) => {
      const productCompetitorPrices = Array.from(this.competitorPrices.values()).filter((cp) => cp.productId === product.id).map((cp) => ({
        ...cp,
        competitor: competitors2.find((c) => c.id === cp.competitorId)
      })).filter((cp) => cp.competitor);
      const lowestCompetitorPrice = productCompetitorPrices.length > 0 ? Math.min(...productCompetitorPrices.map((cp) => parseFloat(cp.price))) : void 0;
      const competitivenessPercentage = lowestCompetitorPrice ? (lowestCompetitorPrice - parseFloat(product.price)) / lowestCompetitorPrice * 100 : void 0;
      return {
        ...product,
        competitorPrices: productCompetitorPrices,
        lowestCompetitorPrice,
        competitivenessPercentage
      };
    });
  }
  async addPriceHistory(productId, price, recordedAt) {
    const entry = {
      id: randomUUID(),
      productId,
      price,
      recordedAt: recordedAt ? new Date(recordedAt) : /* @__PURE__ */ new Date()
    };
    this.priceHistory.set(entry.id, entry);
    return entry;
  }
  async updatePriceHistory(id, data) {
    const entry = this.priceHistory.get(id);
    if (!entry) return void 0;
    const updated = {
      ...entry,
      price: data.price,
      recordedAt: /* @__PURE__ */ new Date()
      // Update timestamp when price is changed
    };
    this.priceHistory.set(id, updated);
    return updated;
  }
  async deletePriceHistory(id) {
    return this.priceHistory.delete(id);
  }
  async getDashboardKPIs() {
    const productsWithPrices = await this.getProductsWithCompetitorPrices();
    const allCompetitors = await this.getCompetitors();
    const totalProducts = productsWithPrices.length;
    const competitiveProducts = productsWithPrices.filter(
      (p) => p.competitivenessPercentage && p.competitivenessPercentage <= 0
    ).length;
    const totalCompetitors = allCompetitors.length;
    const productsWithCompetitorPrices = productsWithPrices.filter(
      (p) => p.competitorPrices.length > 0
    ).length;
    let lowestPriceCompetitor = null;
    if (allCompetitors.length > 0) {
      const competitorAvgPrices = allCompetitors.map((competitor) => {
        const competitorPrices2 = Array.from(this.competitorPrices.values()).filter((cp) => cp.competitorId === competitor.id).map((cp) => parseFloat(cp.price));
        const avgPrice = competitorPrices2.length > 0 ? competitorPrices2.reduce((sum, price) => sum + price, 0) / competitorPrices2.length : 0;
        return { name: competitor.name, avgPrice };
      }).filter((c) => c.avgPrice > 0);
      if (competitorAvgPrices.length > 0) {
        lowestPriceCompetitor = competitorAvgPrices.reduce(
          (lowest, current) => current.avgPrice < lowest.avgPrice ? current : lowest
        );
      }
    }
    const priceAdjustmentOpportunities = productsWithPrices.filter(
      (p) => p.competitorPrices.length === 0
      // produtos sem preços de concorrentes
    ).length;
    return {
      totalProducts,
      competitiveProducts,
      totalCompetitors,
      productsWithCompetitorPrices,
      lowestPriceCompetitor,
      priceAdjustmentOpportunities,
      competitiveProductsChange: 12
      // TODO: Calculate based on historical data
    };
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  type: text("type").notNull(),
  // latex, esmalte, verniz, primer
  size: text("size").notNull(),
  // 900ml, 3.6L, 18L
  color: text("color").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var competitors = pgTable("competitors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  location: text("location"),
  website: text("website"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var competitorPrices = pgTable("competitor_prices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull().references(() => products.id),
  competitorId: varchar("competitor_id").notNull().references(() => competitors.id),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  recordedAt: timestamp("recorded_at").defaultNow().notNull()
});
var priceHistory = pgTable("price_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull().references(() => products.id),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  competitorId: varchar("competitor_id").references(() => competitors.id),
  // null for own prices
  recordedAt: timestamp("recorded_at").defaultNow().notNull()
});
var insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertCompetitorSchema = createInsertSchema(competitors).omit({
  id: true,
  createdAt: true
});
var insertCompetitorPriceSchema = createInsertSchema(competitorPrices).omit({
  id: true,
  recordedAt: true
});
var insertPriceHistorySchema = createInsertSchema(priceHistory).omit({
  id: true,
  recordedAt: true
});

// server/jsonbin.ts
var JSONBinService = class {
  config;
  constructor() {
    this.config = {
      masterKey: process.env.JSONBIN_MASTER_KEY || "",
      baseURL: "https://api.jsonbin.io/v3"
    };
  }
  getHeaders() {
    return {
      "Content-Type": "application/json",
      "X-Master-Key": this.config.masterKey
    };
  }
  async makeRequest(url, options = {}) {
    if (!this.config.masterKey) {
      throw new Error("JSONBin Master Key n\xE3o configurada. Configure a vari\xE1vel JSONBIN_MASTER_KEY.");
    }
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers
      }
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`JSONBin API Error: ${response.status} - ${errorText}`);
    }
    return response.json();
  }
  // Cria um novo bin com os dados da aplicação
  async createBackup() {
    const appData = {
      products: await storage.getProducts(),
      competitors: await storage.getCompetitors(),
      competitorPrices: await storage.getCompetitorPrices(),
      priceHistory: await storage.getPriceHistory(),
      lastSync: (/* @__PURE__ */ new Date()).toISOString()
    };
    const result = await this.makeRequest(
      `${this.config.baseURL}/b`,
      {
        method: "POST",
        headers: {
          "X-Bin-Name": `PaintCompare-Backup-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}`,
          "X-Bin-Private": "true"
        },
        body: JSON.stringify(appData)
      }
    );
    return result.metadata.id;
  }
  // Atualiza um bin existente com os dados atuais
  async updateBackup(binId) {
    const appData = {
      products: await storage.getProducts(),
      competitors: await storage.getCompetitors(),
      competitorPrices: await storage.getCompetitorPrices(),
      priceHistory: await storage.getPriceHistory(),
      lastSync: (/* @__PURE__ */ new Date()).toISOString()
    };
    await this.makeRequest(
      `${this.config.baseURL}/b/${binId}`,
      {
        method: "PUT",
        body: JSON.stringify(appData)
      }
    );
  }
  // Recupera dados de um bin específico
  async getBackup(binId) {
    const result = await this.makeRequest(
      `${this.config.baseURL}/b/${binId}`
    );
    return result.record;
  }
  // Restaura dados do JSONBin para o storage local
  async restoreFromBackup(binId) {
    const backupData = await this.getBackup(binId);
    for (const product of backupData.products) {
      try {
        await storage.createProduct(product);
      } catch (error) {
        await storage.updateProduct(product.id, product);
      }
    }
    for (const competitor of backupData.competitors) {
      try {
        await storage.createCompetitor(competitor);
      } catch (error) {
        await storage.updateCompetitor(competitor.id, competitor);
      }
    }
    for (const price of backupData.competitorPrices) {
      try {
        await storage.createCompetitorPrice(price);
      } catch (error) {
        console.warn(`Erro ao restaurar pre\xE7o: ${error}`);
      }
    }
    for (const history of backupData.priceHistory) {
      try {
        await storage.createPriceHistoryEntry(history);
      } catch (error) {
        console.warn(`Erro ao restaurar hist\xF3rico: ${error}`);
      }
    }
  }
  // Lista todos os bins (backups) do usuário
  async listBackups() {
    console.warn("Listagem de backups desabilitada temporariamente");
    return [];
  }
  // Deleta um backup específico
  async deleteBackup(binId) {
    await this.makeRequest(
      `${this.config.baseURL}/b/${binId}`,
      { method: "DELETE" }
    );
  }
  // Sincronização automática - cria backup se não existir, ou atualiza o existente
  async syncData() {
    const backups = await this.listBackups();
    if (backups.length === 0) {
      const binId = await this.createBackup();
      return { binId, isNew: true };
    } else {
      const latestBackup = backups.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )[0];
      await this.updateBackup(latestBackup.id);
      return { binId: latestBackup.id, isNew: false };
    }
  }
  // Verifica se a configuração está válida
  async testConnection() {
    try {
      await this.makeRequest(`${this.config.baseURL}/c`);
      return true;
    } catch (error) {
      console.error("Erro ao testar conex\xE3o com JSONBin:", error);
      return false;
    }
  }
};
var jsonbinService = new JSONBinService();

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/products", async (req, res) => {
    try {
      const products2 = await storage.getProducts();
      res.json(products2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  app2.get("/api/products/with-prices", async (req, res) => {
    try {
      const products2 = await storage.getProductsWithCompetitorPrices();
      res.json(products2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products with prices" });
    }
  });
  app2.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  app2.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: "Invalid product data", error });
    }
  });
  app2.put("/api/products/:id", async (req, res) => {
    try {
      const validatedData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(req.params.id, validatedData);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: "Invalid product data", error });
    }
  });
  app2.delete("/api/products/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteProduct(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });
  app2.get("/api/competitors", async (req, res) => {
    try {
      const competitors2 = await storage.getCompetitors();
      res.json(competitors2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch competitors" });
    }
  });
  app2.post("/api/competitors", async (req, res) => {
    try {
      const validatedData = insertCompetitorSchema.parse(req.body);
      const competitor = await storage.createCompetitor(validatedData);
      res.status(201).json(competitor);
    } catch (error) {
      res.status(400).json({ message: "Invalid competitor data", error });
    }
  });
  app2.put("/api/competitors/:id", async (req, res) => {
    try {
      const validatedData = insertCompetitorSchema.partial().parse(req.body);
      const competitor = await storage.updateCompetitor(req.params.id, validatedData);
      if (!competitor) {
        return res.status(404).json({ message: "Competitor not found" });
      }
      res.json(competitor);
    } catch (error) {
      res.status(400).json({ message: "Invalid competitor data", error });
    }
  });
  app2.delete("/api/competitors/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCompetitor(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Competitor not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete competitor" });
    }
  });
  app2.get("/api/competitor-prices", async (req, res) => {
    try {
      const productId = req.query.productId;
      const prices = await storage.getCompetitorPrices(productId);
      res.json(prices);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch competitor prices" });
    }
  });
  app2.post("/api/competitor-prices", async (req, res) => {
    try {
      const { recordedAt, ...rest } = req.body;
      const validatedData = insertCompetitorPriceSchema.parse({
        ...rest,
        recordedAt: recordedAt ? new Date(recordedAt) : /* @__PURE__ */ new Date()
      });
      const price = await storage.createCompetitorPrice(validatedData);
      res.status(201).json(price);
    } catch (error) {
      res.status(400).json({ message: "Invalid price data", error });
    }
  });
  app2.get("/api/dashboard/kpis", async (req, res) => {
    try {
      const kpis = await storage.getDashboardKPIs();
      res.json(kpis);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard KPIs" });
    }
  });
  app2.get("/api/price-history/:productId", async (req, res) => {
    try {
      const productId = req.params.productId;
      const history = await storage.getPriceHistory(productId);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch price history" });
    }
  });
  app2.post("/api/price-history", async (req, res) => {
    try {
      const { productId, price, recordedAt } = req.body;
      if (!productId || !price) {
        return res.status(400).json({ message: "Product ID and price are required" });
      }
      const history = await storage.addPriceHistory(productId, price, recordedAt);
      res.status(201).json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to add price history" });
    }
  });
  app2.put("/api/price-history/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { price } = req.body;
      if (!price || isNaN(parseFloat(price))) {
        return res.status(400).json({ message: "Valid price is required" });
      }
      const updated = await storage.updatePriceHistory(id, { price: price.toString() });
      if (!updated) {
        return res.status(404).json({ message: "Price history entry not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update price history" });
    }
  });
  app2.delete("/api/price-history/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deletePriceHistory(id);
      if (!deleted) {
        return res.status(404).json({ message: "Price history entry not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete price history" });
    }
  });
  app2.get("/api/jsonbin/test", async (req, res) => {
    try {
      const isConnected = await jsonbinService.testConnection();
      res.json({ connected: isConnected });
    } catch (error) {
      res.status(500).json({ connected: false, error: error instanceof Error ? error.message : "Unknown error" });
    }
  });
  app2.post("/api/jsonbin/backup", async (req, res) => {
    try {
      const binId = await jsonbinService.createBackup();
      res.json({ binId, message: "Backup criado com sucesso" });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Erro ao criar backup" });
    }
  });
  app2.post("/api/jsonbin/sync", async (req, res) => {
    try {
      const result = await jsonbinService.syncData();
      res.json({
        ...result,
        message: result.isNew ? "Novo backup criado" : "Backup atualizado com sucesso"
      });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Erro na sincroniza\xE7\xE3o" });
    }
  });
  app2.get("/api/jsonbin/backups", async (req, res) => {
    try {
      const backups = await jsonbinService.listBackups();
      res.json(backups);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Erro ao listar backups" });
    }
  });
  app2.post("/api/jsonbin/restore/:binId", async (req, res) => {
    try {
      await jsonbinService.restoreFromBackup(req.params.binId);
      res.json({ message: "Dados restaurados com sucesso" });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Erro ao restaurar dados" });
    }
  });
  app2.delete("/api/jsonbin/backup/:binId", async (req, res) => {
    try {
      await jsonbinService.deleteBackup(req.params.binId);
      res.json({ message: "Backup exclu\xEDdo com sucesso" });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Erro ao excluir backup" });
    }
  });
  app2.post("/api/objects/upload", async (req, res) => {
    try {
      const uploadURL = `https://storage.googleapis.com/mock-bucket/uploads/${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      res.json({ uploadURL });
    } catch (error) {
      res.status(500).json({ message: "Failed to get upload URL" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
