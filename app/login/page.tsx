"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (session?.user?.role === "admin") {
      router.push("/dashboard");
    } else if (session?.user?.role === "organizer") {
      router.push("/organizer-dashboard");
    } else if (session?.user?.role === "superadmin") {
      router.push("/admin-dashboard");
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (res?.error) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 px-4">
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-10">
       <div className="text-2xl mb-4 font-bold text-center ">
      <div className="flex justify-center ">
    <Image 
      src="/logo/logo.png"
      alt="logo"
      width={150}
      height={150}
      className="h-auto w-auto"
        />
       </div>
      </div>

        <input
          className="w-full p-2 border rounded"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="w-full p-2 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Sign In
        </button>
      </form>
    </div>
  );
}
