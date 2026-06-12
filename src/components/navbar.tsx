'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Phone, Shield } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Blog', href: '/blog' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = () => {
    setMobileOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-full bg-rose flex items-center justify-center overflow-hidden">
              <img
                src="/logo-eventra.png"
                alt="Eventra"
                className="w-full h-full object-cover"
              />
            </div>
            <span
              className={`text-2xl font-bold tracking-tight transition-colors duration-300 ${
                scrolled ? 'text-rose-dark' : 'text-white'
              }`}
            >
              Eventra
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-rose/10 ${
                  pathname === link.href
                    ? scrolled ? 'text-rose-dark bg-rose/10' : 'text-white bg-white/10'
                    : scrolled
                      ? 'text-foreground hover:text-rose-dark'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Button
              size="sm"
              className="ml-3 bg-rose hover:bg-rose-dark text-white"
              asChild
            >
              <Link href="/contact">
                <Phone className="w-4 h-4 mr-1" />
                Get Quote
              </Link>
            </Button>
            <Link
              href="/admin"
              className={`ml-2 px-2 py-1 rounded text-xs font-medium transition-colors duration-200 ${
                scrolled
                  ? 'text-muted-foreground hover:text-rose-dark'
                  : 'text-white/40 hover:text-white/70'
              }`}
              title="Admin Panel"
            >
              <Shield className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className={scrolled ? 'text-foreground' : 'text-white'}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <div className="flex items-center justify-between p-4 border-b">
                <span className="text-xl font-bold text-rose-dark">
                  Eventra
                </span>
              </div>
              <div className="flex flex-col p-4 gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={handleNavClick}
                    className={`px-4 py-3 rounded-md text-base font-medium transition-colors ${
                      pathname === link.href
                        ? 'bg-rose/10 text-rose-dark'
                        : 'text-foreground hover:bg-rose/10 hover:text-rose-dark'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-4 pt-4 border-t">
                  <Button
                    className="w-full bg-rose hover:bg-rose-dark text-white"
                    asChild
                  >
                    <Link href="/contact" onClick={handleNavClick}>
                      <Phone className="w-4 h-4 mr-2" />
                      Get Free Quote
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
