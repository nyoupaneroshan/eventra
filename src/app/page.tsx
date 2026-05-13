'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import HomePage from '@/components/pages/home-page';
import AboutPage from '@/components/pages/about-page';
import ServicesPage from '@/components/pages/services-page';
import PortfolioPage from '@/components/pages/portfolio-page';
import TestimonialsPage from '@/components/pages/testimonials-page';
import PricingPage from '@/components/pages/pricing-page';
import ContactPage from '@/components/pages/contact-page';
import AdminLogin from '@/components/admin/admin-login';
import AdminLayout from '@/components/admin/admin-layout';
import AdminDashboard from '@/components/admin/admin-dashboard';
import AdminHero from '@/components/admin/admin-hero';
import AdminServices from '@/components/admin/admin-services';
import AdminPortfolio from '@/components/admin/admin-portfolio';
import AdminTestimonials from '@/components/admin/admin-testimonials';
import AdminPricing from '@/components/admin/admin-pricing';
import AdminInquiries from '@/components/admin/admin-inquiries';
import AdminContact from '@/components/admin/admin-contact';
import AdminSettings from '@/components/admin/admin-settings';

function getHash(): string {
  if (typeof window === 'undefined') return '';
  return window.location.hash.replace('#', '') || '/';
}

function PublicPage({ route }: { route: string }) {
  switch (route) {
    case '/':
    case '':
      return <HomePage />;
    case '/about':
      return <AboutPage />;
    case '/services':
      return <ServicesPage />;
    case '/portfolio':
      return <PortfolioPage />;
    case '/testimonials':
      return <TestimonialsPage />;
    case '/pricing':
      return <PricingPage />;
    case '/contact':
      return <ContactPage />;
    default:
      return <HomePage />;
  }
}

function AdminPage({ route }: { route: string }) {
  switch (route) {
    case '/admin/login':
      return <AdminLogin />;
    case '/admin':
      return (
        <AdminLayout>
          <AdminDashboard />
        </AdminLayout>
      );
    case '/admin/hero':
      return (
        <AdminLayout>
          <AdminHero />
        </AdminLayout>
      );
    case '/admin/services':
      return (
        <AdminLayout>
          <AdminServices />
        </AdminLayout>
      );
    case '/admin/portfolio':
      return (
        <AdminLayout>
          <AdminPortfolio />
        </AdminLayout>
      );
    case '/admin/testimonials':
      return (
        <AdminLayout>
          <AdminTestimonials />
        </AdminLayout>
      );
    case '/admin/pricing':
      return (
        <AdminLayout>
          <AdminPricing />
        </AdminLayout>
      );
    case '/admin/inquiries':
      return (
        <AdminLayout>
          <AdminInquiries />
        </AdminLayout>
      );
    case '/admin/contact':
      return (
        <AdminLayout>
          <AdminContact />
        </AdminLayout>
      );
    case '/admin/settings':
      return (
        <AdminLayout>
          <AdminSettings />
        </AdminLayout>
      );
    default:
      return <AdminLogin />;
  }
}

export default function Home() {
  const [hash, setHash] = useState(getHash);

  useEffect(() => {
    const handleHashChange = () => {
      const newHash = getHash();
      setHash(newHash);
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const route = hash.startsWith('/') ? hash : `/${hash}`;
  const isAdmin = route.startsWith('/admin');

  if (isAdmin) {
    return (
      <div className="min-h-screen">
        <AdminPage route={route} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <PublicPage route={route} />
      </main>
      <Footer />
    </div>
  );
}
