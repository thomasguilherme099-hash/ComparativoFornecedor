import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertCompetitorSchema, type InsertCompetitor, type Competitor } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useEffect } from "react";

interface EditCompetitorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  competitor: Competitor | null;
}

export function EditCompetitorModal({ open, onOpenChange, competitor }: EditCompetitorModalProps) {
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

  // Populate form when competitor changes
  useEffect(() => {
    if (competitor && open) {
      form.reset({
        name: competitor.name,
        location: competitor.location || undefined,
        website: competitor.website || undefined,
      });
    }
  }, [competitor, open, form]);

  const updateCompetitorMutation = useMutation({
    mutationFn: async (data: InsertCompetitor) => {
      if (!competitor) throw new Error("No competitor selected");
      return apiRequest("PUT", `/api/competitors/${competitor.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/competitors"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/kpis"] });
      toast({
        title: "Concorrente atualizado",
        description: "As informações do concorrente foram atualizadas com sucesso.",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Falha ao atualizar concorrente. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertCompetitor) => {
    updateCompetitorMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="modal-edit-competitor">
        <DialogHeader>
          <DialogTitle>Editar Concorrente</DialogTitle>
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
                    <Input placeholder="Ex: Casa das Tintas" {...field} data-testid="input-edit-competitor-name" />
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
                    <Input placeholder="Ex: Centro, Zona Sul" {...field} value={field.value || ""} data-testid="input-edit-competitor-location" />
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
                    <Input placeholder="Ex: www.casadastintas.com" {...field} value={field.value || ""} data-testid="input-edit-competitor-website" />
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
                disabled={updateCompetitorMutation.isPending}
                data-testid="button-save-edit"
              >
                {updateCompetitorMutation.isPending ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}