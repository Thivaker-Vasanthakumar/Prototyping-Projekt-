import type { PageServerLoad, Actions } from "./$types";
import { deleteProduct, listProducts } from "$lib/server/products";

export const load: PageServerLoad = async () => {
  const products = await listProducts();

  return {
    products: products.map((p: any) => ({
      ...p,
      _id: p._id.toString()
    }))
  };
};

export const actions: Actions = {
  delete: async ({ request }) => {
    const data = await request.formData();
    const id = String(data.get("id") ?? "");
    if (!id) return { ok: false };

    await deleteProduct(id);
    return { ok: true };
  }
};
