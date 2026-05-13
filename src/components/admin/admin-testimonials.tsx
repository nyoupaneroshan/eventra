'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdminFormDialog from './admin-form-dialog';
import AdminDeleteDialog from './admin-delete-dialog';
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '@/lib/api';
import type { Testimonial } from '@/lib/types';

const emptyTestimonial: Partial<Testimonial> = {
  name: '',
  role: '',
  text: '',
  rating: 5,
  initials: '',
  order: 0,
  active: true,
};

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Testimonial>>(emptyTestimonial);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchData = () => {
    setLoading(true);
    getTestimonials()
      .then((data) => setTestimonials(data.sort((a, b) => a.order - b.order)))
      .catch(() => toast({ title: 'Error', description: 'Failed to load testimonials', variant: 'destructive' }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => {
    setEditing(emptyTestimonial);
    setIsEdit(false);
    setFormOpen(true);
  };

  const openEdit = (testimonial: Testimonial) => {
    setEditing({ ...testimonial });
    setIsEdit(true);
    setFormOpen(true);
  };

  const openDelete = (testimonial: Testimonial) => {
    setDeleteTarget(testimonial);
    setDeleteOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isEdit && editing.id) {
        await updateTestimonial(editing.id, editing);
        toast({ title: 'Updated', description: 'Testimonial updated successfully' });
      } else {
        await createTestimonial(editing);
        toast({ title: 'Created', description: 'Testimonial created successfully' });
      }
      setFormOpen(false);
      fetchData();
    } catch {
      toast({ title: 'Error', description: 'Failed to save testimonial', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTestimonial(deleteTarget.id);
      toast({ title: 'Deleted', description: 'Testimonial deleted successfully' });
      setDeleteOpen(false);
      fetchData();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete testimonial', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Testimonials</h2>
        <Button onClick={openAdd} size="sm" className="bg-rose hover:bg-rose-dark text-white">
          <Plus className="w-4 h-4 mr-1" /> Add Testimonial
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : testimonials.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No testimonials yet. Click &ldquo;Add Testimonial&rdquo; to create one.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-rose/10 flex items-center justify-center shrink-0">
                    <span className="text-rose-dark font-bold text-sm">{testimonial.initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{testimonial.name}</h3>
                      {!testimonial.active && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Inactive</span>}
                    </div>
                    <p className="text-muted-foreground text-xs">{testimonial.role}</p>
                    <div className="flex gap-0.5 my-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-gold text-gold" />
                      ))}
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-2">{testimonial.text}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => openEdit(testimonial)}>
                      <Pencil className="w-3 h-3 mr-1" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => openDelete(testimonial)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AdminFormDialog
        title={isEdit ? 'Edit Testimonial' : 'Add Testimonial'}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSave}
        loading={saving}
      >
        <div className="space-y-2">
          <Label>Name</Label>
          <Input value={editing.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Role</Label>
          <Input value={editing.role || ''} onChange={(e) => setEditing({ ...editing, role: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Testimonial Text</Label>
          <Textarea value={editing.text || ''} onChange={(e) => setEditing({ ...editing, text: e.target.value })} rows={4} />
        </div>
        <div className="space-y-2">
          <Label>Rating (1-5)</Label>
          <Input type="number" min={1} max={5} value={editing.rating || 5} onChange={(e) => setEditing({ ...editing, rating: parseInt(e.target.value) || 5 })} />
        </div>
        <div className="space-y-2">
          <Label>Initials</Label>
          <Input value={editing.initials || ''} onChange={(e) => setEditing({ ...editing, initials: e.target.value })} maxLength={3} placeholder="e.g. SS" />
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
        itemName={deleteTarget?.name || 'this testimonial'}
      />
    </div>
  );
}
