export interface Space {
  id: string;
  category: 'offices' | 'meeting' | 'theater';
  title: { ar: string; en: string };
  desc: { ar: string; en: string };
  images: string[];
  features: { ar: string[]; en: string[] };
  price: number;
  period: { ar: string; en: string };
  capacity: string;
  type: 'workspace' | 'meeting' | 'theater';
  durationOptions: { value: string; label: { ar: string; en: string }; multiplier: number }[];
  active?: boolean;
}

export interface CartItem {
  id: string;
  spaceId: string;
  name: string;
  nameAr: string;
  type: string;
  price: number;
  quantity: number;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  durationType: string;
  durationLabel: string;
}

export const CART_STORAGE_KEY = 'zamakan-cart';
