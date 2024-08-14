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
import { Card,CardHeader,CardContent, CardFooter } from "@/components/ui/card";
import { ModeToggle } from "@/components/mode-toggle";
import { Slider } from "@/components/ui/slider"


export default function Page() {
  const deckName = (useParams().deck as string).replace("-", " ");
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
  // const handleSliderChange = (value: number) => {
  //   setIsFlipped(false);
  //   setCurrentCardIndex(value);
  // };


  useEffect(() => {
    if (userId) {
      getDeck(userId, deckName, setDeck);
    }
  }, [userId]);

  // return (
  //   <div className="flex flex-col items-center h-screen">
  //     <div className="flex flex-row items-center justify-between w-full p-4">
  //       <Link href="/dashboard">
  //         <Button variant="outline">
  //           <ChevronLeft />
  //         </Button>
  //       </Link>
  //       <h1 className="text-4xl font-extrabold tracking-tight text-center">
  //         {deckName}
  //       </h1>
  //       <div className="flex items-center space-x-4">
  //         <ModeToggle /> 
  //         <UserButton />
  //       </div>
     
  //     </div>

  //     {deck && deck.cards.length > 0 ? (
  //       <div className="flex flex-col items-center w-full">
  //         <Card
  //           className={`w-full max-w-4xl h-[32rem] text-center cursor-pointer transition-transform duration-700 mt-10 ${
  //             isFlipped ? "transform rotate-y-180" : ""
  //           }`}
  //           onClick={handleFlip}
  //         >
        
  //           <CardContent className="flex flex-col justify-center items-center h-full">
  //             <div>
  //               {isFlipped ? (
  //                 <div className="text-4xl">
  //                   <p>{deck.cards[currentCardIndex].back}</p>
  //                 </div>
  //               ) : (
  //                 <div className="text-4xl">
  //                   <p>{deck.cards[currentCardIndex].front}</p>
  //                 </div>
  //               )}
  //             </div>
  //             <p className="mt-4">Click card to flip</p>
  //           </CardContent>
  //           <CardFooter className="text-center">
  //             <p className="mt-4">Click card to flip</p>
  //           </CardFooter>
         
  //         </Card>

  //         <div className="flex justify-between items-center mt-4 w-80">
  //           <Button onClick={handlePreviousCard} disabled={currentCardIndex === 0}>
  //             ← Previous
  //           </Button>
  //           <p>
  //             {currentCardIndex + 1}/{deck.cards.length}
  //           </p>
  //           <Button
  //             onClick={handleNextCard}
  //             disabled={currentCardIndex === deck.cards.length - 1}
  //           >
  //             Next →
  //           </Button>
  //         </div>
  //       </div>
  //     ) : (
  //       <p>No cards available for this deck.</p>
  //     )}
  //   </div>
  // );
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
          <ModeToggle /> {/* Add the ModeToggle component here */}
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
            <Button onClick={handlePreviousCard} disabled={currentCardIndex === 0}>
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
          <input
              type="range"
              min="0"
              max={deck.cards.length - 1}
              value={currentCardIndex}
              onChange={handleSliderChange}
              className="w-full mt-4"
            />
            {/* <Slider
              min={0}
              max={deck.cards.length - 1}
              value={currentCardIndex}
              onChange={handleSliderChange}
              className="mt-4"
              style={{ height: '6px', backgroundColor: '#000', color: '#000' }} // Customize styles here
              thumbStyle={{ width: '20px', height: '20px', backgroundColor: '#000' }} // Customize thumb styles here
            /> */}
         
        </div>
        
      ) : (
        <p>No cards available for this deck.</p>
      )}
    </div>
  );
}
