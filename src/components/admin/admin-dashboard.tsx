'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Mail, Heart, Camera, MessageSquare, Clock, User, Phone, Calendar } from 'lucide-react';
import { getInquiries, getServices, getPortfolioItems, getTestimonials } from '@/lib/api';
import type { Inquiry, Service, PortfolioItem, Testimonial } from '@/lib/types';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ inquiries: 0, services: 0, portfolio: 0, testimonials: 0 });
  const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getInquiries().catch(() => [] as Inquiry[]),
      getServices().catch(() => [] as Service[]),
      getPortfolioItems().catch(() => [] as PortfolioItem[]),
      getTestimonials().catch(() => [] as Testimonial[]),
    ]).then(([inquiries, services, portfolio, testimonials]) => {
      setStats({
        inquiries: inquiries.length,
        services: services.filter((s) => s.active).length,
        portfolio: portfolio.filter((p) => p.active).length,
        testimonials: testimonials.filter((t) => t.active).length,
      });
      setRecentInquiries(
        inquiries
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5)
      );
      setLoading(false);
    });
  }, []);

  const statusColors: Record<string, string> = {
    new: 'bg-green-100 text-green-800',
    read: 'bg-blue-100 text-blue-800',
    replied: 'bg-purple-100 text-purple-800',
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">New Inquiries</CardTitle>
            <Mail className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{stats.inquiries}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Services</CardTitle>
            <Heart className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{stats.services}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Portfolio Items</CardTitle>
            <Camera className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{stats.portfolio}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Testimonials</CardTitle>
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{stats.testimonials}</div>}
          </CardContent>
        </Card>
      </div>

      {/* Recent Inquiries */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : recentInquiries.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">No inquiries yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Name</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Event Type</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="border-b border-border/50 hover:bg-muted/50">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{inquiry.name}</p>
                            <p className="text-xs text-muted-foreground">{inquiry.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          {inquiry.eventType}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          {new Date(inquiry.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[inquiry.status] || 'bg-gray-100 text-gray-800'}`}>
                          {inquiry.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
