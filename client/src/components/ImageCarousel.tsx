import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageCarouselProps {
  images: string[];
  interval?: number;
  showControls?: boolean;
  aspectRatio?: string;
  className?: string;
  objectFit?: "cover" | "contain";
  autoPlay?: boolean;
}

export default function ImageCarousel({
  images,
  interval = 7000,
  showControls = true,
  aspectRatio = "aspect-video",
  className = "",
  objectFit = "cover",
  autoPlay = true,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval, autoPlay]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (!images || images.length === 0) {
    return (
      <div className={`${aspectRatio} bg-muted flex items-center justify-center ${className}`}>
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  return (
    <div className={`relative ${aspectRatio} overflow-hidden ${className}`} data-testid="carousel-container">
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
            data-testid={`carousel-slide-${index}`}
          >
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className={`w-full h-full object-${objectFit}`}
            />
          </div>
        ))}
      </div>

      {showControls && images.length > 1 && (
        <>
          <Button
            size="icon"
            variant="ghost"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white"
            onClick={goToPrevious}
            data-testid="button-carousel-prev"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white"
            onClick={goToNext}
            data-testid="button-carousel-next"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-white w-8"
                    : "bg-white/50 hover:bg-white/75"
                }`}
                data-testid={`button-carousel-dot-${index}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
