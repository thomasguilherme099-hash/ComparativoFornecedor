import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { ComparisonTable } from "@/components/comparison/comparison-table";
import { PriceFormModal } from "@/components/comparison/price-form-modal";
import { staticStorage } from "@/lib/static-storage";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Comparison() {
  const [productsWithPrices, setProductsWithPrices] = useState(staticStorage.getProductsWithPrices());
  const [products] = useState(staticStorage.getProducts());
  const [competitors] = useState(staticStorage.getCompetitors());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrice, setEditingPrice] = useState(null);

  // Atualiza dados quando o storage muda
  useEffect(() => {
    const unsubscribe = staticStorage.subscribe(() => {
      setProductsWithPrices(staticStorage.getProductsWithPrices());
    });

    return unsubscribe;
  }, []);

  const handleAddPrice = () => {
    setEditingPrice(null);
    setIsModalOpen(true);
  };

  const handleEditPrice = (price: any) => {
    setEditingPrice(price);
    setIsModalOpen(true);
  };

  const handleDeletePrice = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este preço?")) {
      staticStorage.deleteCompetitorPrice(id);
    }
  };

  const handleSavePrice = (priceData: any) => {
    if (editingPrice) {
      staticStorage.updateCompetitorPrice((editingPrice as any).id, priceData);
    } else {
      staticStorage.addCompetitorPrice(priceData);
    }
    setIsModalOpen(false);
    setEditingPrice(null);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          title="Comparação de Preços" 
          subtitle="Compare preços com concorrentes"
          action={
            <Button onClick={handleAddPrice} data-testid="button-add-price">
              <Plus className="w-4 h-4 mr-2" />
              Novo Preço
            </Button>
          }
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="p-6">
            <ComparisonTable 
              data={productsWithPrices}
              onEdit={handleEditPrice}
              onDelete={handleDeletePrice}
            />
          </div>
        </main>
      </div>

      <PriceFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePrice}
        price={editingPrice}
        products={products}
        competitors={competitors}
      />
    </div>
  );
}