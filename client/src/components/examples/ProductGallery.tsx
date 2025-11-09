import ProductGallery from '../ProductGallery'
import speakerImg from '@assets/generated_images/Bluetooth_speaker_product_af6fba9e.png'
import mugImg from '@assets/generated_images/Coffee_mug_product_685a7c25.png'
import sunglassesImg from '@assets/generated_images/Sunglasses_product_dda4545a.png'

export default function ProductGalleryExample() {
  const images = [speakerImg, mugImg, sunglassesImg];

  return (
    <div className="p-6 bg-background">
      <div className="max-w-md">
        <ProductGallery images={images} productName="Sample Product" />
      </div>
    </div>
  )
}
