import { Package, TrendingDown, Target, Lightbulb, DollarSign, AlertTriangle, Award, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardKPIs } from "@shared/schema";

export function KPICards() {
  const { data: kpis, isLoading, error } = useQuery<DashboardKPIs>({
    queryKey: ["/api/dashboard/kpis"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !kpis) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">Erro ao carregar KPIs</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card data-testid="kpi-total-products">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total de Produtos</p>
              <p className="text-2xl font-bold text-foreground">{kpis.totalProducts}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {kpis.competitiveProducts} competitivos
              </p>
            </div>
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card data-testid="kpi-total-competitors">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Concorrentes</p>
              <p className="text-2xl font-bold text-foreground">{kpis.totalCompetitors}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Cadastrados no sistema
              </p>
            </div>
            <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-secondary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card data-testid="kpi-products-with-prices">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Com Preços Comparados</p>
              <p className="text-2xl font-bold text-foreground">{kpis.productsWithCompetitorPrices}</p>
              <p className="text-xs text-accent mt-1">
                de {kpis.totalProducts} produtos
              </p>
            </div>
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-accent" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card data-testid="kpi-needs-analysis">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Precisam Análise</p>
              <p className="text-2xl font-bold text-foreground">{kpis.priceAdjustmentOpportunities}</p>
              <p className="text-xs text-destructive mt-1">
                Sem preços de concorrentes
              </p>
            </div>
            <div className="w-10 h-10 bg-destructive/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
