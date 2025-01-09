'use client'

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import Image from 'next/image';
import Logo from '@/public/hit_logo.png';
import BackgroundImage from '@/public/acbackground.jpg'; // Ensure this image is available in your `/public` folder.

export default function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn();
      toast.success('Successfully logged in!');
    } catch (error) {
      toast.error('Failed to log in. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side with background image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src={BackgroundImage}
          alt="Background"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 bg-gradient-to-b from-blue-600/50 to-blue-900/50">
          <h1 className="text-4xl font-bold mb-4 text-center text-white">
            Welcome to the HIT Accommodation Application Portal
          </h1>
          <p className="text-xl text-center text-white">
            Sign in to access your account
          </p>
        </div>
      </div>

      {/* Right side with login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-100 p-8">
        <div className="w-full max-w-md">
          <div className="bg-white shadow-lg rounded-2xl px-8 py-10 space-y-8">
            <div className="text-center">
              <Image src={Logo} alt="logo" width={100} height={100} className="mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
              <p className="text-gray-600 mt-2">
                Please sign in with your HIT account
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Sign in with Google
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
