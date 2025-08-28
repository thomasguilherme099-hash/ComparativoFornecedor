import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FileText, Filter, X } from "lucide-react";
import type { Product, PriceHistory, Competitor } from "@shared/schema";

interface ChartDataPoint {
  date: string;
  fullDate: string;
  [key: string]: string | number; // For dynamic price keys like "prod1_own", "prod1_comp1", etc.
}

export function PriceHistoryChart() {
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [selectedCompetitorIds, setSelectedCompetitorIds] = useState<string[]>([]);

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: competitors, isLoading: competitorsLoading } = useQuery<Competitor[]>({
    queryKey: ["/api/competitors"],
  });

  // Fetch price history for selected product
  const { data: priceHistory, isLoading: historyLoading } = useQuery<PriceHistory[]>({
    queryKey: ["/api/price-history", selectedProductId],
    enabled: !!selectedProductId,
  });

  const generateReport = () => {
    if (!selectedProductId || !priceHistory || !products || !competitors) return;

    const selectedProduct = products.find(p => p.id === selectedProductId);
    if (!selectedProduct) return;
    
    // Filter history based on current filters
    const filteredHistory = priceHistory.filter(h => {
      if (h.competitorId && selectedCompetitorIds.length > 0 && !selectedCompetitorIds.includes(h.competitorId)) {
        return false;
      }
      return true;
    });

    const reportData = {
      product: selectedProduct,
      competitors: competitors,
      history: filteredHistory.map(h => {
        const competitor = h.competitorId ? competitors.find(c => c.id === h.competitorId) : null;
        return {
          competitor: competitor ? competitor.name : 'Nosso Preço',
          date: format(new Date(h.recordedAt), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
          price: parseFloat(h.price),
          recordedAt: new Date(h.recordedAt),
        };
      }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    };

    const reportText = `
RELATÓRIO DE HISTÓRICO DE PREÇOS COMPARATIVO
===========================================

Produto: ${reportData.product.name}
Filtros Aplicados:
${selectedCompetitorIds.length > 0 ? `- Concorrentes: ${competitors.filter(c => selectedCompetitorIds.includes(c.id)).map(c => c.name).join(', ')}` : '- Todos os concorrentes incluídos'}

HISTÓRICO DE ALTERAÇÕES:
${reportData.history.map(h => 
  `${h.date} | ${h.competitor} | R$ ${h.price.toFixed(2)}`
).join('\n')}

Total de registros: ${reportData.history.length}
Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
    `.trim();

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historico-precos-${selectedProduct.name.replace(/[^a-zA-Z0-9]/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Process data for chart
  const chartData: ChartDataPoint[] = [];
  const lineConfigs: Array<{key: string, name: string, color: string}> = [];

  if (priceHistory && products && competitors) {
    // Collect all dates and create a timeline
    const allDates = new Set<string>();
    const pricesByDate: Record<string, Record<string, number>> = {};

    priceHistory.forEach(entry => {
      const dateKey = format(new Date(entry.recordedAt), 'yyyy-MM-dd');
      allDates.add(dateKey);
      
      if (!pricesByDate[dateKey]) {
        pricesByDate[dateKey] = {};
      }

      // Create a unique key for each product-competitor combination
      const product = products.find(p => p.id === entry.productId);
      const competitor = entry.competitorId ? competitors.find(c => c.id === entry.competitorId) : null;
      
      if (product) {
        const lineKey = entry.competitorId ? `${entry.productId}_${entry.competitorId}` : `${entry.productId}_own`;
        const lineName = competitor ? `${product.name} (${competitor.name})` : `${product.name} (Nosso Preço)`;
        
        // Filter based on current settings
        const shouldShow = selectedCompetitorIds.length === 0 || 
                          !entry.competitorId || 
                          selectedCompetitorIds.includes(entry.competitorId);
        
        if (shouldShow) {
          pricesByDate[dateKey][lineKey] = parseFloat(entry.price);
          
          // Add to line configs if not already present
          if (!lineConfigs.find(lc => lc.key === lineKey)) {
            const colors = [
              '#2563eb', '#dc2626', '#059669', '#d97706', '#7c3aed', 
              '#db2777', '#0891b2', '#65a30d', '#ea580c', '#9333ea'
            ];
            lineConfigs.push({
              key: lineKey,
              name: lineName,
              color: colors[lineConfigs.length % colors.length]
            });
          }
        }
      }
    });

    // Create chart data points
    const sortedDates = Array.from(allDates).sort();
    sortedDates.forEach(dateKey => {
      const dataPoint: ChartDataPoint = {
        date: format(new Date(dateKey), 'dd/MM', { locale: ptBR }),
        fullDate: format(new Date(dateKey), 'dd/MM/yyyy', { locale: ptBR }),
        ...pricesByDate[dateKey]
      };
      chartData.push(dataPoint);
    });
  }

  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId === selectedProductId ? "" : productId);
  };

  const handleCompetitorToggle = (competitorId: string) => {
    setSelectedCompetitorIds(prev =>
      prev.includes(competitorId)
        ? prev.filter(id => id !== competitorId)
        : [...prev, competitorId]
    );
  };

  const clearAllFilters = () => {
    setSelectedProductId("");
    setSelectedCompetitorIds([]);
  };

  return (
    <Card data-testid="price-history-chart">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Histórico de Preços Comparativo</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Compare a evolução dos seus preços com os concorrentes
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {(selectedProductId || selectedCompetitorIds.length > 0) && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                data-testid="button-clear-filters"
              >
                <X className="w-4 h-4 mr-2" />
                Limpar
              </Button>
            )}
            {selectedProductId && (
              <Button
                variant="outline"
                size="sm"
                onClick={generateReport}
                data-testid="button-generate-report"
              >
                <FileText className="w-4 h-4 mr-2" />
                Relatório
              </Button>
            )}
          </div>
        </div>

        {/* Filters Section */}
        <div className="space-y-4 pt-4">
          {/* Products Selection */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Filter className="w-4 h-4" />
              <span className="font-medium text-sm">Produto (selecione apenas um):</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {productsLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-8" />
                ))
              ) : (
                products?.map((product) => (
                  <div key={product.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`product-${product.id}`}
                      checked={selectedProductId === product.id}
                      onCheckedChange={() => handleProductSelect(product.id)}
                      data-testid={`checkbox-product-${product.id}`}
                    />
                    <label
                      htmlFor={`product-${product.id}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {product.name}
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Competitor Selection */}
          <div>
            <span className="font-medium text-sm">Concorrentes (opcional):</span>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {competitorsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-8" />
                ))
              ) : (
                competitors?.map((competitor) => (
                  <div key={competitor.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`competitor-${competitor.id}`}
                      checked={selectedCompetitorIds.includes(competitor.id)}
                      onCheckedChange={() => handleCompetitorToggle(competitor.id)}
                      data-testid={`checkbox-competitor-${competitor.id}`}
                    />
                    <label
                      htmlFor={`competitor-${competitor.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {competitor.name}
                    </label>
                  </div>
                ))
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Deixe em branco para mostrar todos os concorrentes
            </p>
          </div>

          {/* Selected Filters Summary */}
          {(selectedProductId || selectedCompetitorIds.length > 0) && (
            <div className="flex flex-wrap gap-2">
              {selectedProductId && (() => {
                const product = products?.find(p => p.id === selectedProductId);
                return product ? (
                  <Badge key={selectedProductId} variant="secondary">
                    {product.name}
                  </Badge>
                ) : null;
              })()}
              {selectedCompetitorIds.map(competitorId => {
                const competitor = competitors?.find(c => c.id === competitorId);
                return competitor ? (
                  <Badge key={competitorId} variant="outline">
                    {competitor.name}
                  </Badge>
                ) : null;
              })}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {!selectedProductId ? (
          <div className="flex items-center justify-center h-80 text-muted-foreground">
            <div className="text-center">
              <p className="text-lg mb-2">📊</p>
              <p>Selecione um produto para visualizar o histórico</p>
              <p className="text-sm mt-2">Apenas um produto pode ser analisado por vez</p>
            </div>
          </div>
        ) : historyLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-80 w-full" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-80 text-muted-foreground">
            <div className="text-center">
              <p className="text-lg mb-2">📈</p>
              <p>Nenhum dado de histórico encontrado com os filtros selecionados</p>
              <p className="text-sm mt-2">Ajuste os filtros ou selecione outros produtos</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    fontSize={12}
                    tick={{ fontSize: 12 }}
                    height={60}
                  />
                  <YAxis 
                    tickFormatter={(value) => `R$ ${value.toFixed(0)}`}
                    fontSize={12}
                    tick={{ fontSize: 12 }}
                    width={80}
                    domain={['dataMin - 10', 'dataMax + 10']}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => [`R$ ${value.toFixed(2)}`, name]}
                    labelFormatter={(label, payload) => {
                      const item = payload?.[0]?.payload;
                      return item?.fullDate || label;
                    }}
                  />
                  <Legend />
                  {lineConfigs.map((config) => (
                    <Line
                      key={config.key}
                      type="monotone"
                      dataKey={config.key}
                      stroke={config.color}
                      strokeWidth={3}
                      name={config.name}
                      dot={{ fill: config.color, r: 5 }}
                      activeDot={{ r: 8, fill: config.color }}
                      connectNulls={true}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              Mostrando {chartData.length} período{chartData.length !== 1 ? 's' : ''} com {lineConfigs.length} linha{lineConfigs.length !== 1 ? 's' : ''} de preço
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}