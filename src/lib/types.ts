export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  order: number;
  active: boolean;
}

export interface AboutContent {
  id: string;
  sectionTitle: string;
  subtitle: string;
  description: string;
  features: string; // JSON
  image1: string;
  image2: string;
  image3: string;
}

export interface AboutFeature {
  icon: string;
  title: string;
  description: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
  features: string; // JSON string[]
  order: number;
  active: boolean;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  order: number;
  active: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  initials: string;
  order: number;
  active: boolean;
}

export interface PricingPackage {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string; // JSON string[]
  notIncluded: string; // JSON string[]
  popular: boolean;
  color: string;
  order: number;
  active: boolean;
}

export interface ContactInfoData {
  id: string;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  viber: string;
  workingHours: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
}

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  eventType: string;
  eventDate: string;
  message: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface InquiryFormData {
  name: string;
  phone: string;
  email: string;
  eventType: string;
  eventDate: string;
  message?: string;
}
