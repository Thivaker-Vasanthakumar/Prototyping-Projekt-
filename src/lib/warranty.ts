export function addMonths(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

export function warrantyInfo(purchaseDateISO: string, warrantyMonths: number) {
  const purchase = new Date(purchaseDateISO);
  const end = addMonths(purchase, warrantyMonths);

  const today = new Date();
  const msLeft = end.getTime() - today.getTime();
  const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));

  let status: "aktiv" | "läuft bald ab" | "abgelaufen";
  if (daysLeft < 0) status = "abgelaufen";
  else if (daysLeft <= 30) status = "läuft bald ab";
  else status = "aktiv";

  return { endISO: end.toISOString().slice(0, 10), daysLeft, status };
}
