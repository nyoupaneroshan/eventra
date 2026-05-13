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
import EditableList from './editable-list';
import { getServices, createService, updateService, deleteService } from '@/lib/api';
import type { Service } from '@/lib/types';

const emptyService: Partial<Service> = {
  title: '',
  description: '',
  icon: 'Heart',
  image: '',
  features: '[]',
  order: 0,
  active: true,
};

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Service>>(emptyService);
  const [editFeatures, setEditFeatures] = useState<string[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchData = () => {
    setLoading(true);
    getServices()
      .then((data) => setServices(data.sort((a, b) => a.order - b.order)))
      .catch(() => toast({ title: 'Error', description: 'Failed to load services', variant: 'destructive' }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => {
    setEditing(emptyService);
    setEditFeatures([]);
    setIsEdit(false);
    setFormOpen(true);
  };

  const openEdit = (service: Service) => {
    setEditing({ ...service });
    try {
      setEditFeatures(JSON.parse(service.features || '[]'));
    } catch {
      setEditFeatures([]);
    }
    setIsEdit(true);
    setFormOpen(true);
  };

  const openDelete = (service: Service) => {
    setDeleteTarget(service);
    setDeleteOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = { ...editing, features: JSON.stringify(editFeatures) };
      if (isEdit && editing.id) {
        await updateService(editing.id, data);
        toast({ title: 'Updated', description: 'Service updated successfully' });
      } else {
        await createService(data);
        toast({ title: 'Created', description: 'Service created successfully' });
      }
      setFormOpen(false);
      fetchData();
    } catch {
      toast({ title: 'Error', description: 'Failed to save service', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteService(deleteTarget.id);
      toast({ title: 'Deleted', description: 'Service deleted successfully' });
      setDeleteOpen(false);
      fetchData();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete service', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Services</h2>
        <Button onClick={openAdd} size="sm" className="bg-rose hover:bg-rose-dark text-white">
          <Plus className="w-4 h-4 mr-1" /> Add Service
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No services yet. Click &ldquo;Add Service&rdquo; to create one.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {services.map((service) => (
            <Card key={service.id}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  {service.image && <img src={service.image} alt={service.title} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{service.title}</h3>
                    {!service.active && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Inactive</span>}
                  </div>
                  <p className="text-muted-foreground text-sm truncate">{service.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">Icon: {service.icon} | Order: {service.order}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" size="sm" onClick={() => openEdit(service)}>
                    <Pencil className="w-3 h-3 mr-1" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => openDelete(service)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AdminFormDialog
        title={isEdit ? 'Edit Service' : 'Add Service'}
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
          <Label>Description</Label>
          <Textarea value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} />
        </div>
        <div className="space-y-2">
          <Label>Icon</Label>
          <Select value={editing.icon || 'Heart'} onValueChange={(v) => setEditing({ ...editing, icon: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Heart">Heart (Wedding)</SelectItem>
              <SelectItem value="Building2">Building (Corporate)</SelectItem>
              <SelectItem value="PartyPopper">Party Popper (Party)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Image</Label>
          <ImageUpload value={editing.image || ''} onChange={(url) => setEditing({ ...editing, image: url })} />
        </div>
        <div className="space-y-2">
          <Label>Features</Label>
          <EditableList items={editFeatures} onChange={setEditFeatures} placeholder="Add a feature..." />
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
        itemName={deleteTarget?.title || 'this service'}
      />
    </div>
  );
}
