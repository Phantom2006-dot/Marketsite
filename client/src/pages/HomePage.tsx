import Navbar from "@/components/Navbar";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import heroImg from '@assets/generated_images/Storefront_hero_background_a16583f2.png'
import electronicsImg from '@assets/generated_images/Electronics_category_image_da2a1661.png'
import fashionImg from '@assets/generated_images/Fashion_category_image_3bafc513.png'
import homeImg from '@assets/generated_images/Home_category_image_82c69197.png'
import speakerImg from '@assets/generated_images/Bluetooth_speaker_product_af6fba9e.png'
import mugImg from '@assets/generated_images/Coffee_mug_product_685a7c25.png'
import sunglassesImg from '@assets/generated_images/Sunglasses_product_dda4545a.png'
import walletImg from '@assets/generated_images/Leather_wallet_product_9a6b3368.png'

export default function HomePage() {
  const categories = [
    { id: 1, name: "Electronics", slug: "electronics", imageUrl: electronicsImg, description: "Latest tech gadgets and accessories" },
    { id: 2, name: "Fashion", slug: "fashion", imageUrl: fashionImg, description: "Trendy clothing and accessories" },
    { id: 3, name: "Home & Living", slug: "home-living", imageUrl: homeImg, description: "Beautiful home decor items" },
  ];

  const products = [
    { id: 1, name: "Wireless Bluetooth Speaker", slug: "wireless-bluetooth-speaker", price: 89.99, imageUrl: speakerImg },
    { id: 2, name: "Ceramic Coffee Mug", slug: "ceramic-coffee-mug", price: 24.99, imageUrl: mugImg },
    { id: 3, name: "Designer Sunglasses", slug: "designer-sunglasses", price: 129.99, imageUrl: sunglassesImg },
    { id: 4, name: "Premium Leather Wallet", slug: "premium-leather-wallet", price: 59.99, imageUrl: walletImg },
    { id: 5, name: "Wireless Bluetooth Speaker", slug: "wireless-bluetooth-speaker-2", price: 89.99, imageUrl: speakerImg },
    { id: 6, name: "Ceramic Coffee Mug", slug: "ceramic-coffee-mug-2", price: 24.99, imageUrl: mugImg },
    { id: 7, name: "Designer Sunglasses", slug: "designer-sunglasses-2", price: 129.99, imageUrl: sunglassesImg },
    { id: 8, name: "Premium Leather Wallet", slug: "premium-leather-wallet-2", price: 59.99, imageUrl: walletImg },
  ];

  return (
    <div className="min-h-screen">
      <Navbar categories={categories} isTransparent />

      <section className="relative h-[80vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="font-['DM_Sans'] font-bold text-5xl md:text-6xl text-white mb-4" data-testid="text-hero-title">
            Welcome to Our Store
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Discover amazing products at great prices
          </p>
          <Button 
            size="lg" 
            className="bg-primary/90 backdrop-blur-md hover:bg-primary text-lg px-8 py-6"
            data-testid="button-shop-now"
          >
            Shop Now
          </Button>
        </div>
      </section>

      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="font-['DM_Sans'] font-semibold text-3xl mb-8" data-testid="text-categories-heading">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} {...category} />
          ))}
        </div>
      </section>

      <section className="py-16 px-4 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-['DM_Sans'] font-semibold text-3xl mb-8" data-testid="text-products-heading">
            Featured Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      <WhatsAppButton phoneNumber="+2348012345678" />
    </div>
  );
}
