import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
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
import { MapPin, Facebook, Send, Mail, Phone, Clock } from "lucide-react";
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

  // FIXED: Prioritize admin-set hero image over heroImages array
  const heroImageUrls =
    // First priority: heroImageUrl from settings (admin panel)
    settings?.heroImageUrl
      ? [settings.heroImageUrl]
      : // Second priority: heroImages from /api/hero-images
        heroImages && heroImages.length > 0
        ? heroImages.map((img) => img.url)
        : // Fallback: default image
          [
            "https://images.unsplash.com/photo-1558769132-cb1aea174970?w=1200&h=600&fit=crop",
          ];

  // Debug: Check what images are being used
  console.log("Settings heroImageUrl:", settings?.heroImageUrl);
  console.log("Hero images from API:", heroImages);
  console.log("Final hero image URLs:", heroImageUrls);

  // Prepare categories data for Navbar
  const navbarCategories =
    categories?.map((cat) => ({
      name: cat.name,
      slug: cat.slug,
    })) || [];

  return (
    <div className="min-h-screen flex flex-col" data-testid="home-page">
      <Navbar categories={navbarCategories} isTransparent={true} />

      <main className="flex-1">
        {/* Increased hero section height and improved styling */}
        <section 
          className="relative h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden"
          data-testid="hero-section"
        >
          <ImageCarousel
            images={heroImageUrls}
            aspectRatio="h-[500px] md:h-[600px]"
            className="absolute inset-0"
            showControls={heroImageUrls.length > 1}
            autoPlay={heroImageUrls.length > 1}
            data-testid="hero-image-carousel"
          />
          <div 
            className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60"
            data-testid="hero-overlay"
          />
          <div 
            className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto"
            data-testid="hero-content"
          >
            <h1
              className="text-4xl md:text-6xl font-bold mb-6 font-['DM_Sans']"
              data-testid="text-hero-title"
            >
              {storeName}
            </h1>
            <p 
              className="text-xl md:text-2xl mb-8 font-light"
              data-testid="text-hero-subtitle"
            >
              Premium Islamic Clothing & Accessories for the Modern Woman
            </p>
            <div 
              className="flex flex-wrap gap-4 justify-center"
              data-testid="hero-buttons"
            >
              <Link href="/categories">
                <Button
                  variant="default"
                  size="lg"
                  className="bg-white text-black hover:bg-white/90 px-8 py-3 text-lg font-semibold"
                  data-testid="button-shop-now"
                >
                  Shop Collection
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg font-semibold"
                  data-testid="button-learn-more"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {categoriesLoading ? (
          <section 
            className="container mx-auto px-4 py-16"
            data-testid="categories-section-loading"
          >
            <h2
              className="text-3xl md:text-4xl font-bold mb-12 text-center font-['DM_Sans']"
              data-testid="text-categories-heading"
            >
              Shop by Category
            </h2>
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              data-testid="categories-loading-grid"
            >
              {[1, 2, 3].map((i) => (
                <Skeleton 
                  key={i} 
                  className="h-48 rounded-lg" 
                  data-testid={`category-skeleton-${i}`}
                />
              ))}
            </div>
          </section>
        ) : categories && categories.length > 0 ? (
          <section 
            className="container mx-auto px-4 py-16"
            data-testid="categories-section"
          >
            <h2
              className="text-3xl md:text-4xl font-bold mb-12 text-center font-['DM_Sans']"
              data-testid="text-categories-heading"
            >
              Shop by Category
            </h2>
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              data-testid="categories-grid"
            >
              {categories.map((category) => (
                <Link 
                  key={category.id} 
                  href={`/category/${category.slug}`}
                  data-testid={`link-category-${category.slug}`}
                >
                  <Card 
                    className="hover-elevate cursor-pointer h-full group border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                    data-testid={`card-category-${category.id}`}
                  >
                    {category.primaryImageUrl ? (
                      <div
                        className="h-48 bg-cover bg-center rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                        style={{
                          backgroundImage: `url(${category.primaryImageUrl})`,
                        }}
                        data-testid={`img-category-${category.id}`}
                      />
                    ) : (
                      <div 
                        className="h-48 bg-gradient-to-br from-muted to-muted/80 flex items-center justify-center rounded-t-lg"
                        data-testid={`img-category-placeholder-${category.id}`}
                      >
                        <span 
                          className="text-muted-foreground"
                          data-testid={`text-category-no-image-${category.id}`}
                        >
                          No Image
                        </span>
                      </div>
                    )}
                    <CardHeader className="text-center">
                      <CardTitle
                        className="text-xl font-['DM_Sans'] group-hover:text-primary transition-colors"
                        data-testid={`text-category-name-${category.id}`}
                      >
                        {category.name}
                      </CardTitle>
                      {category.description && (
                        <CardDescription 
                          data-testid={`text-category-description-${category.id}`}
                        >
                          {category.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ) : (
          <section 
            className="container mx-auto px-4 py-16"
            data-testid="categories-section-empty"
          >
            <h2
              className="text-3xl md:text-4xl font-bold mb-12 text-center font-['DM_Sans']"
              data-testid="text-categories-heading"
            >
              Shop by Category
            </h2>
            <div 
              className="text-center py-12"
              data-testid="text-no-categories"
            >
              <p className="text-muted-foreground">No categories available</p>
            </div>
          </section>
        )}

        {productsLoading ? (
          <section 
            className="container mx-auto px-4 py-16 bg-muted/30"
            data-testid="products-section-loading"
          >
            <h2
              className="text-3xl md:text-4xl font-bold mb-12 text-center font-['DM_Sans']"
              data-testid="text-products-heading"
            >
              Featured Products
            </h2>
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              data-testid="products-loading-grid"
            >
              {[1, 2, 3, 4].map((i) => (
                <Skeleton 
                  key={i} 
                  className="h-80 rounded-lg" 
                  data-testid={`product-skeleton-${i}`}
                />
              ))}
            </div>
          </section>
        ) : products && products.length > 0 ? (
          <section 
            className="container mx-auto px-4 py-16 bg-muted/30"
            data-testid="products-section"
          >
            <h2
              className="text-3xl md:text-4xl font-bold mb-12 text-center font-['DM_Sans']"
              data-testid="text-products-heading"
            >
              Featured Products
            </h2>
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              data-testid="products-grid"
            >
              {products.slice(0, 8).map((product) => (
                <Link 
                  key={product.id} 
                  href={`/product/${product.slug}`}
                  data-testid={`link-product-${product.slug}`}
                >
                  <Card
                    className="hover-elevate cursor-pointer h-full flex flex-col border-0 shadow-md hover:shadow-lg transition-all duration-300 group"
                    data-testid={`card-product-${product.id}`}
                  >
                    {product.primaryImageUrl ? (
                      <div
                        className="h-48 bg-cover bg-center rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                        style={{
                          backgroundImage: `url(${product.primaryImageUrl})`,
                        }}
                        data-testid={`img-product-${product.id}`}
                      />
                    ) : (
                      <div 
                        className="h-48 bg-gradient-to-br from-muted to-muted/80 flex items-center justify-center rounded-t-lg"
                        data-testid={`img-product-placeholder-${product.id}`}
                      >
                        <span 
                          className="text-muted-foreground"
                          data-testid={`text-product-no-image-${product.id}`}
                        >
                          No Image
                        </span>
                      </div>
                    )}
                    <CardHeader className="flex-1">
                      <CardTitle
                        className="text-lg font-['DM_Sans'] group-hover:text-primary transition-colors"
                        data-testid={`text-product-name-${product.id}`}
                      >
                        {product.name}
                      </CardTitle>
                      {product.description && (
                        <CardDescription 
                          className="line-clamp-2 text-sm"
                          data-testid={`text-product-description-${product.id}`}
                        >
                          {product.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardFooter 
                      className="flex flex-wrap items-center justify-between gap-2"
                      data-testid={`product-footer-${product.id}`}
                    >
                      <span 
                        className="text-xl font-bold text-primary"
                        data-testid={`text-product-price-${product.id}`}
                      >
                        ₦{product.price.toLocaleString()}
                      </span>
                      {product.quantity !== null && product.quantity > 0 ? (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800"
                          data-testid={`badge-in-stock-${product.id}`}
                        >
                          In Stock
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-red-100 text-red-800"
                          data-testid={`badge-out-of-stock-${product.id}`}
                        >
                          Out of Stock
                        </Badge>
                      )}
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ) : (
          <section 
            className="container mx-auto px-4 py-16 bg-muted/30"
            data-testid="products-section-empty"
          >
            <h2
              className="text-3xl md:text-4xl font-bold mb-12 text-center font-['DM_Sans']"
              data-testid="text-products-heading"
            >
              Featured Products
            </h2>
            <div 
              className="text-center py-12"
              data-testid="text-no-products"
            >
              <p className="text-muted-foreground">No products available</p>
            </div>
          </section>
        )}

        {/* Professional Contact Section */}
        <section 
          className="py-16 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground"
          data-testid="contact-section"
        >
          <div className="container mx-auto px-4">
            <div 
              className="text-center mb-12"
              data-testid="contact-header"
            >
              <h2 
                className="text-3xl md:text-4xl font-bold mb-4 font-['DM_Sans']"
                data-testid="text-contact-heading"
              >
                Get In Touch
              </h2>
              <p 
                className="text-xl opacity-90 max-w-2xl mx-auto"
                data-testid="text-contact-subtitle"
              >
                We're here to help you find the perfect Islamic clothing and
                accessories. Visit our stores or reach out to us online.
              </p>
            </div>

            <div 
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
              data-testid="contact-grid"
            >
              {/* Store Locations */}
              <Card 
                className="bg-white/10 backdrop-blur-sm border-white/20"
                data-testid="card-locations"
              >
                <CardHeader>
                  <CardTitle 
                    className="flex items-center gap-2 text-white"
                    data-testid="text-locations-title"
                  >
                    <MapPin className="w-5 h-5" />
                    Our Locations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div data-testid="location-kontagora">
                    <h4 
                      className="font-semibold mb-1"
                      data-testid="text-kontagora-title"
                    >
                      Kontagora, Niger State
                    </h4>
                    <p 
                      className="text-sm opacity-90"
                      data-testid="text-kontagora-address"
                    >
                      {settings?.locationKontagora ||
                        "1st floor by LAPO office, Madengene plaza, Opposite Korna amala, Kontagora, Niger state."}
                    </p>
                  </div>
                  <div data-testid="location-abuja">
                    <h4 
                      className="font-semibold mb-1"
                      data-testid="text-abuja-title"
                    >
                      Gwagwalada, Abuja
                    </h4>
                    <p 
                      className="text-sm opacity-90"
                      data-testid="text-abuja-address"
                    >
                      {settings?.locationAbuja ||
                        "Opposite Zahra bread, Compensation lay out, Old kutunku, Gwagwalada FCT, Abuja."}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card 
                className="bg-white/10 backdrop-blur-sm border-white/20"
                data-testid="card-contact-info"
              >
                <CardHeader>
                  <CardTitle 
                    className="flex items-center gap-2 text-white"
                    data-testid="text-contact-info-title"
                  >
                    <Phone className="w-5 h-5" />
                    Contact Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div 
                    className="flex items-center gap-3"
                    data-testid="contact-phone"
                  >
                    <Phone className="w-4 h-4 opacity-70" />
                    <span 
                      className="text-sm"
                      data-testid="text-phone-number"
                    >
                      {settings?.phone || "+234 XXX XXX XXXX"}
                    </span>
                  </div>
                  <div 
                    className="flex items-center gap-3"
                    data-testid="contact-email"
                  >
                    <Mail className="w-4 h-4 opacity-70" />
                    <span 
                      className="text-sm"
                      data-testid="text-email-address"
                    >
                      {settings?.email || "info@almuslimah.com"}
                    </span>
                  </div>
                  <div 
                    className="flex items-center gap-3"
                    data-testid="contact-hours"
                  >
                    <Clock className="w-4 h-4 opacity-70" />
                    <span 
                      className="text-sm"
                      data-testid="text-business-hours"
                    >
                      {settings?.hours || "Mon-Sat: 9AM-6PM"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card 
                className="bg-white/10 backdrop-blur-sm border-white/20"
                data-testid="card-social-media"
              >
                <CardHeader>
                  <CardTitle 
                    className="flex items-center gap-2 text-white"
                    data-testid="text-social-media-title"
                  >
                    <Send className="w-5 h-5" />
                    Follow Us
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {settings?.telegram && (
                    <Button
                      variant="secondary"
                      className="w-full justify-start gap-2 bg-white/20 hover:bg-white/30 border-white/30"
                      onClick={() =>
                        window.open(
                          `https://t.me/${settings.telegram.replace(/\D/g, "")}`,
                          "_blank",
                        )
                      }
                      data-testid="button-telegram"
                    >
                      <Send className="w-4 h-4" />
                      Telegram
                    </Button>
                  )}
                  {settings?.facebook && (
                    <Button
                      variant="secondary"
                      className="w-full justify-start gap-2 bg-white/20 hover:bg-white/30 border-white/30"
                      onClick={() => window.open(settings.facebook, "_blank")}
                      data-testid="button-facebook"
                    >
                      <Facebook className="w-4 h-4" />
                      Facebook
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card 
                className="bg-white/10 backdrop-blur-sm border-white/20"
                data-testid="card-quick-links"
              >
                <CardHeader>
                  <CardTitle 
                    className="text-white"
                    data-testid="text-quick-links-title"
                  >
                    Quick Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/categories">
                    <Button
                      variant="secondary"
                      className="w-full justify-start bg-white/20 hover:bg-white/30 border-white/30"
                      data-testid="button-browse-categories"
                    >
                      Browse All Categories
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button
                      variant="secondary"
                      className="w-full justify-start bg-white/20 hover:bg-white/30 border-white/30"
                      data-testid="button-send-message"
                    >
                      Send Message
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button
                      variant="secondary"
                      className="w-full justify-start bg-white/20 hover:bg-white/30 border-white/30"
                      data-testid="button-about-us"
                    >
                      About Us
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer 
        className="border-t py-8 bg-background"
        data-testid="footer"
      >
        <div className="container mx-auto px-4">
          <div 
            className="text-center"
            data-testid="footer-content"
          >
            <p 
              className="text-sm text-muted-foreground mb-2"
              data-testid="text-copyright"
            >
              &copy; {new Date().getFullYear()} {storeName}. All rights
              reserved.
            </p>
            <p 
              className="text-xs text-muted-foreground"
              data-testid="text-footer-tagline"
            >
              Premium Islamic Clothing & Accessories
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}