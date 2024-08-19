"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { Deck } from "@/lib/interfaces/interfaces";
import { useEffect, useState } from "react";
import { getDeck } from "@/lib/firebase/crud";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ModeToggle } from "@/components/mode-toggle";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";

export default function Page() {
  const deckName = (useParams().deck as string).replaceAll("-", " ");
  const { user } = useUser();
  const userId = user?.id as string;

  const [deck, setDeck] = useState<Deck>();
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  useEffect(() => {
    if (userId) {
      getDeck(userId, deckName, setDeck);
    }
  }, [userId, deckName]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    if (deck && currentCardIndex < deck.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
    console.log(deck?.cards.length);
  };

  const handlePreviousCard = () => {
    setIsFlipped(false);
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };
  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const index = parseInt(event.target.value, 10);
    setIsFlipped(false);
    setCurrentCardIndex(index);
  };

  useEffect(() => {
    if (userId) {
      getDeck(userId, deckName, setDeck);
    }
  }, [userId, deckName]);

  return (
    <div className="flex flex-col items-center h-screen">
      <div className="flex flex-row items-center justify-between w-full p-4 min-h-[4rem]">
        <Link href="/dashboard">
          <Button variant="outline">
            <ChevronLeft />
          </Button>
        </Link>
        <h1 className="text-4xl font-extrabold tracking-tight text-center">
          {deckName}
        </h1>
        <div className="flex items-center space-x-4">
          <ModeToggle />
          <UserButton />
        </div>
      </div>

      {deck && deck.cards.length > 0 ? (
        <div className="flex flex-col items-center w-full">
          <Card
            className="w-full max-w-4xl h-[32rem] text-center cursor-pointer transition-transform duration-700 mt-10 flex flex-col"
            onClick={handleFlip}
          >
            <CardContent className="flex-grow flex items-center justify-center">
              <div className="text-4xl">
                {isFlipped ? (
                  <p>{deck.cards[currentCardIndex].back}</p>
                ) : (
                  <p>{deck.cards[currentCardIndex].front}</p>
                )}
              </div>
            </CardContent>
            <div className="border-t mt-auto">
              <div className="text-center p-2">
                <p>Click card to flip</p>
              </div>
            </div>
          </Card>

          <div className="flex justify-between items-center mt-4 w-80">
            <Button
              onClick={handlePreviousCard}
              disabled={currentCardIndex === 0}
            >
              ← Previous
            </Button>
            <p>
              {currentCardIndex + 1}/{deck.cards.length}
            </p>
            <Button
              onClick={handleNextCard}
              disabled={currentCardIndex === deck.cards.length - 1}
            >
              Next →
            </Button>
          </div>
          <Progress
            value={(currentCardIndex / (deck.cards.length - 1)) * 100}
            min={0}
            max={deck.cards.length - 1}
            onChange={handleSliderChange}
            className="w-full mt-8"
          />
        </div>
      ) : (
        <p>No cards available for this deck.</p>
      )}
    </div>
  );
}
