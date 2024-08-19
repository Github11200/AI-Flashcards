"use client";

import { SignIn, SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  console.log(window.history);

  return (
    <div className="flex flex-col gap-10 justify-center">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
        Sign Up
      </h1>
      <div className="mx-auto">
        <SignUp forceRedirectUrl={"/addAccount"} />
      </div>
      <p className="text-center font-bold">
        This page will only be available once, make your account now.
      </p>
    </div>
  );
}
