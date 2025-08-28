import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { ProductTable } from "@/components/products/product-table";
import { ProductFormModal } from "@/components/products/product-form-modal";
import { staticStorage } from "@/lib/static-storage";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Products() {
  const [products, setProducts] = useState(staticStorage.getProducts());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Atualiza produtos quando o storage muda
  useEffect(() => {
    const unsubscribe = staticStorage.subscribe(() => {
      setProducts(staticStorage.getProducts());
    });

    return unsubscribe;
  }, []);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      staticStorage.deleteProduct(id);
    }
  };

  const handleSaveProduct = (productData: any) => {
    if (editingProduct) {
      staticStorage.updateProduct((editingProduct as any).id, productData);
    } else {
      staticStorage.addProduct(productData);
    }
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          title="Produtos" 
          subtitle="Gerencie seu catálogo de produtos"
          action={
            <Button onClick={handleAddProduct} data-testid="button-add-product">
              <Plus className="w-4 h-4 mr-2" />
              Novo Produto
            </Button>
          }
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="p-6">
            <ProductTable 
              products={products}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          </div>
        </main>
      </div>

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
      />
    </div>
  );
}