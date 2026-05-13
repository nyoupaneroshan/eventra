'use client';

import { useEffect, useRef, useState } from 'react';
import { Heart, Palette, MapPin, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Heart,
    title: 'Attention to Detail',
    description:
      'Every element is carefully considered, from table settings to lighting, ensuring nothing is overlooked.',
  },
  {
    icon: Palette,
    title: 'Creative Design',
    description:
      'We bring fresh, innovative ideas to every event, crafting unique themes and atmospheres that leave lasting impressions.',
  },
  {
    icon: MapPin,
    title: 'Venue Selection',
    description:
      'Access to the finest venues in and around Butwal, handpicked to match your event style and guest count perfectly.',
  },
  {
    icon: Sparkles,
    title: 'Full Coordination',
    description:
      'From decoration to catering, we manage every vendor and detail so you can relax and enjoy your celebration.',
  },
];

export default function About() {
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

  return (
    <section
      id="about"
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
            About Us
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Passionate Event Planners{' '}
            <span className="text-rose">Based in Butwal</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We are a dedicated team of event enthusiasts committed to making
            every celebration smooth, beautiful, memorable, and stress-free.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Photos */}
          <div
            className={`grid grid-cols-2 gap-4 transition-all duration-700 delay-200 ${
              isVisible ? 'animate-slide-in-left' : 'opacity-0'
            }`}
          >
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="/about1.png"
                  alt="Our team planning an event"
                  className="w-full h-48 sm:h-56 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="/about3.png"
                  alt="Attention to detail in decoration"
                  className="w-full h-48 sm:h-56 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="mt-8">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="/about2.png"
                  alt="Elegant venue setup"
                  className="w-full h-full min-h-[400px] object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div
            className={`transition-all duration-700 delay-400 ${
              isVisible ? 'animate-slide-in-right' : 'opacity-0'
            }`}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Making Every Event Smooth, Beautiful &amp; Memorable
            </h3>
            <p className="text-muted-foreground text-base leading-relaxed mb-4">
              At Eventra, we believe that every celebration deserves to be
              extraordinary. Based in the heart of Butwal, our passionate team
              has been transforming ordinary spaces into breathtaking
              experiences. Whether it is an intimate wedding, a grand corporate
              gala, or a joyful private party, we pour our hearts into every
              detail.
            </p>
            <p className="text-muted-foreground text-base leading-relaxed mb-8">
              Our approach is simple yet thorough — we listen to your vision,
              understand your style, and bring it to life with precision and
              creativity. From venue selection and decoration to catering
              coordination and on-site management, we handle it all so you can
              focus on what truly matters: celebrating with the people you
              love.
            </p>

            {/* Feature Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-rose/10 flex items-center justify-center shrink-0">
                    <feature.icon className="w-5 h-5 text-rose" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">
                      {feature.title}
                    </h4>
                    <p className="text-muted-foreground text-xs mt-1">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
