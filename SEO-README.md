# SEO Optimization Guide - ONKIT MERCH

## 🎯 SEO Improvements Implemented

### 1. **Metadata Completa** ✅
- Title tags optimizados con palabras clave
- Meta descriptions únicas por página
- Keywords relevantes para Chile y merchandising
- Canonical URLs
- Author y publisher metadata

### 2. **Open Graph Tags** ✅
- Optimizado para compartir en Facebook, LinkedIn
- Imágenes OG de 1200x630px
- Locale configurado para es_CL
- Type: website

### 3. **Twitter Cards** ✅
- Summary large image card
- Optimizado para compartir en Twitter/X
- Mismas imágenes que Open Graph

### 4. **Structured Data (Schema.org)** ✅

Implementado en `/components/seo/StructuredData.tsx`:

- **OrganizationSchema**: Información de la empresa
- **LocalBusinessSchema**: Negocio local con horarios y rating
- **WebsiteSchema**: Sitio web con search action
- **ProductSchema**: Productos individuales
- **BreadcrumbSchema**: Navegación
- **FAQSchema**: Preguntas frecuentes

### 5. **Sitemap.xml** ✅
- Generado automáticamente en `/app/sitemap.ts`
- Incluye todas las páginas públicas
- Frecuencia de actualización configurada
- Prioridades asignadas

### 6. **Robots.txt** ✅
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Sitemap: https://onkitmerch.com/sitemap.xml
```

### 7. **PWA Ready** ✅
- site.webmanifest configurado
- Theme color: #1DB9A0
- Icons ready (pendiente generar imágenes)

### 8. **Optimizaciones Técnicas** ✅
- Font display: swap (mejora LCP)
- Lang: es-CL
- Canonical URLs
- Mobile optimized meta tags

---

## 📋 Tareas Pendientes

### Imágenes que necesitas crear:

1. **Favicon**:
   - `/public/favicon.ico` (32x32)
   - `/public/favicon-16x16.png`
   - `/public/favicon-32x32.png`

2. **Apple Touch Icons**:
   - `/public/apple-touch-icon.png` (180x180)

3. **Android Chrome**:
   - `/public/android-chrome-192x192.png`
   - `/public/android-chrome-512x512.png`

4. **Open Graph**:
   - `/public/og-image.jpg` (1200x630)
   - Debe mostrar el logo y tagline de ONKIT MERCH

5. **Logo**:
   - `/public/logo.png` (para Schema.org)

### Google Search Console

1. Ir a [Google Search Console](https://search.google.com/search-console)
2. Agregar propiedad: `https://onkitmerch.com`
3. Verificar propiedad (descargar archivo de verificación)
4. Copiar el código de verificación
5. Actualizar en `/app/layout.tsx` línea 91:
   ```typescript
   google: "tu-codigo-de-verificacion-aqui"
   ```
6. Subir sitemap manualmente:
   - URL: `https://onkitmerch.com/sitemap.xml`

### Variable de Entorno

Agregar en Render/Vercel:
```
NEXT_PUBLIC_SITE_URL=https://onkitmerch.com
```

---

## 🔍 Palabras Clave Optimizadas

### Principales:
- kits personalizados
- merchandising corporativo
- regalos empresariales chile
- kits onboarding
- uniformes corporativos

### Secundarias:
- merchandising eventos
- regalos ejecutivos
- kits deportivos
- merchandising colegios
- producción merchandising

### Long-tail:
- "kits personalizados para empresas en chile"
- "merchandising corporativo santiago"
- "regalos empresariales personalizados"

---

## 📊 Métricas Esperadas

### Core Web Vitals Targets:
- **LCP**: < 2.5s (optimizado con font display:swap)
- **FID**: < 100ms
- **CLS**: < 0.1

### SEO Targets:
- Indexación: 100% de páginas públicas
- Rich snippets: Habilitado con Schema.org
- Mobile-friendly: Sí
- HTTPS: Requerido

---

## 🛠️ Herramientas de Verificación

### Testear SEO:
1. **Google Rich Results Test**: https://search.google.com/test/rich-results
2. **PageSpeed Insights**: https://pagespeed.web.dev/
3. **Mobile-Friendly Test**: https://search.google.com/test/mobile-friendly
4. **Schema.org Validator**: https://validator.schema.org/

### Verificar Social Sharing:
1. **Facebook Debugger**: https://developers.facebook.com/tools/debug/
2. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
3. **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/

---

## 📝 Checklist Final

- [x] Meta tags completos
- [x] Open Graph tags
- [x] Twitter Cards
- [x] Structured Data (Schema.org)
- [x] Sitemap.xml
- [x] Robots.txt
- [x] Manifest.json
- [ ] Generar imágenes (favicon, og-image, logos)
- [ ] Configurar Google Search Console
- [ ] Configurar variable NEXT_PUBLIC_SITE_URL
- [ ] Testear con Rich Results Test
- [ ] Testear social sharing
- [ ] Verificar indexación en Google

---

## 🚀 Próximos Pasos

1. **Generar imágenes faltantes**
2. **Configurar Google Search Console**
3. **Agregar Google Analytics**
4. **Configurar Google Tag Manager**
5. **Implementar tracking de conversiones**
6. **Crear contenido para blog (opcional)**

---

## 📈 Mejoras Futuras

- [ ] Blog/Noticias para contenido fresco
- [ ] Reviews con Schema.org
- [ ] Videos con VideoObject schema
- [ ] AMP pages (opcional)
- [ ] Multilingual (inglés)
- [ ] Local SEO (Google Business Profile)
