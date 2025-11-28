// Client-side data loading utilities
// All functions now connect to Supabase

import { supabaseClient } from "./supabaseClient";
import { mockProducts, mockReviews, mockQuotes } from "./mockData";
import { Product, Review, Quote, ConfigData, Sale, InventoryMovement, Segment } from "./types";

// Helper to get Supabase client or fallback to mock
const getClient = () => {
  const client = supabaseClient();
  return client;
};

// Products
export async function loadProductsClient(includeInactive?: boolean): Promise<Product[]> {
  const client = getClient();

  if (!client) {
    // Fallback to mock data
    if (includeInactive) {
      return Promise.resolve(mockProducts);
    }
    return Promise.resolve(mockProducts.filter(p => p.active !== false));
  }

  try {
    // Query products with category join
    let query = client
      .from('productos')
      .select(`
        id,
        nombre,
        descripcion,
        precio_base_sin_iva,
        stock,
        permite_muestra,
        activo,
        imagen,
        categorias (nombre)
      `);

    if (!includeInactive) {
      query = query.eq('activo', true);
    }

    const { data: productos, error } = await query;

    if (error) throw error;
    if (!productos) return [];

    // For each product, get its segments
    const productsWithSegments = await Promise.all(
      productos.map(async (p) => {
        const { data: segmentData } = await client
          .from('productos_segmentos')
          .select(`
            segmentos (nombre)
          `)
          .eq('producto_id', p.id);

        const segments = (segmentData || [])
          .map((s: any) => s.segmentos?.nombre)
          .filter(Boolean) as Segment[];

        return {
          id: p.id,
          name: p.nombre,
          description: p.descripcion || '',
          basePrice: Number(p.precio_base_sin_iva),
          stock: p.stock || 0,
          allowSample: p.permite_muestra || false,
          category: (p.categorias as any)?.nombre || 'Sin categoría',
          segments: segments.length > 0 ? segments : ['empresa' as Segment],
          active: p.activo !== false,
          image: p.imagen
        } as Product;
      })
    );

    return productsWithSegments;
  } catch (error) {
    console.error('Error loading products from Supabase:', error);
    // Fallback to mock data on error
    if (includeInactive) {
      return mockProducts;
    }
    return mockProducts.filter(p => p.active !== false);
  }
}

// Reviews
export async function loadReviewsClient(onlyApproved?: boolean): Promise<Review[]> {
  const client = getClient();

  if (!client) {
    // Fallback to mock data
    if (onlyApproved === false) {
      return Promise.resolve(mockReviews);
    }
    return Promise.resolve(mockReviews.filter(r => r.status === "aprobada"));
  }

  try {
    let query = client
      .from('resenas')
      .select('*')
      .order('created_at', { ascending: false });

    if (onlyApproved !== false) {
      query = query.eq('estado', 'aprobada');
    }

    const { data, error } = await query;

    if (error) throw error;
    if (!data) return [];

    return data.map((r) => ({
      id: r.id,
      name: r.nombre,
      clientType: r.tipo_cliente as Segment,
      comment: r.comentario || '',
      rating: r.rating,
      status: r.estado as 'pendiente' | 'aprobada' | 'rechazada'
    }));
  } catch (error) {
    console.error('Error loading reviews from Supabase:', error);
    // Fallback to mock data
    if (onlyApproved === false) {
      return mockReviews;
    }
    return mockReviews.filter(r => r.status === "aprobada");
  }
}

export async function getAllReviewsClient(): Promise<Review[]> {
  return loadReviewsClient(false);
}

export async function updateReviewStatus(id: string, status: "pendiente" | "aprobada" | "rechazada"): Promise<void> {
  const client = getClient();

  if (!client) {
    console.log("Mock: Update review", id, "to", status);
    return Promise.resolve();
  }

  try {
    const { error } = await client
      .from('resenas')
      .update({ estado: status })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating review status:', error);
    throw error;
  }
}

