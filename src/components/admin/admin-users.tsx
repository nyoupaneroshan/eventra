'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Pencil, Trash2, Shield, Users } from 'lucide-react';
import { getAdminUsers, createAdminUser, updateAdminUser, deleteAdminUser } from '@/lib/api';
import type { AdminUser } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import AdminDeleteDialog from '@/components/admin/admin-delete-dialog';

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [deleting, setDeleting] = useState<AdminUser | null>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'admin' });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const load = () => { getAdminUsers().then(setUsers).catch(() => setUsers([])).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({ name: '', email: '', password: '', role: 'admin' }); setDialogOpen(true); };
  const openEdit = (u: AdminUser) => { setEditing(u); setForm({ name: u.name, email: u.email, password: '', role: u.role }); setDialogOpen(true); };
  const openDelete = (u: AdminUser) => { setDeleting(u); setDeleteOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        const data: Record<string, unknown> = { name: form.name, email: form.email, role: form.role };
        if (form.password) data.password = form.password;
        await updateAdminUser(editing.id, data);
        toast({ title: 'User updated' });
      } else {
        if (!form.password) { toast({ title: 'Password required', variant: 'destructive' }); setSaving(false); return; }
        await createAdminUser({ name: form.name, email: form.email, password: form.password, role: form.role });
        toast({ title: 'User created' });
      }
      setDialogOpen(false); load();
    } catch (e) { toast({ title: 'Error', description: e instanceof Error ? e.message : 'Failed', variant: 'destructive' }); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try { await deleteAdminUser(deleting.id); toast({ title: 'User deleted' }); setDeleteOpen(false); load(); }
    catch { toast({ title: 'Error', variant: 'destructive' }); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Admin Users</h2>
        <Button onClick={openCreate} className="bg-rose hover:bg-rose-dark text-white"><UserPlus className="w-4 h-4 mr-2" />Add User</Button>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Users className="w-5 h-5" />Registered Users</CardTitle></CardHeader>
        <CardContent>
          {loading ? (<div className="space-y-3">{[1,2,3].map((i) => (<Skeleton key={i} className="h-12 w-full" />))}</div>) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="text-left py-3 px-2 font-medium text-muted-foreground">Name</th><th className="text-left py-3 px-2 font-medium text-muted-foreground">Email</th><th className="text-left py-3 px-2 font-medium text-muted-foreground">Role</th><th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th><th className="text-right py-3 px-2 font-medium text-muted-foreground">Actions</th></tr></thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-2 font-medium">{u.name}</td>
                    <td className="py-3 px-2 text-muted-foreground">{u.email}</td>
                    <td className="py-3 px-2"><span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose/10 text-rose-dark rounded-full text-xs"><Shield className="w-3 h-3" />{u.role}</span></td>
                    <td className="py-3 px-2"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{u.active ? 'Active' : 'Inactive'}</span></td>
                    <td className="py-3 px-2 text-right"><Button variant="ghost" size="icon" onClick={() => openEdit(u)}><Pencil className="w-4 h-4" /></Button><Button variant="ghost" size="icon" onClick={() => openDelete(u)} className="text-destructive"><Trash2 className="w-4 h-4" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>)}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent><DialogHeader><DialogTitle>{editing ? 'Edit User' : 'Add New User'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} /></div>
            <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} /></div>
            <div><Label>{editing ? 'New Password (leave blank to keep)' : 'Password'}</Label><Input type="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} /></div>
            <div><Label>Role</Label><Select value={form.role} onValueChange={(v) => setForm({...form, role: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="admin">Admin</SelectItem><SelectItem value="editor">Editor</SelectItem><SelectItem value="viewer">Viewer</SelectItem></SelectContent></Select></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button onClick={handleSave} disabled={saving} className="bg-rose hover:bg-rose-dark text-white">{saving ? 'Saving...' : 'Save'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <AdminDeleteDialog open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={handleDelete} title="Delete User" description={`Are you sure you want to delete "${deleting?.name}"? This action cannot be undone.`} />
    </div>
  );
}
