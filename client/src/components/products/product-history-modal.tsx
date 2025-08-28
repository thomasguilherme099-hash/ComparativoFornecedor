import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FileText, X } from "lucide-react";
import { useState } from "react";
import type { Product, PriceHistory, Competitor } from "@shared/schema";

interface ProductHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

interface ChartDataPoint {
  date: string;
  fullDate: string;
  [key: string]: string | number;
}

export function ProductHistoryModal({ open, onOpenChange, product }: ProductHistoryModalProps) {
  const [selectedCompetitorIds, setSelectedCompetitorIds] = useState<string[]>([]);

  const { data: competitors, isLoading: competitorsLoading } = useQuery<Competitor[]>({
    queryKey: ["/api/competitors"],
  });

  const { data: priceHistory, isLoading: historyLoading } = useQuery<PriceHistory[]>({
    queryKey: ["/api/price-history", product?.id],
    enabled: !!product?.id,
  });

  const generateReport = () => {
    if (!product || !priceHistory || !competitors) return;

    const filteredHistory = priceHistory.filter(h => {
      if (h.competitorId && selectedCompetitorIds.length > 0 && !selectedCompetitorIds.includes(h.competitorId)) {
        return false;
      }
      return true;
    });

    const reportData = {
      product: product,
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
HISTÓRICO DE PREÇOS - ${reportData.product.name.toUpperCase()}
===========================================

Produto: ${reportData.product.name}
Marca: ${reportData.product.brand}
Tipo: ${reportData.product.type}
Tamanho: ${reportData.product.size}
Cor: ${reportData.product.color}

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
    a.download = `historico-${product.name.replace(/[^a-zA-Z0-9]/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Process data for chart
  const chartData: ChartDataPoint[] = [];
  const lineConfigs: Array<{key: string, name: string, color: string}> = [];

  if (priceHistory && competitors) {
    const allDates = new Set<string>();
    const pricesByDate: Record<string, Record<string, number>> = {};

    priceHistory.forEach(entry => {
      const dateKey = format(new Date(entry.recordedAt), 'yyyy-MM-dd');
      allDates.add(dateKey);
      
      if (!pricesByDate[dateKey]) {
        pricesByDate[dateKey] = {};
      }

      const competitor = entry.competitorId ? competitors.find(c => c.id === entry.competitorId) : null;
      const lineKey = entry.competitorId ? `comp_${entry.competitorId}` : 'own';
      const lineName = competitor ? competitor.name : 'Nosso Preço';
      
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

  const handleCompetitorToggle = (competitorId: string) => {
    setSelectedCompetitorIds(prev =>
      prev.includes(competitorId)
        ? prev.filter(id => id !== competitorId)
        : [...prev, competitorId]
    );
  };

  const clearFilters = () => {
    setSelectedCompetitorIds([]);
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto" data-testid="product-history-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div>
              Histórico de Preços - {product.name}
            </div>
            <div className="flex items-center space-x-2">
              {selectedCompetitorIds.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  data-testid="button-clear-filters"
                >
                  <X className="w-4 h-4 mr-2" />
                  Limpar Filtros
                </Button>
              )}
              {priceHistory && priceHistory.length > 0 && (
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
          </DialogTitle>
          <DialogDescription>
            Compare a evolução do seu preço com os preços dos concorrentes para este produto
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info */}
          <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center overflow-hidden">
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-lg">🎨</span>
              )}
            </div>
            <div>
              <h3 className="font-semibold">{product.name}</h3>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Badge variant="secondary">{product.brand}</Badge>
                <span>•</span>
                <span>{product.type}</span>
                <span>•</span>
                <span>{product.size}</span>
                <span>•</span>
                <span>{product.color}</span>
              </div>
              <p className="text-sm font-medium mt-1">Preço atual: R$ {parseFloat(product.price).toFixed(2)}</p>
            </div>
          </div>

          {/* Competitor Filters */}
          {competitors && competitors.length > 0 && (
            <div>
              <span className="font-medium text-sm mb-3 block">Filtrar por concorrentes (opcional):</span>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {competitorsLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-8" />
                  ))
                ) : (
                  competitors.map((competitor) => (
                    <div key={competitor.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`modal-competitor-${competitor.id}`}
                        checked={selectedCompetitorIds.includes(competitor.id)}
                        onCheckedChange={() => handleCompetitorToggle(competitor.id)}
                        data-testid={`checkbox-competitor-${competitor.id}`}
                      />
                      <label
                        htmlFor={`modal-competitor-${competitor.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {competitor.name}
                      </label>
                    </div>
                  ))
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Deixe em branco para mostrar todos os concorrentes
              </p>
              
              {selectedCompetitorIds.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
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
          )}

          {/* Chart */}
          {historyLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-80 w-full" />
            </div>
          ) : !priceHistory || priceHistory.length === 0 ? (
            <div className="flex items-center justify-center h-80 text-muted-foreground">
              <div className="text-center">
                <p className="text-lg mb-2">📈</p>
                <p>Nenhum histórico de preços encontrado para este produto</p>
                <p className="text-sm mt-2">Cadastre preços da concorrência para começar a análise</p>
              </div>
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex items-center justify-center h-80 text-muted-foreground">
              <div className="text-center">
                <p className="text-lg mb-2">📈</p>
                <p>Nenhum dado encontrado com os filtros selecionados</p>
                <p className="text-sm mt-2">Ajuste os filtros ou cadastre mais preços</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="h-[400px]">
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
                      domain={['dataMin - 5', 'dataMax + 5']}
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
        </div>
      </DialogContent>
    </Dialog>
  );
}