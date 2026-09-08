const ARS_FORMATTER = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 2,
});

export function formatCurrency(amountInCents: number): string {
  return ARS_FORMATTER.format(amountInCents / 100);
}
