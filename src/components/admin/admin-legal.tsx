'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2, FileText } from 'lucide-react';
import { getLegalPages, createLegalPage, updateLegalPage, deleteLegalPage } from '@/lib/api';
import type { LegalPage } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import AdminDeleteDialog from '@/components/admin/admin-delete-dialog';

const emptyForm = { title: '', slug: '', content: '', type: 'general', metaTitle: '', metaDesc: '' };

export default function AdminLegal() {
  const [pages, setPages] = useState<LegalPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<LegalPage | null>(null);
  const [deleting, setDeleting] = useState<LegalPage | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const load = () => { getLegalPages().then(setPages).catch(() => setPages([])).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (p: LegalPage) => { setEditing(p); setForm({ title: p.title, slug: p.slug, content: p.content, type: p.type, metaTitle: p.metaTitle, metaDesc: p.metaDesc }); setDialogOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) { await updateLegalPage(editing.id, form); toast({ title: 'Page updated' }); }
      else { await createLegalPage(form); toast({ title: 'Page created' }); }
      setDialogOpen(false); load();
    } catch (e) { toast({ title: 'Error', description: e instanceof Error ? e.message : 'Failed', variant: 'destructive' }); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try { await deleteLegalPage(deleting.id); toast({ title: 'Page deleted' }); setDeleteOpen(false); load(); }
    catch { toast({ title: 'Error', variant: 'destructive' }); }
  };

  const typeBadge: Record<string, string> = { privacy: 'bg-blue-100 text-blue-800', terms: 'bg-purple-100 text-purple-800', cookie: 'bg-amber-100 text-amber-800', refund: 'bg-red-100 text-red-800', general: 'bg-gray-100 text-gray-800' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Legal Pages</h2>
        <Button onClick={openCreate} className="bg-rose hover:bg-rose-dark text-white"><Plus className="w-4 h-4 mr-2" />Add Page</Button>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><FileText className="w-5 h-5" />All Pages ({pages.length})</CardTitle></CardHeader>
        <CardContent>
          {loading ? (<div className="space-y-3">{[1,2,3].map((i) => (<Skeleton key={i} className="h-12 w-full" />))}</div>) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="text-left py-3 px-2 font-medium text-muted-foreground">Title</th><th className="text-left py-3 px-2 font-medium text-muted-foreground">Slug</th><th className="text-left py-3 px-2 font-medium text-muted-foreground">Type</th><th className="text-left py-3 px-2 font-medium text-muted-foreground">Updated</th><th className="text-right py-3 px-2 font-medium text-muted-foreground">Actions</th></tr></thead>
              <tbody>
                {pages.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-2 font-medium">{p.title}</td>
                    <td className="py-3 px-2 text-muted-foreground font-mono text-xs">/{p.slug}</td>
                    <td className="py-3 px-2"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeBadge[p.type] || typeBadge.general}`}>{p.type}</span></td>
                    <td className="py-3 px-2 text-muted-foreground">{new Date(p.updatedAt).toLocaleDateString()}</td>
                    <td className="py-3 px-2 text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => { setDeleting(p); setDeleteOpen(true); }} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>)}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>{editing ? 'Edit Page' : 'Add Legal Page'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} /></div>
              <div><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm({...form, slug: e.target.value})} placeholder="privacy-policy" /></div>
            </div>
            <div><Label>Type</Label><Select value={form.type} onValueChange={(v) => setForm({...form, type: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="privacy">Privacy Policy</SelectItem><SelectItem value="terms">Terms & Conditions</SelectItem><SelectItem value="cookie">Cookie Policy</SelectItem><SelectItem value="refund">Refund Policy</SelectItem><SelectItem value="general">General</SelectItem></SelectContent></Select></div>
            <div><Label>Content</Label><Textarea value={form.content} onChange={(e) => setForm({...form, content: e.target.value})} rows={15} /></div>
            <details className="border rounded-lg p-4"><summary className="cursor-pointer font-medium text-sm">SEO Settings</summary>
              <div className="mt-4 space-y-3">
                <div><Label>Meta Title</Label><Input value={form.metaTitle} onChange={(e) => setForm({...form, metaTitle: e.target.value})} /></div>
                <div><Label>Meta Description</Label><Textarea value={form.metaDesc} onChange={(e) => setForm({...form, metaDesc: e.target.value})} rows={2} /></div>
              </div>
            </details>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button onClick={handleSave} disabled={saving} className="bg-rose hover:bg-rose-dark text-white">{saving ? 'Saving...' : 'Save'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <AdminDeleteDialog open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={handleDelete} title="Delete Page" description={`Are you sure you want to delete "${deleting?.title}"?`} />
    </div>
  );
}
