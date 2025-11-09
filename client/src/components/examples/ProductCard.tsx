import ProductCard from '../ProductCard'
import speakerImg from '@assets/generated_images/Bluetooth_speaker_product_af6fba9e.png'

export default function ProductCardExample() {
  return (
    <div className="p-6 bg-background">
      <div className="max-w-xs">
        <ProductCard 
          id={1}
          name="Wireless Bluetooth Speaker" 
          slug="wireless-bluetooth-speaker"
          price={89.99}
          imageUrl={speakerImg}
        />
      </div>
    </div>
  )
}
