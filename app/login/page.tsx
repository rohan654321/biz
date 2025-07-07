"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (res?.ok) {
      router.push("/dashboard");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <input type="text" name="username" placeholder="Username" className="border p-2 w-full" />
      <input type="password" name="password" placeholder="Password" className="border p-2 w-full" />
      <button type="submit" className="bg-blue-500 text-white p-2 w-full">Login</button>
        <button
            type="button"
            onClick={() => signIn("google")}
            className="bg-red-500 text-white p-2 w-full"
        >
            Login with Google
        </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
