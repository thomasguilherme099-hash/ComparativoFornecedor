// Cliente JSONBin para funcionar diretamente no frontend
export interface JSONBinData {
  products: Array<any>;
  competitors: Array<any>;
  competitorPrices: Array<any>;
  priceHistory: Array<any>;
}

export class JSONBinClient {
  private apiKey: string;
  private binId: string;
  private baseURL = 'https://api.jsonbin.io/v3';

  constructor(apiKey: string, binId: string) {
    this.apiKey = apiKey;
    this.binId = binId;
  }

  private async makeRequest<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': this.apiKey,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`JSONBin API Error: ${response.status} - ${errorData}`);
    }

    return response.json();
  }

  // Carrega os dados do bin
  async loadData(): Promise<JSONBinData> {
    try {
      const result = await this.makeRequest<{ record: JSONBinData }>(`/b/${this.binId}/latest`);
      return result.record;
    } catch (error) {
      console.warn('Erro ao carregar dados do JSONBin:', error);
      // Retorna dados padrão se falhar
      return {
        products: [],
        competitors: [],
        competitorPrices: [],
        priceHistory: []
      };
    }
  }

  // Salva os dados no bin
  async saveData(data: JSONBinData): Promise<void> {
    await this.makeRequest(`/b/${this.binId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // Testa a conexão
  async testConnection(): Promise<boolean> {
    try {
      await this.makeRequest(`/b/${this.binId}/latest`);
      return true;
    } catch {
      return false;
    }
  }

  // Cria um novo bin se necessário
  async createBin(data: JSONBinData): Promise<string> {
    const result = await this.makeRequest<{ metadata: { id: string } }>('/b', {
      method: 'POST',
      headers: {
        'X-Bin-Name': `PaintCompare-Backup-${new Date().toISOString()}`,
        'X-Bin-Private': 'false'
      },
      body: JSON.stringify(data)
    });
    
    return result.metadata.id;
  }
}