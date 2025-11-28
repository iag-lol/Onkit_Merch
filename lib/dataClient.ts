import { supabaseClient } from "./supabaseClient";
import { mapConfigRow, mapInventoryRow, mapProductRow, mapQuoteRow, mapReviewRow, mapSaleRow, mapVisitRow } from "./mappers";
import { ConfigData, InventoryMovement, Product, Quote, Review, Sale, VisitLog } from "./types";
import { VolumeDiscount, Segment } from "./types";

const productSelect =
  "id, nombre, descripcion, precio_base_sin_iva, stock, permite_muestra, activo, imagen, categoria:categorias(nombre), productos_segmentos(segmento:segmentos(nombre)), reglas_descuento(cantidad_desde, porcentaje_descuento)";

export const loadProductsClient = async (includeInactive = false): Promise<Product[]> => {
  const supabase = supabaseClient();
  if (!supabase) return [];
  const query = supabase.from("productos").select(productSelect);
  if (!includeInactive) query.eq("activo", true);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(mapProductRow);
};

export const loadReviewsClient = async (onlyApproved = true): Promise<Review[]> => {
  const supabase = supabaseClient();
  if (!supabase) return [];
  const query = supabase.from("resenas").select("*").order("created_at", { ascending: false });
  const { data, error } = onlyApproved ? await query.eq("estado", "aprobada") : await query;
  if (error) throw error;
  return (data ?? []).map(mapReviewRow);
};

export const loadQuotesClient = async (): Promise<Quote[]> => {
  const supabase = supabaseClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("cotizaciones").select("*, cotizacion_items (*)").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapQuoteRow);
};

export const loadInventoryMovementsClient = async (): Promise<InventoryMovement[]> => {
  const supabase = supabaseClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("inventario_movimientos").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapInventoryRow);
};

export const loadSalesClient = async (): Promise<Sale[]> => {
  const supabase = supabaseClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("ventas").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapSaleRow);
};

export const loadVisitsClient = async (): Promise<VisitLog[]> => {
  const supabase = supabaseClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("visitas").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapVisitRow);
};

export const loadConfigClient = async (): Promise<ConfigData | null> => {
  const supabase = supabaseClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from("configuracion").select("*").limit(1).single();
  if (error) {
    console.error(error);
    return null;
  }
  return data ? mapConfigRow(data) : null;
};

export const updateReviewStatus = async (id: string, status: "aprobada" | "rechazada") => {
  const supabase = supabaseClient();
  if (!supabase) return;
  await supabase.from("resenas").update({ estado: status }).eq("id", id);
};

export const updateConfig = async (config: ConfigData) => {
  const supabase = supabaseClient();
  if (!supabase) return;
  await supabase.from("configuracion").upsert({ id: 1, ...config });
};

// Helpers for creation flows
const ensureCategoryId = async (supabase: ReturnType<typeof supabaseClient>, nombre?: string | null) => {
  if (!nombre) return null;
  const { data: existing, error: findError } = await supabase
    .from("categorias")
    .select("id")
    .eq("nombre", nombre)
    .maybeSingle();
  if (findError) throw findError;
  if (existing?.id) return existing.id;
  const { data: created, error: insertError } = await supabase
    .from("categorias")
    .insert({ nombre })
    .select("id")
    .single();
  if (insertError) throw insertError;
  return created.id;
};

const linkSegments = async (supabase: ReturnType<typeof supabaseClient>, productoId: string, segments: Segment[]) => {
  if (!segments.length) return;
  const { data: segmentRows, error: segError } = await supabase
    .from("segmentos")
    .select("id, nombre")
    .in("nombre", segments);
  if (segError) throw segError;
  const relations = (segmentRows ?? []).map((seg) => ({ producto_id: productoId, segmento_id: seg.id }));
  if (relations.length) {
    await supabase.from("productos_segmentos").insert(relations);
  }
};

