import { Link } from "wouter";
import { Card } from "@/components/ui/card";

interface CategoryCardProps {
  name: string;
  slug: string;
  imageUrl: string;
  description?: string;
}

export default function CategoryCard({ name, slug, imageUrl, description }: CategoryCardProps) {
  return (
    <Link href={`/category/${slug}`}>
      <Card className="group overflow-hidden cursor-pointer hover-elevate active-elevate-2 transition-transform duration-200">
        <div className="relative aspect-[4/3]">
          <img 
            src={imageUrl} 
            alt={name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="text-white font-['DM_Sans'] font-semibold text-xl mb-1" data-testid={`text-category-${slug}`}>
              {name}
            </h3>
            {description && (
              <p className="text-white/90 text-sm line-clamp-2">{description}</p>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
