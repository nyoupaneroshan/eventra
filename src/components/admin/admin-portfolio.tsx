'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdminFormDialog from './admin-form-dialog';
import AdminDeleteDialog from './admin-delete-dialog';
import ImageUpload from './image-upload';
import { getPortfolioItems, createPortfolioItem, updatePortfolioItem, deletePortfolioItem } from '@/lib/api';
import type { PortfolioItem } from '@/lib/types';

const emptyItem: Partial<PortfolioItem> = {
  title: '',
  category: 'Wedding',
  image: '',
  description: '',
  order: 0,
  active: true,
};

export default function AdminPortfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<PortfolioItem>>(emptyItem);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PortfolioItem | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchData = () => {
    setLoading(true);
    getPortfolioItems()
      .then((data) => setItems(data.sort((a, b) => a.order - b.order)))
      .catch(() => toast({ title: 'Error', description: 'Failed to load portfolio', variant: 'destructive' }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => {
    setEditing(emptyItem);
    setIsEdit(false);
    setFormOpen(true);
  };

  const openEdit = (item: PortfolioItem) => {
    setEditing({ ...item });
    setIsEdit(true);
    setFormOpen(true);
  };

  const openDelete = (item: PortfolioItem) => {
    setDeleteTarget(item);
    setDeleteOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isEdit && editing.id) {
        await updatePortfolioItem(editing.id, editing);
        toast({ title: 'Updated', description: 'Portfolio item updated successfully' });
      } else {
        await createPortfolioItem(editing);
        toast({ title: 'Created', description: 'Portfolio item created successfully' });
      }
      setFormOpen(false);
      fetchData();
    } catch {
      toast({ title: 'Error', description: 'Failed to save portfolio item', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deletePortfolioItem(deleteTarget.id);
      toast({ title: 'Deleted', description: 'Portfolio item deleted successfully' });
      setDeleteOpen(false);
      fetchData();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete portfolio item', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Portfolio</h2>
        <Button onClick={openAdd} size="sm" className="bg-rose hover:bg-rose-dark text-white">
          <Plus className="w-4 h-4 mr-1" /> Add Item
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No portfolio items yet. Click &ldquo;Add Item&rdquo; to create one.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden group">
              <div className="aspect-square relative bg-gray-100">
                {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover" />}
                {!item.active && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">Inactive</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button variant="outline" size="sm" className="bg-white" onClick={() => openEdit(item)}>
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button variant="outline" size="sm" className="bg-white text-destructive hover:text-destructive" onClick={() => openDelete(item)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-3">
                <h3 className="font-semibold text-sm truncate">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.category} | Order: {item.order}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AdminFormDialog
        title={isEdit ? 'Edit Portfolio Item' : 'Add Portfolio Item'}
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
          <Label>Category</Label>
          <Select value={editing.category || 'Wedding'} onValueChange={(v) => setEditing({ ...editing, category: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Wedding">Wedding</SelectItem>
              <SelectItem value="Corporate">Corporate</SelectItem>
              <SelectItem value="Party">Party</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Image</Label>
          <ImageUpload value={editing.image || ''} onChange={(url) => setEditing({ ...editing, image: url })} />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} />
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
        itemName={deleteTarget?.title || 'this item'}
      />
    </div>
  );
}
