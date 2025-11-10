import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";

type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  primaryImageUrl?: string;
};

export default function AllCategoriesPage() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Transform categories for Navbar
  const navbarCategories =
    categories?.map((cat) => ({
      name: cat.name,
      slug: cat.slug,
    })) || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar categories={navbarCategories} />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1
              className="text-4xl font-bold mb-4"
              data-testid="text-categories-title"
            >
              Shop by Category
            </h1>
            <p className="text-xl text-muted-foreground">
              Explore our collection of quality Islamic clothing and accessories
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-square bg-muted animate-pulse" />
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted rounded animate-pulse mb-3" />
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories?.map((category) => {
                const imageUrl =
                  category.primaryImageUrl ||
                  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800";

                return (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    data-testid={`link-category-${category.slug}`}
                  >
                    <Card className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer h-full">
                      <div className="aspect-square relative overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          data-testid={`img-category-${category.slug}`}
                        />
                      </div>
                      <CardContent className="p-6">
                        <h2
                          className="text-2xl font-bold mb-2"
                          data-testid={`text-category-name-${category.slug}`}
                        >
                          {category.name}
                        </h2>
                        <p className="text-muted-foreground">
                          {category.description || "Discover our collection"}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
