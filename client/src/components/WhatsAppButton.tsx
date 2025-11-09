import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WhatsAppButtonProps {
  phoneNumber: string;
}

export default function WhatsAppButton({ phoneNumber }: WhatsAppButtonProps) {
  const handleClick = () => {
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}`, '_blank');
  };

  return (
    <Button
      size="icon"
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 h-14 w-14 md:h-16 md:w-16 rounded-full shadow-2xl bg-[#25D366] hover:bg-[#20BA59] text-white z-50 animate-pulse"
      onClick={handleClick}
      data-testid="button-whatsapp"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="h-7 w-7 md:h-8 md:w-8" />
    </Button>
  );
}
