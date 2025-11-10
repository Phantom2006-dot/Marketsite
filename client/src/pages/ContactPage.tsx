import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, MessageCircle, Send } from "lucide-react";
import { SiWhatsapp, SiTelegram, SiFacebook } from "react-icons/si";

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

export default function ContactPage() {
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: settings } = useQuery<SiteSetting>({
    queryKey: ["/api/settings"],
  });

  const handleWhatsAppClick = () => {
    if (settings?.whatsapp) {
      const phone = settings.whatsapp.replace(/\D/g, '');
      window.open(`https://wa.me/${phone}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar categories={categories} />
      
      <main className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4" data-testid="text-contact-title">
              Contact Us
            </h1>
            <p className="text-xl text-muted-foreground">
              We'd love to hear from you. Reach out to us anytime!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Visit Our Stores
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-primary">📍</span>
                    Kontagora, Niger State
                  </h3>
                  <p className="text-muted-foreground">
                    {settings?.locationKontagora || "1st floor by LAPO office, Madengene plaza, Opposite Korna amala, Kontagora, Niger state."}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-primary">📍</span>
                    Gwagwalada, Abuja
                  </h3>
                  <p className="text-muted-foreground">
                    {settings?.locationAbuja || "Opposite Zahra bread, Compensation lay out, Old kutunku, Gwagwalada FCT, Abuja."}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Connect With Us
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {settings?.whatsapp && (
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3"
                    onClick={handleWhatsAppClick}
                    data-testid="button-whatsapp"
                  >
                    <SiWhatsapp className="h-5 w-5 text-green-600 dark:text-green-500" />
                    <div className="text-left">
                      <div className="font-semibold">WhatsApp</div>
                      <div className="text-sm text-muted-foreground">{settings.whatsapp}</div>
                    </div>
                  </Button>
                )}

                {settings?.telegram && (
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3"
                    onClick={() => window.open(`https://t.me/${settings.telegram}`, '_blank')}
                    data-testid="button-telegram"
                  >
                    <SiTelegram className="h-5 w-5 text-blue-500" />
                    <div className="text-left">
                      <div className="font-semibold">Telegram</div>
                      <div className="text-sm text-muted-foreground">{settings.telegram}</div>
                    </div>
                  </Button>
                )}

                {settings?.facebook && (
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3"
                    onClick={() => window.open(settings.facebook, '_blank')}
                    data-testid="button-facebook"
                  >
                    <SiFacebook className="h-5 w-5 text-blue-600" />
                    <div className="text-left">
                      <div className="font-semibold">Facebook</div>
                      <div className="text-sm text-muted-foreground">Follow us</div>
                    </div>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Have Questions?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                For product inquiries, orders, or general questions, please contact us via WhatsApp. 
                Our team is ready to assist you in finding the perfect pieces for your wardrobe.
              </p>
              <Button onClick={handleWhatsAppClick} data-testid="button-message">
                <Send className="h-4 w-4 mr-2" />
                Send us a Message
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
