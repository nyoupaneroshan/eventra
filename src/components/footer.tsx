'use client';

import { Heart, ArrowUp } from 'lucide-react';
import Link from 'next/link';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms-and-conditions' },
  { label: 'Cookie Policy', href: '/cookie-policy' },
  { label: 'Refund Policy', href: '/refund-policy' },
];

const serviceLinks = [
  'Wedding Planning', 'Corporate Events', 'Private Parties',
  'Venue Selection', 'Decoration & Themes', 'Catering Coordination',
];

export default function Footer() {
  const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <footer className="bg-foreground text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-rose flex items-center justify-center overflow-hidden">
                <img src="/logo-eventra.png" alt="Eventra" className="w-full h-full object-cover"/>
              </div>
              <span className="text-2xl font-bold">Eventra</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              Professional event planning services in Butwal, Nepal. We turn
              your ideas into unforgettable experiences — from concept to execution.
            </p>
            <p className="text-white/50 text-xs">&ldquo;We Plan, You Celebrate&rdquo;</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-base mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/70 hover:text-rose-light text-sm transition-colors duration-200">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-base mb-4">Our Services</h4>
            <ul className="space-y-2">
              {serviceLinks.map((service) => (
                <li key={service}><span className="text-white/70 text-sm">{service}</span></li>
              ))}
            </ul>
          </div>

          {/* Legal & Contact */}
          <div>
            <h4 className="font-semibold text-base mb-4">Legal</h4>
            <ul className="space-y-2 mb-6">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/70 hover:text-rose-light text-sm transition-colors duration-200">{link.label}</Link>
                </li>
              ))}
            </ul>
            <h4 className="font-semibold text-base mb-3">Get In Touch</h4>
            <div className="flex gap-3">
              <a href="https://wa.me/97798XXXXXXXX" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-500 transition-colors duration-300" aria-label="WhatsApp">
                <span className="text-xs font-bold">WA</span>
              </a>
              <a href="viber://chat?number=97798XXXXXXXX"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-purple-500 transition-colors duration-300" aria-label="Viber">
                <span className="text-xs font-bold">VB</span>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-rose-light transition-colors duration-300" aria-label="Facebook">
                <span className="text-xs font-bold">FB</span>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-rose-light transition-colors duration-300" aria-label="Instagram">
                <span className="text-xs font-bold">IG</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm flex items-center gap-1">
            &copy; {new Date().getFullYear()} Eventra. Made with <Heart className="w-3 h-3 text-rose fill-rose"/> in Butwal, Nepal
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="text-white/40 hover:text-white/70 text-xs transition-colors">Privacy</Link>
            <Link href="/terms-and-conditions" className="text-white/40 hover:text-white/70 text-xs transition-colors">Terms</Link>
            <button onClick={scrollToTop}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-rose flex items-center justify-center transition-colors duration-300" aria-label="Scroll to top">
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
