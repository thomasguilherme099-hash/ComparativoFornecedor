import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Reports() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          title="Relatórios" 
          subtitle="Análises e relatórios detalhados"
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="p-6">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios de Competitividade</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Página de relatórios em desenvolvimento. 
                  Aqui você poderá gerar e visualizar relatórios detalhados sobre competitividade e margem.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
