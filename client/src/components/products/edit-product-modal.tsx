import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertProductSchema, type InsertProduct, type Product } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
// import { ObjectUploader } from "@/components/ui/object-uploader";
// import type { UploadResult } from '@uppy/core';

interface EditProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export function EditProductModal({ open, onOpenChange, product }: EditProductModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<InsertProduct>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      name: "",
      brand: "",
      type: "",
      size: "",
      color: "",
      price: "0.00",
      imageUrl: "",
    },
  });

  // Populate form when product changes
  useEffect(() => {
    if (product && open) {
      form.reset({
        name: product.name,
        brand: product.brand,
        type: product.type,
        size: product.size,
        color: product.color,
        price: product.price,
        imageUrl: product.imageUrl || "",
      });
    }
  }, [product, open, form]);

  const updateProductMutation = useMutation({
    mutationFn: async (data: InsertProduct) => {
      if (!product) throw new Error("No product selected");
      return apiRequest("PUT", `/api/products/${product.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products/with-prices"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/kpis"] });
      toast({
        title: "Produto atualizado",
        description: "As informações do produto foram atualizadas com sucesso.",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Falha ao atualizar produto. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // const handleGetUploadParameters = async () => {
  //   const response = await apiRequest("POST", "/api/objects/upload");
  //   const data = await response.json();
  //   return {
  //     method: 'PUT' as const,
  //     url: data.uploadURL,
  //   };
  // };

  // const handleImageUploadComplete = (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
  //   if (result.successful && result.successful.length > 0) {
  //     const uploadURL = result.successful[0].uploadURL;
  //     // Update form with the image URL
  //     form.setValue("imageUrl", uploadURL);
  //     toast({
  //       title: "Imagem enviada",
  //       description: "A imagem do produto foi enviada com sucesso.",
  //     });
  //   }
  // };

  const onSubmit = (data: InsertProduct) => {
    updateProductMutation.mutate(data);
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" data-testid="modal-edit-product">
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Nome do Produto</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Látex Premium 18L" {...field} data-testid="input-edit-product-name" />
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
                    <FormLabel>Marca</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Suvinil" {...field} data-testid="input-edit-product-brand" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Látex" {...field} data-testid="input-edit-product-type" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tamanho</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 18L" {...field} data-testid="input-edit-product-size" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cor</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Branco Neve" {...field} data-testid="input-edit-product-color" />
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
                    <FormLabel>Preço (R$)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 185.50" {...field} data-testid="input-edit-product-price" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>URL da Imagem (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: https://..." {...field} value={field.value || ""} data-testid="input-edit-product-image" />
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
                data-testid="button-cancel-edit"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="flex-1" 
                disabled={updateProductMutation.isPending}
                data-testid="button-save-edit"
              >
                {updateProductMutation.isPending ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}