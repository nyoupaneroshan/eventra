'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { X, ZoomIn } from 'lucide-react';

const categories = ['All', 'Wedding', 'Corporate', 'Party'];

const portfolioItems = [
  {
    src: '/portfolio1.png',
    alt: 'Luxury wedding ceremony with traditional decorations',
    category: 'Wedding',
    title: 'Traditional Wedding Celebration',
  },
  {
    src: '/portfolio2.png',
    alt: 'Corporate product launch event',
    category: 'Corporate',
    title: 'Product Launch Gala',
  },
  {
    src: '/portfolio3.png',
    alt: 'Elegant engagement party',
    category: 'Party',
    title: 'Engagement Celebration',
  },
  {
    src: '/portfolio4.png',
    alt: 'Garden wedding reception',
    category: 'Wedding',
    title: 'Garden Wedding Reception',
  },
  {
    src: '/portfolio5.png',
    alt: 'Corporate team building event',
    category: 'Corporate',
    title: 'Team Building Event',
  },
  {
    src: '/portfolio6.png',
    alt: 'Grand anniversary celebration',
    category: 'Party',
    title: 'Golden Anniversary Party',
  },
  {
    src: '/wedding.png',
    alt: 'Outdoor wedding ceremony',
    category: 'Wedding',
    title: 'Sunset Wedding Ceremony',
  },
  {
    src: '/corporate.png',
    alt: 'Business conference event',
    category: 'Corporate',
    title: 'Annual Business Conference',
  },
  {
    src: '/party.png',
    alt: 'Birthday celebration party',
    category: 'Party',
    title: 'Milestone Birthday Bash',
  },
];

export default function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const filteredItems =
    activeCategory === 'All'
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === activeCategory);

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="section-padding bg-champagne/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`text-center mb-12 md:mb-16 transition-all duration-700 ${
            isVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          <span className="inline-block px-4 py-1.5 bg-rose/10 text-rose-dark rounded-full text-sm font-medium mb-4">
            Our Portfolio
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Events We Have <span className="text-rose">Crafted</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Browse through our collection of past events and see how we bring
            visions to life. Every celebration tells a unique story.
          </p>
        </div>

        {/* Category Filter */}
        <div
          className={`flex flex-wrap justify-center gap-2 mb-10 transition-all duration-700 delay-200 ${
            isVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? 'default' : 'outline'}
              size="sm"
              className={`rounded-full px-6 transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-rose hover:bg-rose-dark text-white'
                  : 'border-border text-muted-foreground hover:text-rose-dark hover:border-rose/30'
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredItems.map((item, index) => (
            <div
              key={`${item.src}-${index}`}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer aspect-square transition-all duration-500 ${
                isVisible ? 'animate-scale-in' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 0.08}s` }}
              onClick={() => setSelectedImage(index)}
            >
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h4 className="text-white font-semibold text-sm">
                  {item.title}
                </h4>
                <span className="text-white/80 text-xs">{item.category}</span>
              </div>
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ZoomIn className="w-4 h-4 text-white" />
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Dialog */}
        <Dialog
          open={selectedImage !== null}
          onOpenChange={() => setSelectedImage(null)}
        >
          <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-none">
            <DialogTitle className="sr-only">Portfolio Image</DialogTitle>
            {selectedImage !== null && filteredItems[selectedImage] && (
              <div className="relative">
                <img
                  src={filteredItems[selectedImage].src}
                  alt={filteredItems[selectedImage].alt}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-white text-xl font-bold">
                    {filteredItems[selectedImage].title}
                  </h3>
                  <p className="text-white/70">
                    {filteredItems[selectedImage].category}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
