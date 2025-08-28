import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { ProductWithCompetitorPrices } from "@shared/schema";

export function TopProducts() {
  const { data: products, isLoading, error } = useQuery<ProductWithCompetitorPrices[]>({
    queryKey: ["/api/products/with-prices"],
  });

  if (isLoading) {
    return (
      <Card data-testid="top-products">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Produtos Mais Competitivos</CardTitle>
            <Skeleton className="h-9 w-20" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <div>
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="text-right">
                  <Skeleton className="h-4 w-12 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !products) {
    return (
      <Card data-testid="top-products">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Produtos Mais Competitivos</CardTitle>
            <Button variant="ghost" size="sm">Ver todos</Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Erro ao carregar produtos ou nenhum produto cadastrado
          </p>
        </CardContent>
      </Card>
    );
  }

  const topCompetitiveProducts = products
    .filter(p => p.competitivenessPercentage !== undefined && p.competitivenessPercentage <= 0)
    .sort((a, b) => (a.competitivenessPercentage || 0) - (b.competitivenessPercentage || 0))
    .slice(0, 3);

  return (
    <Card data-testid="top-products">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Produtos Mais Competitivos</CardTitle>
          <Button variant="ghost" size="sm" data-testid="button-view-all">Ver todos</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topCompetitiveProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhum produto competitivo encontrado. Adicione produtos e preços de concorrentes.
            </p>
          ) : (
            topCompetitiveProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg" data-testid={`product-${product.id}`}>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center overflow-hidden">
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML = '<span class="text-lg">🎨</span>';
                        }}
                      />
                    ) : (
                      <span className="text-lg">🎨</span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.brand} - {product.color}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="bg-secondary/20 text-secondary">
                    {product.competitivenessPercentage?.toFixed(1)}%
                  </Badge>
                  <p className="text-sm text-muted-foreground">vs concorrência</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
