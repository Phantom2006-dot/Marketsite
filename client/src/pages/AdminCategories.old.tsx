import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import CategoryForm from "@/components/CategoryForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";
import electronicsImg from '@assets/generated_images/Electronics_category_image_da2a1661.png'
import fashionImg from '@assets/generated_images/Fashion_category_image_3bafc513.png'
import homeImg from '@assets/generated_images/Home_category_image_82c69197.png'

export default function AdminCategories() {
  const [showForm, setShowForm] = useState(false);

  const categories = [
    { id: 1, name: "Electronics", slug: "electronics", description: "Latest tech gadgets", imageUrl: electronicsImg, order: 1, productCount: 12 },
    { id: 2, name: "Fashion", slug: "fashion", description: "Trendy clothing", imageUrl: fashionImg, order: 2, productCount: 24 },
    { id: 3, name: "Home & Living", slug: "home-living", description: "Beautiful home decor", imageUrl: homeImg, order: 3, productCount: 18 },
  ];

  const handleSubmit = (data: any, image?: File) => {
    console.log('Category created:', data, image);
    setShowForm(false);
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-['DM_Sans'] font-bold text-3xl mb-2" data-testid="text-categories-title">
              Categories
            </h1>
            <p className="text-muted-foreground">
              Organize your products into categories
            </p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} data-testid="button-add-category">
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>

        {showForm && (
          <div className="mb-8">
            <CategoryForm onSubmit={handleSubmit} />
          </div>
        )}

        <div className="space-y-4">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  <img 
                    src={category.imageUrl} 
                    alt={category.name}
                    className="w-32 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-['DM_Sans'] font-semibold text-lg mb-1" data-testid={`text-category-${category.id}`}>
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-2">{category.description}</p>
                    <div className="flex items-center gap-6 text-sm">
                      <span className="text-muted-foreground">Order: {category.order}</span>
                      <span className="text-muted-foreground">{category.productCount} products</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" data-testid={`button-edit-${category.id}`}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-destructive" data-testid={`button-delete-${category.id}`}>
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
