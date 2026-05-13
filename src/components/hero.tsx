'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const heroSlides = [
  {
    image: '/hero1.png',
    title: 'We Plan, You Celebrate',
    subtitle:
      'Professional event planning services in Nepal for weddings, corporate events, and private parties.',
  },
  {
    image: '/hero2.png',
    title: 'Crafting Unforgettable Moments',
    subtitle:
      'From concept to execution, we handle every detail so you can focus on what matters most — celebrating.',
  },
  {
    image: '/hero3.png',
    title: 'Your Vision, Our Expertise',
    subtitle:
      'Turning your ideas into extraordinary experiences with creativity, precision, and passion.',
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 600);
    },
    [isTransitioning]
  );

  const nextSlide = useCallback(() => {
    goToSlide((current + 1) % heroSlides.length);
  }, [current, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((current - 1 + heroSlides.length) % heroSlides.length);
  }, [current, goToSlide]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const handleCTA = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative w-full h-screen min-h-[600px] overflow-hidden">
      {/* Background slides */}
      {heroSlides.map((slide, index) => (
        <div
          key={index}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: current === index ? 1 : 0 }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div
            key={`title-${current}`}
            className="animate-fade-in-up"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight tracking-tight">
              {heroSlides[current].title}
            </h1>
          </div>
          <div
            key={`subtitle-${current}`}
            className="animate-fade-in-up"
            style={{ animationDelay: '0.15s' }}
          >
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
              {heroSlides[current].subtitle}
            </p>
          </div>
          <div
            key={`cta-${current}`}
            className="animate-fade-in-up flex flex-col sm:flex-row gap-4 justify-center"
            style={{ animationDelay: '0.3s' }}
          >
            <Button
              size="lg"
              className="bg-rose hover:bg-rose-dark text-white text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => handleCTA('#contact')}
            >
              Get Free Quote
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 text-lg px-8 py-6 rounded-full transition-all duration-300"
              onClick={() => handleCTA('#contact')}
            >
              Book Consultation
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-all duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-all duration-300"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              current === index
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/50 flex items-start justify-center pt-2">
          <div className="w-1.5 h-3 rounded-full bg-white/70" />
        </div>
      </div>
    </section>
  );
}
