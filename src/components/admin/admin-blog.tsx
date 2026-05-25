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
import { Plus, Pencil, Trash2, BookOpen, Eye } from 'lucide-react';
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost, uploadImage } from '@/lib/api';
import type { BlogPost } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import AdminDeleteDialog from '@/components/admin/admin-delete-dialog';

const emptyForm = { title: '', slug: '', excerpt: '', content: '', image: '', category: 'General', tags: '', author: 'Eventra Team', published: false, metaTitle: '', metaDesc: '' };

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [deleting, setDeleting] = useState<BlogPost | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const load = () => { getBlogPosts().then(setPosts).catch(() => setPosts([])).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (p: BlogPost) => { setEditing(p); let tagsStr = ''; try { const parsed = JSON.parse(p.tags || '[]'); tagsStr = Array.isArray(parsed) ? parsed.join(', ') : ''; } catch { tagsStr = ''; } setForm({ title: p.title, slug: p.slug, excerpt: p.excerpt, content: p.content, image: p.image, category: p.category, tags: tagsStr, author: p.author, published: p.published, metaTitle: p.metaTitle, metaDesc: p.metaDesc }); setDialogOpen(true); };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    try { const res = await uploadImage(file); setForm({...form, image: res.url}); toast({ title: 'Image uploaded' }); }
    catch { toast({ title: 'Upload failed', variant: 'destructive' }); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const tagsArr = form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [];
      const data = { ...form, tags: JSON.stringify(tagsArr), slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') };
      if (editing) { await updateBlogPost(editing.id, data); toast({ title: 'Post updated' }); }
      else { await createBlogPost(data); toast({ title: 'Post created' }); }
      setDialogOpen(false); load();
    } catch (e) { toast({ title: 'Error', description: e instanceof Error ? e.message : 'Failed', variant: 'destructive' }); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try { await deleteBlogPost(deleting.id); toast({ title: 'Post deleted' }); setDeleteOpen(false); load(); }
    catch { toast({ title: 'Error', variant: 'destructive' }); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Blog Posts</h2>
        <Button onClick={openCreate} className="bg-rose hover:bg-rose-dark text-white"><Plus className="w-4 h-4 mr-2" />New Post</Button>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><BookOpen className="w-5 h-5" />All Posts ({posts.length})</CardTitle></CardHeader>
        <CardContent>
          {loading ? (<div className="space-y-3">{[1,2,3].map((i) => (<Skeleton key={i} className="h-12 w-full" />))}</div>) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="text-left py-3 px-2 font-medium text-muted-foreground">Title</th><th className="text-left py-3 px-2 font-medium text-muted-foreground">Category</th><th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th><th className="text-left py-3 px-2 font-medium text-muted-foreground">Date</th><th className="text-right py-3 px-2 font-medium text-muted-foreground">Actions</th></tr></thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-2"><div className="flex items-center gap-2">{p.image && <img src={p.image} alt="" className="w-10 h-10 rounded object-cover" />}<span className="font-medium">{p.title}</span></div></td>
                    <td className="py-3 px-2"><span className="px-2 py-0.5 bg-rose/10 text-rose-dark rounded-full text-xs">{p.category}</span></td>
                    <td className="py-3 px-2"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{p.published ? 'Published' : 'Draft'}</span></td>
                    <td className="py-3 px-2 text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-2 text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="w-4 h-4" /></Button>
                      {p.published && <a href={`#/blog/${p.slug}`} className="inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-accent"><Eye className="w-4 h-4 text-muted-foreground" /></a>}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>{editing ? 'Edit Post' : 'New Blog Post'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} /></div>
              <div><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm({...form, slug: e.target.value})} placeholder="auto-generated" /></div>
            </div>
            <div><Label>Excerpt</Label><Textarea value={form.excerpt} onChange={(e) => setForm({...form, excerpt: e.target.value})} rows={2} /></div>
            <div><Label>Content</Label><Textarea value={form.content} onChange={(e) => setForm({...form, content: e.target.value})} rows={10} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} /></div>
              <div><Label>Tags (comma-separated)</Label><Input value={form.tags} onChange={(e) => setForm({...form, tags: e.target.value})} placeholder="wedding, event, planning" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Author</Label><Input value={form.author} onChange={(e) => setForm({...form, author: e.target.value})} /></div>
              <div><Label>Featured Image</Label><Input type="file" accept="image/*" onChange={handleImageUpload} />{form.image && <img src={form.image} alt="" className="mt-2 w-24 h-16 rounded object-cover" />}</div>
            </div>
            <div className="flex items-center gap-3"><Switch checked={form.published} onCheckedChange={(v) => setForm({...form, published: v})} /><Label>Published</Label></div>
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

      <AdminDeleteDialog open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={handleDelete} itemName={deleting?.title || ''} title="Delete Post" description={`Are you sure you want to delete "${deleting?.title}"?`} />
    </div>
  );
}
