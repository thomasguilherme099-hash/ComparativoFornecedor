import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { KPICards } from "@/components/dashboard/kpi-cards";
import { ComparisonCharts } from "@/components/dashboard/comparison-charts";
import { PriceHistoryChart } from "@/components/dashboard/price-history-chart";
import { TopProducts } from "@/components/dashboard/top-products";
import { RecentActivities } from "@/components/dashboard/recent-activities";
import { staticStorage } from "@/lib/static-storage";

export default function Dashboard() {
  const [data, setData] = useState({
    kpis: staticStorage.getDashboardKPIs(),
    products: staticStorage.getProducts(),
    competitors: staticStorage.getCompetitors(),
    productsWithPrices: staticStorage.getProductsWithPrices()
  });

  // Atualiza dados quando o storage muda
  useEffect(() => {
    const unsubscribe = staticStorage.subscribe(() => {
      setData({
        kpis: staticStorage.getDashboardKPIs(),
        products: staticStorage.getProducts(),
        competitors: staticStorage.getCompetitors(),
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
          title="Dashboard" 
          subtitle="Visão geral da competitividade de preços"
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="p-6 space-y-8">
            <KPICards data={data.kpis} />
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
              <ComparisonCharts 
                products={data.products}
                competitors={data.competitors}
                productsWithPrices={data.productsWithPrices}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 mb-8">
              <PriceHistoryChart 
                products={data.products}
                priceHistory={staticStorage.getPriceHistory()}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentActivities data={data.productsWithPrices} />
              <TopProducts data={data.productsWithPrices} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}