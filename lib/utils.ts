export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(
    value
  );

export const calcVat = (net: number, vatPct = 19) => ({
  net,
  vat: Math.round(net * (vatPct / 100)),
  total: Math.round(net * (1 + vatPct / 100))
});

// Ensures minimum quantity logic (10 unless product allows sample).
export const normalizeQuantity = (qty: number, min: number, allowSample = false) => {
  if (allowSample) return Math.max(1, qty);
  return Math.max(min, qty);
};