const insertVolumeDiscounts = async (
  supabase: ReturnType<typeof supabaseClient>,
  productoId: string,
  rules?: VolumeDiscount[]
) => {
  if (!rules || !rules.length) return;
  const payload = rules.map((r) => ({
    producto_id: productoId,
    cantidad_desde: r.from,
    porcentaje_descuento: r.discountPct
  }));
  await supabase.from("reglas_descuento").insert(payload);
};

export const createProductClient = async (input: {
  name: string;
  description?: string;
  basePrice: number;
  stock: number;
  allowSample: boolean;
  categoryName?: string;
  segments: Segment[];
  volumeDiscounts?: VolumeDiscount[];
  image?: string;
  active?: boolean;
}): Promise<Product> => {
  const supabase = supabaseClient();
  if (!supabase) throw new Error("Supabase no configurado");

  const categoryId = await ensureCategoryId(supabase, input.categoryName);

  const { data: productRow, error } = await supabase
    .from("productos")
    .insert({
      nombre: input.name,
      descripcion: input.description ?? "",
      precio_base_sin_iva: input.basePrice,
      stock: input.stock,
      permite_muestra: input.allowSample,
      categoria_id: categoryId,
      imagen: input.image ?? null,
      activo: input.active ?? true
    })
    .select(productSelect)
    .single();
  if (error) throw error;

  await linkSegments(supabase, productRow.id, input.segments);
  await insertVolumeDiscounts(supabase, productRow.id, input.volumeDiscounts);

  // Recargar con relaciones
  const { data: full, error: refetchError } = await supabase
    .from("productos")
    .select(productSelect)
    .eq("id", productRow.id)
    .single();
  if (refetchError) throw refetchError;
  return mapProductRow(full);
};

export const updateProductActive = async (productId: string, active: boolean) => {
  const supabase = supabaseClient();
  if (!supabase) return;
  await supabase.from("productos").update({ activo: active }).eq("id", productId);
};

export const recordInventoryMovement = async (movement: {
  productId: string;
  type: "entrada" | "salida" | "ajuste";
  quantity: number;
  reason?: string;
}) => {
  const supabase = supabaseClient();
  if (!supabase) throw new Error("Supabase no configurado");
  const { data: inserted, error } = await supabase
    .from("inventario_movimientos")
    .insert({
      producto_id: movement.productId,
      tipo: movement.type,
      cantidad: movement.quantity,
      motivo: movement.reason ?? ""
    })
    .select("*")
    .single();
  if (error) throw error;

  // Ajustar stock simple
  const { data: productRow, error: prodError } = await supabase
    .from("productos")
    .select("stock")
    .eq("id", movement.productId)
    .single();
  if (!prodError && productRow) {
    let newStock = Number(productRow.stock ?? 0);
    if (movement.type === "entrada") newStock += movement.quantity;
    if (movement.type === "salida") newStock -= movement.quantity;
    if (movement.type === "ajuste") newStock += movement.quantity;
    await supabase.from("productos").update({ stock: newStock }).eq("id", movement.productId);
  }
  return mapInventoryRow(inserted);
};

export const convertQuoteToSale = async (quote: Quote) => {
  const supabase = supabaseClient();
  if (!supabase) throw new Error("Supabase no configurado");

  const { data: sale, error } = await supabase
    .from("ventas")
    .insert({
      cotizacion_id: quote.id,
      monto_neto: quote.netAmount,
      iva: quote.vat,
      total: quote.total,
      tipo_cliente: quote.clientType
    })
    .select("*")
    .single();
  if (error) throw error;

  if (quote.items?.length) {
    await supabase.from("venta_items").insert(
      quote.items.map((item) => ({
        venta_id: sale.id,
        producto_id: item.productId,
        nombre: item.name,
        cantidad: item.quantity,
        precio_unitario: item.unitPrice
      }))
    );
  }
  await supabase.from("cotizaciones").update({ estado: "venta" }).eq("id", quote.id);
  return mapSaleRow(sale);
};
