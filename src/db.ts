import { MongoClient, Db, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
let db: Db;

export async function connectDB() {
  await client.connect();
  db = client.db();
  await db.collection("events").createIndex({ date: 1 });
  await db.collection("events").createIndex({ creatorEmail: 1, date: 1 });
  await db.collection("joins").createIndex({ eventId: 1, userEmail: 1 }, { unique: true });
  return db;
}

export function getDB() {
  if (!db) throw new Error("Database is not connected.");
  return db;
}

export { ObjectId };
