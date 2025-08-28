export interface JSONBinConfig {
  apiKey: string;
  binId: string;
  baseUrl: string;
}

export interface JSONBinData {
  products: any[];
  competitors: any[];
  competitorPrices: any[];
  priceHistory: any[];
  lastSync: string;
}

export interface PaintBrand {
  id: string;
  name: string;
  logo?: string;
}

export interface PaintType {
  id: string;
  name: string;
  category: string;
}

export interface PaintSize {
  id: string;
  volume: string;
  unit: string;
}

export const PAINT_BRANDS: PaintBrand[] = [
  { id: "suvinil", name: "Suvinil" },
  { id: "coral", name: "Coral" },
  { id: "sherwin-williams", name: "Sherwin Williams" },
  { id: "tintas-renner", name: "Tintas Renner" },
  { id: "eucatex", name: "Eucatex" },
  { id: "ypiranga", name: "Ypiranga" },
];

export const PAINT_TYPES: PaintType[] = [
  { id: "latex", name: "Látex", category: "interior" },
  { id: "esmalte", name: "Esmalte", category: "acabamento" },
  { id: "verniz", name: "Verniz", category: "proteção" },
  { id: "primer", name: "Primer", category: "preparo" },
  { id: "tinta-acrilica", name: "Tinta Acrílica", category: "interior" },
  { id: "tinta-oleo", name: "Tinta a Óleo", category: "exterior" },
];

export const PAINT_SIZES: PaintSize[] = [
  { id: "900ml", volume: "900", unit: "ml" },
  { id: "1l", volume: "1", unit: "L" },
  { id: "3.6l", volume: "3.6", unit: "L" },
  { id: "18l", volume: "18", unit: "L" },
  { id: "20l", volume: "20", unit: "L" },
];
