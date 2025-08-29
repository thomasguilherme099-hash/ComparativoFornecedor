import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertProductSchema, type InsertProduct } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { PAINT_BRANDS, PAINT_TYPES, PAINT_SIZES } from "@/lib/types";

interface AddProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddProductModal({ open, onOpenChange }: AddProductModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreatingCustomBrand, setIsCreatingCustomBrand] = useState(false);
  const [customBrand, setCustomBrand] = useState("");
  
  const form = useForm<InsertProduct>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      name: "",
      brand: "",
      type: "",
      size: "",
      color: "",
      price: "0.00",
      imageUrl: null,
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: InsertProduct) => {
      console.log("Enviando dados:", data);
      const response = await apiRequest("POST", "/api/products", data);
      console.log("Resposta da API:", response);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products/with-prices"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/kpis"] });
      toast({
        title: "Produto adicionado",
        description: "O produto foi criado com sucesso.",
      });
      form.reset();
      onOpenChange(false);
    },
    onError: (error: any) => {
      console.error("Erro ao criar produto:", error);
      let errorMessage = "Falha ao criar produto. Tente novamente.";
      
      if (error?.message?.includes("brand")) {
        errorMessage = "Por favor, selecione uma marca para o produto.";
      } else if (error?.message?.includes("validation")) {
        errorMessage = "Verifique se todos os campos obrigatórios foram preenchidos.";
      }
      
      toast({
        title: "Erro no cadastro",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertProduct) => {
    console.log("Dados do produto para salvar:", data);
    
    // Validação adicional no frontend
    let finalBrand = data.brand;
    if (isCreatingCustomBrand && customBrand.trim()) {
      finalBrand = customBrand.trim();
    }
    
    if (!finalBrand || finalBrand.trim() === "") {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, selecione ou digite uma marca para o produto.",
        variant: "destructive",
      });
      return;
    }
    
    // Atualiza os dados com a marca final
    data.brand = finalBrand;
    
    // Converte o preço do formato brasileiro para o formato americano
    if (data.price && typeof data.price === 'string') {
      // Remove pontos e troca vírgula por ponto
      data.price = data.price.replace(/\./g, '').replace(',', '.');
      console.log("💰 Preço convertido:", data.price);
    }
    
    if (!data.type || data.type.trim() === "") {
      toast({
        title: "Campo obrigatório", 
        description: "Por favor, selecione o tipo do produto.",
        variant: "destructive",
      });
      return;
    }
    
    createProductMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="modal-add-product">
        <DialogHeader>
          <DialogTitle>Adicionar Produto</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Produto *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Látex Premium 18L" {...field} data-testid="input-product-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Marca *</FormLabel>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsCreatingCustomBrand(!isCreatingCustomBrand);
                        setCustomBrand("");
                        field.onChange("");
                      }}
                      data-testid="toggle-custom-brand"
                    >
                      {isCreatingCustomBrand ? "Selecionar existente" : "Nova marca"}
                    </Button>
                  </div>
                  
                  {isCreatingCustomBrand ? (
                    <FormControl>
                      <Input
                        placeholder="Digite o nome da nova marca"
                        value={customBrand}
                        onChange={(e) => setCustomBrand(e.target.value)}
                        data-testid="input-custom-brand"
                      />
                    </FormControl>
                  ) : (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-brand">
                          <SelectValue placeholder="Selecione a marca" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PAINT_BRANDS.map((brand) => (
                          <SelectItem key={brand.id} value={brand.name}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-type">
                          <SelectValue placeholder="Tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PAINT_TYPES.map((type) => (
                          <SelectItem key={type.id} value={type.name}>
                            {type.name}
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
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tamanho *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-size">
                          <SelectValue placeholder="Tamanho" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PAINT_SIZES.map((size) => (
                          <SelectItem key={size.id} value={`${size.volume}${size.unit}`}>
                            {size.volume}{size.unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Branco Neve" {...field} data-testid="input-color" />
                  </FormControl>
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
                      placeholder="0,00" 
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
                disabled={createProductMutation.isPending}
                data-testid="button-save"
              >
                {createProductMutation.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
