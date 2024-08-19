import { db } from "@/firebase";
import { clerkClient } from "@clerk/nextjs/server";
import {
  collection,
  getDocs,
  query,
  doc,
  writeBatch,
} from "firebase/firestore";

export async function POST(request: Request) {
  const userId = (await request.json()).userId;

  const userDocRef = doc(collection(db, "users"), userId);
  const batch = writeBatch(db);
  batch.set(userDocRef, { decks: [] });
  await batch.commit();

  return new Response(JSON.stringify([]));
}
