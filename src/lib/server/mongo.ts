import { MongoClient } from "mongodb";
import { MONGODB_URI, MONGODB_DB } from "$env/static/private";
import { dev } from "$app/environment";

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!MONGODB_URI) throw new Error("Missing MONGODB_URI");

if (dev) {
  if (!globalThis._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI);
    globalThis._mongoClientPromise = client.connect();
  }
  clientPromise = globalThis._mongoClientPromise;
} else {
  client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();
}

export async function getDb() {
  const c = await clientPromise;
  return c.db(MONGODB_DB);
}
