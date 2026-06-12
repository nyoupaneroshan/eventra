import type {
  HeroSlide, AboutContent, Service, PortfolioItem, Testimonial, PricingPackage,
  ContactInfoData, Inquiry, InquiryFormData, AdminUser, BlogPost, LegalPage, FAQItem,
} from './types';

const BASE = '';

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  // Separate headers from other options to properly merge them
  // (prevents ...options from overriding the Content-Type header)
  const { headers: customHeaders, ...restOptions } = options || {};
  const res = await fetch(`${BASE}${url}`, {
    ...restOptions,
    headers: { 'Content-Type': 'application/json', ...customHeaders },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// Auth helpers
export function setAdminToken(token: string) {
  if (typeof window !== 'undefined') localStorage.setItem('admin_token', token);
}
export function getAdminToken(): string | null {
  if (typeof window !== 'undefined') return localStorage.getItem('admin_token');
  return null;
}
export function clearAdminToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_role');
    localStorage.removeItem('admin_user_id');
  }
}
export function isAdminAuthenticated(): boolean {
  return !!getAdminToken();
}

// Role helpers
export type UserRole = 'admin' | 'editor' | 'viewer';

export function setAdminRole(role: string) {
  if (typeof window !== 'undefined') localStorage.setItem('admin_role', role);
}
export function getAdminRole(): UserRole | null {
  if (typeof window !== 'undefined') {
    const role = localStorage.getItem('admin_role');
    if (role === 'admin' || role === 'editor' || role === 'viewer') return role;
    return null;
  }
  return null;
}
export function setAdminUserId(userId: string) {
  if (typeof window !== 'undefined') localStorage.setItem('admin_user_id', userId);
}
export function getAdminUserId(): string | null {
  if (typeof window !== 'undefined') return localStorage.getItem('admin_user_id');
  return null;
}

const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin: 3,
  editor: 2,
  viewer: 1,
};

export function hasMinRole(minRole: UserRole): boolean {
  const role = getAdminRole();
  if (!role) return false;
  return (ROLE_HIERARCHY[role] ?? 0) >= (ROLE_HIERARCHY[minRole] ?? 0);
}

export function isAdmin(): boolean { return getAdminRole() === 'admin'; }
export function isEditor(): boolean {
  const role = getAdminRole();
  return role === 'admin' || role === 'editor';
}
export function isViewer(): boolean { return getAdminRole() === 'viewer'; }

// Public APIs
export async function getHeroSlides(): Promise<HeroSlide[]> {
  return apiFetch<HeroSlide[]>('/api/hero');
}
export async function getAboutContent(): Promise<AboutContent> {
  return apiFetch<AboutContent>('/api/about');
}
export async function getServices(): Promise<Service[]> {
  return apiFetch<Service[]>('/api/services');
}
export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  return apiFetch<PortfolioItem[]>('/api/portfolio');
}
export async function getTestimonials(): Promise<Testimonial[]> {
  return apiFetch<Testimonial[]>('/api/testimonials');
}
export async function getPricingPackages(): Promise<PricingPackage[]> {
  return apiFetch<PricingPackage[]>('/api/pricing');
}
export async function getContactInfo(): Promise<ContactInfoData> {
  return apiFetch<ContactInfoData>('/api/contact-info');
}
export async function submitInquiry(data: InquiryFormData): Promise<void> {
  await apiFetch('/api/inquiries', { method: 'POST', body: JSON.stringify(data) });
}

