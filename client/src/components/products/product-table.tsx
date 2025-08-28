import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil, Trash2, DollarSign, List } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { EditPriceModal } from "./edit-price-modal";
import { EditProductModal } from "./edit-product-modal";
import { ProductPricesModal } from "./product-prices-modal";
import type { Product } from "@shared/schema";

export function ProductTable() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editPriceProduct, setEditPriceProduct] = useState<Product | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [pricesProduct, setPricesProduct] = useState<Product | null>(null);

  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products/with-prices"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/kpis"] });
      toast({
        title: "Produto excluído",
        description: "O produto foi removido com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao excluir produto. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      deleteProductMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (error || !products) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">Erro ao carregar produtos</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">Nenhum produto cadastrado</p>
        <p className="text-xs text-muted-foreground mt-1">Use o botão "Adicionar Produto" para começar</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg" data-testid="product-table">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Imagem</TableHead>
            <TableHead>Produto</TableHead>
            <TableHead>Marca</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Tamanho</TableHead>
            <TableHead>Cor</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} data-testid={`product-row-${product.id}`}>
              <TableCell>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center overflow-hidden">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = '<span class="text-sm">🎨</span>';
                      }}
                    />
                  ) : (
                    <span className="text-sm">🎨</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>
                <Badge variant="secondary">{product.brand}</Badge>
              </TableCell>
              <TableCell>{product.type}</TableCell>
              <TableCell>{product.size}</TableCell>
              <TableCell>{product.color}</TableCell>
              <TableCell className="font-medium">
                R$ {parseFloat(product.price).toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPricesProduct(product)}
                    data-testid={`button-prices-${product.id}`}
                    title="Gerenciar Preços"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setEditPriceProduct(product)}
                    data-testid={`button-edit-price-${product.id}`}
                    title="Editar Preço"
                  >
                    <DollarSign className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setEditProduct(product)}
                    data-testid={`button-edit-${product.id}`}
                    title="Editar Produto"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDelete(product.id)}
                    disabled={deleteProductMutation.isPending}
                    data-testid={`button-delete-${product.id}`}
                    title="Excluir Produto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <ProductPricesModal
        open={!!pricesProduct}
        onOpenChange={(open) => !open && setPricesProduct(null)}
        product={pricesProduct}
      />
      
      <EditPriceModal 
        open={!!editPriceProduct} 
        onOpenChange={(open) => !open && setEditPriceProduct(null)}
        product={editPriceProduct}
      />
      
      <EditProductModal 
        open={!!editProduct} 
        onOpenChange={(open) => !open && setEditProduct(null)}
        product={editProduct}
      />
    </div>
  );
}
