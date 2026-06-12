'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Settings, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getSettings, updateSettings, isAdmin } from '@/lib/api';

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const canEdit = isAdmin();

  useEffect(() => {
    getSettings()
      .then((data) => setSettings(data))
      .catch(() => setSettings({}))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!canEdit) return;
    setSaving(true);
    try {
      await updateSettings(settings);
      toast({ title: 'Saved', description: 'Settings updated successfully' });
    } catch {
      toast({ title: 'Error', description: 'Failed to save settings', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        {!canEdit && (
          <span className="inline-flex items-center gap-1 text-sm text-muted-foreground"><Lock className="w-4 h-4" /> Read-only access</span>
        )}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="w-5 h-5" /> Site Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Brand Name</Label>
            <Input
              value={settings.brandName || ''}
              onChange={(e) => canEdit && setSettings({ ...settings, brandName: e.target.value })}
              placeholder="Eventra"
              disabled={!canEdit}
            />
          </div>
          <div className="space-y-2">
            <Label>Tagline</Label>
            <Input
              value={settings.tagline || ''}
              onChange={(e) => canEdit && setSettings({ ...settings, tagline: e.target.value })}
              placeholder="We Plan, You Celebrate"
              disabled={!canEdit}
            />
          </div>
          {canEdit && (
            <div className="pt-2">
              <Button onClick={handleSave} className="bg-rose hover:bg-rose-dark text-white" disabled={saving}>
                {saving && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
                Save Settings
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
