export type CurrencyCode = 'NGN' | 'GHS' | 'XOF';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'completed'
  | 'cancelled';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rate_to_base: number;
  is_active: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  product_code: string | null;
  base_price: number;
  discount_percent: number;
  sizes: string[];
  colors: string[];
  is_featured: boolean;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  is_available: boolean;
  category?: Category | null;
  images?: ProductImage[];
}

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  image: string | null;
  size: string | null;
  color: string | null;
  quantity: number;
  unitPrice: number; // in base currency
}

export interface CheckoutDetails {
  fullName: string;
  phoneNumber: string;
  deliveryLocation: string;
  notes?: string;
}

export interface OrderItem {
  product_id: string | null;
  product_name: string;
  size: string | null;
  color: string | null;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export interface Review {
  id: string;
  product_id: string;
  customer_name: string;
  rating: number;
  comment: string | null;
  is_approved: boolean;
  created_at: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  link_url: string | null;
  is_active: boolean;
}
