'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trash2, Eye, User, Mail, Phone, Calendar, Clock, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdminDeleteDialog from './admin-delete-dialog';
import { getInquiries, updateInquiry, deleteInquiry } from '@/lib/api';
import type { Inquiry } from '@/lib/types';

const statusColors: Record<string, string> = {
  new: 'bg-green-100 text-green-800',
  read: 'bg-blue-100 text-blue-800',
  replied: 'bg-purple-100 text-purple-800',
};

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Inquiry | null>(null);
  const { toast } = useToast();

  const fetchData = () => {
    setLoading(true);
    getInquiries()
      .then((data) => setInquiries(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())))
      .catch(() => toast({ title: 'Error', description: 'Failed to load inquiries', variant: 'destructive' }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let cancelled = false;
    getInquiries()
      .then((data) => {
        if (!cancelled) {
          setInquiries(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          toast({ title: 'Error', description: 'Failed to load inquiries', variant: 'destructive' });
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  const openView = (inquiry: Inquiry) => {
    setSelected(inquiry);
    setViewOpen(true);
    if (inquiry.status === 'new') {
      handleStatusChange(inquiry.id, 'read');
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateInquiry(id, { status });
      setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
      if (selected?.id === id) {
        setSelected((prev) => prev ? { ...prev, status } : prev);
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    }
  };

  const openDelete = (inquiry: Inquiry) => {
    setDeleteTarget(inquiry);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteInquiry(deleteTarget.id);
      toast({ title: 'Deleted', description: 'Inquiry deleted successfully' });
      setDeleteOpen(false);
      fetchData();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete inquiry', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Inquiries</h2>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : inquiries.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No inquiries yet.
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Event Type</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Event Date</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Submitted</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inquiry) => (
                <tr key={inquiry.id} className="border-b border-border/50 hover:bg-muted/30 cursor-pointer" onClick={() => openView(inquiry)}>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div>
                        <p className="font-medium">{inquiry.name}</p>
                        <p className="text-xs text-muted-foreground">{inquiry.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">{inquiry.eventType}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      {inquiry.eventDate}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[inquiry.status] || 'bg-gray-100 text-gray-800'}`}>
                      {inquiry.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <Select value={inquiry.status} onValueChange={(v) => handleStatusChange(inquiry.id, v)}>
                        <SelectTrigger className="w-24 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="read">Read</SelectItem>
                          <SelectItem value="replied">Replied</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="sm" onClick={() => openView(inquiry)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => openDelete(inquiry)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Inquiry Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="font-medium text-sm">{selected.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium text-sm">{selected.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium text-sm">{selected.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Event Date</p>
                    <p className="font-medium text-sm">{selected.eventDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Event Type</p>
                    <p className="font-medium text-sm">{selected.eventType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Submitted</p>
                    <p className="font-medium text-sm">{new Date(selected.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div>
                <Badge className={statusColors[selected.status] || 'bg-gray-100 text-gray-800'}>
                  {selected.status}
                </Badge>
              </div>
              {selected.message && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Message</p>
                  <p className="text-sm bg-muted/50 p-3 rounded-lg">{selected.message}</p>
                </div>
              )}
              <div className="flex gap-2">
                <Select value={selected.status} onValueChange={(v) => handleStatusChange(selected.id, v)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="replied">Replied</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AdminDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        itemName={deleteTarget?.name || 'this inquiry'}
      />
    </div>
  );
}
