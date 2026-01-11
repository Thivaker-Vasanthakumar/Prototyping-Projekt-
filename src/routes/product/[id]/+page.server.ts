import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { getProduct } from "$lib/server/products";

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
