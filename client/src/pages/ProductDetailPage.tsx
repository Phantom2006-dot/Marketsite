import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import ImageCarousel from "@/components/ImageCarousel";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { ChevronRight, MessageCircle } from "lucide-react";
import type { Product, Category, ProductImage } from "@shared/schema";

export default function ProductDetailPage() {
  const [, params] = useRoute("/product/:slug");
  const slug = params?.slug || "";

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: product, isLoading: productLoading } = useQuery<Product>({
    queryKey: [`/api/products/slug/${slug}`],
    enabled: !!slug,
  });

  const { data: productImages } = useQuery<ProductImage[]>({
    queryKey: [`/api/products/${product?.id}/images`],
    enabled: !!product?.id,
  });

  const { data: category } = useQuery<Category>({
    queryKey: [`/api/categories/${product?.categoryId}`],
    enabled: !!product?.categoryId,
  });

  const { data: settings } = useQuery({
    queryKey: ["/api/settings"],
  });

  const whatsappNumber = settings?.whatsapp || "07016342022";

  if (productLoading) {
    return (
      <div className="min-h-screen">
        <Navbar categories={categories || []} />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navbar categories={categories || []} />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Product not found</p>
        </div>
      </div>
    );
  }

  const images = productImages?.map(img => img.url) || [];

  return (
    <div className="min-h-screen">
      <Navbar categories={categories || []} />

      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-8">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="h-4 w-4" />
            {category && (
              <>
                <Link href={`/category/${category.slug}`} className="hover:text-foreground">
                  {category.name}
                </Link>
                <ChevronRight className="h-4 w-4" />
              </>
            )}
            <span data-testid="text-breadcrumb-product">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-3">
              {images.length > 0 ? (
                <ImageCarousel
                  images={images}
                  aspectRatio="aspect-[3/4]"
                  showControls={images.length > 1}
                  autoPlay={images.length > 1}
                  interval={8000}
                />
              ) : (
                <div className="aspect-[3/4] bg-muted flex items-center justify-center rounded-lg">
                  <p className="text-muted-foreground">No images available</p>
                </div>
              )}
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="font-['DM_Sans'] font-semibold text-3xl mb-3" data-testid="text-product-name">
                  {product.name}
                </h1>
                <p className="text-4xl font-bold text-primary" data-testid="text-product-price">
                  ₦{product.price.toFixed(2)}
                </p>
              </div>

              {product.description && (
                <div className="border-t border-b py-6 space-y-4">
                  <p className="text-foreground leading-relaxed" data-testid="text-product-description">
                    {product.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                {product.size && (
                  <div>
                    <p className="text-muted-foreground mb-1">Size</p>
                    <p className="font-medium" data-testid="text-product-size">{product.size}</p>
                  </div>
                )}
                {product.weight && (
                  <div>
                    <p className="text-muted-foreground mb-1">Weight</p>
                    <p className="font-medium" data-testid="text-product-weight">{product.weight}</p>
                  </div>
                )}
                {product.quantity !== undefined && product.quantity !== null && (
                  <div>
                    <p className="text-muted-foreground mb-1">In Stock</p>
                    <p className="font-medium" data-testid="text-product-quantity">{product.quantity} units</p>
                  </div>
                )}
              </div>

              <Button 
                className="w-full bg-[#25D366] hover:bg-[#20BA59] text-white text-lg py-6"
                onClick={() => window.open(`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`, '_blank')}
                data-testid="button-contact-seller"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Contact Seller on WhatsApp
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                Click to message the seller directly about this product
              </p>
            </div>
          </div>
        </div>
      </div>

      <WhatsAppButton />
    </div>
  );
}
