const ARS_FORMATTER = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 2,
});

export function formatCurrency(amountInCents: number): string {
  return ARS_FORMATTER.format(amountInCents / 100);
}

export function stringAmountToCents(amount: string): number | null {
  const match = /^(?!0+(?:[.,]0{1,2})?$)(\d+)(?:[.,](\d{1,2}))?$/.exec(amount);

  if (!match) {
    return null;
  }

  const integerPart = Number(match[1]);
  const decimalPart = Number((match[2] ?? "").padEnd(2, "0"));

  const cents = integerPart * 100 + decimalPart;

  if (!Number.isSafeInteger(cents)) {
    return null;
  }

  return cents;
}
