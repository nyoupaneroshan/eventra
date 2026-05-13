'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Pencil, Trash2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdminFormDialog from './admin-form-dialog';
import AdminDeleteDialog from './admin-delete-dialog';
import EditableList from './editable-list';
import { getPricingPackages, createPricingPackage, updatePricingPackage, deletePricingPackage } from '@/lib/api';
import type { PricingPackage } from '@/lib/types';

const emptyPackage: Partial<PricingPackage> = {
  name: '',
  price: '',
  description: '',
  features: '[]',
  notIncluded: '[]',
  popular: false,
  color: 'gold',
  order: 0,
  active: true,
};

export default function AdminPricing() {
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<PricingPackage>>(emptyPackage);
  const [editFeatures, setEditFeatures] = useState<string[]>([]);
  const [editNotIncluded, setEditNotIncluded] = useState<string[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PricingPackage | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchData = () => {
    setLoading(true);
    getPricingPackages()
      .then((data) => setPackages(data.sort((a, b) => a.order - b.order)))
      .catch(() => toast({ title: 'Error', description: 'Failed to load packages', variant: 'destructive' }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => {
    setEditing(emptyPackage);
    setEditFeatures([]);
    setEditNotIncluded([]);
    setIsEdit(false);
    setFormOpen(true);
  };

  const openEdit = (pkg: PricingPackage) => {
    setEditing({ ...pkg });
    try { setEditFeatures(JSON.parse(pkg.features || '[]')); } catch { setEditFeatures([]); }
    try { setEditNotIncluded(JSON.parse(pkg.notIncluded || '[]')); } catch { setEditNotIncluded([]); }
    setIsEdit(true);
    setFormOpen(true);
  };

  const openDelete = (pkg: PricingPackage) => {
    setDeleteTarget(pkg);
    setDeleteOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = { ...editing, features: JSON.stringify(editFeatures), notIncluded: JSON.stringify(editNotIncluded) };
      if (isEdit && editing.id) {
        await updatePricingPackage(editing.id, data);
        toast({ title: 'Updated', description: 'Package updated successfully' });
      } else {
        await createPricingPackage(data);
        toast({ title: 'Created', description: 'Package created successfully' });
      }
      setFormOpen(false);
      fetchData();
    } catch {
      toast({ title: 'Error', description: 'Failed to save package', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deletePricingPackage(deleteTarget.id);
      toast({ title: 'Deleted', description: 'Package deleted successfully' });
      setDeleteOpen(false);
      fetchData();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete package', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Pricing Packages</h2>
        <Button onClick={openAdd} size="sm" className="bg-rose hover:bg-rose-dark text-white">
          <Plus className="w-4 h-4 mr-1" /> Add Package
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : packages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No pricing packages yet. Click &ldquo;Add Package&rdquo; to create one.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {packages.map((pkg) => {
            const features: string[] = (() => { try { return JSON.parse(pkg.features || '[]'); } catch { return []; } })();
            return (
              <Card key={pkg.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{pkg.name}</h3>
                        {pkg.popular && <span className="text-xs bg-rose text-white px-2 py-0.5 rounded">Popular</span>}
                        {!pkg.active && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Inactive</span>}
                      </div>
                      <p className="text-lg font-bold text-foreground">{pkg.price}</p>
                      <p className="text-muted-foreground text-sm truncate">{pkg.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {features.slice(0, 3).map((f, i) => (
                          <span key={i} className="inline-flex items-center gap-1 text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded">
                            <CheckCircle2 className="w-3 h-3" /> {f}
                          </span>
                        ))}
                        {features.length > 3 && <span className="text-xs text-muted-foreground">+{features.length - 3} more</span>}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button variant="outline" size="sm" onClick={() => openEdit(pkg)}>
                        <Pencil className="w-3 h-3 mr-1" /> Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => openDelete(pkg)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <AdminFormDialog
        title={isEdit ? 'Edit Package' : 'Add Package'}
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
          <Label>Price</Label>
          <Input value={editing.price || ''} onChange={(e) => setEditing({ ...editing, price: e.target.value })} placeholder="e.g. NPR 55,000" />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} />
        </div>
        <div className="space-y-2">
          <Label>Features</Label>
          <EditableList items={editFeatures} onChange={setEditFeatures} placeholder="Add a feature..." />
        </div>
        <div className="space-y-2">
          <Label>Not Included</Label>
          <EditableList items={editNotIncluded} onChange={setEditNotIncluded} placeholder="Add excluded item..." />
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={editing.popular || false} onCheckedChange={(checked) => setEditing({ ...editing, popular: checked })} />
          <Label>Popular</Label>
        </div>
        <div className="space-y-2">
          <Label>Color Theme</Label>
          <Input value={editing.color || 'gold'} onChange={(e) => setEditing({ ...editing, color: e.target.value })} placeholder="gold or rose" />
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
        itemName={deleteTarget?.name || 'this package'}
      />
    </div>
  );
}
