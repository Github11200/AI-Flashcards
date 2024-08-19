"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ResultPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCheckoutSession = async () => {
      if (!sessionId) return;

      try {
        const res = await fetch(
          `/api/checkout_session?session_id=${sessionId}`
        );
        const sessionData = await res.json();
        if (res.ok) {
          setSession(sessionData);
        } else {
          setError(sessionData.error);
        }
      } catch (err) {
        setError("An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCheckoutSession();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-600 text-center">{error}</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      {session && session.payment_status === "paid" ? (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">
            Payment Successful! 🎉
          </h1>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            Thank you for your purchase! You&apos;re all set to start enhancing
            your study sessions.
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Session ID: {sessionId}
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            We have received your payment. You will receive an email with the
            order details shortly. <br />
            <span className="font-bold">
              Create your account now, you will not be able to sign up after.
            </span>
          </p>
          <div className="flex space-x-4">
            <Link href="/sign-up" className="w-full">
              <Button className="font-semibold">Create an account</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center max-w-md mx-auto">
          <div className="flex justify-center items-center mb-4">
            <svg
              className="w-12 h-12 text-red-600 dark:text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m0-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-red-600 dark:text-red-400 mb-2">
            Payment Failed 😞
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Oops! Something went wrong with your payment. Please try again or
            contact support if the issue persists.
          </p>
          <div className="flex justify-center space-x-4 mt-6 pb-7">
            <Link href="#">
              <Button className="font-semibold py-2 px-8 rounded-full shadow-md transition duration-200 ease-in-out transform hover:scale-105 w-auto whitespace-nowrap">
                Try Again
              </Button>
            </Link>

            <Link href="/">
              <Button className="font-semibold py-2 px-8 rounded-full shadow-md transition duration-200 ease-in-out transform hover:scale-105">
                Return Home
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultPage;
