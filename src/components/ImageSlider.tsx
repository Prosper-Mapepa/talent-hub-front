"use client"
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageSliderProps {
  images: string[];
  alt: string;
  className?: string;
  autoPlay?: boolean;
  interval?: number;
  showControls?: boolean;
  showDots?: boolean;
  showCounter?: boolean;
}

export default function ImageSlider({ 
  images, 
  alt, 
  className = "", 
  autoPlay = true, 
  interval = 3000,
  showControls = true,
  showDots = true,
  showCounter = true
}: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || images.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, interval, images.length, isPaused]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  }, [images.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPaused(!isPaused);
  }, [isPaused]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!sliderRef.current?.contains(event.target as Node)) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          goToNext();
          break;
        case ' ':
          event.preventDefault();
          togglePlayPause();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious, togglePlayPause]);

  // Touch/swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  if (!images || images.length === 0) {
    return (
      <div className={`relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-gray-400 text-sm">No images available</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={sliderRef}
      className={`relative group ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
    >
      {/* Main Image Container */}
      <div className="relative overflow-hidden rounded-lg">
        <div 
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="w-full flex-shrink-0 relative overflow-hidden">
              <Image
                src={image}
                alt={`${alt} ${index + 1}`}
                width={400}
                height={250}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
                priority={index === 0}
              />
              {/* Shiny filter overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full animate-shine" />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {showControls && images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="sm"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 hover:bg-white shadow-lg hover:shadow-xl"
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 hover:bg-white shadow-lg hover:shadow-xl"
              onClick={goToNext}
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Play/Pause Button */}
        {images.length > 1 && (
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 hover:bg-black/70 text-white"
            onClick={togglePlayPause}
            aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
          >
            {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
          </Button>
        )}
      </div>

      {/* Dots Indicator */}
      {showDots && images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white shadow-lg scale-110' 
                  : 'bg-white/60 hover:bg-white/80 hover:scale-110'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      {showCounter && images.length > 1 && (
        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Progress Bar */}
      {images.length > 1 && autoPlay && !isPaused && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
          <div 
            className="h-full bg-white transition-all duration-100 ease-linear"
            style={{ 
              width: `${((currentIndex + 1) / images.length) * 100}%` 
            }}
          />
        </div>
      )}
    </div>
  );
} 