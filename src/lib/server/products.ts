import { ObjectId } from "mongodb";
import { getDb } from "./mongo";

export type ProductInput = {
  name: string;
  retailer: string;
  purchaseDate: string;   // YYYY-MM-DD
  warrantyMonths: number; // e.g. 24
  receiptUrl?: string;    // optional
};

export async function listProducts() {
  const db = await getDb();
  return db.collection("products").find({}).sort({ createdAt: -1 }).toArray();
}

export async function getProduct(id: string) {
  const db = await getDb();
  return db.collection("products").findOne({ _id: new ObjectId(id) });
}

export async function createProduct(input: ProductInput) {
  const db = await getDb();
  return db.collection("products").insertOne({
    ...input,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

export async function updateProduct(id: string, input: ProductInput) {
  const db = await getDb();
  return db.collection("products").updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...input, updatedAt: new Date() } }
  );
}

export async function deleteProduct(id: string) {
  const db = await getDb();
  return db.collection("products").deleteOne({ _id: new ObjectId(id) });
}
