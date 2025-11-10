import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Navbar from "@/components/Navbar"; // Changed from CustomerNav to Navbar
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { MapPin, Facebook, Send } from "lucide-react";
import ImageCarousel from "@/components/ImageCarousel";
import type { Category, Product, SiteSetting, HeroImage } from "@shared/schema";

export default function HomePage() {
  const { data: settings, isLoading: settingsLoading } = useQuery<SiteSetting>({
    queryKey: ["/api/settings"],
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery<
    Category[]
  >({
    queryKey: ["/api/categories"],
  });

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: heroImages } = useQuery<HeroImage[]>({
    queryKey: ["/api/hero-images"],
  });

  const storeName = settings?.storeName || "AL-MUSLIMAH CLOTHINGS & SHOES";
  const fallbackHeroImage =
    settings?.heroImageUrl ||
    "https://images.unsplash.com/photo-1558769132-cb1aea174970?w=1200&h=600&fit=crop";

  const heroImageUrls =
    heroImages && heroImages.length > 0
      ? heroImages.map((img) => img.url)
      : [fallbackHeroImage];

  // Prepare categories data for Navbar
  const navbarCategories =
    categories?.map((cat) => ({
      name: cat.name,
      slug: cat.slug,
    })) || [];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Replaced CustomerNav with Navbar and set isTransparent for hero section */}
      <Navbar categories={navbarCategories} isTransparent={true} />

      <main className="flex-1">
        <section className="relative h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden">
          <ImageCarousel
            images={heroImageUrls}
            aspectRatio="h-[300px] md:h-[400px]"
            className="absolute inset-0"
            showControls={heroImageUrls.length > 1}
            autoPlay={heroImageUrls.length > 1}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
          <div className="relative z-10 text-center text-white px-4">
            <h1
              className="text-3xl md:text-5xl font-bold mb-4"
              data-testid="text-hero-title"
            >
              {storeName}
            </h1>
            <p className="text-lg md:text-xl mb-6">
              Quality Islamic Clothing & Accessories for Women
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/categories">
                <Button
                  variant="default"
                  size="lg"
                  data-testid="button-shop-now"
                >
                  Shop Now
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {categoriesLoading ? (
          <section className="container mx-auto px-4 py-12">
            <h2
              className="text-2xl md:text-3xl font-bold mb-8"
              data-testid="text-categories-heading"
            >
              Shop by Category
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          </section>
        ) : categories && categories.length > 0 ? (
          <section className="container mx-auto px-4 py-12">
            <h2
              className="text-2xl md:text-3xl font-bold mb-8"
              data-testid="text-categories-heading"
            >
              Shop by Category
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Link key={category.id} href={`/category/${category.slug}`}>
                  <Card className="hover-elevate cursor-pointer h-full">
                    {category.primaryImageUrl ? (
                      <div
                        className="h-40 bg-cover bg-center rounded-t-md"
                        style={{
                          backgroundImage: `url(${category.primaryImageUrl})`,
                        }}
                        data-testid={`img-category-${category.id}`}
                      />
                    ) : (
                      <div className="h-40 bg-muted flex items-center justify-center rounded-t-md">
                        <span className="text-muted-foreground">No Image</span>
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle data-testid={`text-category-${category.id}`}>
                        {category.name}
                      </CardTitle>
                      {category.description && (
                        <CardDescription>
                          {category.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {productsLoading ? (
          <section className="container mx-auto px-4 py-12">
            <h2
              className="text-2xl md:text-3xl font-bold mb-8"
              data-testid="text-products-heading"
            >
              Featured Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-80" />
              ))}
            </div>
          </section>
        ) : products && products.length > 0 ? (
          <section className="container mx-auto px-4 py-12">
            <h2
              className="text-2xl md:text-3xl font-bold mb-8"
              data-testid="text-products-heading"
            >
              Featured Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 8).map((product) => (
                <Link key={product.id} href={`/product/${product.slug}`}>
                  <Card
                    className="hover-elevate cursor-pointer h-full flex flex-col"
                    data-testid={`card-product-${product.id}`}
                  >
                    {product.primaryImageUrl ? (
                      <div
                        className="h-48 bg-cover bg-center rounded-t-md"
                        style={{
                          backgroundImage: `url(${product.primaryImageUrl})`,
                        }}
                        data-testid={`img-product-${product.id}`}
                      />
                    ) : (
                      <div className="h-48 bg-muted flex items-center justify-center rounded-t-md">
                        <span className="text-muted-foreground">No Image</span>
                      </div>
                    )}
                    <CardHeader className="flex-1">
                      <CardTitle
                        className="text-lg"
                        data-testid={`text-product-${product.id}`}
                      >
                        {product.name}
                      </CardTitle>
                      {product.description && (
                        <CardDescription className="line-clamp-2">
                          {product.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardFooter className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xl font-bold">
                        ₦{product.price.toLocaleString()}
                      </span>
                      {product.quantity !== null && product.quantity > 0 && (
                        <Badge variant="secondary">In Stock</Badge>
                      )}
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="bg-muted/50 py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              Visit Our Stores
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Kontagora, Niger State
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {settings?.locationKontagora ||
                      "1st floor by LAPO office, Madengene plaza, Opposite Korna amala, Kontagora, Niger state."}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Gwagwalada, Abuja
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {settings?.locationAbuja ||
                      "Opposite Zahra bread, Compensation lay out, Old kutunku, Gwagwalada FCT, Abuja."}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="bg-primary text-primary-foreground py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Connect With Us
            </h2>
            <p className="mb-6 text-lg">
              Follow us on social media and chat with us directly
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {settings?.telegram && (
                <Button
                  variant="secondary"
                  size="lg"
                  className="gap-2"
                  onClick={() =>
                    window.open(
                      `https://t.me/${settings.telegram.replace(/\D/g, "")}`,
                      "_blank",
                    )
                  }
                  data-testid="button-telegram"
                >
                  <Send className="w-5 h-5" />
                  Telegram
                </Button>
              )}
              {settings?.facebook && (
                <Button
                  variant="secondary"
                  size="lg"
                  className="gap-2"
                  onClick={() => window.open(settings.facebook, "_blank")}
                  data-testid="button-facebook"
                >
                  <Facebook className="w-5 h-5" />
                  Facebook
                </Button>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} {storeName}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
