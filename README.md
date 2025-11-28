# ONKIT MERCH – Web corporativa + Panel admin

Stack: Next.js 14 (App Router) + TypeScript + TailwindCSS + Supabase.

## Scripts
- `npm install`
- `npm run dev`
- `npm run build`
- `npm start`

## Configuración de entorno
Crear `.env.local` con:
```
NEXT_PUBLIC_SUPABASE_URL=https://XXXX.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...
# Opcional: webhook/función para email
NEXT_PUBLIC_EMAIL_WEBHOOK=https://...
# Opcional server (para insert/updates desde el backend)
SUPABASE_SERVICE_ROLE_KEY=ey...
# Para correo gratis con Resend (usa /api/email)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxx

### Correo sin costo (Resend)
- En Render (o `.env.local`) define:
  - `NEXT_PUBLIC_EMAIL_WEBHOOK=/api/email`
  - `RESEND_API_KEY` (puedes usar la clave de onboarding de Resend con 100 correos/mes).
- El endpoint `/api/email` usa `from: onboarding@resend.dev` (no requiere dominio verificado).
- Si quieres otro proveedor, apunta `NEXT_PUBLIC_EMAIL_WEBHOOK` a tu propia API y ajusta la lógica allí.
```

## Estructura clave
- `app/` páginas públicas (home, catálogo, segmentos, cotización, reseñas, contacto, carrito).
- `app/admin/` panel (dashboard, productos, inventario, cotizaciones, ventas, reseñas, logs, config, login).
- `components/` UI reutilizable (cards, tablas, modales, charts) y layout.
- `context/cart.tsx` carrito B2B con mínimos y cálculo de IVA.
- `lib/supabaseClient.ts` helper para inicializar cliente.
- `lib/dataClient.ts` loaders desde Supabase (productos, cotizaciones, reseñas, visitas, etc).
- `lib/mappers.ts` transforma filas de Supabase a tipos de front.
- `lib/pdf.ts` generación de PDF de cotización con jsPDF.
- `lib/analytics.ts` logging de visitas a tabla `visitas` (fallback a consola si no hay Supabase).
- `supabase/schema.sql` definición de tablas sugeridas.

## Tablas Supabase (resumen)
- `productos`, `categorias`, `segmentos`, `productos_segmentos`, `reglas_descuento`
- `inventario_movimientos`
- `cotizaciones`, `cotizacion_items`
- `ventas`, `venta_items`
- `resenas`
- `visitas`
- `configuracion`

## Flujo de cotización
1) Usuario selecciona productos/segmento en `/cotizacion`.
2) Calcula neto + IVA 19%. Respeta mínimo 10u (muestras 1u).
3) Envía a Supabase (`cotizaciones`, `cotizacion_items`) si hay credenciales; si no, log en consola.
4) Admin puede ver, descargar PDF y convertir a venta en `/admin/cotizaciones`.

## Autenticación admin
`/admin/login` usa `supabase.auth.signInWithPassword` cuando hay credenciales; en mock marca éxito.

## Logging de visitas
`VisitTracker` (layout) registra cada path en `visitas` vía REST si existen variables de Supabase. Incluye user agent y device.

## Email/Outlook
`lib/email.ts` expone `sendEmail` listo para conectar webhook/SMTP (placeholder).

## Estilos y diseño
- Tailwind con paleta petróleo (`brand.base`) y acento teal (`brand.accent`).
- Componentes corporativos: cards, badges, tablas, modales, gráficas Recharts.
- Botón flotante de WhatsApp y CTA de cotización.

## Notas
- Añadir logo en `Header` (espacio reservado).
- Ajustar copy y datos legales en `app/aviso-legal` y `app/privacidad`.
- Agregar pasarela de pago futura: integrar en flujo de carrito manteniendo cálculo de IVA y mínimos.
