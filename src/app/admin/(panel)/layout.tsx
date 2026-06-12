'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAdminAuthenticated, clearAdminToken, getAdminRole, isEditor, isAdmin } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  LayoutDashboard, Image, Heart, Camera, MessageSquare, CreditCard,
  Mail, Phone, Settings, LogOut, Menu, BookOpen, HelpCircle, FileText, Users,
  Eye, Shield, ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import type { UserRole } from '@/lib/api';

interface SidebarLink {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  minRole: UserRole; // minimum role required to see this link
}

const sidebarLinks: SidebarLink[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin', minRole: 'viewer' },
  { label: 'Hero Slides', icon: Image, href: '/admin/hero', minRole: 'viewer' },
  { label: 'Services', icon: Heart, href: '/admin/services', minRole: 'viewer' },
  { label: 'Portfolio', icon: Camera, href: '/admin/portfolio', minRole: 'viewer' },
  { label: 'Testimonials', icon: MessageSquare, href: '/admin/testimonials', minRole: 'viewer' },
  { label: 'Pricing', icon: CreditCard, href: '/admin/pricing', minRole: 'viewer' },
  { label: 'Blog', icon: BookOpen, href: '/admin/blog', minRole: 'viewer' },
  { label: 'FAQ', icon: HelpCircle, href: '/admin/faq', minRole: 'viewer' },
  { label: 'Inquiries', icon: Mail, href: '/admin/inquiries', minRole: 'viewer' },
  { label: 'Contact Info', icon: Phone, href: '/admin/contact', minRole: 'viewer' },
  { label: 'Legal Pages', icon: FileText, href: '/admin/legal', minRole: 'viewer' },
  { label: 'Users', icon: Users, href: '/admin/users', minRole: 'admin' },
  { label: 'Settings', icon: Settings, href: '/admin/settings', minRole: 'admin' },
];

const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin: 3,
  editor: 2,
  viewer: 1,
};

function RoleBadge({ role }: { role: UserRole | null }) {
  if (!role) return null;
  const config: Record<UserRole, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
    admin: { label: 'Admin', color: 'bg-rose text-white', icon: Shield },
    editor: { label: 'Editor', color: 'bg-blue-500 text-white', icon: ShieldCheck },
    viewer: { label: 'Viewer', color: 'bg-slate-500 text-white', icon: Eye },
  };
  const c = config[role];
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${c.color}`}>
      <Icon className="w-3 h-3" />
      {c.label}
    </span>
  );
}

function SidebarContent({ onNavigate, onLogout, role }: { onNavigate: () => void; onLogout: () => void; role: UserRole | null }) {
  const pathname = usePathname();

  const visibleLinks = sidebarLinks.filter((link) => {
    const userLevel = ROLE_HIERARCHY[role ?? 'viewer'] ?? 0;
    const requiredLevel = ROLE_HIERARCHY[link.minRole] ?? 0;
    return userLevel >= requiredLevel;
  });

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
            <div className="mt-0.5"><RoleBadge role={role} /></div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {visibleLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 text-sm font-medium ${
                isActive
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <link.icon className="w-5 h-5 shrink-0" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors duration-200 text-sm"
        >
          View Website
        </Link>
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

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);
  const router = useRouter();

  useEffect(() => {
    const isAuth = isAdminAuthenticated();
    setAuthed(isAuth);
    if (isAuth) {
      setRole(getAdminRole());
    }
    setChecked(true);
    if (!isAuth) {
      router.push('/admin/login');
    }
  }, [router]);

  const handleLogout = () => {
    clearAdminToken();
    router.push('/admin/login');
  };

  const handleNavigate = () => {
    setSidebarOpen(false);
  };

  if (!checked) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-rose border-t-transparent rounded-full"></div></div>;
  }

  if (!authed) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-slate-900">
        <SidebarContent onNavigate={handleNavigate} onLogout={handleLogout} role={role} />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-slate-900 border-none">
          <SidebarContent onNavigate={handleNavigate} onLogout={handleLogout} role={role} />
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
              <RoleBadge role={role} />
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
