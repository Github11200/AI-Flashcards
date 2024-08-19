"use client";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  SignIn,
  SignedIn,
  SignedOut,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";
import ParticlesBackground from "@/components/ParticlesBackground";
import { useState, useEffect } from "react";

//----------stripe import----
import getStripe from "@/lib/stripe/get-stripe";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import Image from "next/image";

//--------------------------

export default function Home() {
  const { user } = useUser();
  if (user) {
    // redirect("/checkAccount");
  }

  //-----------------stripe function----------------
  const handleSubmit = async () => {
    const checkoutSession = await fetch("/api/checkout_session", {
      method: "POST",
    });

    const checkoutSessionJson = await checkoutSession.json();

    if (checkoutSession.status === 500) {
      console.error(checkoutSessionJson.message);
      return;
    }
    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });

    if (error) {
      console.error(error.message);
    }
  };
  //------------------------------------

  return (
    <div className="relative min-h-screen">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
        {/* Top-left logo and title */}
        <div className="absolute top-4 left-4 flex items-center space-x-2">
          <Image
            src="/logo.svg"
            alt="FlashFlorte logo"
            width={40}
            height={40}
          />
          <h1 className="text-2xl font-extrabold tracking-tight lg:text-3xl">
            FlashFlorte
          </h1>
        </div>
        {/* Tab Naviagation */}
        <div className="flex-1 top-4 flex justify-center space-x-20">
          <a href="#home" className="text-lg font-semibold">
            Home
          </a>
          <a href="#features" className="text-lg font-semibold">
            Features
          </a>
          <a href="#pricing" className="text-lg font-semibold">
            Pricing
          </a>
        </div>

        {/* Top-right controls */}
        <div className="absolute top-4 right-4 flex items-center space-x-4">
          <ModeToggle />
          <SignedIn>
            <UserButton />
            <SignOutButton />
          </SignedIn>
          <SignedOut>
            <div className="flex space-x-4">
              <Link href="/sign-in">
                <Button>Login</Button>
              </Link>
            </div>
          </SignedOut>
        </div>
      </nav>

      {/* Title content */}
      <div
        id="home"
        className="flex flex-col items-center justify-center min-h-screen p-4"
      >
        <div className="flex flex-col items-center justify-center">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            More time studying flashcards,
            <br />
            less time creating them.
          </h1>
          <ParticlesBackground />
          <p className="text-lg mb-8">
            Create flashcards using text and images, organize them into decks,
            and study them with ease.
          </p>
          <SignedIn>
            <Link href="/dashboard">
              <Button className="mb-4">View My Decks</Button>
            </Link>
          </SignedIn>
        </div>
        <video
          className="xl:w-3/6 w-5/6 rounded-2xl mt-10 border-2 p-3"
          autoPlay
          muted
          loop
        >
          <source src="/demo.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Features section */}
      <div
        id="features"
        className="flex flex-col items-center min-h-screen p-4"
      >
        <h2 className="text-3xl font-bold mb-16 text-center">Features</h2>
        <div className="flex flex-wrap justify-center gap-8 max-w-[1200px]">
          <Card className="flex flex-col items-center bg-slate-90 dhadow-md rounded-lg p-6 w-80 h-75 hover:shadow-lg transition-shadow duration-300">
            <svg
              className="w-12 h-12 text-green-500 mb-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h16v16H4z" />
              <path d="M8 4v16M16 4v16" />
            </svg>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
              Create Flashcards
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Easily create your own flashcards with our intuitive interface.
            </p>
          </Card>
          <Card className="flex flex-col items-center bg-slate-90 shadow-md rounded-lg p-6 w-80 h-75 hover:shadow-lg transition-shadow duration-300">
            <svg
              className="w-12 h-12 text-green-500 mb-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 6h16v12H4z" />
              <path d="M12 6v12M8 12h8" />
            </svg>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
              Manage Decks
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Organize and manage your flashcard decks with ease.
            </p>
          </Card>
          <Card className="flex flex-col items-center bg-slate-90 shadow-md rounded-lg p-6 w-80 h-75 hover:shadow-lg transition-shadow duration-300">
            <svg
              className="w-12 h-12 text-green-500 mb-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M12 22l10-5V7L12 2 2 7v10l10 5z" />
            </svg>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
              Review Flashcards
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Review your flashcards to reinforce your learning and retention.
            </p>
          </Card>
          <Card className="flex flex-col items-center bg-slate-90 shadow-md rounded-lg p-6 w-80 h-75 hover:shadow-lg transition-shadow duration-300">
            <svg
              className="w-12 h-12 text-green-500 mb-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h16v16H4z" />
              <path d="M8 4v16M16 4v16" />
            </svg>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
              AI Generated Flashcards
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Create customized flashcards with AI-generated content.
            </p>
          </Card>
          <Card className="flex flex-col items-center bg-slate-90 shadow-md rounded-lg p-6 w-80 h-75 hover:shadow-lg transition-shadow duration-300">
            <svg
              className="w-12 h-12 text-green-500 mb-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h16v16H4z" />
              <path d="M8 4v16M16 4v16" />
            </svg>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
              Notes-to-Flashcards
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Use an image of your notes to create flashcards.
            </p>
          </Card>
        </div>
      </div>

      {/* Pricing section */}
      <div id="pricing" className="flex flex-col items-center min-h-screen p-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Pricing</h2>
        <p className="text-lg mb-16 max-w-lg">
          One simple plan. No hidden fees. Cancel anytime.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
          <Card className="flex-1 max-w-md flex flex-col items-center gap-8 shadow-md rounded-lg p-8 w-[350px] hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
              Basic Version
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-2xl">
              $5/month
            </p>
            <ul className="text-gray-600 dark:text-gray-300 list-disc">
              <li>Generate cards from text</li>
              <li>Generate cards from images</li>
              <li>Manage and study decks</li>
            </ul>
            <Button
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
              onClick={handleSubmit}
            >
              Get Started
            </Button>
          </Card>
        </div>
      </div>
      <footer className="mt-16 px-4 py-8 bg-slate-100 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600 dark:text-gray-400">
            © 2024 FlashFlorte. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
