import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, MapPin, Phone } from "lucide-react";

type Category = {
  id: number;
  name: string;
  slug: string;
};

type SiteSetting = {
  storeName: string;
  whatsapp: string;
  telegram: string;
  facebook: string;
  locationKontagora: string;
  locationAbuja: string;
};

export default function AboutPage() {
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: settings } = useQuery<SiteSetting>({
    queryKey: ["/api/settings"],
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar categories={categories} />
      
      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4" data-testid="text-about-title">
              About {settings?.storeName || "Us"}
            </h1>
            <p className="text-xl text-muted-foreground">
              Quality Islamic Clothing & Accessories for Women
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Our Story
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Welcome to {settings?.storeName || "our store"}, your trusted destination for 
                  authentic Islamic clothing and accessories. We are dedicated to providing 
                  high-quality, modest fashion that combines traditional values with contemporary 
                  style.
                </p>
                <p className="text-muted-foreground">
                  Our collection features carefully curated pieces that celebrate modesty and 
                  elegance, ensuring you look and feel your best while honoring your faith 
                  and values.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Our Locations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Kontagora, Niger State</h3>
                  <p className="text-muted-foreground">
                    {settings?.locationKontagora || "Visit us in Kontagora"}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Gwagwalada, Abuja</h3>
                  <p className="text-muted-foreground">
                    {settings?.locationAbuja || "Visit us in Gwagwalada"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Get in Touch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  We're here to help you find the perfect pieces for your wardrobe. 
                  Feel free to reach out to us through WhatsApp or visit our stores 
                  for a personalized shopping experience.
                </p>
                {settings?.whatsapp && (
                  <div>
                    <span className="font-semibold">WhatsApp: </span>
                    <span className="text-muted-foreground">{settings.whatsapp}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