// Quotes
export async function loadQuotesClient(): Promise<Quote[]> {
  const client = getClient();

  if (!client) {
    return Promise.resolve(mockQuotes);
  }

  try {
    const { data: cotizaciones, error } = await client
      .from('cotizaciones')
      .select(`
        *,
        cotizacion_items (
          id,
          producto_id,
          nombre,
          cantidad,
          precio_unitario
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!cotizaciones) return [];

    return cotizaciones.map((c) => ({
      id: c.id,
      customerName: c.cliente,
      email: c.email,
      phone: c.telefono || '',
      clientType: c.tipo_cliente as Segment,
      company: c.empresa,
      notes: c.notas || '',
      netAmount: Number(c.monto_neto),
      vat: Number(c.iva),
      total: Number(c.total),
      status: c.estado,
      createdAt: c.created_at,
      items: (c.cotizacion_items || []).map((item: any) => ({
        productId: item.producto_id,
        name: item.nombre,
        quantity: item.cantidad,
        unitPrice: Number(item.precio_unitario)
      }))
    }));
  } catch (error) {
    console.error('Error loading quotes from Supabase:', error);
    return mockQuotes;
  }
}

export async function updateQuoteStatus(id: string, status: string): Promise<void> {
  const client = getClient();

  if (!client) {
    console.log("Mock: Update quote", id, "to", status);
    return Promise.resolve();
  }

  try {
    const { error } = await client
      .from('cotizaciones')
      .update({ estado: status })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating quote status:', error);
    throw error;
  }
}

// Sales
export async function loadSalesClient(): Promise<Sale[]> {
  const client = getClient();

  if (!client) {
    return Promise.resolve([]);
  }

  try {
    const { data, error } = await client
      .from('ventas')
      .select(`
        *,
        cotizaciones (cliente)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data) return [];

    return data.map((v) => ({
      id: v.id,
      customer: (v.cotizaciones as any)?.cliente || null,
      clientType: v.tipo_cliente as Segment,
      netAmount: Number(v.monto_neto),
      vat: Number(v.iva),
      total: Number(v.total),
      createdAt: v.created_at
    }));
  } catch (error) {
    console.error('Error loading sales from Supabase:', error);
    return [];
  }
}

// Visit logs
export async function loadVisitLogsClient(): Promise<any[]> {
  // This function is not used in the current implementation
  return Promise.resolve([]);
}

// Config
export async function loadConfigClient(): Promise<ConfigData> {
  const client = getClient();

  const defaultConfig: ConfigData = {
    nombreLegal: "ONKIT MERCH SPA",
    rut: "12.345.678-9",
    giro: "Merchandising y kits corporativos",
    direccion: "Santiago, Chile",
    correo: "onkitmerch@outlook.com",
    telefono: "+56 9 8475 2936",
    iva: 19,
    minimo_unidades: 10
  };

  if (!client) {
    return Promise.resolve(defaultConfig);
  }

  try {
    const { data, error } = await client
      .from('configuracion')
      .select('*')
      .eq('id', 1)
      .single();

    if (error || !data) {
      return defaultConfig;
    }

    return {
      nombreLegal: data.nombre_legal || defaultConfig.nombreLegal,
      rut: data.rut || defaultConfig.rut,
      giro: data.giro || defaultConfig.giro,
      direccion: data.direccion || defaultConfig.direccion,
      correo: data.correo || defaultConfig.correo,
      telefono: data.telefono || defaultConfig.telefono,
      iva: Number(data.iva) || defaultConfig.iva,
      minimo_unidades: data.minimo_unidades || defaultConfig.minimo_unidades
    };
  } catch (error) {
    console.error('Error loading config from Supabase:', error);
    return defaultConfig;
  }
}

export async function updateConfig(config: Partial<ConfigData>): Promise<void> {
  const client = getClient();

  if (!client) {
    console.log("Mock: Update config", config);
    return Promise.resolve();
  }

  try {
    const updateData: any = {};
    if (config.nombreLegal !== undefined) updateData.nombre_legal = config.nombreLegal;
    if (config.rut !== undefined) updateData.rut = config.rut;
    if (config.giro !== undefined) updateData.giro = config.giro;
    if (config.direccion !== undefined) updateData.direccion = config.direccion;
    if (config.correo !== undefined) updateData.correo = config.correo;
    if (config.telefono !== undefined) updateData.telefono = config.telefono;
    if (config.iva !== undefined) updateData.iva = config.iva;
    if (config.minimo_unidades !== undefined) updateData.minimo_unidades = config.minimo_unidades;

    const { error } = await client
      .from('configuracion')
      .upsert({ id: 1, ...updateData });

    if (error) throw error;
  } catch (error) {
    console.error('Error updating config:', error);
    throw error;
  }
}

