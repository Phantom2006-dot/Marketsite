import CategoryCard from '../CategoryCard'
import electronicsImg from '@assets/generated_images/Electronics_category_image_da2a1661.png'

export default function CategoryCardExample() {
  return (
    <div className="p-6 bg-background">
      <div className="max-w-sm">
        <CategoryCard 
          name="Electronics" 
          slug="electronics"
          imageUrl={electronicsImg}
          description="Latest tech gadgets and accessories"
        />
      </div>
    </div>
  )
}
