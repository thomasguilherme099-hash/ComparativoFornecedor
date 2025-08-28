import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Check, X, Plus, Trash2 } from "lucide-react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Product, PriceHistory, Competitor } from "@shared/schema";

interface ProductPricesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

interface EditingPrice {
  id: string;
  price: string;
}

export function ProductPricesModal({ open, onOpenChange, product }: ProductPricesModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingPrice, setEditingPrice] = useState<EditingPrice | null>(null);
  const [isAddingPrice, setIsAddingPrice] = useState(false);
  const [newPrice, setNewPrice] = useState({ 
    competitorId: "own", 
    price: "", 
    date: format(new Date(), 'yyyy-MM-dd') 
  });

  const { data: competitors } = useQuery<Competitor[]>({
    queryKey: ["/api/competitors"],
  });

  const { data: priceHistory, isLoading: historyLoading } = useQuery<PriceHistory[]>({
    queryKey: ["/api/price-history", product?.id],
    enabled: !!product?.id,
  });

  const updatePriceMutation = useMutation({
    mutationFn: async ({ id, price }: { id: string; price: string }) => {
      await apiRequest("PUT", `/api/price-history/${id}`, { price });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/price-history", product?.id] });
      toast({
        title: "Preço atualizado",
        description: "O preço foi atualizado com sucesso.",
      });
      setEditingPrice(null);
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao atualizar preço. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const addPriceMutation = useMutation({
    mutationFn: async (data: { productId: string; competitorId?: string; price: string }) => {
      const endpoint = data.competitorId ? "/api/competitor-prices" : "/api/price-history";
      const payload = data.competitorId 
        ? { productId: data.productId, competitorId: data.competitorId, price: data.price }
        : { productId: data.productId, price: data.price };
      await apiRequest("POST", endpoint, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/price-history", product?.id] });
      toast({
        title: "Preço adicionado",
        description: "O novo preço foi cadastrado com sucesso.",
      });
      setIsAddingPrice(false);
      setNewPrice({ 
        competitorId: "own", 
        price: "", 
        date: format(new Date(), 'yyyy-MM-dd') 
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao adicionar preço. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const deletePriceMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/price-history/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/price-history", product?.id] });
      toast({
        title: "Preço excluído",
        description: "O preço foi removido com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao excluir preço. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleSaveEdit = () => {
    if (!editingPrice) return;
    
    const price = parseFloat(editingPrice.price);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Erro",
        description: "Digite um preço válido maior que zero.",
        variant: "destructive",
      });
      return;
    }

    updatePriceMutation.mutate({ 
      id: editingPrice.id, 
      price: editingPrice.price 
    });
  };

  const handleAddPrice = () => {
    if (!product) return;
    
    const price = parseFloat(newPrice.price);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Erro",
        description: "Digite um preço válido maior que zero.",
        variant: "destructive",
      });
      return;
    }

    addPriceMutation.mutate({
      productId: product.id,
      competitorId: newPrice.competitorId === "own" ? undefined : newPrice.competitorId,
      price: newPrice.price,
      recordedAt: new Date(newPrice.date).toISOString(),
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este preço?")) {
      deletePriceMutation.mutate(id);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="product-prices-modal">
        <DialogHeader>
          <DialogTitle>Histórico de Preços - {product.name}</DialogTitle>
          <DialogDescription>
            Visualize e edite o histórico de preços do seu produto e dos concorrentes
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

          {/* Add Price Button */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Histórico de Preços</h3>
            <Button
              onClick={() => setIsAddingPrice(true)}
              disabled={isAddingPrice}
              data-testid="button-add-price"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Preço
            </Button>
          </div>

          {/* Add Price Form */}
          {isAddingPrice && (
            <div className="p-4 border rounded-lg bg-muted/30">
              <h4 className="font-medium mb-3">Adicionar Novo Preço</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Concorrente (opcional)</label>
                  <Select
                    value={newPrice.competitorId}
                    onValueChange={(value) => setNewPrice(prev => ({ ...prev, competitorId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Meu preço" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="own">Meu Preço</SelectItem>
                      {competitors?.map(competitor => (
                        <SelectItem key={competitor.id} value={competitor.id}>
                          {competitor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Preço</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={newPrice.price}
                    onChange={(e) => setNewPrice(prev => ({ ...prev, price: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Data</label>
                  <Input
                    type="date"
                    value={newPrice.date}
                    onChange={(e) => setNewPrice(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div className="flex items-end space-x-2">
                  <Button
                    onClick={handleAddPrice}
                    disabled={addPriceMutation.isPending}
                    size="sm"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddingPrice(false);
                      setNewPrice({ 
        competitorId: "own", 
        price: "", 
        date: format(new Date(), 'yyyy-MM-dd') 
      });
                    }}
                    size="sm"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Prices Table */}
          {historyLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : !priceHistory || priceHistory.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg mb-2">📊</p>
              <p>Nenhum histórico de preços encontrado</p>
              <p className="text-sm mt-2">Use o botão "Adicionar Preço" para começar</p>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Concorrente</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {priceHistory
                    .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())
                    .map((entry) => {
                      const competitor = entry.competitorId 
                        ? competitors?.find(c => c.id === entry.competitorId)
                        : null;
                      const isEditing = editingPrice?.id === entry.id;

                      return (
                        <TableRow key={entry.id}>
                          <TableCell>
                            {format(new Date(entry.recordedAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                          </TableCell>
                          <TableCell>
                            {competitor ? (
                              <Badge variant="outline">{competitor.name}</Badge>
                            ) : (
                              <Badge variant="secondary">Nosso Preço</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {isEditing ? (
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                value={editingPrice.price}
                                onChange={(e) => setEditingPrice(prev => prev ? { ...prev, price: e.target.value } : null)}
                                className="w-32"
                              />
                            ) : (
                              <span className="font-medium">R$ {parseFloat(entry.price).toFixed(2)}</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              {isEditing ? (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleSaveEdit}
                                    disabled={updatePriceMutation.isPending}
                                    data-testid={`button-save-${entry.id}`}
                                  >
                                    <Check className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setEditingPrice(null)}
                                    data-testid={`button-cancel-${entry.id}`}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setEditingPrice({ id: entry.id, price: entry.price })}
                                    data-testid={`button-edit-${entry.id}`}
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(entry.id)}
                                    disabled={deletePriceMutation.isPending}
                                    data-testid={`button-delete-${entry.id}`}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}