import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { AddCompetitorModal } from "@/components/competitors/add-competitor-modal";
import { EditCompetitorModal } from "@/components/competitors/edit-competitor-modal.tsx";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Competitor } from "@shared/schema";

export default function Competitors() {
  const [showAddCompetitorModal, setShowAddCompetitorModal] = useState(false);
  const [showEditCompetitorModal, setShowEditCompetitorModal] = useState(false);
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null);
  const { toast } = useToast();

  const { data: competitors, isLoading } = useQuery<Competitor[]>({
    queryKey: ["/api/competitors"],
  });

  const deleteCompetitorMutation = useMutation({
    mutationFn: (competitorId: string) => 
      apiRequest("DELETE", `/api/competitors/${competitorId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/competitors"] });
      toast({
        title: "Concorrente excluído",
        description: "O concorrente foi removido com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o concorrente.",
        variant: "destructive",
      });
    },
  });

  const handleEditCompetitor = (competitor: Competitor) => {
    setSelectedCompetitor(competitor);
    setShowEditCompetitorModal(true);
  };

  const handleDeleteCompetitor = (competitorId: string) => {
    deleteCompetitorMutation.mutate(competitorId);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          title="Concorrentes" 
          subtitle="Gerencie informações dos concorrentes"
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="p-6 space-y-6">
            
            {/* Actions */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Concorrentes</h2>
                <p className="text-muted-foreground">
                  Gerencie informações dos seus concorrentes
                </p>
              </div>
              <div className="flex space-x-3">
                <Button onClick={() => setShowAddCompetitorModal(true)} data-testid="button-add-competitor">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Concorrente
                </Button>
              </div>
            </div>

            {/* Competitors Table */}
            <Card>
              <CardHeader>
                <CardTitle>Lista de Concorrentes</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : !competitors || competitors.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground mb-4">
                      Nenhum concorrente cadastrado ainda.
                    </p>
                    <Button onClick={() => setShowAddCompetitorModal(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Primeiro Concorrente
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Localização</TableHead>
                          <TableHead>Website</TableHead>
                          <TableHead>Data de Cadastro</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {competitors.map((competitor) => (
                          <TableRow key={competitor.id} data-testid={`competitor-row-${competitor.id}`}>
                            <TableCell className="font-medium">{competitor.name}</TableCell>
                            <TableCell>
                              {competitor.location ? (
                                <Badge variant="outline">{competitor.location}</Badge>
                              ) : (
                                <span className="text-muted-foreground text-sm">N/A</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {competitor.website ? (
                                <a 
                                  href={competitor.website.startsWith('http') ? competitor.website : `https://${competitor.website}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline text-sm"
                                >
                                  {competitor.website}
                                </a>
                              ) : (
                                <span className="text-muted-foreground text-sm">N/A</span>
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {new Date(competitor.createdAt).toLocaleDateString('pt-BR')}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditCompetitor(competitor)}
                                  data-testid={`button-edit-competitor-${competitor.id}`}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      data-testid={`button-delete-competitor-${competitor.id}`}
                                    >
                                      <Trash2 className="w-4 h-4 text-destructive" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Tem certeza de que deseja excluir o concorrente "{competitor.name}"? 
                                        Esta ação não pode ser desfeita e todos os preços associados também serão removidos.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteCompetitor(competitor.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Excluir
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Modals */}
      <AddCompetitorModal 
        open={showAddCompetitorModal} 
        onOpenChange={setShowAddCompetitorModal}
      />
      
      <EditCompetitorModal 
        open={showEditCompetitorModal}
        onOpenChange={setShowEditCompetitorModal}
        competitor={selectedCompetitor}
      />
    </div>
  );
}
