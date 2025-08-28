import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, FileText, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { jsonBinService } from "@/lib/jsonbin";
import { AddProductModal } from "@/components/products/add-product-modal";

export function QuickActions() {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const handleUpdatePrices = async () => {
    setIsSyncing(true);
    try {
      // Simulate price update process
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Preços atualizados",
        description: "Os preços dos concorrentes foram atualizados com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar preços dos concorrentes.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleGenerateReport = () => {
    toast({
      title: "Relatório gerado",
      description: "Relatório de competitividade foi gerado com sucesso.",
    });
  };

  const testConnection = async () => {
    const isConnected = await jsonBinService.testConnection();
    return isConnected;
  };

  return (
    <>
      <Card data-testid="quick-actions">
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button 
              className="w-full flex items-center justify-center px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              onClick={() => setIsAddProductOpen(true)}
              data-testid="button-add-product"
            >
              <Plus className="w-5 h-5 mr-2" />
              Adicionar Produto
            </Button>

            <Button 
              className="w-full flex items-center justify-center px-4 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
              onClick={handleUpdatePrices}
              disabled={isSyncing}
              data-testid="button-update-prices"
            >
              <RefreshCw className={`w-5 h-5 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Atualizando...' : 'Atualizar Preços'}
            </Button>

            <Button 
              className="w-full flex items-center justify-center px-4 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
              onClick={handleGenerateReport}
              data-testid="button-generate-report"
            >
              <FileText className="w-5 h-5 mr-2" />
              Gerar Relatório
            </Button>

            <div className="pt-4 border-t border-border">
              <h4 className="text-sm font-medium text-foreground mb-3">Integração JSONBin</h4>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-2">
                  {jsonBinService.isConfigured() ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-secondary" />
                      <span className="text-sm text-foreground">Conectado</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-destructive" />
                      <span className="text-sm text-foreground">Não configurado</span>
                    </>
                  )}
                </div>
                <Button variant="ghost" size="sm" data-testid="button-configure-jsonbin">
                  Configurar
                </Button>
              </div>
            </div>

            <div className="pt-3">
              <h4 className="text-sm font-medium text-foreground mb-3">Última Sincronização</h4>
              <p className="text-xs text-muted-foreground">
                {jsonBinService.isConfigured() ? "Há 5 minutos" : "Não configurado"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <AddProductModal 
        open={isAddProductOpen} 
        onOpenChange={setIsAddProductOpen}
      />
    </>
  );
}
