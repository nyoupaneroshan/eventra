'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  LayoutDashboard,
  Image,
  Heart,
  Camera,
  MessageSquare,
  CreditCard,
  Mail,
  Phone,
  Settings,
  LogOut,
  Menu,
} from 'lucide-react';
import { isAdminAuthenticated, clearAdminToken } from '@/lib/api';

const sidebarLinks = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '#/admin' },
  { label: 'Hero Slides', icon: Image, href: '#/admin/hero' },
  { label: 'Services', icon: Heart, href: '#/admin/services' },
  { label: 'Portfolio', icon: Camera, href: '#/admin/portfolio' },
  { label: 'Testimonials', icon: MessageSquare, href: '#/admin/testimonials' },
  { label: 'Pricing', icon: CreditCard, href: '#/admin/pricing' },
  { label: 'Inquiries', icon: Mail, href: '#/admin/inquiries' },
  { label: 'Contact Info', icon: Phone, href: '#/admin/contact' },
  { label: 'Settings', icon: Settings, href: '#/admin/settings' },
];

function SidebarContent({ onNavigate, onLogout }: { onNavigate: () => void; onLogout: () => void }) {
  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose flex items-center justify-center overflow-hidden">
            <img src="/logo-eventra.png" alt="Eventra" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">Eventra</h2>
            <p className="text-slate-400 text-xs">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {sidebarLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors duration-200 text-sm font-medium"
            onClick={onNavigate}
          >
            <link.icon className="w-5 h-5 shrink-0" />
            {link.label}
          </a>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <a
          href="#/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors duration-200 text-sm"
        >
          View Website
        </a>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors duration-200 text-sm w-full mt-1"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const authed = typeof window !== 'undefined' && isAdminAuthenticated();

  const redirect = useCallback(() => {
    if (typeof window !== 'undefined' && !isAdminAuthenticated()) {
      window.location.hash = '#/admin/login';
    }
  }, []);

  useEffect(() => {
    redirect();
  }, [redirect]);

  const handleLogout = () => {
    clearAdminToken();
    window.location.hash = '#/admin/login';
  };

  const handleNavigate = () => {
    setSidebarOpen(false);
  };

  if (!authed) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-slate-900">
        <SidebarContent onNavigate={handleNavigate} onLogout={handleLogout} />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-slate-900 border-none">
          <SidebarContent onNavigate={handleNavigate} onLogout={handleLogout} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-border shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
              </Sheet>
              <h1 className="text-lg font-semibold text-foreground">Admin Panel</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:block">Admin</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
