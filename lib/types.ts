export type Segment = "empresa" | "colegio" | "sport" | "evento" | "otro";

export interface VolumeDiscount {
  from: number;
  discountPct: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  segments: Segment[];
  basePrice: number; // price without VAT
  stock: number;
  allowSample: boolean;
  volumeDiscounts?: VolumeDiscount[];
  image?: string;
  active?: boolean;
  tags?: string[];
}

export interface QuoteItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number; // without VAT
}

export interface Quote {
  id: string;
  customerName: string;
  company: string;
  email: string;
  phone: string;
  clientType: Segment;
  items: QuoteItem[];
  notes?: string;
  status: "pendiente" | "enviada" | "aceptada" | "rechazada" | "venta";
  netAmount: number;
  vat: number;
  total: number;
  createdAt: string;
}

export interface Review {
  id: string;
  name: string;
  clientType: Segment;
  comment: string;
  rating: number;
  status: "pendiente" | "aprobada" | "rechazada";
}

export interface VisitLog {
  id: string;
  path: string;
  userAgent: string;
  ip: string;
  createdAt: string;
  device: "mobile" | "desktop" | "tablet";
}

export interface InventoryMovement {
  id: string;
  productId: string;
  type: "entrada" | "salida" | "ajuste";
  quantity: number;
  reason?: string;
  createdAt: string;
}

export interface Sale {
  id: string;
  createdAt: string;
  netAmount: number;
  vat: number;
  total: number;
  clientType?: Segment;
  customer?: string;
}

export interface ConfigData {
  nombreLegal?: string;
  rut?: string;
  giro?: string;
  direccion?: string;
  correo?: string;
  telefono?: string;
  iva?: number;
  minimo_unidades?: number;
}
