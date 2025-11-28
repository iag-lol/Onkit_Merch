import jsPDF from "jspdf";
import "jspdf-autotable";
import { Quote } from "./types";

// Genera un PDF simplificado con logo placeholder y detalle de IVA.
export const generateQuotePdf = (quote: Quote) => {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text("ONKIT MERCH", 14, 18);
  doc.setFontSize(10);
  doc.text("Kits personalizados, producción bajo demanda", 14, 24);

  doc.text(`Cliente: ${quote.customerName}`, 14, 36);
  doc.text(`Empresa: ${quote.company}`, 14, 42);
  doc.text(`Correo: ${quote.email}`, 14, 48);
  doc.text(`Teléfono: ${quote.phone}`, 14, 54);
  doc.text(`Fecha: ${quote.createdAt}`, 14, 60);

  const rows = quote.items.map((item) => [
    item.name,
    item.quantity,
    `$${item.unitPrice.toLocaleString()}`,
    `$${(item.unitPrice * item.quantity).toLocaleString()}`
  ]);

  doc.autoTable({
    head: [["Producto", "Cant.", "Precio unitario (sin IVA)", "Subtotal"]],
    body: rows,
    startY: 70
  });

  doc.text(`Neto: $${quote.netAmount.toLocaleString()}`, 14, doc.lastAutoTable.finalY + 10);
  doc.text(`IVA 19%: $${quote.vat.toLocaleString()}`, 14, doc.lastAutoTable.finalY + 16);
  doc.text(`Total: $${quote.total.toLocaleString()}`, 14, doc.lastAutoTable.finalY + 22);

  doc.save(`cotizacion-${quote.id}.pdf`);
};
