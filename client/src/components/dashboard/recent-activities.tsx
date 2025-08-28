import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { ProductWithCompetitorPrices } from "@shared/schema";

export function RecentActivities() {
  const { data: products, isLoading, error } = useQuery<ProductWithCompetitorPrices[]>({
    queryKey: ["/api/products/with-prices"],
  });

  if (isLoading) {
    return (
      <Card className="lg:col-span-2" data-testid="recent-activities">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Atualizações Recentes</CardTitle>
            <Skeleton className="h-9 w-24" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Skeleton className="h-64 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !products) {
    return (
      <Card className="lg:col-span-2" data-testid="recent-activities">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Atualizações Recentes</CardTitle>
            <Button variant="ghost" size="sm">Ver histórico</Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Erro ao carregar dados ou nenhuma atividade recente
          </p>
        </CardContent>
      </Card>
    );
  }

  const recentProducts = products.slice(0, 5);

  return (
    <Card className="lg:col-span-2" data-testid="recent-activities">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Atualizações Recentes</CardTitle>
          <Button variant="ghost" size="sm" data-testid="button-view-history">Ver histórico</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Produto</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Seu Preço</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Concorrente</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Diferença</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-sm text-muted-foreground">
                    Nenhum produto encontrado. Adicione produtos para ver as atualizações.
                  </td>
                </tr>
              ) : (
                recentProducts.map((product) => {
                  const lowestPrice = product.lowestCompetitorPrice;
                  const priceDiff = lowestPrice ? parseFloat(product.price) - lowestPrice : 0;
                  const isCompetitive = priceDiff <= 0;

                  return (
                    <tr key={product.id} className="border-b border-border" data-testid={`activity-${product.id}`}>
                      <td className="py-3 px-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-muted rounded-md flex items-center justify-center">
                            <span className="text-xs">🎨</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-sm text-foreground font-medium">
                        R$ {parseFloat(product.price).toFixed(2)}
                      </td>
                      <td className="py-3 px-2 text-sm text-foreground">
                        {lowestPrice ? `R$ ${lowestPrice.toFixed(2)}` : "N/A"}
                      </td>
                      <td className="py-3 px-2">
                        {lowestPrice ? (
                          <Badge
                            variant={isCompetitive ? "default" : "destructive"}
                            className={isCompetitive ? "bg-secondary/20 text-secondary" : "bg-destructive/20 text-destructive"}
                          >
                            {priceDiff >= 0 ? '+' : ''}R$ {priceDiff.toFixed(2)}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">N/A</span>
                        )}
                      </td>
                      <td className="py-3 px-2">
                        <Badge
                          variant={isCompetitive ? "default" : "secondary"}
                          className={isCompetitive ? "bg-secondary/20 text-secondary" : "bg-accent/20 text-accent"}
                        >
                          {isCompetitive ? "Competitivo" : "Revisar"}
                        </Badge>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
