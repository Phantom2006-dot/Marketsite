import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import ProductForm from "@/components/ProductForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";
import speakerImg from '@assets/generated_images/Bluetooth_speaker_product_af6fba9e.png'
import mugImg from '@assets/generated_images/Coffee_mug_product_685a7c25.png'

export default function AdminProducts() {
  const [showForm, setShowForm] = useState(false);

  const categories = [
    { id: 1, name: "Electronics" },
    { id: 2, name: "Fashion" },
    { id: 3, name: "Home & Living" },
  ];

  const products = [
    { id: 1, name: "Wireless Bluetooth Speaker", slug: "wireless-bluetooth-speaker", price: 89.99, category: "Electronics", imageUrl: speakerImg, quantity: 15 },
    { id: 2, name: "Ceramic Coffee Mug", slug: "ceramic-coffee-mug", price: 24.99, category: "Home & Living", imageUrl: mugImg, quantity: 30 },
  ];

  const handleSubmit = (data: any, images: File[]) => {
    console.log('Product created:', data, images);
    setShowForm(false);
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-['DM_Sans'] font-bold text-3xl mb-2" data-testid="text-products-title">
              Products
            </h1>
            <p className="text-muted-foreground">
              Manage your product catalog
            </p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} data-testid="button-add-product">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        {showForm && (
          <div className="mb-8">
            <ProductForm categories={categories} onSubmit={handleSubmit} />
          </div>
        )}

        <div className="space-y-4">
          {products.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-['DM_Sans'] font-semibold text-lg mb-1" data-testid={`text-product-${product.id}`}>
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-2">{product.category}</p>
                    <div className="flex items-center gap-6 text-sm">
                      <span className="font-semibold">${product.price}</span>
                      <span className="text-muted-foreground">Stock: {product.quantity}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" data-testid={`button-edit-${product.id}`}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-destructive" data-testid={`button-delete-${product.id}`}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
