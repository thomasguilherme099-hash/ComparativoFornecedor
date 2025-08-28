import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { CompetitorTable } from "@/components/competitors/competitor-table";
import { CompetitorFormModal } from "@/components/competitors/competitor-form-modal";
import { staticStorage } from "@/lib/static-storage";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Competitors() {
  const [competitors, setCompetitors] = useState(staticStorage.getCompetitors());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompetitor, setEditingCompetitor] = useState(null);

  // Atualiza concorrentes quando o storage muda
  useEffect(() => {
    const unsubscribe = staticStorage.subscribe(() => {
      setCompetitors(staticStorage.getCompetitors());
    });

    return unsubscribe;
  }, []);

  const handleAddCompetitor = () => {
    setEditingCompetitor(null);
    setIsModalOpen(true);
  };

  const handleEditCompetitor = (competitor: any) => {
    setEditingCompetitor(competitor);
    setIsModalOpen(true);
  };

  const handleDeleteCompetitor = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este concorrente?")) {
      staticStorage.deleteCompetitor(id);
    }
  };

  const handleSaveCompetitor = (competitorData: any) => {
    if (editingCompetitor) {
      staticStorage.updateCompetitor((editingCompetitor as any).id, competitorData);
    } else {
      staticStorage.addCompetitor(competitorData);
    }
    setIsModalOpen(false);
    setEditingCompetitor(null);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          title="Concorrentes" 
          subtitle="Gerencie seus concorrentes"
          action={
            <Button onClick={handleAddCompetitor} data-testid="button-add-competitor">
              <Plus className="w-4 h-4 mr-2" />
              Novo Concorrente
            </Button>
          }
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="p-6">
            <CompetitorTable 
              competitors={competitors}
              onEdit={handleEditCompetitor}
              onDelete={handleDeleteCompetitor}
            />
          </div>
        </main>
      </div>

      <CompetitorFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCompetitor}
        competitor={editingCompetitor}
      />
    </div>
  );
}