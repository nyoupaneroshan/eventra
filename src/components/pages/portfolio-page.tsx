'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ZoomIn } from 'lucide-react';
import PageBanner from '@/components/page-banner';
import { getPortfolioItems } from '@/lib/api';
import type { PortfolioItem } from '@/lib/types';

const categories = ['All', 'Wedding', 'Corporate', 'Party'];

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  useEffect(() => {
    getPortfolioItems()
      .then((data) => {
        const active = data.filter((p) => p.active).sort((a, b) => a.order - b.order);
        setItems(active);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredItems =
    activeCategory === 'All'
      ? items
      : items.filter((item) => item.category === activeCategory);

  return (
    <div>
      <PageBanner title="Our Portfolio" subtitle="Browse through our collection of past events and see how we bring visions to life." />
      <section className="section-padding bg-champagne/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
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

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="aspect-square rounded-2xl" />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No portfolio items available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className="group relative rounded-2xl overflow-hidden cursor-pointer aspect-square transition-all duration-500"
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="text-white font-semibold text-sm">{item.title}</h4>
                    <span className="text-white/80 text-xs">{item.category}</span>
                  </div>
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ZoomIn className="w-4 h-4 text-white" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Lightbox Dialog */}
          <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-none">
              <DialogTitle className="sr-only">Portfolio Image</DialogTitle>
              {selectedImage !== null && filteredItems[selectedImage] && (
                <div className="relative">
                  <img
                    src={filteredItems[selectedImage].image}
                    alt={filteredItems[selectedImage].title}
                    className="w-full h-auto max-h-[80vh] object-contain"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="text-white text-xl font-bold">
                      {filteredItems[selectedImage].title}
                    </h3>
                    <p className="text-white/70">{filteredItems[selectedImage].category}</p>
                    {filteredItems[selectedImage].description && (
                      <p className="text-white/60 text-sm mt-1">{filteredItems[selectedImage].description}</p>
                    )}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </div>
  );
}
