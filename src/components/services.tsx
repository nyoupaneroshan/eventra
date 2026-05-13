'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Heart,
  Building2,
  PartyPopper,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

const services = [
  {
    icon: Heart,
    image: '/wedding.png',
    title: 'Wedding Planning',
    description:
      'Your dream wedding deserves nothing but perfection. Our team specializes in creating magical wedding experiences that reflect your unique love story, from intimate ceremonies to grand celebrations.',
    features: [
      'Venue selection & booking',
      'Decoration & theme setup',
      'Catering coordination',
      'Full event management',
      'Photography coordination',
      'Guest management',
    ],
  },
  {
    icon: Building2,
    image: '/corporate.png',
    title: 'Corporate Events',
    description:
      'Elevate your brand with professionally organized corporate events. We handle every detail from technical setup to guest experience, ensuring your business events leave a lasting impression on attendees.',
    features: [
      'Conferences & seminars',
      'Product launches',
      'Team building events',
      'Award ceremonies',
      'Brand activations',
      'Corporate galas',
    ],
  },
  {
    icon: PartyPopper,
    image: '/party.png',
    title: 'Private Parties',
    description:
      'Celebrate life\'s special moments with style and joy. Whether it is a milestone birthday, an engagement celebration, or an anniversary party, we create festive atmospheres that bring people together.',
    features: [
      'Birthday celebrations',
      'Engagement parties',
      'Anniversary events',
      'Baby showers',
      'Festival gatherings',
      'Theme parties',
    ],
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  const handleCTA = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" ref={sectionRef} className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`text-center mb-12 md:mb-16 transition-all duration-700 ${
            isVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          <span className="inline-block px-4 py-1.5 bg-rose/10 text-rose-dark rounded-full text-sm font-medium mb-4">
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            What We <span className="text-rose">Offer</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From intimate gatherings to grand celebrations, we offer
            comprehensive event planning services tailored to your needs and
            vision.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`group rounded-2xl overflow-hidden bg-white border border-border shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {service.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="w-4 h-4 text-rose shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant="outline"
                  className="w-full border-rose/30 text-rose-dark hover:bg-rose hover:text-white transition-colors duration-300"
                  onClick={handleCTA}
                >
                  Request Custom Quote
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
