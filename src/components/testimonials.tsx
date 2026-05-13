'use client';

import { useEffect, useRef, useState } from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Srijana Sharma',
    role: 'Bride, Wedding Client',
    text: 'Eventra made our wedding day absolutely perfect. From the stunning floral arrangements to the seamless coordination, every detail was handled with care and professionalism. We could truly enjoy our special day without any stress. The team went above and beyond to make our vision come to life, and the results exceeded our expectations in every way.',
    rating: 5,
    initials: 'SS',
  },
  {
    name: 'Rajesh Poudel',
    role: 'CEO, TechVenture Pvt. Ltd.',
    text: 'We hired Eventra for our annual corporate conference, and they delivered an outstanding experience. The stage design, audiovisual setup, and guest management were flawless. Our attendees were impressed, and we have already booked them for next year. Their attention to detail and professional approach sets them apart from other event planners we have worked with.',
    rating: 5,
    initials: 'RP',
  },
  {
    name: 'Anita Gurung',
    role: 'Birthday Celebration Client',
    text: 'I wanted a special 30th birthday celebration, and Eventra created a magical evening that I will never forget. The decorations, the music, the cake setup — everything was coordinated beautifully. My friends are still talking about how amazing the party was. The team was responsive, creative, and truly understood the vibe I was going for.',
    rating: 5,
    initials: 'AG',
  },
  {
    name: 'Bikash Thapa',
    role: 'Engagement Party Client',
    text: 'Our engagement party was everything we dreamed of and more. The Eventra team took our vague ideas and transformed them into a stunning celebration. The venue decoration was elegant, the lighting was perfect, and the flow of the evening was seamless. They even helped us with last-minute changes without any hassle. Highly recommended for any special occasion!',
    rating: 5,
    initials: 'BT',
  },
];

export default function Testimonials() {
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
      id="testimonials"
      ref={sectionRef}
      className="section-padding bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`text-center mb-12 md:mb-16 transition-all duration-700 ${
            isVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          <span className="inline-block px-4 py-1.5 bg-rose/10 text-rose-dark rounded-full text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            What Our <span className="text-rose">Clients Say</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Do not just take our word for it. Here is what our happy clients
            have to say about their experience working with Eventra.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`relative p-6 md:p-8 rounded-2xl bg-champagne/50 border border-border hover:shadow-lg transition-all duration-500 ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Quote icon */}
              <div className="absolute top-6 right-6 opacity-10">
                <Quote className="w-16 h-16 text-rose" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-gold text-gold"
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6 relative z-10">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-rose/10 flex items-center justify-center">
                  <span className="text-rose-dark font-bold text-sm">
                    {testimonial.initials}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">
                    {testimonial.name}
                  </h4>
                  <p className="text-muted-foreground text-xs">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
