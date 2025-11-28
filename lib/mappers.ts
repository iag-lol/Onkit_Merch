import { ConfigData, InventoryMovement, Product, Quote, Review, Sale, Segment, VisitLog, VolumeDiscount } from "./types";

const mapVolumeDiscounts = (rules: any[] | null | undefined): VolumeDiscount[] =>
  (rules ?? [])
    .filter((r) => r?.cantidad_desde)
    .map((r) => ({
      from: Number(r.cantidad_desde),
      discountPct: Number(r.porcentaje_descuento ?? 0)
    }));

const mapSegments = (rows: any[] | null | undefined): Segment[] =>
  (rows ?? [])
    .map((s) => s?.segmento?.nombre || s?.segmentos?.nombre)
    .filter(Boolean) as Segment[];

export const mapProductRow = (row: any): Product => ({
  id: row.id,
  name: row.nombre,
  description: row.descripcion ?? "",
  category: row.categoria?.nombre ?? "Sin categoría",
  segments: mapSegments(row.productos_segmentos),
  basePrice: Number(row.precio_base_sin_iva ?? 0),
  stock: Number(row.stock ?? 0),
  allowSample: !!row.permite_muestra,
  volumeDiscounts: mapVolumeDiscounts(row.reglas_descuento),
  image: row.imagen ?? undefined,
  active: row.activo ?? true
});

export const mapReviewRow = (row: any): Review => ({
  id: row.id,
  name: row.nombre,
  clientType: row.tipo_cliente as Segment,
  comment: row.comentario ?? "",
  rating: Number(row.rating ?? 0),
  status: row.estado ?? "pendiente"
});

export const mapQuoteRow = (row: any): Quote => ({
  id: row.id,
  customerName: row.cliente,
  company: row.empresa,
  email: row.email,
  phone: row.telefono ?? "",
  clientType: row.tipo_cliente as Segment,
  items:
    row.cotizacion_items?.map((item: any) => ({
      productId: item.producto_id ?? "",
      name: item.nombre,
      quantity: Number(item.cantidad ?? 0),
      unitPrice: Number(item.precio_unitario ?? 0)
    })) ?? [],
  notes: row.notas ?? "",
  status: row.estado ?? "pendiente",
  netAmount: Number(row.monto_neto ?? 0),
  vat: Number(row.iva ?? 0),
  total: Number(row.total ?? 0),
  createdAt: row.created_at
});

export const mapVisitRow = (row: any): VisitLog => ({
  id: row.id,
  path: row.path ?? "/",
  userAgent: row.user_agent ?? "",
  ip: row.ip ?? "",
  createdAt: row.created_at,
  device: (row.device ?? "desktop") as VisitLog["device"]
});

export const mapInventoryRow = (row: any): InventoryMovement => ({
  id: row.id,
  productId: row.producto_id ?? "",
  type: row.tipo,
  quantity: Number(row.cantidad ?? 0),
  reason: row.motivo ?? "",
  createdAt: row.created_at
});

export const mapSaleRow = (row: any): Sale => ({
  id: row.id,
  createdAt: row.created_at,
  netAmount: Number(row.monto_neto ?? 0),
  vat: Number(row.iva ?? 0),
  total: Number(row.total ?? 0),
  clientType: row.tipo_cliente as Segment,
  customer: row.cliente ?? ""
});

export const mapConfigRow = (row: any): ConfigData => ({
  nombreLegal: row.nombre_legal ?? "",
  rut: row.rut ?? "",
  giro: row.giro ?? "",
  direccion: row.direccion ?? "",
  correo: row.correo ?? "",
  telefono: row.telefono ?? "",
  iva: Number(row.iva ?? 19),
  minimo_unidades: Number(row.minimo_unidades ?? 10)
});
