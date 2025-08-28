import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertCompetitorSchema, insertCompetitorPriceSchema } from "@shared/schema";
import { jsonbinService } from "./jsonbin";

export async function registerRoutes(app: Express): Promise<Server> {
  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Analytics routes - must come before /api/products/:id to avoid collision
  app.get("/api/products/with-prices", async (req, res) => {
    try {
      const products = await storage.getProductsWithCompetitorPrices();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products with prices" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
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

  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: "Invalid product data", error });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
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

  app.delete("/api/products/:id", async (req, res) => {
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

  // Competitors routes
  app.get("/api/competitors", async (req, res) => {
    try {
      const competitors = await storage.getCompetitors();
      res.json(competitors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch competitors" });
    }
  });

  app.post("/api/competitors", async (req, res) => {
    try {
      const validatedData = insertCompetitorSchema.parse(req.body);
      const competitor = await storage.createCompetitor(validatedData);
      res.status(201).json(competitor);
    } catch (error) {
      res.status(400).json({ message: "Invalid competitor data", error });
    }
  });

  app.put("/api/competitors/:id", async (req, res) => {
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

  app.delete("/api/competitors/:id", async (req, res) => {
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

  // Competitor prices routes
  app.get("/api/competitor-prices", async (req, res) => {
    try {
      const productId = req.query.productId as string;
      const prices = await storage.getCompetitorPrices(productId);
      res.json(prices);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch competitor prices" });
    }
  });

  app.post("/api/competitor-prices", async (req, res) => {
    try {
      const { recordedAt, ...rest } = req.body;
      const validatedData = insertCompetitorPriceSchema.parse({
        ...rest,
        recordedAt: recordedAt ? new Date(recordedAt) : new Date()
      });
      const price = await storage.createCompetitorPrice(validatedData);
      res.status(201).json(price);
    } catch (error) {
      res.status(400).json({ message: "Invalid price data", error });
    }
  });


  app.get("/api/dashboard/kpis", async (req, res) => {
    try {
      const kpis = await storage.getDashboardKPIs();
      res.json(kpis);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard KPIs" });
    }
  });

  app.get("/api/price-history/:productId", async (req, res) => {
    try {
      const productId = req.params.productId;
      const history = await storage.getPriceHistory(productId);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch price history" });
    }
  });

  // Add price to history
  app.post("/api/price-history", async (req, res) => {
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

  // Update price history entry
  app.put("/api/price-history/:id", async (req, res) => {
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

  // Delete price history entry
  app.delete("/api/price-history/:id", async (req, res) => {
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

  // JSONBin backup/sync routes
  app.get("/api/jsonbin/test", async (req, res) => {
    try {
      const isConnected = await jsonbinService.testConnection();
      res.json({ connected: isConnected });
    } catch (error) {
      res.status(500).json({ connected: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.post("/api/jsonbin/backup", async (req, res) => {
    try {
      const binId = await jsonbinService.createBackup();
      res.json({ binId, message: "Backup criado com sucesso" });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Erro ao criar backup" });
    }
  });

  app.post("/api/jsonbin/sync", async (req, res) => {
    try {
      const result = await jsonbinService.syncData();
      res.json({ 
        ...result, 
        message: result.isNew ? "Novo backup criado" : "Backup atualizado com sucesso" 
      });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Erro na sincronização" });
    }
  });

  app.get("/api/jsonbin/backups", async (req, res) => {
    try {
      const backups = await jsonbinService.listBackups();
      res.json(backups);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Erro ao listar backups" });
    }
  });

  app.post("/api/jsonbin/restore/:binId", async (req, res) => {
    try {
      await jsonbinService.restoreFromBackup(req.params.binId);
      res.json({ message: "Dados restaurados com sucesso" });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Erro ao restaurar dados" });
    }
  });

  app.delete("/api/jsonbin/backup/:binId", async (req, res) => {
    try {
      await jsonbinService.deleteBackup(req.params.binId);
      res.json({ message: "Backup excluído com sucesso" });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Erro ao excluir backup" });
    }
  });

  // Object storage routes for image upload
  app.post("/api/objects/upload", async (req, res) => {
    try {
      // For now, return a mock upload URL - in production this would be a signed URL
      const uploadURL = `https://storage.googleapis.com/mock-bucket/uploads/${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      res.json({ uploadURL });
    } catch (error) {
      res.status(500).json({ message: "Failed to get upload URL" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
