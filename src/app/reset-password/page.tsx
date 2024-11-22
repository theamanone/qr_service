"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { VscEye, VscEyeClosed } from "react-icons/vsc";

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const isDarkMode = false; 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Basic validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (password.length < 8) { // Example: minimum length check
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    try {
      const queryParams = new URLSearchParams(window.location.search);
      const token = queryParams.get("token");

      if (!token) {
        setError("Invalid or missing reset token.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "/api/auth/reset-password",
        {
          token,
          password,
          type: "reset",
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("auth_t")}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccess("Password successfully reset.");
        setTimeout(() => router.push("/auth/signin"), 2000); // Redirect after a delay
      } else {
        setError(response.data.message || "Something went wrong.");
      }
    } catch (err) {
      console.log("Error: ", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-100 ${isDarkMode ? "text-white" : "text-black"}`}>
      <div className="container max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Reset Password</h1>
        {error && (
          <p className="text-red-600 mb-4 text-center">{error}</p>
        )}
        {success && (
          <p className="text-green-600 mb-4 text-center">{success}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <div className="flex relative">
              <input
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
              {showPassword ? (
                <VscEye
                  className="text-xl absolute right-2 cursor-pointer top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <VscEyeClosed
                  className="text-xl absolute right-2 cursor-pointer top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              required
              placeholder="Confirm your password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
