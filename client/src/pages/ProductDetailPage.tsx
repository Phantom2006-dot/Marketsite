import { useRoute, Link } from "wouter";
import Navbar from "@/components/Navbar";
import ProductGallery from "@/components/ProductGallery";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { ChevronRight, MessageCircle } from "lucide-react";
import speakerImg from '@assets/generated_images/Bluetooth_speaker_product_af6fba9e.png'
import mugImg from '@assets/generated_images/Coffee_mug_product_685a7c25.png'
import sunglassesImg from '@assets/generated_images/Sunglasses_product_dda4545a.png'

export default function ProductDetailPage() {
  const [, params] = useRoute("/product/:slug");
  const slug = params?.slug || "";

  const categories = [
    { name: "Electronics", slug: "electronics" },
    { name: "Fashion", slug: "fashion" },
    { name: "Home & Living", slug: "home-living" },
  ];

  const product = {
    id: 1,
    name: "Wireless Bluetooth Speaker",
    price: 89.99,
    description: "Experience premium sound quality with our wireless Bluetooth speaker. Featuring advanced audio technology, 12-hour battery life, and waterproof design. Perfect for outdoor adventures or home entertainment. Connect seamlessly to any device and enjoy your favorite music anywhere.",
    images: [speakerImg, mugImg, sunglassesImg],
    category: "Electronics",
    categorySlug: "electronics",
    size: "Compact (6 x 3 x 3 inches)",
    weight: "450g",
    quantity: 15,
  };

  return (
    <div className="min-h-screen">
      <Navbar categories={categories} />

      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-8">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/category/${product.categorySlug}`} className="hover:text-foreground">
              {product.category}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span data-testid="text-breadcrumb-product">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-3">
              <ProductGallery images={product.images} productName={product.name} />
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="font-['DM_Sans'] font-semibold text-3xl mb-3" data-testid="text-product-name">
                  {product.name}
                </h1>
                <p className="text-4xl font-bold text-primary" data-testid="text-product-price">
                  ${product.price.toFixed(2)}
                </p>
              </div>

              <div className="border-t border-b py-6 space-y-4">
                <p className="text-foreground leading-relaxed" data-testid="text-product-description">
                  {product.description}
                </p>
              </div>

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
                {product.quantity !== undefined && (
                  <div>
                    <p className="text-muted-foreground mb-1">In Stock</p>
                    <p className="font-medium" data-testid="text-product-quantity">{product.quantity} units</p>
                  </div>
                )}
              </div>

              <Button 
                className="w-full bg-[#25D366] hover:bg-[#20BA59] text-white text-lg py-6"
                onClick={() => window.open('https://wa.me/2348012345678', '_blank')}
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

      <WhatsAppButton phoneNumber="+2348012345678" />
    </div>
  );
}
