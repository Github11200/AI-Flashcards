"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createDeck } from "@/lib/firebase/crud";
import { Deck } from "@/lib/interfaces/interfaces";
import { Card } from "@/components/ui/card";
import { ModeToggle } from "@/components/mode-toggle";
import checkmarkIcon from "@/public/checkmark.svg";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export default function Page() {
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File>();
  const [deck, setDeck] = useState<Deck>();
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const generateDeckFromText = (userDescription: string) => {
    fetch("/api/generateDeckFromText", {
      method: "POST",
      body: JSON.stringify({ description: userDescription }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        setDeck(data);
      });
  };

  const handleSubmit = async () => {
    if (description === "" && !file) {
      setNotificationMessage("Please enter a description or upload an image.");
      setNotificationVisible(true);
      return;
    } else if (description !== "" && file) {
      setNotificationMessage(
        "Please enter either a description or upload an image, not both."
      );
      setNotificationVisible(true);
      return;
    } else if (description !== "") {
      setLoading(true);
      generateDeckFromText(description);
    } else {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64String = e.target?.result;
        setLoading(true);
        fetch("/api/generateDeckFromFile", {
          method: "POST",
          body: JSON.stringify({ base64String: base64String }),
        })
          .then((res) => res.json())
          .then((data) => {
            let fullText = "";
            data.data.ParsedResults.forEach((result: any) => {
              fullText += result.ParsedText;
            });
            generateDeckFromText(fullText);
          });
      };
      reader.readAsDataURL(file as Blob);
    }
  };

  const handleNewDeckCreation = async () => {
    try {
      await createDeck({ userId: "", newDeck: deck as Deck });
      setNotificationMessage("Deck saved successfully!");
      setNotificationVisible(true);
      setTimeout(() => {
        setNotificationVisible(false);
      }, 3000); // Hide notification after 3 seconds
    } catch (error) {
      setNotificationMessage("Failed to save the deck.");
      setNotificationVisible(true);
      setTimeout(() => {
        setNotificationVisible(false);
      }, 3000); // Hide notification after 3 seconds
    }
  };

  return (
    <div className="grid gap-10">
      <div className="flex flex-row items-center justify-between">
        <Link href="/dashboard">
          <Button variant="outline">
            <ChevronLeft />
          </Button>
        </Link>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
          New Deck
        </h1>
        <div className="flex space-x-4">
          <ModeToggle />
        </div>
      </div>
      <div>
        <div className="flex flex-col items-center space-y-4 w-full max-w-md mx-auto">
          <Label htmlFor="description">Deck Description 💬</Label>
          <Input
            placeholder="Create a deck about planets..."
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
          />
          <h3>Or...</h3>
          <Label htmlFor="image">Image of your notes 📷</Label>
          <Input
            placeholder="Create a deck about planets..."
            id="image"
            type="file"
            accept="image/*, application/pdf"
            onChange={(e) => {
              if (e.target.files && e.target.files[0].size / 1000 > 1024) {
                setNotificationMessage(
                  "File size too large. Please upload a file less than 1MB. Otherwise, upload a PDF less than 3 pages."
                );
                setNotificationVisible(true);
                return;
              } else {
                setFile(e.target.files![0]);
              }
            }}
          />
          <Button
            className="justify-self-end w-full"
            onClick={() => handleSubmit()}
          >
            Generate!
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="w-full flex flex-wrap gap-4 justify-center">
          {loading && <Skeleton className="w-full h-96" />}
          {deck !== undefined ? (
            deck.cards.map((card, index) => (
              <div className="flip-card" key={index}>
                <div className="flip-card-inner">
                  <Card className="size-60 flex items-center justify-center hover:hidden flip-card-front">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0 text-center">
                      {card.front}
                    </h2>
                  </Card>
                  <Card className="size-60 flex items-center justify-center absolute flip-card-back p-4">
                    <h2 className="scroll-m-20 text-lg font-semibold tracking-tight first:mt-0 text-center">
                      {card.back}
                    </h2>
                  </Card>
                </div>
              </div>
            ))
          ) : (
            <div></div>
          )}
        </div>
        {deck && (
          <div className="flex justify-center mt-4">
            <Button onClick={() => handleNewDeckCreation()}>Save Deck</Button>
          </div>
        )}
      </div>

      {/* Notification */}
      {notificationVisible && (
        <div className="fixed bottom-5 right-5 bg-green-500 text-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
          <Image
            src="/checkmark.svg"
            alt="Checkmark icon"
            width={6}
            height={6}
          />
          <span>{notificationMessage}</span>
        </div>
      )}
    </div>
  );
}
