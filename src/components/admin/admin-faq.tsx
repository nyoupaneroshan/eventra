'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Trash2, HelpCircle } from 'lucide-react';
import { getAllFAQs, createFAQ, updateFAQ, deleteFAQ } from '@/lib/api';
import type { FAQItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import AdminDeleteDialog from '@/components/admin/admin-delete-dialog';

export default function AdminFAQ() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<FAQItem | null>(null);
  const [deleting, setDeleting] = useState<FAQItem | null>(null);
  const [form, setForm] = useState({ question: '', answer: '', category: 'General', order: 0, active: true });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const load = () => { getAllFAQs().then((data) => setFaqs(data.sort((a,b) => a.order - b.order))).catch(() => setFaqs([])).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({ question: '', answer: '', category: 'General', order: 0, active: true }); setDialogOpen(true); };
  const openEdit = (f: FAQItem) => { setEditing(f); setForm({ question: f.question, answer: f.answer, category: f.category, order: f.order, active: f.active }); setDialogOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) { await updateFAQ(editing.id, form); toast({ title: 'FAQ updated' }); }
      else { await createFAQ(form); toast({ title: 'FAQ created' }); }
      setDialogOpen(false); load();
    } catch (e) { toast({ title: 'Error', variant: 'destructive' }); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try { await deleteFAQ(deleting.id); toast({ title: 'FAQ deleted' }); setDeleteOpen(false); load(); }
    catch { toast({ title: 'Error', variant: 'destructive' }); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">FAQ Management</h2>
        <Button onClick={openCreate} className="bg-rose hover:bg-rose-dark text-white"><Plus className="w-4 h-4 mr-2" />Add FAQ</Button>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><HelpCircle className="w-5 h-5" />All FAQs ({faqs.length})</CardTitle></CardHeader>
        <CardContent>
          {loading ? (<div className="space-y-3">{[1,2,3].map((i) => (<Skeleton key={i} className="h-12 w-full" />))}</div>) : (
          <div className="space-y-3">
            {faqs.map((f) => (
              <div key={f.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1"><span className="font-medium">{f.question}</span><span className="px-2 py-0.5 bg-rose/10 text-rose-dark rounded-full text-xs">{f.category}</span><span className={`px-2 py-0.5 rounded-full text-xs ${f.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{f.active ? 'Active' : 'Hidden'}</span></div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{f.answer}</p>
                </div>
                <div className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => openEdit(f)}><Pencil className="w-4 h-4" /></Button><Button variant="ghost" size="icon" onClick={() => { setDeleting(f); setDeleteOpen(true); }} className="text-destructive"><Trash2 className="w-4 h-4" /></Button></div>
              </div>
            ))}
          </div>)}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent><DialogHeader><DialogTitle>{editing ? 'Edit FAQ' : 'Add FAQ'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Question</Label><Input value={form.question} onChange={(e) => setForm({...form, question: e.target.value})} /></div>
            <div><Label>Answer</Label><Textarea value={form.answer} onChange={(e) => setForm({...form, answer: e.target.value})} rows={4} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} /></div>
              <div><Label>Order</Label><Input type="number" value={form.order} onChange={(e) => setForm({...form, order: parseInt(e.target.value) || 0})} /></div>
            </div>
            <div className="flex items-center gap-3"><Switch checked={form.active} onCheckedChange={(v) => setForm({...form, active: v})} /><Label>Active</Label></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button onClick={handleSave} disabled={saving} className="bg-rose hover:bg-rose-dark text-white">{saving ? 'Saving...' : 'Save'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <AdminDeleteDialog open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={handleDelete} title="Delete FAQ" description="Are you sure you want to delete this FAQ?" />
    </div>
  );
}
