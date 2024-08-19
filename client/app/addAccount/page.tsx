"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useClerk, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CheckAccountPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch("api/addUserToDatabase", {
        method: "POST",
        body: JSON.stringify({ userId: user.id }),
      }).then(() => {
        setLoading(false);
      });
    }
  }, [user]);

  return (
    <div className="flex justify-center">
      {loading ? (
        <Skeleton className="w-full h-10" />
      ) : (
        <div className="text-center flex flex-col gap-2">
          <p>Account created!</p>
          <Link href="/dashboard">
            <Button>Go to dashboard</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