// Admin Auth
export async function adminLogin(email: string, password: string): Promise<{ token: string; user: { id: string; name: string; email: string; role: string } }> {
  const res = await apiFetch<{ token: string; user: { id: string; name: string; email: string; role: string } }>('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setAdminToken(res.token);
  setAdminRole(res.user.role);
  setAdminUserId(res.user.id);
  return res;
}

export async function adminVerify(): Promise<boolean> {
  try {
    const token = getAdminToken();
    if (!token) return false;
    const res = await apiFetch<{ valid: boolean; role: string; userId: string }>('/api/admin/verify', {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Sync role from server in case it changed
    if (res.role) setAdminRole(res.role);
    if (res.userId) setAdminUserId(res.userId);
    return true;
  } catch {
    return false;
  }
}

// Admin CRUD helpers
function adminHeaders(): Record<string, string> {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Hero
export async function createHeroSlide(data: Partial<HeroSlide>): Promise<HeroSlide> {
  return apiFetch('/api/hero', { method: 'POST', body: JSON.stringify(data), headers: adminHeaders() });
}
export async function updateHeroSlide(id: string, data: Partial<HeroSlide>): Promise<HeroSlide> {
  return apiFetch(`/api/hero/${id}`, { method: 'PUT', body: JSON.stringify(data), headers: adminHeaders() });
}
export async function deleteHeroSlide(id: string): Promise<void> {
  await apiFetch(`/api/hero/${id}`, { method: 'DELETE', headers: adminHeaders() });
}

// Services
export async function createService(data: Partial<Service>): Promise<Service> {
  return apiFetch('/api/services', { method: 'POST', body: JSON.stringify(data), headers: adminHeaders() });
}
export async function updateService(id: string, data: Partial<Service>): Promise<Service> {
  return apiFetch(`/api/services/${id}`, { method: 'PUT', body: JSON.stringify(data), headers: adminHeaders() });
}
export async function deleteService(id: string): Promise<void> {
  await apiFetch(`/api/services/${id}`, { method: 'DELETE', headers: adminHeaders() });
}

// Portfolio
export async function createPortfolioItem(data: Partial<PortfolioItem>): Promise<PortfolioItem> {
  return apiFetch('/api/portfolio', { method: 'POST', body: JSON.stringify(data), headers: adminHeaders() });
}
export async function updatePortfolioItem(id: string, data: Partial<PortfolioItem>): Promise<PortfolioItem> {
  return apiFetch(`/api/portfolio/${id}`, { method: 'PUT', body: JSON.stringify(data), headers: adminHeaders() });
}
export async function deletePortfolioItem(id: string): Promise<void> {
  await apiFetch(`/api/portfolio/${id}`, { method: 'DELETE', headers: adminHeaders() });
}

// Testimonials
export async function createTestimonial(data: Partial<Testimonial>): Promise<Testimonial> {
  return apiFetch('/api/testimonials', { method: 'POST', body: JSON.stringify(data), headers: adminHeaders() });
}
export async function updateTestimonial(id: string, data: Partial<Testimonial>): Promise<Testimonial> {
  return apiFetch(`/api/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(data), headers: adminHeaders() });
}
export async function deleteTestimonial(id: string): Promise<void> {
  await apiFetch(`/api/testimonials/${id}`, { method: 'DELETE', headers: adminHeaders() });
}

// Pricing
export async function createPricingPackage(data: Partial<PricingPackage>): Promise<PricingPackage> {
  return apiFetch('/api/pricing', { method: 'POST', body: JSON.stringify(data), headers: adminHeaders() });
}
export async function updatePricingPackage(id: string, data: Partial<PricingPackage>): Promise<PricingPackage> {
  return apiFetch(`/api/pricing/${id}`, { method: 'PUT', body: JSON.stringify(data), headers: adminHeaders() });
}
export async function deletePricingPackage(id: string): Promise<void> {
  await apiFetch(`/api/pricing/${id}`, { method: 'DELETE', headers: adminHeaders() });
}

// Contact Info
export async function updateContactInfo(data: Partial<ContactInfoData>): Promise<ContactInfoData> {
  return apiFetch('/api/contact-info', { method: 'PUT', body: JSON.stringify(data), headers: adminHeaders() });
}

// Inquiries (admin)
export async function getInquiries(): Promise<Inquiry[]> {
  return apiFetch('/api/inquiries', { headers: adminHeaders() });
}
export async function updateInquiry(id: string, data: Partial<Inquiry>): Promise<Inquiry> {
  return apiFetch(`/api/inquiries/${id}`, { method: 'PUT', body: JSON.stringify(data), headers: adminHeaders() });
}
export async function deleteInquiry(id: string): Promise<void> {
  await apiFetch(`/api/inquiries/${id}`, { method: 'DELETE', headers: adminHeaders() });
}

// Settings
export async function getSettings(): Promise<Record<string, string>> {
  return apiFetch('/api/settings');
}
export async function updateSettings(data: Record<string, string>): Promise<void> {
  await apiFetch('/api/settings', { method: 'PUT', body: JSON.stringify(data), headers: adminHeaders() });
}

// Image upload
export async function uploadImage(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('file', file);
  const token = getAdminToken();
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}

// Admin Users
export async function getAdminUsers(): Promise<AdminUser[]> {
  return apiFetch<AdminUser[]>('/api/users', { headers: adminHeaders() });
}
export async function createAdminUser(data: { name: string; email: string; password: string; role?: string }): Promise<AdminUser> {
  return apiFetch('/api/users', { method: 'POST', body: JSON.stringify(data), headers: adminHeaders() });
}
export async function updateAdminUser(id: string, data: Partial<AdminUser & { password?: string }>): Promise<AdminUser> {
  return apiFetch(`/api/users/${id}`, { method: 'PUT', body: JSON.stringify(data), headers: adminHeaders() });
}
export async function deleteAdminUser(id: string): Promise<void> {
  await apiFetch(`/api/users/${id}`, { method: 'DELETE', headers: adminHeaders() });
}

// Blog Posts (public)
export async function getBlogPosts(): Promise<BlogPost[]> {
  return apiFetch<BlogPost[]>('/api/blog');
}
export async function getBlogPostBySlug(slug: string): Promise<BlogPost> {
  return apiFetch<BlogPost>(`/api/blog/slug/${slug}`);
}
// Blog Posts (admin)
export async function createBlogPost(data: Partial<BlogPost>): Promise<BlogPost> {
  return apiFetch('/api/blog', { method: 'POST', body: JSON.stringify(data), headers: adminHeaders() });
}
export async function updateBlogPost(id: string, data: Partial<BlogPost>): Promise<BlogPost> {
  return apiFetch(`/api/blog/${id}`, { method: 'PUT', body: JSON.stringify(data), headers: adminHeaders() });
}
export async function deleteBlogPost(id: string): Promise<void> {
  await apiFetch(`/api/blog/${id}`, { method: 'DELETE', headers: adminHeaders() });
}

// Legal Pages (public)
export async function getLegalPages(): Promise<LegalPage[]> {
  return apiFetch<LegalPage[]>('/api/legal');
}
export async function getLegalPageBySlug(slug: string): Promise<LegalPage> {
  return apiFetch<LegalPage>(`/api/legal/slug/${slug}`);
}
// Legal Pages (admin)
export async function createLegalPage(data: Partial<LegalPage>): Promise<LegalPage> {
  return apiFetch('/api/legal', { method: 'POST', body: JSON.stringify(data), headers: adminHeaders() });
}
export async function updateLegalPage(id: string, data: Partial<LegalPage>): Promise<LegalPage> {
  return apiFetch(`/api/legal/${id}`, { method: 'PUT', body: JSON.stringify(data), headers: adminHeaders() });
}
export async function deleteLegalPage(id: string): Promise<void> {
  await apiFetch(`/api/legal/${id}`, { method: 'DELETE', headers: adminHeaders() });
}

// FAQs (public)
export async function getFAQs(): Promise<FAQItem[]> {
  return apiFetch<FAQItem[]>('/api/faq');
}
// FAQs (admin)
export async function getAllFAQs(): Promise<FAQItem[]> {
  return apiFetch<FAQItem[]>('/api/faq', { headers: adminHeaders() });
}
export async function createFAQ(data: Partial<FAQItem>): Promise<FAQItem> {
  return apiFetch('/api/faq', { method: 'POST', body: JSON.stringify(data), headers: adminHeaders() });
}
export async function updateFAQ(id: string, data: Partial<FAQItem>): Promise<FAQItem> {
  return apiFetch(`/api/faq/${id}`, { method: 'PUT', body: JSON.stringify(data), headers: adminHeaders() });
}
export async function deleteFAQ(id: string): Promise<void> {
  await apiFetch(`/api/faq/${id}`, { method: 'DELETE', headers: adminHeaders() });
}
