"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import Image from "next/image";
import Logo from "@/public/hit_logo.png";
import BackgroundImage from "@/public/acbackground.jpg";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { signIn } = useAuth();
  const [selectedPart, setSelectedPart] = useState<"1" | "other">("1");
  const [countdown, setCountdown] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);

  // Target date: June 4, 2025, 08:00
  const targetDate = new Date("2025-06-04T08:00:00");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      // Check if the target date has passed
      if (difference <= 0) {
        setIsApplicationOpen(true);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      // Calculate remaining time
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
      setIsApplicationOpen(false);
    };

    // Initial update
    updateCountdown();

    // Update countdown every second
    const interval = setInterval(updateCountdown, 1000);

    // Clean up interval
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn({ part: selectedPart });
    } catch (error) {
      toast.error("Failed to log in. Please try again.");
    }
  };

  // Format countdown with leading zeros
  const formatNumber = (num: number) => {
    return num.toString().padStart(2, "0");
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side with background image */}
      <motion.div
        className="hidden lg:flex lg:w-1/2 relative"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Image
          src={BackgroundImage || "/placeholder.svg"}
          alt="Background"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0"
        />
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center p-12 bg-gradient-to-b from-blue-600/50 to-blue-900/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <motion.h1
            className="text-4xl font-bold mb-4 text-center text-white"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Welcome to the HIT Accommodation Application Portal
          </motion.h1>
          <motion.p
            className="text-xl text-center text-white"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            Sign in to access your account
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Right side with login form and animated background */}
      <motion.div
        className="w-full lg:w-1/2 flex items-center justify-center p-8 relative overflow-hidden"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 z-0"
          animate={{
            background: [
              "linear-gradient(45deg, #f3f4f6, #e5e7eb)",
              "linear-gradient(45deg, #e5e7eb, #d1d5db)",
              "linear-gradient(45deg, #d1d5db, #f3f4f6)",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />

        <div className="w-full max-w-md z-10">
          <motion.div
            className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl px-8 py-10 space-y-8"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <motion.div
              className="text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <Image
                src={Logo || "/placeholder.svg"}
                alt="logo"
                width={100}
                height={100}
                className="mx-auto mb-4"
              />
              <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
              <p className="text-gray-600 mt-2">
                Please sign in with your HIT account
              </p>
            </motion.div>

            {/* Tab Navigation */}
            <motion.div
              className="flex bg-gray-100 rounded-lg p-1"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <button
                type="button"
                onClick={() => setSelectedPart("1")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  selectedPart === "1"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Part 1
              </button>
              <button
                type="button"
                onClick={() => setSelectedPart("other")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  selectedPart === "other"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Others
              </button>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {selectedPart === "other" && !isApplicationOpen && (
                <motion.div
                  className="bg-amber-50 border border-amber-200 rounded-lg p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-amber-800 text-sm text-center mb-3">
                    Only Part 1s can apply at the moment. You will be able to
                    apply on 4 June 2025 at 08:00.
                  </p>

                  {/* Countdown Timer */}
                  <div className="flex justify-center items-center space-x-2">
                    <div className="flex flex-col items-center">
                      <div className="bg-white text-blue-600 font-mono font-bold rounded-md px-2 py-1 text-lg">
                        {formatNumber(countdown.days)}
                      </div>
                      <span className="text-xs text-amber-800 mt-1">Days</span>
                    </div>
                    <span className="text-amber-800 font-bold">:</span>
                    <div className="flex flex-col items-center">
                      <div className="bg-white text-blue-600 font-mono font-bold rounded-md px-2 py-1 text-lg">
                        {formatNumber(countdown.hours)}
                      </div>
                      <span className="text-xs text-amber-800 mt-1">Hours</span>
                    </div>
                    <span className="text-amber-800 font-bold">:</span>
                    <div className="flex flex-col items-center">
                      <div className="bg-white text-blue-600 font-mono font-bold rounded-md px-2 py-1 text-lg">
                        {formatNumber(countdown.minutes)}
                      </div>
                      <span className="text-xs text-amber-800 mt-1">Mins</span>
                    </div>
                    <span className="text-amber-800 font-bold">:</span>
                    <div className="flex flex-col items-center">
                      <div className="bg-white text-blue-600 font-mono font-bold rounded-md px-2 py-1 text-lg">
                        {formatNumber(countdown.seconds)}
                      </div>
                      <span className="text-xs text-amber-800 mt-1">Secs</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={selectedPart === "other" && !isApplicationOpen}
                className={`w-full py-2 px-4 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 ${
                  selectedPart === "other" && !isApplicationOpen
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
                }`}
                whileHover={
                  selectedPart === "1" || isApplicationOpen
                    ? { scale: 1.05 }
                    : {}
                }
                whileTap={
                  selectedPart === "1" || isApplicationOpen
                    ? { scale: 0.95 }
                    : {}
                }
              >
                Sign in with Google
              </motion.button>
            </motion.form>

            {/* Bottom message */}
            <motion.div
              className="text-center pt-4 border-t border-gray-200"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <p className="text-sm text-gray-600">
                Only Part 1s can apply at the moment. Applications will open for
                everyone else on 4 June 2025 at 08:00. Thank you.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
