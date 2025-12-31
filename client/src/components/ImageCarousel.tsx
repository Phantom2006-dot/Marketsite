import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageCarouselProps {
  images: string[];
  interval?: number;
  showControls?: boolean;
  aspectRatio?: string;
  className?: string;
  objectFit?: "cover" | "contain";
  autoPlay?: boolean;
  showDots?: boolean;
  swipeThreshold?: number;
}

export default function ImageCarousel({
  images,
  interval = 2000, // Changed from 7000 to 2000ms (2 seconds)
  showControls = true,
  aspectRatio = "aspect-video",
  className = "",
  objectFit = "cover",
  autoPlay = true,
  showDots = true,
  swipeThreshold = 50, // Minimum drag distance to trigger swipe
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;

    const startAutoPlay = () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      autoPlayRef.current = setInterval(() => {
        goToNext();
      }, interval);
    };

    startAutoPlay();

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [images.length, interval, autoPlay]);

  // Pause auto-play on hover/drag
  const pauseAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);

  // Resume auto-play
  const resumeAutoPlay = useCallback(() => {
    if (autoPlay && images.length > 1 && !autoPlayRef.current) {
      autoPlayRef.current = setInterval(() => {
        goToNext();
      }, interval);
    }
  }, [autoPlay, images.length, interval]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    pauseAutoPlay();
    setTimeout(resumeAutoPlay, interval * 2);
  }, [images.length, pauseAutoPlay, resumeAutoPlay, interval]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    pauseAutoPlay();
    setTimeout(resumeAutoPlay, interval * 2);
  }, [pauseAutoPlay, resumeAutoPlay, interval]);

  // Touch/Mouse drag handlers
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setDragOffset(0);
    pauseAutoPlay();
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const offset = clientX - startX;
    setDragOffset(offset);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    
    const threshold = swipeThreshold;
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        // Swiped right - go to previous
        goToPrevious();
      } else {
        // Swiped left - go to next
        goToNext();
      }
    }
    
    setIsDragging(false);
    setDragOffset(0);
    setTimeout(resumeAutoPlay, interval * 2);
  };

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleDragEnd();
    }
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevious, goToNext]);

  if (!images || images.length === 0) {
    return (
      <div className={`${aspectRatio} bg-muted flex items-center justify-center ${className}`}>
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  const transformStyle = `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`;

  return (
    <div 
      className={`relative ${aspectRatio} overflow-hidden ${className}`}
      data-testid="carousel-container"
      ref={containerRef}
      onMouseEnter={pauseAutoPlay}
      onMouseLeave={() => {
        if (!isDragging) {
          resumeAutoPlay();
        }
      }}
    >
      {/* Main Carousel Container */}
      <div 
        className="relative w-full h-full"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div 
          className={cn(
            "flex w-full h-full transition-transform duration-300 ease-out",
            isDragging && "transition-none"
          )}
          style={{ transform: transformStyle }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full h-full"
              data-testid={`carousel-slide-${index}`}
            >
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className={`w-full h-full object-${objectFit} select-none`}
                draggable="false"
              />
            </div>
          ))}
        </div>

        {/* Drag overlay for better UX */}
        {isDragging && (
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
            <div className="text-white bg-black/70 px-4 py-2 rounded-lg text-sm">
              {dragOffset > 0 ? "← Swipe right" : "Swipe left →"}
            </div>
          </div>
        )}
      </div>

      {/* Manual Controls */}
      {showControls && images.length > 1 && (
        <>
          <Button
            size="icon"
            variant="ghost"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white z-10"
            onClick={goToPrevious}
            onMouseEnter={pauseAutoPlay}
            onMouseLeave={resumeAutoPlay}
            data-testid="button-carousel-prev"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white z-10"
            onClick={goToNext}
            onMouseEnter={pauseAutoPlay}
            onMouseLeave={resumeAutoPlay}
            data-testid="button-carousel-next"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Navigation Dots */}
      {showDots && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              onMouseEnter={pauseAutoPlay}
              onMouseLeave={resumeAutoPlay}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === currentIndex
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/75"
              )}
              data-testid={`button-carousel-dot-${index}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Slide Counter */}
      <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-10">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Auto-play indicator */}
      {autoPlay && images.length > 1 && (
        <div className="absolute bottom-4 left-4 flex items-center gap-2 z-10">
          <div className="text-white/70 text-sm">Auto-scroll: 2s</div>
          <div className="relative w-16 h-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-white rounded-full"
              style={{
                animation: `progress ${interval}ms linear infinite`,
                animationPlayState: autoPlayRef.current ? 'running' : 'paused'
              }}
            />
          </div>
          <style>{`
            @keyframes progress {
              0% { width: 0%; }
              100% { width: 100%; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
