"use client";

import HomePage from "@/pages/home";
import { signIn, useSession } from "next-auth/react";

export default function AuthComponent() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div>
        <h1>You must sign in</h1>
        <button onClick={() => signIn("google")}>Sign in with Google</button>
      </div>
    );
  }

  return (
    <div>
      <div>
        <HomePage />
      </div>
    </div>
  );
}
