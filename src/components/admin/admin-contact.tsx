'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Phone, Mail, MapPin, MessageCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getContactInfo, updateContactInfo } from '@/lib/api';
import type { ContactInfoData } from '@/lib/types';

export default function AdminContact() {
  const [contact, setContact] = useState<Partial<ContactInfoData>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    getContactInfo()
      .then((data) => setContact(data))
      .catch(() => setContact({}))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updateContactInfo(contact);
      setContact(result);
      toast({ title: 'Saved', description: 'Contact info updated successfully' });
    } catch {
      toast({ title: 'Error', description: 'Failed to save contact info', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Contact Info</h2>
        <Card>
          <CardContent className="p-6 space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Contact Info</h2>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1"><Phone className="w-3 h-3" /> Phone</Label>
              <Input value={contact.phone || ''} onChange={(e) => setContact({ ...contact, phone: e.target.value })} placeholder="+977 98XXXXXXXX" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1"><Mail className="w-3 h-3" /> Email</Label>
              <Input value={contact.email || ''} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="hello@eventra.com.np" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Address</Label>
            <Input value={contact.address || ''} onChange={(e) => setContact({ ...contact, address: e.target.value })} placeholder="Butwal, Rupandehi, Nepal" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> WhatsApp Number</Label>
              <Input value={contact.whatsapp || ''} onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })} placeholder="97798XXXXXXXX" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1"><Phone className="w-3 h-3" /> Viber Number</Label>
              <Input value={contact.viber || ''} onChange={(e) => setContact({ ...contact, viber: e.target.value })} placeholder="97798XXXXXXXX" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-1"><Clock className="w-3 h-3" /> Working Hours</Label>
            <Input value={contact.workingHours || ''} onChange={(e) => setContact({ ...contact, workingHours: e.target.value })} placeholder="Sun - Fri: 10 AM - 6 PM" />
          </div>
          <div className="pt-2">
            <Button onClick={handleSave} className="bg-rose hover:bg-rose-dark text-white" disabled={saving}>
              {saving && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
