import { db } from "@/firebase";
import { clerkClient } from "@clerk/nextjs/server";
import { collection, getDocs, query } from "firebase/firestore";

// Check if the user exists inside the database
export async function POST(request: Request) {
  const userId = (await request.json()).userId;

  const usersQuery = query(collection(db, "users"));

  let querySnapshot = (await getDocs(usersQuery)).docs.filter((doc) => {
    return doc.id === userId;
  })[0];

  if (!querySnapshot) {
    return new Response(JSON.stringify({ exists: false }));
  }

  return new Response(JSON.stringify({ exists: true }));
}
