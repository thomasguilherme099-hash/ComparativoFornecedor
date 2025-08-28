import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Plus, DollarSign, Edit } from "lucide-react";
import { ProductTable } from "@/components/products/product-table";
import { AddProductModal } from "@/components/products/add-product-modal";
import { AddPriceModal } from "@/components/competitor-prices/add-price-modal";

export default function Products() {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddPriceOpen, setIsAddPriceOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          title="Meus Produtos" 
          subtitle="Gerencie seu catálogo de tintas e preços"
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Catálogo de Produtos</h2>
                <p className="text-sm text-muted-foreground">
                  Gerencie produtos e cadastre preços da concorrência
                </p>
              </div>
              <div className="flex space-x-3">
                <Button 
                  variant="outline"
                  onClick={() => setIsAddPriceOpen(true)}
                  data-testid="button-add-competitor-price"
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Cadastrar Preço Concorrência
                </Button>
                <Button 
                  onClick={() => setIsAddProductOpen(true)}
                  data-testid="button-add-product-main"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Produto
                </Button>
              </div>
            </div>

            <ProductTable />
          </div>
        </main>
      </div>

      <AddProductModal 
        open={isAddProductOpen} 
        onOpenChange={setIsAddProductOpen}
      />
      <AddPriceModal 
        open={isAddPriceOpen} 
        onOpenChange={setIsAddPriceOpen}
      />
    </div>
  );
}
