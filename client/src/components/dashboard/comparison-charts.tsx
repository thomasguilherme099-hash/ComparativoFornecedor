import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { ProductWithCompetitorPrices } from "@shared/schema";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export function ComparisonCharts() {
  const { data: products, isLoading } = useQuery<ProductWithCompetitorPrices[]>({
    queryKey: ["/api/products/with-prices"],
  });

  const chartData = products?.map(product => {
    const myPrice = parseFloat(product.price);
    const competitorPrices = product.competitorPrices.map(cp => parseFloat(cp.price));
    const avgCompetitorPrice = competitorPrices.length > 0 
      ? competitorPrices.reduce((sum, price) => sum + price, 0) / competitorPrices.length
      : 0;
    
    const difference = myPrice - avgCompetitorPrice;
    const percentageDiff = avgCompetitorPrice > 0 ? (difference / avgCompetitorPrice) * 100 : 0;
    
    return {
      product: product.name.length > 15 ? product.name.substring(0, 15) + "..." : product.name,
      fullName: product.name,
      meuPreco: myPrice,
      concorrencia: avgCompetitorPrice,
      diferenca: difference,
      percentual: percentageDiff,
      status: difference < 0 ? 'competitive' : difference > 0 ? 'expensive' : 'equal'
    };
  }).slice(0, 8) || []; // Limitar a 8 produtos para melhor visualização

  const competitiveProducts = chartData.filter(p => p.status === 'competitive').length;
  const expensiveProducts = chartData.filter(p => p.status === 'expensive').length;
  const equalProducts = chartData.filter(p => p.status === 'equal').length;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-md">
          <p className="font-medium">{data.fullName}</p>
          <p className="text-sm">
            <span className="text-primary">Meu preço: R$ {data.meuPreco.toFixed(2)}</span>
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">Média concorrência: R$ {data.concorrencia.toFixed(2)}</span>
          </p>
          <p className="text-xs mt-1">
            <span className={data.diferenca < 0 ? "text-secondary" : data.diferenca > 0 ? "text-destructive" : "text-muted-foreground"}>
              {data.diferenca < 0 ? "+" : ""}{Math.abs(data.percentual).toFixed(1)}% 
              {data.diferenca < 0 ? " mais barato" : data.diferenca > 0 ? " mais caro" : " igual"}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Comparação de Preços
          <div className="flex items-center space-x-2">
            {competitiveProducts > 0 && (
              <Badge variant="default" className="bg-secondary text-secondary-foreground">
                <TrendingDown className="w-3 h-3 mr-1" />
                {competitiveProducts} competitivos
              </Badge>
            )}
            {expensiveProducts > 0 && (
              <Badge variant="destructive">
                <TrendingUp className="w-3 h-3 mr-1" />
                {expensiveProducts} caros
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : !chartData || chartData.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              Nenhum dado de preços disponível para comparação.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="product" 
                  className="text-xs"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis className="text-xs" tickFormatter={(value) => `R$${value}`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="meuPreco" name="Meu Preço" fill="hsl(var(--primary))" radius={4} />
                <Bar dataKey="concorrencia" name="Média Concorrência" fill="hsl(var(--muted-foreground))" radius={4}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="hsl(var(--muted-foreground))" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">{competitiveProducts}</div>
                <div className="text-xs text-muted-foreground">Mais Barato</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-destructive">{expensiveProducts}</div>
                <div className="text-xs text-muted-foreground">Mais Caro</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-muted-foreground">{equalProducts}</div>
                <div className="text-xs text-muted-foreground">Preço Igual</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}