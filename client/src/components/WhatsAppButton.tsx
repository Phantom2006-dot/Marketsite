import { MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { SiteSetting } from "@shared/schema";

export function WhatsAppButton() {
  const { data: settings } = useQuery<SiteSetting>({
    queryKey: ["/api/settings"],
  });

  const whatsappNumber = settings?.whatsapp || "07016342022";

  const handleClick = () => {
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}`, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      data-testid="button-whatsapp"
      aria-label="Contact us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 md:w-16 md:h-16 bg-[#25D366] hover:bg-[#20BA59] dark:bg-[#20BA59] dark:hover:bg-[#1DA851] text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center"
    >
      <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
    </button>
  );
}
