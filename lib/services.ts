import { supabaseClient } from "./supabaseClient";
import type { Product, Quote, Review, VisitLog } from "./types";

// Products
export async function getProducts(): Promise<Product[]> {
  const supabase = supabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("productos")
    .select(`
      id,
      nombre,
      descripcion,
      precio_base_sin_iva,
      stock,
      permite_muestra,
      activo,
      imagen,
      categoria_id,
      categorias(nombre),
      productos_segmentos(segmentos(nombre))
    `)
    .eq("activo", true);

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return (data || []).map((p: any) => ({
    id: p.id,
    name: p.nombre,
    description: p.descripcion || "",
    category: p.categorias?.nombre || "General",
    basePrice: parseFloat(p.precio_base_sin_iva),
    stock: p.stock || 0,
    allowSample: p.permite_muestra || false,
    image: p.imagen,
    active: p.activo,
    segments: (p.productos_segmentos || []).map((ps: any) => ps.segmentos.nombre),
    tags: []
  }));
}

// Quotes
export async function getQuotes(): Promise<Quote[]> {
  const supabase = supabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("cotizaciones")
    .select(`
      *,
      cotizacion_items(*)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching quotes:", error);
    return [];
  }

  return (data || []).map((q: any) => ({
    id: q.id,
    customerName: q.cliente,
    company: q.empresa,
    email: q.email,
    phone: q.telefono || "",
    clientType: q.tipo_cliente,
    netAmount: parseFloat(q.monto_neto),
    vat: parseFloat(q.iva),
    total: parseFloat(q.total),
    status: q.estado,
    notes: q.notas,
    createdAt: new Date(q.created_at).toLocaleDateString(),
    items: (q.cotizacion_items || []).map((item: any) => ({
      productId: item.producto_id,
      name: item.nombre,
      quantity: item.cantidad,
      unitPrice: parseFloat(item.precio_unitario)
    }))
  }));
}

// Reviews
export async function getReviews(): Promise<Review[]> {
  const supabase = supabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("resenas")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }

  return (data || []).map((r: any) => ({
    id: r.id,
    name: r.nombre,
    clientType: r.tipo_cliente,
    comment: r.comentario || "",
    rating: r.rating,
    status: r.estado
  }));
}

// Get approved reviews only
export async function getApprovedReviews(): Promise<Review[]> {
  const supabase = supabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("resenas")
    .select("*")
    .eq("estado", "aprobada")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching approved reviews:", error);
    return [];
  }

  return (data || []).map((r: any) => ({
    id: r.id,
    name: r.nombre,
    clientType: r.tipo_cliente,
    comment: r.comentario || "",
    rating: r.rating,
    status: r.estado
  }));
}

// Visit logs
export async function getVisitLogs(): Promise<VisitLog[]> {
  const supabase = supabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("visitas")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Error fetching visit logs:", error);
    return [];
  }

  return (data || []).map((v: any) => ({
    id: v.id,
    path: v.path,
    userAgent: v.user_agent || "",
    ip: v.ip || "",
    device: v.device || "desktop",
    createdAt: new Date(v.created_at).toLocaleString()
  }));
}

// Create visit log
export async function createVisitLog(log: Omit<VisitLog, "id" | "createdAt">) {
  const supabase = supabaseClient();
  if (!supabase) return;

  const { error } = await supabase.from("visitas").insert({
    path: log.path,
    user_agent: log.userAgent,
    ip: log.ip,
    device: log.device
  });

  if (error) {
    console.error("Error creating visit log:", error);
  }
}

// Update review status
export async function updateReviewStatus(id: string, status: "pendiente" | "aprobada" | "rechazada") {
  const supabase = supabaseClient();
  if (!supabase) return { error: "Supabase not configured" };

  const { error } = await supabase
    .from("resenas")
    .update({ estado: status })
    .eq("id", id);

  if (error) {
    console.error("Error updating review:", error);
    return { error: error.message };
  }

  return { success: true };
}

// Update quote status
export async function updateQuoteStatus(id: string, status: string) {
  const supabase = supabaseClient();
  if (!supabase) return { error: "Supabase not configured" };

  const { error } = await supabase
    .from("cotizaciones")
    .update({ estado: status })
    .eq("id", id);

  if (error) {
    console.error("Error updating quote:", error);
    return { error: error.message };
  }

  return { success: true };
}
