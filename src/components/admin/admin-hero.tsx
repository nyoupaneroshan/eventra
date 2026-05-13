'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdminFormDialog from './admin-form-dialog';
import AdminDeleteDialog from './admin-delete-dialog';
import ImageUpload from './image-upload';
import { getHeroSlides, createHeroSlide, updateHeroSlide, deleteHeroSlide } from '@/lib/api';
import type { HeroSlide } from '@/lib/types';

const emptySlide: Partial<HeroSlide> = {
  title: '',
  subtitle: '',
  image: '',
  order: 0,
  active: true,
};

export default function AdminHero() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<HeroSlide>>(emptySlide);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<HeroSlide | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchData = () => {
    setLoading(true);
    getHeroSlides()
      .then((data) => setSlides(data.sort((a, b) => a.order - b.order)))
      .catch(() => toast({ title: 'Error', description: 'Failed to load slides', variant: 'destructive' }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => {
    setEditing(emptySlide);
    setIsEdit(false);
    setFormOpen(true);
  };

  const openEdit = (slide: HeroSlide) => {
    setEditing({ ...slide });
    setIsEdit(true);
    setFormOpen(true);
  };

  const openDelete = (slide: HeroSlide) => {
    setDeleteTarget(slide);
    setDeleteOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isEdit && editing.id) {
        await updateHeroSlide(editing.id, editing);
        toast({ title: 'Updated', description: 'Slide updated successfully' });
      } else {
        await createHeroSlide(editing);
        toast({ title: 'Created', description: 'Slide created successfully' });
      }
      setFormOpen(false);
      fetchData();
    } catch {
      toast({ title: 'Error', description: 'Failed to save slide', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteHeroSlide(deleteTarget.id);
      toast({ title: 'Deleted', description: 'Slide deleted successfully' });
      setDeleteOpen(false);
      fetchData();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete slide', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Hero Slides</h2>
        <Button onClick={openAdd} size="sm" className="bg-rose hover:bg-rose-dark text-white">
          <Plus className="w-4 h-4 mr-1" /> Add Slide
        </Button>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : slides.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No hero slides yet. Click &ldquo;Add Slide&rdquo; to create one.
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {slides.map((slide) => (
            <Card key={slide.id} className="overflow-hidden">
              <div className="h-36 bg-gray-100 relative">
                {slide.image && (
                  <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                )}
                {!slide.active && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded">Inactive</span>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground truncate">{slide.title}</h3>
                <p className="text-muted-foreground text-sm truncate">{slide.subtitle}</p>
                <p className="text-xs text-muted-foreground mt-1">Order: {slide.order}</p>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" onClick={() => openEdit(slide)}>
                    <Pencil className="w-3 h-3 mr-1" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => openDelete(slide)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AdminFormDialog
        title={isEdit ? 'Edit Slide' : 'Add Slide'}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSave}
        loading={saving}
      >
        <div className="space-y-2">
          <Label>Title</Label>
          <Input value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Subtitle</Label>
          <Textarea value={editing.subtitle || ''} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} rows={3} />
        </div>
        <div className="space-y-2">
          <Label>Image</Label>
          <ImageUpload value={editing.image || ''} onChange={(url) => setEditing({ ...editing, image: url })} />
        </div>
        <div className="space-y-2">
          <Label>Order</Label>
          <Input type="number" value={editing.order || 0} onChange={(e) => setEditing({ ...editing, order: parseInt(e.target.value) || 0 })} />
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={editing.active !== false} onCheckedChange={(checked) => setEditing({ ...editing, active: checked })} />
          <Label>Active</Label>
        </div>
      </AdminFormDialog>

      <AdminDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        itemName={deleteTarget?.title || 'this slide'}
      />
    </div>
  );
}
