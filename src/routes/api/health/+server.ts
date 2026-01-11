import { json } from "@sveltejs/kit";
import { MongoClient } from "mongodb";
import { MONGODB_URI, MONGODB_DB } from "$env/static/private";

export async function GET() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db(MONGODB_DB);
    await db.command({ ping: 1 });
    return json({ ok: true, db: MONGODB_DB });
  } catch (e) {
    return json({ ok: false, error: String(e) }, { status: 500 });
  } finally {
    await client.close();
  }
}
