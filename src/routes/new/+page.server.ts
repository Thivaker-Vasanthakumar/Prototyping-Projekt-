import type { Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { createProduct } from "$lib/server/products";

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();

    const name = String(data.get("name") ?? "").trim();
    const retailer = String(data.get("retailer") ?? "").trim();
    const purchaseDate = String(data.get("purchaseDate") ?? "").trim();
    const warrantyMonthsRaw = String(data.get("warrantyMonths") ?? "").trim();
    const receiptUrlRaw = String(data.get("receiptUrl") ?? "").trim();
    const receiptUrl = receiptUrlRaw ? receiptUrlRaw : undefined;

    const warrantyMonths = Number(warrantyMonthsRaw);

    const errors: Record<string, string> = {};
    if (!name) errors.name = "Bitte Produktname eingeben.";
    if (!retailer) errors.retailer = "Bitte Händler eingeben.";
    if (!purchaseDate) errors.purchaseDate = "Bitte Kaufdatum wählen.";
    if (!Number.isFinite(warrantyMonths) || warrantyMonths <= 0)
      errors.warrantyMonths = "Garantie (Monate) muss > 0 sein.";
    if (receiptUrl && !/^https?:\/\//i.test(receiptUrl))
      errors.receiptUrl = "Bitte eine gültige URL (http/https) eingeben.";

    if (Object.keys(errors).length > 0) {
      return fail(400, {
        errors,
        values: { name, retailer, purchaseDate, warrantyMonths: warrantyMonthsRaw, receiptUrl: receiptUrlRaw }
      });
    }

    await createProduct({ name, retailer, purchaseDate, warrantyMonths, receiptUrl });

    throw redirect(303, "/");
  }
};
