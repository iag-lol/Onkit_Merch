export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ONKIT MERCH",
    description: "Kits personalizados y merchandising corporativo en Chile",
    url: "https://onkitmerch.com",
    logo: "https://onkitmerch.com/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+56-9-8475-2936",
      contactType: "customer service",
      email: "onkitmerch@outlook.com",
      areaServed: "CL",
      availableLanguage: ["Spanish"],
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "CL",
      addressLocality: "Chile",
    },
    sameAs: [
      "https://wa.me/56984752936",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://onkitmerch.com",
    name: "ONKIT MERCH",
    description: "Kits personalizados, producción bajo demanda para empresas, colegios, sport y eventos",
    image: "https://onkitmerch.com/og-image.jpg",
    url: "https://onkitmerch.com",
    telephone: "+56-9-8475-2936",
    email: "onkitmerch@outlook.com",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressCountry: "CL",
    },
    geo: {
      "@type": "GeoCoordinates",
      addressCountry: "CL",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "47",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ONKIT MERCH",
    url: "https://onkitmerch.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://onkitmerch.com/catalogo?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ProductSchema({ product }: { product: any }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image || "https://onkitmerch.com/product-placeholder.jpg",
    sku: product.id,
    offers: {
      "@type": "Offer",
      url: `https://onkitmerch.com/catalogo#${product.id}`,
      priceCurrency: "CLP",
      price: product.basePrice,
      priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      itemCondition: "https://schema.org/NewCondition",
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "ONKIT MERCH",
      },
    },
    brand: {
      "@type": "Brand",
      name: "ONKIT MERCH",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "12",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({ items }: { items: Array<{ name: string; url: string }> }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQSchema({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
