import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { staticStorage } from "@/lib/static-storage";
import { 
  Cloud, 
  CloudDownload, 
  CloudUpload, 
  RefreshCw, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Database,
  Settings
} from "lucide-react";

export function JSONBinSync() {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [binId, setBinId] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Carrega configuração do localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem('jsonbin_api_key');
    const savedBinId = localStorage.getItem('jsonbin_bin_id');
    
    if (savedApiKey && savedBinId) {
      setApiKey(savedApiKey);
      setBinId(savedBinId);
      setIsConfigured(true);
      staticStorage.setJSONBinConfig(savedApiKey, savedBinId);
      testConnection(savedApiKey, savedBinId);
    }
  }, []);

  const testConnection = async (key: string = apiKey, id: string = binId) => {
    if (!key || !id) {
      console.log('JSONBin: Chave ou ID não fornecidos');
      return;
    }
    
    console.log('JSONBin: Testando conexão...', { keyLength: key.length, binId: id });
    setIsLoading(true);
    try {
      staticStorage.setJSONBinConfig(key, id);
      const connected = await staticStorage.testJSONBinConnection();
      console.log('JSONBin: Resultado do teste:', connected);
      setConnectionStatus(connected);
      
      if (connected) {
        toast({
          title: "Conexão bem-sucedida",
          description: "JSONBin conectado com sucesso!",
        });
      } else {
        toast({
          title: "Falha na conexão",
          description: "Verifique suas credenciais JSONBin.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('JSONBin: Erro na conexão:', error);
      setConnectionStatus(false);
      toast({
        title: "Erro na conexão",
        description: error.message || "Erro ao conectar com JSONBin",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveConfig = () => {
    if (!apiKey || !binId) {
      toast({
        title: "Configuração incompleta",
        description: "Por favor, preencha API Key e Bin ID.",
        variant: "destructive"
      });
      return;
    }

    // Salva no localStorage
    localStorage.setItem('jsonbin_api_key', apiKey);
    localStorage.setItem('jsonbin_bin_id', binId);
    
    setIsConfigured(true);
    staticStorage.setJSONBinConfig(apiKey, binId);
    
    toast({
      title: "Configuração salva",
      description: "JSONBin configurado com sucesso.",
    });
    
    testConnection();
  };

  const handleLoadFromCloud = async () => {
    if (!isConfigured) return;
    
    setIsLoading(true);
    try {
      await staticStorage.loadFromJSONBin();
      
      toast({
        title: "Dados carregados",
        description: "Dados importados do JSONBin com sucesso.",
      });
      
      // Força atualização da página
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Erro ao carregar",
        description: error.message || "Falha ao carregar dados do JSONBin.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToCloud = async () => {
    if (!isConfigured) return;
    
    setIsLoading(true);
    try {
      await staticStorage.saveToJSONBin();
      
      toast({
        title: "Backup criado",
        description: "Dados salvos no JSONBin com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro no backup",
        description: error.message || "Falha ao salvar dados.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearConfig = () => {
    if (confirm("Tem certeza que deseja limpar a configuração?")) {
      localStorage.removeItem('jsonbin_api_key');
      localStorage.removeItem('jsonbin_bin_id');
      setApiKey('');
      setBinId('');
      setIsConfigured(false);
      setConnectionStatus(null);
      
      toast({
        title: "Configuração limpa",
        description: "Configuração do JSONBin foi removida.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card data-testid="jsonbin-sync-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Cloud className="w-5 h-5" />
            <span>Configuração JSONBin</span>
          </CardTitle>
          <CardDescription>
            Configure sua API do JSONBin para sincronizar dados na nuvem
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status da Conexão */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              {connectionStatus === true ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : connectionStatus === false ? (
                <XCircle className="w-5 h-5 text-red-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-500" />
              )}
              <div>
                <p className="font-medium">
                  {connectionStatus === true 
                    ? "Conectado ao JSONBin" 
                    : connectionStatus === false
                    ? "Desconectado"
                    : "Status desconhecido"
                  }
                </p>
                <p className="text-sm text-muted-foreground">
                  {isConfigured ? "Configuração salva localmente" : "Não configurado"}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => testConnection()}
              disabled={isLoading || !isConfigured}
              data-testid="button-test-connection"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Testar Conexão
            </Button>
          </div>

          {/* Configuração */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Sua chave da API do JSONBin"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  data-testid="input-api-key"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bin-id">Bin ID</Label>
                <Input
                  id="bin-id"
                  placeholder="ID do seu Bin"
                  value={binId}
                  onChange={(e) => setBinId(e.target.value)}
                  data-testid="input-bin-id"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleSaveConfig}
                disabled={isLoading || !apiKey || !binId}
                data-testid="button-save-config"
              >
                <Settings className="w-4 h-4 mr-2" />
                Salvar Configuração
              </Button>
              {isConfigured && (
                <Button
                  variant="outline"
                  onClick={handleClearConfig}
                  data-testid="button-clear-config"
                >
                  Limpar Configuração
                </Button>
              )}
            </div>
          </div>

          {!isConfigured && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Como configurar:</strong><br />
                1. Acesse <a href="https://jsonbin.io" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">jsonbin.io</a><br />
                2. Crie uma conta gratuita<br />
                3. Gere uma API Key nas configurações<br />
                4. Crie um novo Bin e copie o ID
              </AlertDescription>
            </Alert>
          )}

          {/* Ações de Sincronização */}
          {isConfigured && connectionStatus === true && (
            <div className="border-t pt-6">
              <h4 className="font-medium mb-4 flex items-center">
                <Database className="w-4 h-4 mr-2" />
                Sincronização de Dados
              </h4>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleSaveToCloud}
                  disabled={isLoading}
                  data-testid="button-save-to-cloud"
                >
                  <CloudUpload className="w-4 h-4 mr-2" />
                  {isLoading ? "Salvando..." : "Salvar na Nuvem"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLoadFromCloud}
                  disabled={isLoading}
                  data-testid="button-load-from-cloud"
                >
                  <CloudDownload className="w-4 h-4 mr-2" />
                  {isLoading ? "Carregando..." : "Carregar da Nuvem"}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Use "Salvar na Nuvem" para fazer backup dos dados atuais.<br />
                Use "Carregar da Nuvem" para restaurar dados salvos anteriormente.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}