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

export async function POST(request: Request) {
  const params = await request.json();
  const userId = params.userId;
  const deckToDeleteName = params.deckName;

  const userDocRef = doc(collection(db, "users"), userId);
  // @ts-ignore
  const userDocSnap = await getDoc(userDocRef);

  const batch = writeBatch(db);
  if (userDocSnap.exists()) {
    batch.update(userDocRef, {
      decks: [
        ...userDocSnap
          .data()
          .decks.filter((deck: Deck) => deck.name !== deckToDeleteName),
      ],
    });
  }

  await batch.commit();

  return new Response(JSON.stringify({ deleted: true }));
}
