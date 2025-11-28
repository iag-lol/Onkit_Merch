"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { loadProductsClient, loadReviewsClient } from "@/lib/dataClient";
import { Product, Review } from "@/lib/types";
import { OrganizationSchema, LocalBusinessSchema, WebsiteSchema } from "@/components/seo/StructuredData";
import { sendProductToWhatsApp, sendQuoteToWhatsApp } from "@/lib/whatsapp";

const segmentos = [
  { id: "empresa", title: "Empresas", desc: "Kits de onboarding, regalos ejecutivos y campañas internas con branding premium." },
  { id: "colegio", title: "Colegios", desc: "Uniformes, kits deportivos, eventos estudiantiles y bienvenida docente." },
  { id: "sport", title: "Sport / Clubes", desc: "Equipamiento para entrenamiento, staff técnico y fan shop para hinchas." },
  { id: "evento", title: "Eventos", desc: "Acreditaciones, stands feriales, congresos y activaciones de marketing experiencial." },
  { id: "otro", title: "Otros", desc: "Fundaciones, municipalidades, asociaciones, ONGs y más." }
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    tipo: "Empresa",
    empresa: "",
    detalle: ""
  });

  useEffect(() => {
    loadProductsClient().then((data) => setProducts(data.slice(0, 4))).catch(console.error);
    loadReviewsClient().then(setReviews).catch(console.error);
  }, []);

  const handleProductAdd = (product: Product) => {
    sendProductToWhatsApp({
      name: product.name,
      basePrice: product.basePrice,
      category: product.category
    }, 10);
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.email || !formData.telefono) {
      alert("Por favor completa los campos obligatorios");
      return;
    }
    sendQuoteToWhatsApp(formData);
    // Reset form
    setFormData({
      nombre: "",
      email: "",
      telefono: "",
      tipo: "Empresa",
      empresa: "",
      detalle: ""
    });
  };

  return (
    <main>
      <OrganizationSchema />
      <LocalBusinessSchema />
      <WebsiteSchema />

      {/* Hero Section */}
      <section className="gradient-hero text-white">
        <div className="container-page py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge tone="accent" className="bg-white/15 text-white">
              Kits personalizados, producción bajo demanda
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Merchandising inteligente y kits personalizados para tu marca
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Diseñamos, producimos y entregamos kits corporativos de alto impacto.
              Mínimo 10 unidades con descuentos progresivos por volumen.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button href="/cotizacion" className="text-lg px-8 py-6">
                Solicitar cotización
              </Button>
              <Button variant="secondary" href="/catalogo" className="text-lg px-8 py-6">
                Ver catálogo
              </Button>
            </div>
            <div className="flex flex-wrap gap-3 justify-center text-sm text-white/80">
              <span className="rounded-full bg-white/10 px-4 py-2">✓ Respuesta en 24hrs</span>
              <span className="rounded-full bg-white/10 px-4 py-2">✓ Descuentos por volumen</span>
              <span className="rounded-full bg-white/10 px-4 py-2">✓ Producción nacional</span>
              <span className="rounded-full bg-white/10 px-4 py-2">✓ Muestras disponibles</span>
            </div>
          </div>
        </div>
      </section>

      {/* Qué hacemos */}
      <section className="container-page py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm uppercase tracking-wide text-brand-accent">Por qué elegirnos</p>
            <h2 className="text-3xl font-semibold text-brand-base">Tu socio en merchandising corporativo</h2>
          </div>
          <Button variant="secondary" href="/catalogo">
            Ver catálogo
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-accent/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-brand-base mb-2">Diseño personalizado</h3>
            <p className="text-slate-600">Creamos diseños únicos alineados a tu marca para onboarding, eventos corporativos y retail.</p>
          </Card>
          <Card className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-accent/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-brand-base mb-2">Calidad garantizada</h3>
            <p className="text-slate-600">Producción nacional con los más altos estándares. Muestras disponibles para validación previa.</p>
          </Card>
          <Card className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-accent/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-brand-base mb-2">Descuentos por volumen</h3>
            <p className="text-slate-600">Precios competitivos con descuentos progresivos. Cuanto más compras, más ahorras.</p>
          </Card>
        </div>
      </section>

      {/* Segmentos */}
      <section className="container-page py-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <p className="text-sm uppercase tracking-wide text-brand-accent">Sectores</p>
            <h2 className="text-3xl font-semibold text-brand-base">Soluciones por industria</h2>
          </div>
          <Button variant="secondary" href="/segmentos">
            Ver todos los sectores
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {segmentos.map((seg) => (
            <Link key={seg.id} href={`/segmentos?tipo=${seg.id}`}>
              <Card className="h-full border border-slate-100 hover:-translate-y-1 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold text-brand-base">{seg.title}</h3>
                </div>
                <p className="text-sm text-slate-600">{seg.desc}</p>
                <p className="mt-4 text-sm font-semibold text-brand-accent">Ver más →</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Productos destacados */}
      <section className="bg-slate-50 py-16">
        <div className="container-page">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <p className="text-sm uppercase tracking-wide text-brand-accent">Catálogo</p>
              <h2 className="text-3xl font-semibold text-brand-base">Productos destacados</h2>
            </div>
            <Button href="/catalogo">Ver catálogo completo</Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {products.map((product) => (
              <Card key={product.id} className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="h-32 w-full rounded-2xl bg-gradient-to-br from-brand-accent/20 to-brand-base/20 md:w-36 flex items-center justify-center">
                  <svg className="w-12 h-12 text-brand-base/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge>{product.category}</Badge>
                    {product.allowSample && <Badge tone="success">Muestra disponible</Badge>}
                  </div>
                  <h3 className="text-lg font-semibold text-brand-base">{product.name}</h3>
                  <p className="text-sm text-slate-600 mt-1">{product.description}</p>
                  <p className="text-brand-accent font-semibold mt-2">
                    Desde {formatCurrency(product.basePrice)} + IVA
                  </p>
                </div>
                <Button
                  onClick={() => handleProductAdd(product)}
                  className="md:self-center"
                >
                  Consultar
                </Button>
              </Card>
            ))}
            {products.length === 0 && (
              <div className="col-span-2 text-center py-12">
                <p className="text-slate-500">Próximamente nuevos productos</p>
                <Button href="/contacto" variant="secondary" className="mt-4">
                  Contáctanos para más información
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Reseñas */}
      <section className="container-page py-16">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <p className="text-sm uppercase tracking-wide text-brand-accent">Testimonios</p>
            <h2 className="text-3xl font-semibold text-brand-base">Clientes satisfechos</h2>
          </div>
          <Button variant="secondary" href="/reseñas">
            Ver todas las reseñas
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reviews.slice(0, 3).map((review) => (
            <Card key={review.id} className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand-accent to-brand-base flex items-center justify-center text-white font-bold">
                  {review.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-brand-base">{review.name}</p>
                  <p className="text-xs uppercase tracking-wide text-slate-500">{review.clientType}</p>
                </div>
                <div className="text-yellow-400 text-sm">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </div>
              </div>
              <p className="text-slate-700">{review.comment}</p>
            </Card>
          ))}
          {reviews.length === 0 && (
            <div className="col-span-3 text-center py-8">
              <p className="text-slate-500">Sé el primero en dejarnos tu opinión</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-gradient-to-br from-brand-base to-brand-base/90 text-white">
        <div className="container-page py-12">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-3xl font-bold mb-3">¿Listo para cotizar?</h2>
              <p className="text-white/90 text-lg mb-4">
                Completa el formulario y te responderemos en menos de 24 horas con una propuesta personalizada.
              </p>
              <div className="space-y-2 text-white/80">
                <p className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-brand-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Respuesta garantizada en 24hrs
                </p>
                <p className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-brand-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Sin compromiso
                </p>
                <p className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-brand-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Asesoría personalizada
                </p>
              </div>
            </div>
            <form onSubmit={handleQuoteSubmit} className="glass-panel grid gap-3 rounded-2xl border border-white/10 bg-white/10 p-6 text-slate-900">
              <input
                type="text"
                required
                className="rounded-xl border border-white/40 bg-white/90 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                placeholder="Nombre completo *"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              />
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  type="email"
                  required
                  className="rounded-xl border border-white/40 bg-white/90 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                <input
                  type="tel"
                  required
                  className="rounded-xl border border-white/40 bg-white/90 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  placeholder="Teléfono / WhatsApp *"
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <select
                  className="rounded-xl border border-white/40 bg-white/90 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  value={formData.tipo}
                  onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                >
                  <option>Empresa</option>
                  <option>Colegio</option>
                  <option>Sport</option>
                  <option>Evento</option>
                  <option>Otro</option>
                </select>
                <input
                  type="text"
                  className="rounded-xl border border-white/40 bg-white/90 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  placeholder="Nombre de empresa"
                  value={formData.empresa}
                  onChange={(e) => setFormData({...formData, empresa: e.target.value})}
                />
              </div>
              <textarea
                className="rounded-xl border border-white/40 bg-white/90 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                placeholder="¿Qué necesitas? (productos, cantidades, fechas...)"
                rows={3}
                value={formData.detalle}
                onChange={(e) => setFormData({...formData, detalle: e.target.value})}
              />
              <Button type="submit" className="w-full py-3 text-lg font-semibold">
                Enviar consulta por WhatsApp
              </Button>
              <p className="text-xs text-white/70 text-center">
                * Campos obligatorios
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
