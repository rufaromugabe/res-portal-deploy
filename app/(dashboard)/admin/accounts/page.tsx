"use client";
import React from "react";
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AuthProvider } from "@/components/auth-provider";
import Archived from "@/components/archived";
import AdminAccountManagement from "@/components/accounts-management";

const page = () => {
  const { user, loading, role } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (role !== 'admin') {
        router.push('/unauthorized');
      } else {
        setIsAuthorized(true);
      }
    }
  }, [user, loading, role, router]);

  
  
  return<AuthProvider>
  <AdminAccountManagement/>
  </AuthProvider>;
};

export default page;
