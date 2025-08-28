import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { BarChart3 } from "lucide-react";

export function PriceTrendsChart() {
  const [timeRange, setTimeRange] = useState("30");

  const { data: priceHistory, isLoading, error } = useQuery({
    queryKey: ["/api/price-history", { range: timeRange }],
  });

  if (isLoading) {
    return (
      <Card data-testid="price-trends-chart">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tendências de Preço</CardTitle>
            <Skeleton className="h-9 w-32" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !priceHistory) {
    return (
      <Card data-testid="price-trends-chart">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tendências de Preço</CardTitle>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">Últimos 30 dias</SelectItem>
                <SelectItem value="90">Últimos 90 dias</SelectItem>
                <SelectItem value="365">Último ano</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="chart-container rounded-lg p-4 h-64 flex items-center justify-center">
            <div className="text-center text-primary-foreground">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-80" />
              <p className="text-sm font-medium">Sem dados de histórico</p>
              <p className="text-xs opacity-75">Adicione produtos para ver as tendências</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Transform data for chart
  const chartData = Array.isArray(priceHistory) && priceHistory.length > 0
    ? priceHistory.slice(0, 10).map((item: any, index: number) => ({
        date: new Date(Date.now() - (9 - index) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        price: Math.random() * 50 + 100, // Placeholder data
        competitor: Math.random() * 50 + 105,
      }))
    : Array.from({ length: 10 }, (_, index) => ({
        date: new Date(Date.now() - (9 - index) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        price: Math.random() * 50 + 100,
        competitor: Math.random() * 50 + 105,
      }));

  return (
    <Card data-testid="price-trends-chart">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Tendências de Preço</CardTitle>
          <Select value={timeRange} onValueChange={setTimeRange} data-testid="select-time-range">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
              <SelectItem value="365">Último ano</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={256}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              name="Seu Preço"
            />
            <Line 
              type="monotone" 
              dataKey="competitor" 
              stroke="hsl(var(--destructive))" 
              strokeWidth={2}
              name="Concorrência"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
