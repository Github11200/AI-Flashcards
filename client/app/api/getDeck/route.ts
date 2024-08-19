import { db } from "@/firebase";
import { collection, getDocs, query } from "firebase/firestore";
import { Deck } from "@/lib/interfaces/interfaces";

export async function POST(request: Request) {
  const params = await request.json();
  const userId = params.userId as string;
  const deckName = params.deckName as string;

  const usersCollection = query(collection(db, "users"));
  const currentUser = (await getDocs(usersCollection)).docs.filter(
    (doc) => doc.id === userId
  )[0];

  const deck: Deck = currentUser.data().decks.filter((deck: Deck) => {
    return deck.name === deckName;
  })[0];

  return new Response(JSON.stringify(deck));
}
