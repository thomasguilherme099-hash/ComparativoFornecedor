import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { insertCompetitorPriceSchema, type InsertCompetitorPrice, type Product, type Competitor } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface AddPriceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId?: string;
  competitorId?: string;
}

export function AddPriceModal({ open, onOpenChange, productId, competitorId }: AddPriceModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: competitors } = useQuery<Competitor[]>({
    queryKey: ["/api/competitors"],
  });

  const form = useForm<InsertCompetitorPrice>({
    resolver: zodResolver(insertCompetitorPriceSchema),
    defaultValues: {
      productId: productId || "",
      competitorId: competitorId || "",
      price: "",
    },
  });

  const createPriceMutation = useMutation({
    mutationFn: async (data: InsertCompetitorPrice) => {
      const response = await apiRequest("POST", "/api/competitor-prices", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products/with-prices"] });
      queryClient.invalidateQueries({ queryKey: ["/api/competitor-prices"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/kpis"] });
      toast({
        title: "Preço cadastrado",
        description: "O preço do concorrente foi cadastrado com sucesso.",
      });
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Falha ao cadastrar preço. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertCompetitorPrice) => {
    createPriceMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="modal-add-price">
        <DialogHeader>
          <DialogTitle>Cadastrar Preço da Concorrência</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Produto *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!productId}>
                    <FormControl>
                      <SelectTrigger data-testid="select-product">
                        <SelectValue placeholder="Selecione o produto" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {products?.map(product => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - {product.brand} ({product.size})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="competitorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Concorrente *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!competitorId}>
                    <FormControl>
                      <SelectTrigger data-testid="select-competitor">
                        <SelectValue placeholder="Selecione o concorrente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {competitors?.map(competitor => (
                        <SelectItem key={competitor.id} value={competitor.id}>
                          {competitor.name} {competitor.location && `- ${competitor.location}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço (R$) *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00" 
                      {...field} 
                      data-testid="input-price"
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
                disabled={createPriceMutation.isPending}
                data-testid="button-save"
              >
                {createPriceMutation.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}