import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { KPICards } from "@/components/dashboard/kpi-cards";
import { ComparisonCharts } from "@/components/dashboard/comparison-charts";
import { PriceHistoryChart } from "@/components/dashboard/price-history-chart";
import { TopProducts } from "@/components/dashboard/top-products";
import { RecentActivities } from "@/components/dashboard/recent-activities";

export default function Dashboard() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          title="Dashboard" 
          subtitle="Visão geral do seu negócio"
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="p-6">
            <KPICards />
            
            <div className="grid grid-cols-1 gap-6 mb-8">
              <ComparisonCharts />
            </div>
            
            <div className="grid grid-cols-1 gap-6 mb-8">
              <PriceHistoryChart />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentActivities />
              <TopProducts />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
