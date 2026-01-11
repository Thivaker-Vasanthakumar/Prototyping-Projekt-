import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { getProduct, updateProduct } from "$lib/server/products";

export const load: PageServerLoad = async ({ params }) => {
  const product = await getProduct(params.id);
  if (!product) throw redirect(303, "/");

  return {
    product: {
      ...product,
      _id: product._id.toString()
    }
  };
};

export const actions: Actions = {
  default: async ({ request, params }) => {
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

    await updateProduct(params.id, { name, retailer, purchaseDate, warrantyMonths, receiptUrl });

    throw redirect(303, "/");
  }
};
