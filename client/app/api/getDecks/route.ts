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

  const usersQuery = query(collection(db, "users"));
  let querySnapshot = (await getDocs(usersQuery)).docs.filter(
    (doc) => doc.id === userId
  )[0];

  if (querySnapshot !== undefined) {
    // @ts-ignore
    querySnapshot = querySnapshot.data();
  } else {
    const userDocRef = doc(collection(db, "users"), userId);
    const batch = writeBatch(db);
    batch.set(userDocRef, { decks: [] });
    await batch.commit();
    return new Response(JSON.stringify([]));
  }

  // @ts-ignore
  return new Response(JSON.stringify(querySnapshot.decks));
}
