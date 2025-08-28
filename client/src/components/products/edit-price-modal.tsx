import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { insertProductSchema, type Product } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const editPriceSchema = z.object({
  price: z.string().min(1, "Preço é obrigatório"),
});

type EditPriceData = z.infer<typeof editPriceSchema>;

interface EditPriceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export function EditPriceModal({ open, onOpenChange, product }: EditPriceModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<EditPriceData>({
    resolver: zodResolver(editPriceSchema),
    defaultValues: {
      price: product?.price || "",
    },
  });

  // Reset form when product changes
  React.useEffect(() => {
    if (product) {
      form.reset({ price: product.price });
    }
  }, [product, form]);

  const updatePriceMutation = useMutation({
    mutationFn: async (data: EditPriceData) => {
      if (!product) return;
      const response = await apiRequest("PUT", `/api/products/${product.id}`, {
        price: data.price,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products/with-prices"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/kpis"] });
      toast({
        title: "Preço atualizado",
        description: "O preço do produto foi atualizado com sucesso.",
      });
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Falha ao atualizar preço. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EditPriceData) => {
    updatePriceMutation.mutate(data);
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="modal-edit-price">
        <DialogHeader>
          <DialogTitle>Editar Preço do Produto</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm font-medium">Produto</div>
            <div className="text-sm text-muted-foreground">
              {product.name} - {product.brand} ({product.size})
            </div>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Novo Preço (R$) *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="0.00" 
                        {...field} 
                        data-testid="input-edit-price"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex space-x-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => onOpenChange(false)}
                  data-testid="button-cancel"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1" 
                  disabled={updatePriceMutation.isPending}
                  data-testid="button-save"
                >
                  {updatePriceMutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}