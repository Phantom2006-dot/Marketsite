import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ChevronRight } from "lucide-react";
import ImageCarousel from "@/components/ImageCarousel";
import type { Category, Product, CategoryImage, ProductImage } from "@shared/schema";

export default function CategoryPage() {
  const [, params] = useRoute("/category/:slug");
  const slug = params?.slug || "";

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: category, isLoading: categoryLoading } = useQuery<Category>({
    queryKey: [`/api/categories/slug/${slug}`],
    enabled: !!slug,
  });

  const { data: categoryImages } = useQuery<CategoryImage[]>({
    queryKey: [`/api/categories/${category?.id}/images`],
    enabled: !!category?.id,
  });

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: [`/api/products/category/${category?.id}`],
    enabled: !!category?.id,
  });

  const productIds = products?.map(p => p.id) || [];
  
  const productImageQueries = useQuery<{[key: number]: ProductImage[]}>({
    queryKey: ['/api/product-images', 'category', category?.id, productIds],
    queryFn: async () => {
      if (!products || products.length === 0) return {};
      const imagePromises = products.map(p => 
        fetch(`/api/products/${p.id}/images`).then(r => r.json())
      );
      const imagesArrays = await Promise.all(imagePromises);
      const imagesMap: {[key: number]: ProductImage[]} = {};
      products.forEach((p, i) => {
        imagesMap[p.id] = imagesArrays[i];
      });
      return imagesMap;
    },
    enabled: !!products && products.length > 0 && !!category?.id,
  });

  const allProductImages = productImageQueries.data;

  if (categoryLoading) {
    return (
      <div className="min-h-screen">
        <Navbar categories={categories || []} />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading category...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen">
        <Navbar categories={categories || []} />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Category not found</p>
        </div>
      </div>
    );
  }

  const images = categoryImages?.map(img => img.url) || [];
  const hasImages = images.length > 0;

  return (
    <div className="min-h-screen">
      <Navbar categories={categories || []} />

      <div className="relative h-96 flex items-end">
        {hasImages ? (
          <ImageCarousel
            images={images}
            aspectRatio="h-96"
            className="absolute inset-0"
            showControls={images.length > 1}
          />
        ) : (
          <div className="absolute inset-0 bg-muted" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="relative z-10 px-4 pb-12 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2 text-white/80 text-sm mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <span data-testid="text-breadcrumb-category">{category.name}</span>
          </div>
          <h1 className="font-['DM_Sans'] font-bold text-4xl md:text-5xl text-white mb-3" data-testid="text-category-name">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-white/90 text-lg max-w-3xl" data-testid="text-category-description">
              {category.description}
            </p>
          )}
        </div>
      </div>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-['DM_Sans'] font-semibold text-2xl" data-testid="text-products-count">
              {productsLoading ? "Loading..." : `${products?.length || 0} Products`}
            </h2>
          </div>
          
          {productsLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading products...</div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => {
                const productImages = allProductImages?.[product.id] || [];
                const firstImage = productImages[0]?.url || "";
                return (
                  <ProductCard 
                    key={product.id} 
                    id={product.id}
                    name={product.name}
                    slug={product.slug}
                    price={product.price}
                    imageUrl={firstImage}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No products available in this category
            </div>
          )}
        </div>
      </section>

      <WhatsAppButton />
    </div>
  );
}
