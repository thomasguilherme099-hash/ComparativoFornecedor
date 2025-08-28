import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { CompetitivenessReport } from "@/components/reports/competitiveness-report";
import { PriceHistoryReport } from "@/components/reports/price-history-report";
import { MarketPositionReport } from "@/components/reports/market-position-report";
import { staticStorage } from "@/lib/static-storage";

export default function Reports() {
  const [data, setData] = useState({
    products: staticStorage.getProducts(),
    competitors: staticStorage.getCompetitors(),
    competitorPrices: staticStorage.getCompetitorPrices(),
    priceHistory: staticStorage.getPriceHistory(),
    productsWithPrices: staticStorage.getProductsWithPrices()
  });

  // Atualiza dados quando o storage muda
  useEffect(() => {
    const unsubscribe = staticStorage.subscribe(() => {
      setData({
        products: staticStorage.getProducts(),
        competitors: staticStorage.getCompetitors(),
        competitorPrices: staticStorage.getCompetitorPrices(),
        priceHistory: staticStorage.getPriceHistory(),
        productsWithPrices: staticStorage.getProductsWithPrices()
      });
    });

    return unsubscribe;
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          title="Relatórios" 
          subtitle="Análises de competitividade e tendências"
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="p-6 space-y-8">
            <CompetitivenessReport 
              products={data.products}
              competitorPrices={data.competitorPrices}
              competitors={data.competitors}
            />
            
            <PriceHistoryReport 
              products={data.products}
              priceHistory={data.priceHistory}
              competitors={data.competitors}
            />
            
            <MarketPositionReport 
              productsWithPrices={data.productsWithPrices}
              competitors={data.competitors}
            />
          </div>
        </main>
      </div>
    </div>
  );
}