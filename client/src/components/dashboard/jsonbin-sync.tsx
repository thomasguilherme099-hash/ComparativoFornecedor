import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Cloud, 
  CloudDownload, 
  CloudUpload, 
  Trash2, 
  RefreshCw, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap
} from "lucide-react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Backup {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface ConnectionStatus {
  connected: boolean;
  error?: string;
}

export function JSONBinSync() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  // Query para verificar status da conexão
  const { data: connectionStatus, refetch: refetchConnection } = useQuery<ConnectionStatus>({
    queryKey: ["/api/jsonbin/test"],
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Query para listar backups
  const { data: backups = [], isLoading: loadingBackups, refetch: refetchBackups } = useQuery<Backup[]>({
    queryKey: ["/api/jsonbin/backups"],
    enabled: connectionStatus?.connected,
    retry: false,
  });

  // Mutação para criar backup
  const createBackupMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/jsonbin/backup", {});
    },
    onSuccess: () => {
      toast({
        title: "Backup criado",
        description: "Os dados foram salvos no JSONBin com sucesso.",
      });
      refetchBackups();
    },
    onError: (error: any) => {
      toast({
        title: "Erro no backup",
        description: error.message || "Falha ao criar backup.",
        variant: "destructive",
      });
    },
  });

  // Mutação para sincronizar dados
  const syncMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/jsonbin/sync", {});
    },
    onSuccess: (data: any) => {
      toast({
        title: "Sincronização concluída",
        description: data.message,
      });
      refetchBackups();
    },
    onError: (error: any) => {
      toast({
        title: "Erro na sincronização",
        description: error.message || "Falha na sincronização.",
        variant: "destructive",
      });
    },
  });

  // Mutação para restaurar dados
  const restoreMutation = useMutation({
    mutationFn: async (binId: string) => {
      return await apiRequest("POST", `/api/jsonbin/restore/${binId}`, {});
    },
    onSuccess: () => {
      toast({
        title: "Dados restaurados",
        description: "Os dados foram restaurados com sucesso. Atualize a página.",
      });
      // Invalida todos os caches para forçar recarregamento
      queryClient.invalidateQueries();
    },
    onError: (error: any) => {
      toast({
        title: "Erro na restauração",
        description: error.message || "Falha ao restaurar dados.",
        variant: "destructive",
      });
    },
  });

  // Mutação para excluir backup
  const deleteBackupMutation = useMutation({
    mutationFn: async (binId: string) => {
      return await apiRequest("DELETE", `/api/jsonbin/backup/${binId}`, {});
    },
    onSuccess: () => {
      toast({
        title: "Backup excluído",
        description: "Backup removido com sucesso.",
      });
      refetchBackups();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir",
        description: error.message || "Falha ao excluir backup.",
        variant: "destructive",
      });
    },
  });

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    await refetchConnection();
    setIsTestingConnection(false);
  };

  const handleRestore = (backup: Backup) => {
    if (confirm(`Tem certeza que deseja restaurar os dados do backup "${backup.name}"? Isso substituirá todos os dados atuais.`)) {
      restoreMutation.mutate(backup.id);
    }
  };

  const handleDelete = (backup: Backup) => {
    if (confirm(`Tem certeza que deseja excluir o backup "${backup.name}"? Esta ação não pode ser desfeita.`)) {
      deleteBackupMutation.mutate(backup.id);
    }
  };

  return (
    <div className="space-y-6">
      <Card data-testid="jsonbin-sync-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Cloud className="w-5 h-5" />
            <span>Sincronização JSONBin</span>
          </CardTitle>
          <CardDescription>
            Faça backup e sincronize seus dados na nuvem usando JSONBin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status da Conexão */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              {connectionStatus?.connected ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : connectionStatus?.connected === false ? (
                <XCircle className="w-5 h-5 text-red-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-500" />
              )}
              <div>
                <p className="font-medium">
                  {connectionStatus?.connected 
                    ? "Conectado ao JSONBin" 
                    : connectionStatus?.connected === false
                    ? "Desconectado"
                    : "Status desconhecido"
                  }
                </p>
                {connectionStatus?.error && (
                  <p className="text-sm text-muted-foreground">{connectionStatus.error}</p>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestConnection}
              disabled={isTestingConnection}
              data-testid="button-test-connection"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isTestingConnection ? 'animate-spin' : ''}`} />
              Testar Conexão
            </Button>
          </div>

          {!connectionStatus?.connected && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Para usar a sincronização com JSONBin, você precisa configurar sua chave da API. 
                Configure a variável de ambiente JSONBIN_MASTER_KEY com sua chave do JSONBin.
              </AlertDescription>
            </Alert>
          )}

          {/* Ações de Backup */}
          {connectionStatus?.connected && (
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => syncMutation.mutate()}
                disabled={syncMutation.isPending}
                data-testid="button-sync"
              >
                <Zap className="w-4 h-4 mr-2" />
                {syncMutation.isPending ? "Sincronizando..." : "Sincronizar Dados"}
              </Button>
              <Button
                variant="outline"
                onClick={() => createBackupMutation.mutate()}
                disabled={createBackupMutation.isPending}
                data-testid="button-create-backup"
              >
                <CloudUpload className="w-4 h-4 mr-2" />
                {createBackupMutation.isPending ? "Criando..." : "Criar Backup"}
              </Button>
              <Button
                variant="outline"
                onClick={() => refetchBackups()}
                disabled={loadingBackups}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loadingBackups ? 'animate-spin' : ''}`} />
                Atualizar Lista
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de Backups */}
      {connectionStatus?.connected && (
        <Card>
          <CardHeader>
            <CardTitle>Backups Disponíveis</CardTitle>
            <CardDescription>
              Lista de backups armazenados no JSONBin
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingBackups ? (
              <div className="text-center py-8 text-muted-foreground">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                Carregando backups...
              </div>
            ) : backups.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Cloud className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">Nenhum backup encontrado</p>
                <p className="text-sm">Use o botão "Sincronizar Dados" ou "Criar Backup" para começar</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead>Atualizado em</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {backups
                    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                    .map((backup) => (
                      <TableRow key={backup.id}>
                        <TableCell className="font-medium">{backup.name}</TableCell>
                        <TableCell>
                          {format(new Date(backup.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </TableCell>
                        <TableCell>
                          {format(new Date(backup.updatedAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">Ativo</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRestore(backup)}
                              disabled={restoreMutation.isPending}
                              data-testid={`button-restore-${backup.id}`}
                            >
                              <CloudDownload className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(backup)}
                              disabled={deleteBackupMutation.isPending}
                              data-testid={`button-delete-${backup.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}