import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertCompetitorSchema, type InsertCompetitor } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface AddCompetitorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddCompetitorModal({ open, onOpenChange }: AddCompetitorModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<InsertCompetitor>({
    resolver: zodResolver(insertCompetitorSchema),
    defaultValues: {
      name: "",
      location: undefined,
      website: undefined,
    },
  });

  const createCompetitorMutation = useMutation({
    mutationFn: async (data: InsertCompetitor) => {
      const response = await apiRequest("POST", "/api/competitors", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/competitors"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/kpis"] });
      toast({
        title: "Concorrente adicionado",
        description: "O concorrente foi cadastrado com sucesso.",
      });
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Falha ao cadastrar concorrente. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertCompetitor) => {
    createCompetitorMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="modal-add-competitor">
        <DialogHeader>
          <DialogTitle>Adicionar Concorrente</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Concorrente *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Casa das Tintas" {...field} data-testid="input-competitor-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Localização</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Centro, Zona Sul" {...field} value={field.value || ""} data-testid="input-competitor-location" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: www.casadastintas.com" {...field} value={field.value || ""} data-testid="input-competitor-website" />
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
                disabled={createCompetitorMutation.isPending}
                data-testid="button-save"
              >
                {createCompetitorMutation.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}