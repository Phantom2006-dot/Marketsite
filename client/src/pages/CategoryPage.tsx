import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ChevronRight } from "lucide-react";
import ImageCarousel from "@/components/ImageCarousel";
import type {
  Category,
  Product,
  CategoryImage,
  ProductImage,
} from "@shared/schema";

export default function CategoryPage() {
  const [, params] = useRoute("/category/:slug");
  const slug = params?.slug || "";

  // Debug logging
  console.log("Current slug:", slug);
  console.log("Route params:", params);

  const { data: categories, isLoading: categoriesLoading } = useQuery<
    Category[]
  >({
    queryKey: ["/api/categories"],
  });

  const {
    data: category,
    isLoading: categoryLoading,
    error: categoryError,
  } = useQuery<Category>({
    queryKey: [`/api/categories/slug/${slug}`],
    enabled: !!slug,
  });

  // Debug category data
  console.log("Category data:", category);
  console.log("Category error:", categoryError);

  const { data: categoryImages } = useQuery<CategoryImage[]>({
    queryKey: [`/api/categories/${category?.id}/images`],
    enabled: !!category?.id,
  });

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: [`/api/products/category/${category?.id}`],
    enabled: !!category?.id,
  });

  const productIds = products?.map((p) => p.id) || [];

  const { data: allProductImages, isLoading: imagesLoading } = useQuery<{
    [key: number]: ProductImage[];
  }>({
    queryKey: ["/api/product-images", "category", category?.id, productIds],
    queryFn: async () => {
      if (!products || products.length === 0) return {};
      try {
        const imagePromises = products.map((p) =>
          fetch(`/api/products/${p.id}/images`).then((r) => {
            if (!r.ok)
              throw new Error(`Failed to fetch images for product ${p.id}`);
            return r.json();
          }),
        );
        const imagesArrays = await Promise.all(imagePromises);
        const imagesMap: { [key: number]: ProductImage[] } = {};
        products.forEach((p, i) => {
          imagesMap[p.id] = imagesArrays[i];
        });
        return imagesMap;
      } catch (error) {
        console.error("Error fetching product images:", error);
        return {};
      }
    },
    enabled: !!products && products.length > 0 && !!category?.id,
  });

  // Check if categories are loaded and if the slug exists
  const currentCategory = categories?.find((cat) => cat.slug === slug);
  console.log("Current category from categories list:", currentCategory);

  // Show loading state if categories are still loading or category is loading
  if (categoriesLoading || categoryLoading) {
    return (
      <div className="min-h-screen">
        <Navbar categories={categories || []} />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading category...</p>
        </div>
      </div>
    );
  }

  // Check if category exists - both from direct API and from categories list
  if (!category && !currentCategory) {
    console.log("Category not found - both API and local search failed");
    return (
      <div className="min-h-screen">
        <Navbar categories={categories || []} />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">Category not found</p>
            <p className="text-sm text-muted-foreground">Slug: "{slug}"</p>
            <Link
              href="/categories"
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              Browse all categories
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Use the category data from API or fallback to the one from categories list
  const displayCategory = category || currentCategory;

  // If we have category data but no ID, show error
  if (displayCategory && !displayCategory.id) {
    console.error("Category has no ID:", displayCategory);
    return (
      <div className="min-h-screen">
        <Navbar categories={categories || []} />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Invalid category data</p>
        </div>
      </div>
    );
  }

  const images = categoryImages?.map((img) => img.url) || [];
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
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span data-testid="text-breadcrumb-category">
              {displayCategory?.name}
            </span>
          </div>
          <h1
            className="font-['DM_Sans'] font-bold text-4xl md:text-5xl text-white mb-3"
            data-testid="text-category-name"
          >
            {displayCategory?.name}
          </h1>
          {displayCategory?.description && (
            <p
              className="text-white/90 text-lg max-w-3xl"
              data-testid="text-category-description"
            >
              {displayCategory.description}
            </p>
          )}
        </div>
      </div>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2
              className="font-['DM_Sans'] font-semibold text-2xl"
              data-testid="text-products-count"
            >
              {productsLoading || imagesLoading
                ? "Loading..."
                : `${products?.length || 0} Products`}
            </h2>
          </div>

          {productsLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading products...
            </div>
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
