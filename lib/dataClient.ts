import { supabaseClient } from "./supabaseClient";
import { mapConfigRow, mapInventoryRow, mapProductRow, mapQuoteRow, mapReviewRow, mapSaleRow, mapVisitRow } from "./mappers";
import { ConfigData, InventoryMovement, Product, Quote, Review, Sale, VisitLog } from "./types";

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
