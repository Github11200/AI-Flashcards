import { SignIn, SignUp } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex flex-col gap-10 justify-center">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
        Sign In
      </h1>
      <div className="mx-auto">
        <SignIn forceRedirectUrl={"/checkAccount"} />
      </div>
    </div>
  );
}
