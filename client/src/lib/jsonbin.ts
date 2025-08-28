import { JSONBinConfig, JSONBinData } from "./types";

class JSONBinService {
  private config: JSONBinConfig;

  constructor() {
    this.config = {
      apiKey: import.meta.env.VITE_JSONBIN_API_KEY || "",
      binId: import.meta.env.VITE_JSONBIN_BIN_ID || "",
      baseUrl: "https://api.jsonbin.io/v3/b"
    };
  }

  private getHeaders() {
    return {
      "Content-Type": "application/json",
      "X-Master-Key": this.config.apiKey,
    };
  }

  async saveData(data: JSONBinData): Promise<boolean> {
    if (!this.config.apiKey || !this.config.binId) {
      console.warn("JSONBin not configured. Skipping cloud sync.");
      return false;
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/${this.config.binId}`, {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`JSONBin API error: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error("Failed to save to JSONBin:", error);
      return false;
    }
  }

  async loadData(): Promise<JSONBinData | null> {
    if (!this.config.apiKey || !this.config.binId) {
      console.warn("JSONBin not configured. Using local data only.");
      return null;
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/${this.config.binId}/latest`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`JSONBin API error: ${response.status}`);
      }

      const result = await response.json();
      return result.record;
    } catch (error) {
      console.error("Failed to load from JSONBin:", error);
      return null;
    }
  }

  async testConnection(): Promise<boolean> {
    if (!this.config.apiKey || !this.config.binId) {
      return false;
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/${this.config.binId}/latest`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  }

  isConfigured(): boolean {
    return !!(this.config.apiKey && this.config.binId);
  }
}

export const jsonBinService = new JSONBinService();
