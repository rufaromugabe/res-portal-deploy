'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
export default function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Unauthorized</h1>
        <p className="text-gray-700 mb-8">You do not have permission to access this page.</p>
        <Button className="w-full" onClick={() => window.location.href = "/login"}>
            Go to login page
          </Button>
      </div>
    </div>
  );
}