import { storage } from "./storage";
import type { Product, Competitor, CompetitorPrice, PriceHistory } from "@shared/schema";

interface JSONBinConfig {
  masterKey: string;
  baseURL: string;
}

interface JSONBinResponse<T> {
  record: T;
  metadata: {
    id: string;
    name: string;
    private: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

interface AppData {
  products: Product[];
  competitors: Competitor[];
  competitorPrices: CompetitorPrice[];
  priceHistory: PriceHistory[];
  lastSync: string;
}

export class JSONBinService {
  private config: JSONBinConfig;

  constructor() {
    this.config = {
      masterKey: process.env.JSONBIN_MASTER_KEY || '',
      baseURL: 'https://api.jsonbin.io/v3'
    };
  }

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'X-Master-Key': this.config.masterKey
    };
  }

  private async makeRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
    if (!this.config.masterKey) {
      throw new Error('JSONBin Master Key não configurada. Configure a variável JSONBIN_MASTER_KEY.');
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
  async createBackup(): Promise<string> {
    const appData: AppData = {
      products: await storage.getProducts(),
      competitors: await storage.getCompetitors(),
      competitorPrices: await storage.getCompetitorPrices(),
      priceHistory: await storage.getPriceHistory(),
      lastSync: new Date().toISOString()
    };

    const result = await this.makeRequest<JSONBinResponse<AppData>>(
      `${this.config.baseURL}/b`,
      {
        method: 'POST',
        headers: {
          'X-Bin-Name': `PaintCompare-Backup-${new Date().toISOString().split('T')[0]}`,
          'X-Bin-Private': 'true'
        },
        body: JSON.stringify(appData)
      }
    );

    return result.metadata.id;
  }

  // Atualiza um bin existente com os dados atuais
  async updateBackup(binId: string): Promise<void> {
    const appData: AppData = {
      products: await storage.getProducts(),
      competitors: await storage.getCompetitors(),
      competitorPrices: await storage.getCompetitorPrices(),
      priceHistory: await storage.getPriceHistory(),
      lastSync: new Date().toISOString()
    };

    await this.makeRequest(
      `${this.config.baseURL}/b/${binId}`,
      {
        method: 'PUT',
        body: JSON.stringify(appData)
      }
    );
  }

  // Recupera dados de um bin específico
  async getBackup(binId: string): Promise<AppData> {
    const result = await this.makeRequest<JSONBinResponse<AppData>>(
      `${this.config.baseURL}/b/${binId}`
    );

    return result.record;
  }

  // Restaura dados do JSONBin para o storage local
  async restoreFromBackup(binId: string): Promise<void> {
    const backupData = await this.getBackup(binId);

    // Limpa dados existentes (implementação simplificada)
    // Em uma implementação real, você pode querer fazer merge ou backup dos dados atuais
    
    // Restaura produtos
    for (const product of backupData.products) {
      try {
        await storage.createProduct(product);
      } catch (error) {
        // Se o produto já existe, atualiza
        await storage.updateProduct(product.id, product);
      }
    }

    // Restaura concorrentes
    for (const competitor of backupData.competitors) {
      try {
        await storage.createCompetitor(competitor);
      } catch (error) {
        await storage.updateCompetitor(competitor.id, competitor);
      }
    }

    // Restaura preços de concorrentes
    for (const price of backupData.competitorPrices) {
      try {
        await storage.createCompetitorPrice(price);
      } catch (error) {
        // Em caso de erro, continua com o próximo
        console.warn(`Erro ao restaurar preço: ${error}`);
      }
    }

    // Restaura histórico de preços
    for (const history of backupData.priceHistory) {
      try {
        await storage.createPriceHistoryEntry(history);
      } catch (error) {
        console.warn(`Erro ao restaurar histórico: ${error}`);
      }
    }
  }

  // Lista todos os bins (backups) do usuário
  async listBackups(): Promise<Array<{ id: string; name: string; createdAt: string; updatedAt: string }>> {
    // Temporariamente desabilitado - API do JSONBin v3 pode não suportar listagem de bins
    // com chave Master Key gratuita
    console.warn('Listagem de backups desabilitada temporariamente');
    return [];
  }

  // Deleta um backup específico
  async deleteBackup(binId: string): Promise<void> {
    await this.makeRequest(
      `${this.config.baseURL}/b/${binId}`,
      { method: 'DELETE' }
    );
  }

  // Sincronização automática - cria backup se não existir, ou atualiza o existente
  async syncData(): Promise<{ binId: string; isNew: boolean }> {
    const backups = await this.listBackups();
    
    if (backups.length === 0) {
      // Cria novo backup
      const binId = await this.createBackup();
      return { binId, isNew: true };
    } else {
      // Atualiza o backup mais recente
      const latestBackup = backups.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )[0];
      
      await this.updateBackup(latestBackup.id);
      return { binId: latestBackup.id, isNew: false };
    }
  }

  // Verifica se a configuração está válida
  async testConnection(): Promise<boolean> {
    try {
      // Faz uma requisição simples para verificar a conectividade
      await this.makeRequest(`${this.config.baseURL}/c`);
      return true;
    } catch (error) {
      console.error('Erro ao testar conexão com JSONBin:', error);
      return false;
    }
  }
}

export const jsonbinService = new JSONBinService();