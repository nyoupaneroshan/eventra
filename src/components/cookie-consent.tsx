'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Cookie } from 'lucide-react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !localStorage.getItem('cookie_consent');
  });

  const accept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg p-4 animate-fade-in-up">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-3 flex-1">
          <Cookie className="w-6 h-6 text-gold shrink-0" />
          <p className="text-sm text-muted-foreground">We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies. <a href="#/cookie-policy" className="text-rose-dark hover:underline">Learn more</a></p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={decline}>Decline</Button>
          <Button size="sm" onClick={accept} className="bg-rose hover:bg-rose-dark text-white">Accept</Button>
        </div>
      </div>
    </div>
  );
}
