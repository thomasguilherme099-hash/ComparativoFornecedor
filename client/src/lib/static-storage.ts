import { JSONBinClient, type JSONBinData } from './jsonbin-client';

// Classe para gerenciar dados localmente e sincronizar com JSONBin
export class StaticStorage {
  private data: JSONBinData | null = null;
  private jsonBinClient: JSONBinClient | null = null;
  private subscribers: Array<() => void> = [];

  constructor() {
    this.initializeData();
  }

  // Inicializa os dados com dados padrão
  private initializeData() {
    this.data = {
      products: [
        {
          id: "prod1",
          name: "Látex Premium Branco",
          brand: "Coral",
          category: "Látex",
          size: "18L",
          description: "Tinta látex premium para paredes internas",
          image: "/api/placeholder/200/200",
          ourPrice: 89.90
        },
        {
          id: "prod2",
          name: "Esmalte Sintético Azul",
          brand: "Suvinil",
          category: "Esmalte",
          size: "3.6L",
          description: "Esmalte sintético brilhante",
          image: "/api/placeholder/200/200",
          ourPrice: 65.50
        },
        {
          id: "prod3",
          name: "Primer Branco",
          brand: "Sherwin Williams",
          category: "Primer",
          size: "18L",
          description: "Primer selador para paredes",
          image: "/api/placeholder/200/200",
          ourPrice: 75.00
        },
        {
          id: "prod4",
          name: "Látex Econômico Bege",
          brand: "Coral",
          category: "Látex",
          size: "18L",
          description: "Linha econômica para acabamento fosco",
          image: "/api/placeholder/200/200",
          ourPrice: 62.30
        },
        {
          id: "prod5",
          name: "Verniz Marítimo",
          brand: "Iquine",
          category: "Verniz",
          size: "900ml",
          description: "Verniz transparente resistente à umidade",
          image: "/api/placeholder/200/200",
          ourPrice: 45.80
        }
      ],
      competitors: [
        {
          id: "comp1",
          name: "Casa das Tintas",
          location: "Centro",
          type: "Física",
          contact: "(11) 9999-1234"
        },
        {
          id: "comp2",
          name: "TintasOnline",
          location: "Online",
          type: "E-commerce",
          contact: "contato@tintasonline.com"
        },
        {
          id: "comp3",
          name: "Mega Tintas",
          location: "Shopping Norte",
          type: "Física",
          contact: "(11) 8888-5678"
        }
      ],
      competitorPrices: [
        {
          id: "cp1",
          productId: "prod1",
          competitorId: "comp1",
          price: 92.00,
          date: "2024-01-15",
          notes: "Promoção de inverno"
        },
        {
          id: "cp2",
          productId: "prod1",
          competitorId: "comp2",
          price: 87.50,
          date: "2024-01-15",
          notes: "Frete grátis acima de R$ 100"
        },
        {
          id: "cp3",
          productId: "prod2",
          competitorId: "comp1",
          price: 68.90,
          date: "2024-01-15",
          notes: ""
        },
        {
          id: "cp4",
          productId: "prod2",
          competitorId: "comp3",
          price: 63.00,
          date: "2024-01-15",
          notes: "Produto em oferta"
        }
      ],
      priceHistory: [
        {
          id: "ph1",
          productId: "prod1",
          competitorId: "comp1",
          price: 95.00,
          date: "2024-01-01"
        },
        {
          id: "ph2",
          productId: "prod1",
          competitorId: "comp1",
          price: 92.00,
          date: "2024-01-15"
        },
        {
          id: "ph3",
          productId: "prod1",
          competitorId: "comp2",
          price: 90.00,
          date: "2024-01-01"
        },
        {
          id: "ph4",
          productId: "prod1",
          competitorId: "comp2",
          price: 87.50,
          date: "2024-01-15"
        }
      ]
    };
  }

  // Configura o cliente JSONBin
  setJSONBinConfig(apiKey: string, binId: string) {
    this.jsonBinClient = new JSONBinClient(apiKey, binId);
  }

  // Carrega dados do JSONBin
  async loadFromJSONBin(): Promise<void> {
    if (!this.jsonBinClient) {
      throw new Error('JSONBin não configurado');
    }

    const data = await this.jsonBinClient.loadData();
    if (data && Object.keys(data).length > 0) {
      this.data = data;
      this.notifySubscribers();
    }
  }

