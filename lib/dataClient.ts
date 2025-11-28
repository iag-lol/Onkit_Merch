// Client-side data loading utilities
// All functions return mock data for now - will be connected to Supabase later

import { mockProducts, mockReviews, mockQuotes } from "./mockData";
import { Product, Review, Quote, ConfigData } from "./types";

// Products
export async function loadProductsClient(): Promise<Product[]> {
  return Promise.resolve(mockProducts);
}

// Reviews
export async function loadReviewsClient(): Promise<Review[]> {
  return Promise.resolve(mockReviews.filter(r => r.status === "aprobada"));
}

export async function getAllReviewsClient(): Promise<Review[]> {
  return Promise.resolve(mockReviews);
}

export async function updateReviewStatus(id: string, status: "pendiente" | "aprobada" | "rechazada"): Promise<void> {
  console.log("Mock: Update review", id, "to", status);
  return Promise.resolve();
}

// Quotes
export async function loadQuotesClient(): Promise<Quote[]> {
  return Promise.resolve(mockQuotes);
}

export async function updateQuoteStatus(id: string, status: string): Promise<void> {
  console.log("Mock: Update quote", id, "to", status);
  return Promise.resolve();
}

// Sales
export async function loadSalesClient(): Promise<any[]> {
  return Promise.resolve([]);
}

// Visit logs
export async function loadVisitLogsClient(): Promise<any[]> {
  return Promise.resolve([]);
}

// Config
export async function loadConfigClient(): Promise<ConfigData> {
  return Promise.resolve({
    nombreLegal: "ONKIT MERCH SPA",
    rut: "12.345.678-9",
    giro: "Merchandising y kits corporativos",
    direccion: "Santiago, Chile",
    correo: "onkitmerch@outlook.com",
    telefono: "+56 9 8475 2936",
    iva: 19,
    minimoUnidades: 10
  });
}

export async function updateConfig(config: Partial<ConfigData>): Promise<void> {
  console.log("Mock: Update config", config);
  return Promise.resolve();
}

// Convert quote to sale
export async function convertQuoteToSale(quoteId: string): Promise<void> {
  console.log("Mock: Convert quote to sale", quoteId);
  return Promise.resolve();
}
