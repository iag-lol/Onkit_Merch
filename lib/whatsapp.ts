// WhatsApp integration utilities

const WHATSAPP_NUMBER = "56984752936"; // Tu número de WhatsApp

export function sendProductToWhatsApp(product: {
  name: string;
  basePrice: number;
  category: string;
}, quantity: number = 10) {
  const message = `Hola! Me interesa el siguiente producto:

📦 *Producto:* ${product.name}
📂 *Categoría:* ${product.category}
🔢 *Cantidad:* ${quantity} unidades
💰 *Precio unitario:* $${product.basePrice.toLocaleString()} + IVA

¿Podrían enviarme más información?`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

export function sendQuoteToWhatsApp(formData: {
  nombre: string;
  email: string;
  telefono: string;
  tipo: string;
  empresa: string;
  detalle: string;
}) {
  const message = `Hola! Solicito cotización:

👤 *Nombre:* ${formData.nombre}
✉️ *Email:* ${formData.email}
📱 *Teléfono:* ${formData.telefono}
🏢 *Tipo:* ${formData.tipo}
🏛️ *Empresa:* ${formData.empresa}

📝 *Detalle:*
${formData.detalle}`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

export function getWhatsAppLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
