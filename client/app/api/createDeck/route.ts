import { db } from "@/firebase";
import { Deck } from "@/lib/interfaces/interfaces";
import {
  collection,
  getDocs,
  query,
  writeBatch,
  doc,
  getDoc,
} from "firebase/firestore";

export interface CreateDeckRequestParams {
  userId: string;
  newDeck: Deck;
}

export async function POST(request: Request) {
  const params: CreateDeckRequestParams = await request.json();
  const userId = "user_2kclYQ1Cu80UtPyVqfbAsbkkXDa";
  const newDeck = params.newDeck;

  const userDocRef = doc(collection(db, "users"), userId);
  // @ts-ignore
  const userDocSnap = await getDoc(userDocRef);

  const batch = writeBatch(db);
  if (userDocSnap.exists()) {
    batch.update(userDocRef, {
      decks: [...userDocSnap.data().decks, newDeck],
    });
  } else {
    batch.set(userDocRef, {
      decks: [newDeck],
    });
  }

  await batch.commit();

  return new Response(JSON.stringify({ what: true }));
}
