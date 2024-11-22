"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { Input, Button } from "@nextui-org/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function SignInPage() {
  const [email, setEmail] = useState("demo@gmail.com");
  const [password, setPassword] = useState("Demo@123");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordToggle = () => setShowPassword(!showPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError(result.error);
      setSuccess("");
    } else {
      setSuccess("Successfully signed in!");
      setError("");
      window.location.href = "/";
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-gray-200 p-4 text-black">
      <div className="w-full max-w-md p-8 my-14 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-3xl font-semibold text-center text-gray-800">
          Sign In
        </h1>

        {/* Display error or success message */}
        {error && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 border border-green-300 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <Input
              id="email"
              type="email"
              label="Email"
              value={email}
              variant="bordered"
              required
              onChange={(e) => setEmail(e.target.value)}
              className=" focus:border-blue-500"
            />
          </div>

          <div>
            <div className="relative">
              <Input
                id="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                variant="bordered"
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-gray-300 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handlePasswordToggle}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            color="primary"
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            Sign In
          </Button>
        </form>

        <div className="my-6 border-t border-gray-300"></div>

        <p className="mt-6 text-sm text-center text-gray-600">
          Forgot your password?{" "}
          <Link href="/request-reset-password" className="text-blue-500 hover:underline">
            Reset it here
          </Link>
          <span> | </span>
          Don’t have an account?{" "}
          <Link href="/auth/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
