import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";

interface ProductCardProps {
  id: number;
  name: string;
  slug: string;
  price: number;
  imageUrl: string;
}

export default function ProductCard({ id, name, slug, price, imageUrl }: ProductCardProps) {
  return (
    <Link href={`/product/${slug}`}>
      <Card className="group overflow-hidden cursor-pointer hover-elevate active-elevate-2 transition-transform duration-200" data-testid={`card-product-${id}`}>
        <div className="relative aspect-[3/4] overflow-hidden">
          <img 
            src={imageUrl} 
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-['DM_Sans'] font-medium text-base line-clamp-2 mb-2" data-testid={`text-product-name-${id}`}>
            {name}
          </h3>
          <p className="text-xl font-semibold" data-testid={`text-product-price-${id}`}>
            ${price.toFixed(2)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
