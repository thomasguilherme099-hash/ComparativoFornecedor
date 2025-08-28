import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, EyeOff } from "lucide-react";
import type { ProductWithCompetitorPrices, Competitor } from "@shared/schema";

export default function Comparison() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>([]);

  const { data: products, isLoading: productsLoading } = useQuery<ProductWithCompetitorPrices[]>({
    queryKey: ["/api/products/with-prices"],
  });

  const { data: competitors, isLoading: competitorsLoading } = useQuery<Competitor[]>({
    queryKey: ["/api/competitors"],
  });

  const isLoading = productsLoading || competitorsLoading;

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const selectAllProducts = () => {
    if (products) {
      setSelectedProducts(products.map(p => p.id));
    }
  };

  const clearSelection = () => {
    setSelectedProducts([]);
  };

  const toggleCompetitorSelection = (competitorId: string) => {
    setSelectedCompetitors(prev => 
      prev.includes(competitorId) 
        ? prev.filter(id => id !== competitorId)
        : [...prev, competitorId]
    );
  };

  const selectAllCompetitors = () => {
    if (competitors) {
      setSelectedCompetitors(competitors.map(c => c.id));
    }
  };

  const clearCompetitorSelection = () => {
    setSelectedCompetitors([]);
  };

  const displayProducts = selectedProducts.length > 0 
    ? (products || []).filter(p => selectedProducts.includes(p.id))
    : products || [];

  const displayCompetitors = selectedCompetitors.length > 0 
    ? (competitors || []).filter(c => selectedCompetitors.includes(c.id))
    : competitors || [];

  const getMinPrice = (product: ProductWithCompetitorPrices, visibleCompetitors: Competitor[]) => {
    const visibleCompetitorIds = visibleCompetitors?.map(c => c.id) || [];
    const visibleCompetitorPrices = (product.competitorPrices || [])
      .filter(cp => visibleCompetitorIds.includes(cp.competitorId))
      .map(cp => parseFloat(cp.price));
    const allPrices = [parseFloat(product.price), ...visibleCompetitorPrices];
    return allPrices.length > 0 ? Math.min(...allPrices) : parseFloat(product.price);
  };

  const getMaxPrice = (product: ProductWithCompetitorPrices, visibleCompetitors: Competitor[]) => {
    const visibleCompetitorIds = visibleCompetitors?.map(c => c.id) || [];
    const visibleCompetitorPrices = (product.competitorPrices || [])
      .filter(cp => visibleCompetitorIds.includes(cp.competitorId))
      .map(cp => parseFloat(cp.price));
    const allPrices = [parseFloat(product.price), ...visibleCompetitorPrices];
    return allPrices.length > 0 ? Math.max(...allPrices) : parseFloat(product.price);
  };

  const isPriceMin = (price: number, minPrice: number) => Math.abs(price - minPrice) < 0.01;
  const isPriceMax = (price: number, maxPrice: number) => Math.abs(price - maxPrice) < 0.01;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          title="Comparação de Preços" 
          subtitle="Compare seus preços com a concorrência"
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="p-6 space-y-6">
            
            {/* Product Filters */}
            <div className="bg-card rounded-lg p-4 border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-sm font-medium">Produtos:</div>
                  <div className="flex flex-wrap gap-2">
                    {products?.map(product => (
                      <Button
                        key={product.id}
                        variant={selectedProducts.includes(product.id) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleProductSelection(product.id)}
                        data-testid={`button-product-${product.id}`}
                      >
                        {product.name.length > 20 ? product.name.substring(0, 20) + "..." : product.name}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={selectAllProducts} data-testid="button-select-all-products">
                    Todos
                  </Button>
                  <Button variant="ghost" size="sm" onClick={clearSelection} data-testid="button-clear-products">
                    Limpar
                  </Button>
                  <Badge variant="outline">
                    {selectedProducts.length || products?.length || 0} exibidos
                  </Badge>
                </div>
              </div>
            </div>

            {/* Competitor Filters */}
            <div className="bg-card rounded-lg p-4 border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-sm font-medium">Concorrentes:</div>
                  <div className="flex flex-wrap gap-2">
                    {competitors?.map(competitor => (
                      <Button
                        key={competitor.id}
                        variant={selectedCompetitors.includes(competitor.id) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleCompetitorSelection(competitor.id)}
                        data-testid={`button-competitor-${competitor.id}`}
                      >
                        {competitor.name}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={selectAllCompetitors} data-testid="button-select-all-competitors">
                    Todos
                  </Button>
                  <Button variant="ghost" size="sm" onClick={clearCompetitorSelection} data-testid="button-clear-competitors">
                    Limpar
                  </Button>
                  <Badge variant="outline">
                    {selectedCompetitors.length || competitors?.length || 0} exibidos
                  </Badge>
                </div>
              </div>
            </div>

            {/* Comparison Table */}
            <Card>
              <CardHeader>
                <CardTitle>Comparação Detalhada</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : !products || products.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">
                      Nenhum produto encontrado. Adicione produtos para fazer comparações.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Produto</TableHead>
                          <TableHead>Seu Preço</TableHead>
                          {displayCompetitors.map(competitor => (
                            <TableHead key={competitor.id}>{competitor.name}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {displayProducts.map((product) => {
                          const minPrice = getMinPrice(product, displayCompetitors);
                          const maxPrice = getMaxPrice(product, displayCompetitors);
                          const myPrice = parseFloat(product.price);
                          
                          return (
                            <TableRow key={product.id} data-testid={`comparison-row-${product.id}`}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{product.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {product.brand} - {product.size}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="secondary"
                                  className={
                                    isPriceMin(myPrice, minPrice) 
                                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border-green-300" 
                                      : isPriceMax(myPrice, maxPrice)
                                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 border-red-300"
                                      : "bg-muted text-muted-foreground"
                                  }
                                >
                                  R$ {myPrice.toFixed(2)}
                                </Badge>
                              </TableCell>
                              {displayCompetitors.map(competitor => {
                                const competitorPrice = product.competitorPrices.find(cp => cp.competitorId === competitor.id);
                                const price = competitorPrice ? parseFloat(competitorPrice.price) : null;
                                
                                return (
                                  <TableCell key={competitor.id}>
                                    {price ? (
                                      <Badge
                                        variant="secondary"
                                        className={
                                          isPriceMin(price, minPrice) 
                                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border-green-300" 
                                            : isPriceMax(price, maxPrice)
                                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 border-red-300"
                                            : "bg-muted text-muted-foreground"
                                        }
                                      >
                                        R$ {price.toFixed(2)}
                                      </Badge>
                                    ) : (
                                      <span className="text-xs text-muted-foreground">N/A</span>
                                    )}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

    </div>
  );
}
