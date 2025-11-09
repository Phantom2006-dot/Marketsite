import { useRoute } from "wouter";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import WhatsAppButton from "@/components/WhatsAppButton";
import { ChevronRight } from "lucide-react";
import { Link } from "wouter";
import electronicsImg from '@assets/generated_images/Electronics_category_image_da2a1661.png'
import speakerImg from '@assets/generated_images/Bluetooth_speaker_product_af6fba9e.png'
import mugImg from '@assets/generated_images/Coffee_mug_product_685a7c25.png'
import sunglassesImg from '@assets/generated_images/Sunglasses_product_dda4545a.png'

export default function CategoryPage() {
  const [, params] = useRoute("/category/:slug");
  const slug = params?.slug || "";

  const categories = [
    { name: "Electronics", slug: "electronics" },
    { name: "Fashion", slug: "fashion" },
    { name: "Home & Living", slug: "home-living" },
  ];

  const categoryData = {
    name: "Electronics",
    imageUrl: electronicsImg,
    description: "Discover the latest in technology and innovation. From cutting-edge gadgets to essential accessories, find everything you need to stay connected and productive."
  };

  const products = [
    { id: 1, name: "Wireless Bluetooth Speaker", slug: "wireless-bluetooth-speaker", price: 89.99, imageUrl: speakerImg },
    { id: 2, name: "Ceramic Coffee Mug", slug: "ceramic-coffee-mug", price: 24.99, imageUrl: mugImg },
    { id: 3, name: "Designer Sunglasses", slug: "designer-sunglasses", price: 129.99, imageUrl: sunglassesImg },
    { id: 4, name: "Wireless Bluetooth Speaker Pro", slug: "wireless-bluetooth-speaker-pro", price: 149.99, imageUrl: speakerImg },
    { id: 5, name: "Smart Coffee Mug", slug: "smart-coffee-mug", price: 39.99, imageUrl: mugImg },
    { id: 6, name: "Premium Sunglasses", slug: "premium-sunglasses", price: 199.99, imageUrl: sunglassesImg },
  ];

  return (
    <div className="min-h-screen">
      <Navbar categories={categories} />

      <div className="relative h-96 flex items-end">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${categoryData.imageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="relative z-10 px-4 pb-12 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2 text-white/80 text-sm mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <span data-testid="text-breadcrumb-category">{categoryData.name}</span>
          </div>
          <h1 className="font-['DM_Sans'] font-bold text-4xl md:text-5xl text-white mb-3" data-testid="text-category-name">
            {categoryData.name}
          </h1>
          <p className="text-white/90 text-lg max-w-3xl" data-testid="text-category-description">
            {categoryData.description}
          </p>
        </div>
      </div>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-['DM_Sans'] font-semibold text-2xl" data-testid="text-products-count">
              {products.length} Products
            </h2>
          </div>
          
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
