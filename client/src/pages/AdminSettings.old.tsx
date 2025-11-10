import AdminLayout from "@/components/AdminLayout";
import BackgroundEditor from "@/components/BackgroundEditor";
import heroImg from '@assets/generated_images/Storefront_hero_background_a16583f2.png'

export default function AdminSettings() {
  const handleBackgroundUpload = (file: File) => {
    console.log('Background uploaded:', file);
  };

  const handleWhatsAppUpdate = (number: string) => {
    console.log('WhatsApp updated:', number);
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="font-['DM_Sans'] font-bold text-3xl mb-2" data-testid="text-settings-title">
            Store Settings
          </h1>
          <p className="text-muted-foreground">
            Customize your storefront appearance and contact information
          </p>
        </div>

        <div className="max-w-4xl">
          <BackgroundEditor 
            currentBackground={heroImg}
            currentWhatsApp="+2348012345678"
            onBackgroundUpload={handleBackgroundUpload}
            onWhatsAppUpdate={handleWhatsAppUpdate}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