  // Salva dados no JSONBin
  async saveToJSONBin(): Promise<void> {
    if (!this.jsonBinClient || !this.data) {
      throw new Error('JSONBin não configurado ou dados não disponíveis');
    }

    await this.jsonBinClient.saveData(this.data);
  }

  // Testa conexão JSONBin
  async testJSONBinConnection(): Promise<boolean> {
    if (!this.jsonBinClient) {
      return false;
    }
    return this.jsonBinClient.testConnection();
  }

  // Métodos para acessar dados
  getProducts() {
    return this.data?.products || [];
  }

  getCompetitors() {
    return this.data?.competitors || [];
  }

  getCompetitorPrices() {
    return this.data?.competitorPrices || [];
  }

  getPriceHistory() {
    return this.data?.priceHistory || [];
  }

  // Métodos para modificar dados
  addProduct(product: any) {
    if (this.data) {
      this.data.products.push({ ...product, id: this.generateId() });
      this.notifySubscribers();
    }
  }

  updateProduct(id: string, product: any) {
    if (this.data) {
      const index = this.data.products.findIndex(p => p.id === id);
      if (index >= 0) {
        this.data.products[index] = { ...product, id };
        this.notifySubscribers();
      }
    }
  }

  deleteProduct(id: string) {
    if (this.data) {
      this.data.products = this.data.products.filter(p => p.id !== id);
      this.notifySubscribers();
    }
  }

  // Métodos similares para competitors
  addCompetitor(competitor: any) {
    if (this.data) {
      this.data.competitors.push({ ...competitor, id: this.generateId() });
      this.notifySubscribers();
    }
  }

  updateCompetitor(id: string, competitor: any) {
    if (this.data) {
      const index = this.data.competitors.findIndex(c => c.id === id);
      if (index >= 0) {
        this.data.competitors[index] = { ...competitor, id };
        this.notifySubscribers();
      }
    }
  }

  deleteCompetitor(id: string) {
    if (this.data) {
      this.data.competitors = this.data.competitors.filter(c => c.id !== id);
      this.notifySubscribers();
    }
  }

  // Métodos para preços
  addCompetitorPrice(price: any) {
    if (this.data) {
      this.data.competitorPrices.push({ ...price, id: this.generateId() });
      this.notifySubscribers();
    }
  }

  updateCompetitorPrice(id: string, price: any) {
    if (this.data) {
      const index = this.data.competitorPrices.findIndex(p => p.id === id);
      if (index >= 0) {
        this.data.competitorPrices[index] = { ...price, id };
        this.notifySubscribers();
      }
    }
  }

  deleteCompetitorPrice(id: string) {
    if (this.data) {
      this.data.competitorPrices = this.data.competitorPrices.filter(p => p.id !== id);
      this.notifySubscribers();
    }
  }

  // Sistema de subscrição para mudanças
  subscribe(callback: () => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => callback());
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Métodos para KPIs do dashboard
  getDashboardKPIs() {
    const products = this.getProducts();
    const competitors = this.getCompetitors();
    const competitorPrices = this.getCompetitorPrices();

    const competitiveProducts = products.filter(product => {
      const prices = competitorPrices.filter(cp => cp.productId === product.id);
      return prices.some(price => price.price < product.ourPrice);
    }).length;

    const avgCompetitorPrice = competitorPrices.length > 0 
      ? competitorPrices.reduce((sum, cp) => sum + cp.price, 0) / competitorPrices.length
      : 0;

    return {
      totalProducts: products.length,
      competitiveProducts,
      totalCompetitors: competitors.length,
      avgCompetitorPrice: Number(avgCompetitorPrice.toFixed(2))
    };
  }

  // Método para obter produtos com preços dos concorrentes
  getProductsWithPrices() {
    const products = this.getProducts();
    const competitorPrices = this.getCompetitorPrices();
    const competitors = this.getCompetitors();

    return products.map(product => {
      const prices = competitorPrices.filter(cp => cp.productId === product.id);
      const competitorInfo = prices.map(price => {
        const competitor = competitors.find(c => c.id === price.competitorId);
        return {
          competitorName: competitor?.name || 'Desconhecido',
          price: price.price,
          date: price.date
        };
      });

      return {
        ...product,
        competitorPrices: competitorInfo
      };
    });
  }
}

// Instância global do storage
export const staticStorage = new StaticStorage();