// Convert quote to sale
export async function convertQuoteToSale(quoteId: string): Promise<void> {
  const client = getClient();

  if (!client) {
    console.log("Mock: Convert quote to sale", quoteId);
    return Promise.resolve();
  }

  try {
    // Get the quote with its items
    const { data: quote, error: quoteError } = await client
      .from('cotizaciones')
      .select(`
        *,
        cotizacion_items (*)
      `)
      .eq('id', quoteId)
      .single();

    if (quoteError) throw quoteError;
    if (!quote) throw new Error('Quote not found');

    // Create sale
    const { data: sale, error: saleError } = await client
      .from('ventas')
      .insert({
        cotizacion_id: quoteId,
        monto_neto: quote.monto_neto,
        iva: quote.iva,
        total: quote.total,
        tipo_cliente: quote.tipo_cliente
      })
      .select()
      .single();

    if (saleError) throw saleError;
    if (!sale) throw new Error('Failed to create sale');

    // Create sale items
    const saleItems = (quote.cotizacion_items || []).map((item: any) => ({
      venta_id: sale.id,
      producto_id: item.producto_id,
      nombre: item.nombre,
      cantidad: item.cantidad,
      precio_unitario: item.precio_unitario
    }));

    if (saleItems.length > 0) {
      const { error: itemsError } = await client
        .from('venta_items')
        .insert(saleItems);

      if (itemsError) throw itemsError;
    }

    // Update quote status
    const { error: updateError } = await client
      .from('cotizaciones')
      .update({ estado: 'venta' })
      .eq('id', quoteId);

    if (updateError) throw updateError;
  } catch (error) {
    console.error('Error converting quote to sale:', error);
    throw error;
  }
}

// Inventory movements
export async function loadInventoryMovementsClient(): Promise<InventoryMovement[]> {
  const client = getClient();

  if (!client) {
    return Promise.resolve([]);
  }

  try {
    const { data, error } = await client
      .from('inventario_movimientos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data) return [];

    return data.map((m) => ({
      id: m.id,
      productId: m.producto_id,
      type: m.tipo as 'entrada' | 'salida' | 'ajuste',
      quantity: m.cantidad,
      reason: m.motivo || '',
      createdAt: m.created_at
    }));
  } catch (error) {
    console.error('Error loading inventory movements from Supabase:', error);
    return [];
  }
}

// Visits
export async function loadVisitsClient(): Promise<any[]> {
  const client = getClient();

  if (!client) {
    return Promise.resolve([]);
  }

  try {
    const { data, error } = await client
      .from('visitas')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1000);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error loading visits from Supabase:', error);
    return [];
  }
}

// Product management
export async function createProductClient(product: any): Promise<Product> {
  const client = getClient();

  if (!client) {
    // Mock fallback
    console.log("Mock: Create product", product);
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: product.name,
      description: product.description,
      basePrice: product.basePrice,
      stock: product.stock,
      allowSample: product.allowSample,
      category: product.categoryName,
      segments: product.segments,
      active: true
    };
    return Promise.resolve(newProduct);
  }

  try {
    // First, get or create category
    let categoryId: string;
    const { data: existingCategory } = await client
      .from('categorias')
      .select('id')
      .eq('nombre', product.categoryName)
      .single();

    if (existingCategory) {
      categoryId = existingCategory.id;
    } else {
      const { data: newCategory, error: categoryError } = await client
        .from('categorias')
        .insert({ nombre: product.categoryName })
        .select()
        .single();

      if (categoryError) throw categoryError;
      categoryId = newCategory.id;
    }

    // Create product
    const { data: newProduct, error: productError } = await client
      .from('productos')
      .insert({
        nombre: product.name,
        descripcion: product.description,
        categoria_id: categoryId,
        precio_base_sin_iva: product.basePrice,
        stock: product.stock,
        permite_muestra: product.allowSample,
        activo: true
      })
      .select()
      .single();

    if (productError) throw productError;
    if (!newProduct) throw new Error('Failed to create product');

    // Get segment IDs and create product-segment relationships
    const { data: segmentData } = await client
      .from('segmentos')
      .select('id, nombre')
      .in('nombre', product.segments);

    if (segmentData && segmentData.length > 0) {
      const productSegments = segmentData.map(s => ({
        producto_id: newProduct.id,
        segmento_id: s.id
      }));

      await client
        .from('productos_segmentos')
        .insert(productSegments);
    }

    return {
      id: newProduct.id,
      name: newProduct.nombre,
      description: newProduct.descripcion || '',
      basePrice: Number(newProduct.precio_base_sin_iva),
      stock: newProduct.stock || 0,
      allowSample: newProduct.permite_muestra || false,
      category: product.categoryName,
      segments: product.segments,
      active: true
    };
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

export async function updateProductActive(id: string, active: boolean): Promise<void> {
  const client = getClient();

  if (!client) {
    console.log("Mock: Update product active", id, active);
    return Promise.resolve();
  }

  try {
    const { error } = await client
      .from('productos')
      .update({ activo: active })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating product active status:', error);
    throw error;
  }
}
