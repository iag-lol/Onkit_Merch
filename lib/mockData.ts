import { Product, Quote, Review, VisitLog } from "./types";

export const mockProducts: Product[] = [
  {
    id: "kit-empresa",
    name: "Kit Ejecutivo Premium",
    description: "Mochila, botella térmica, cuaderno y lápiz grabado con logo.",
    category: "Empresas",
    segments: ["empresa"],
    basePrice: 38000,
    stock: 120,
    allowSample: true,
    volumeDiscounts: [
      { from: 20, discountPct: 5 },
      { from: 50, discountPct: 10 },
      { from: 100, discountPct: 15 }
    ],
    image: "/images/kit-empresa.jpg",
    tags: ["onboarding", "corporativo"]
  },
  {
    id: "kit-colegio",
    name: "Kit Escolar Completo",
    description: "Mochila, polera deportiva, botella y credencial personalizable.",
    category: "Colegios",
    segments: ["colegio"],
    basePrice: 22000,
    stock: 200,
    allowSample: false,
    volumeDiscounts: [
      { from: 50, discountPct: 7 },
      { from: 120, discountPct: 12 }
    ],
    image: "/images/kit-colegio.jpg",
    tags: ["uniforme", "deporte"]
  },
  {
    id: "kit-sport",
    name: "Kit Club Deportivo",
    description: "Bolso, polerón, short técnico y botella de acero.",
    category: "Sport",
    segments: ["sport"],
    basePrice: 26000,
    stock: 80,
    allowSample: true,
    volumeDiscounts: [
      { from: 30, discountPct: 6 },
      { from: 80, discountPct: 11 }
    ],
    image: "/images/kit-sport.jpg",
    tags: ["club", "equipo"]
  },
  {
    id: "kit-evento",
    name: "Kit Evento Corporativo",
    description: "Tote bag, credencial, lanyard y libreta con logo.",
    category: "Eventos",
    segments: ["evento", "empresa"],
    basePrice: 12000,
    stock: 400,
    allowSample: true,
    volumeDiscounts: [
      { from: 100, discountPct: 5 },
      { from: 250, discountPct: 9 }
    ],
    image: "/images/kit-evento.jpg",
    tags: ["feria", "congreso"]
  }
];

export const mockQuotes: Quote[] = [
  {
    id: "Q-1023",
    customerName: "María González",
    company: "InnovaCorp",
    email: "maria@innovacorp.cl",
    phone: "+56 9 7777 1111",
    clientType: "empresa",
    items: [
      { productId: "kit-empresa", name: "Kit Ejecutivo Premium", quantity: 25, unitPrice: 38000 }
    ],
    notes: "Entrega en dos tandas.",
    status: "enviada",
    netAmount: 950000,
    vat: 180500,
    total: 1130500,
    createdAt: "2024-05-12"
  },
  {
    id: "Q-1040",
    customerName: "Colegio Andes",
    company: "Colegio Andes",
    email: "compras@andes.cl",
    phone: "+56 9 8888 2222",
    clientType: "colegio",
    items: [
      { productId: "kit-colegio", name: "Kit Escolar Completo", quantity: 120, unitPrice: 22000 }
    ],
    status: "pendiente",
    netAmount: 2640000,
    vat: 501600,
    total: 3141600,
    createdAt: "2024-05-18"
  }
];

export const mockReviews: Review[] = [
  {
    id: "R-1",
    name: "Felipe Duarte",
    clientType: "empresa",
    comment: "Excelente calidad y logística impecable para 300 kits de onboarding.",
    rating: 5,
    status: "aprobada"
  },
  {
    id: "R-2",
    name: "Paula Soto",
    clientType: "colegio",
    comment: "Personalizaron rápido y respetaron los colores institucionales.",
    rating: 4,
    status: "aprobada"
  }
];

export const mockVisits: VisitLog[] = [
  {
    id: "V-1",
    path: "/",
    userAgent: "Chrome",
    ip: "181.44.23.10",
    createdAt: "2024-05-20",
    device: "desktop"
  },
  {
    id: "V-2",
    path: "/catalogo",
    userAgent: "Safari iOS",
    ip: "190.22.10.91",
    createdAt: "2024-05-20",
    device: "mobile"
  }
];
