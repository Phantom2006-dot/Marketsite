import BackgroundEditor from '../BackgroundEditor'
import heroImg from '@assets/generated_images/Storefront_hero_background_a16583f2.png'

export default function BackgroundEditorExample() {
  const handleBackgroundUpload = (file: File) => {
    console.log('Background uploaded:', file);
  };

  const handleWhatsAppUpdate = (number: string) => {
    console.log('WhatsApp updated:', number);
  };

  return (
    <div className="p-6 bg-background">
      <div className="max-w-4xl">
        <BackgroundEditor 
          currentBackground={heroImg}
          currentWhatsApp="+2348012345678"
          onBackgroundUpload={handleBackgroundUpload}
          onWhatsAppUpdate={handleWhatsAppUpdate}
        />
      </div>
    </div>
  )
}
