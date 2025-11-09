import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BackgroundEditorProps {
  currentBackground?: string;
  currentWhatsApp?: string;
  onBackgroundUpload: (file: File) => void;
  onWhatsAppUpdate: (number: string) => void;
}

export default function BackgroundEditor({ 
  currentBackground, 
  currentWhatsApp = "",
  onBackgroundUpload,
  onWhatsAppUpdate 
}: BackgroundEditorProps) {
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(currentBackground || null);
  const [whatsappNumber, setWhatsappNumber] = useState(currentWhatsApp);

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onBackgroundUpload(file);
    }
  };

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('WhatsApp number updated:', whatsappNumber);
    onWhatsAppUpdate(whatsappNumber);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Storefront Background</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <input
              type="file"
              id="background"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleBackgroundChange}
              className="hidden"
              data-testid="input-background"
            />
            <label htmlFor="background" className="cursor-pointer">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Click to upload background image (1920x1080px recommended)
              </p>
            </label>
          </div>

          {backgroundPreview && (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
              <img src={backgroundPreview} alt="Background preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <p className="text-white font-['DM_Sans'] text-2xl font-bold">Preview</p>
              </div>
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2"
                onClick={() => setBackgroundPreview(null)}
                data-testid="button-remove-background"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>WhatsApp Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp Number (International Format)</Label>
              <Input
                id="whatsapp"
                type="tel"
                placeholder="+2348012345678"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                data-testid="input-whatsapp"
              />
              <p className="text-xs text-muted-foreground">
                Include country code (e.g., +234 for Nigeria)
              </p>
            </div>
            <Button type="submit" data-testid="button-update-whatsapp">
              Update WhatsApp Number
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
