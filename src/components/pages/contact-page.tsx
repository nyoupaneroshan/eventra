'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  Loader2,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import PageBanner from '@/components/page-banner';
import { submitInquiry, getContactInfo } from '@/lib/api';
import type { ContactInfoData, InquiryFormData } from '@/lib/types';

const eventTypes = [
  'Wedding',
  'Corporate Event',
  'Birthday Party',
  'Engagement Party',
  'Anniversary Celebration',
  'Other',
];

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState<ContactInfoData | null>(null);
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<InquiryFormData>({
    name: '',
    phone: '',
    email: '',
    eventType: '',
    eventDate: '',
    message: '',
  });

  useEffect(() => {
    getContactInfo()
      .then((data) => setContactInfo(data))
      .catch(() => setContactInfo(null))
      .finally(() => setLoadingInfo(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await submitInquiry(formData);
      setIsSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        eventType: '',
        eventDate: '',
        message: '',
      });
      setTimeout(() => setIsSuccess(false), 5000);
    } catch {
      setError('Something went wrong. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const phone = contactInfo?.phone || '+977 98XXXXXXXX';
  const email = contactInfo?.email || 'hello@eventra.com.np';
  const address = contactInfo?.address || 'Butwal, Rupandehi, Nepal';
  const workingHours = contactInfo?.workingHours || 'Sun - Fri: 10 AM - 6 PM';
  const whatsapp = contactInfo?.whatsapp || '97798XXXXXXXX';
  const viber = contactInfo?.viber || '97798XXXXXXXX';

  return (
    <div>
      <PageBanner title="Contact Us" subtitle="Ready to plan your next event? Reach out to us and let us make it happen." />
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-16">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-border p-6 md:p-8 shadow-sm">
                {isSuccess ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Inquiry Submitted!</h3>
                    <p className="text-muted-foreground">
                      Thank you for reaching out. We will get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+977 98XXXXXXXX"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                          className="rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="rounded-lg"
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="eventType">Event Type *</Label>
                        <Select
                          value={formData.eventType}
                          onValueChange={(value) => setFormData({ ...formData, eventType: value })}
                        >
                          <SelectTrigger className="rounded-lg">
                            <SelectValue placeholder="Select event type" />
                          </SelectTrigger>
                          <SelectContent>
                            {eventTypes.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="eventDate">Event Date *</Label>
                        <Input
                          id="eventDate"
                          type="date"
                          value={formData.eventDate}
                          onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                          required
                          className="rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us about your event vision, guest count, or any special requirements..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={4}
                        className="rounded-lg resize-none"
                      />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-rose hover:bg-rose-dark text-white rounded-full text-base"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Check Availability Now
                          <Send className="ml-2 w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2">
              {loadingInfo ? (
                <div className="space-y-6">
                  <Skeleton className="h-48 w-full rounded-2xl" />
                  <Skeleton className="h-36 w-full rounded-2xl" />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="rounded-2xl bg-champagne/80 p-6 space-y-5">
                    <h3 className="text-lg font-bold text-foreground">Quick Contact</h3>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-rose/10 flex items-center justify-center shrink-0">
                        <Phone className="w-5 h-5 text-rose" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">Phone</p>
                        <p className="text-muted-foreground text-sm">{phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-rose/10 flex items-center justify-center shrink-0">
                        <Mail className="w-5 h-5 text-rose" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">Email</p>
                        <p className="text-muted-foreground text-sm">{email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-rose/10 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-rose" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">Office</p>
                        <p className="text-muted-foreground text-sm">{address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-rose/10 flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5 text-rose" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">Working Hours</p>
                        <p className="text-muted-foreground text-sm">{workingHours}</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-champagne/80 p-6 space-y-4">
                    <h3 className="text-lg font-bold text-foreground">Message Us Directly</h3>
                    <div className="space-y-3">
                      <a
                        href={`https://wa.me/${whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl bg-green-50 hover:bg-green-100 border border-green-200 transition-colors duration-300"
                      >
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                          <MessageCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-green-800 text-sm">WhatsApp</p>
                          <p className="text-green-600 text-xs">Chat with us instantly</p>
                        </div>
                      </a>
                      <a
                        href={`viber://chat?number=${viber}`}
                        className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors duration-300"
                      >
                        <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                          <Phone className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-purple-800 text-sm">Viber</p>
                          <p className="text-purple-600 text-xs">Message us on Viber</p>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
