'use client';

import { useEffect } from 'react';
import { initializePaymentScheduler } from '@/lib/payment-scheduler';

export function PaymentSchedulerInit() {
  useEffect(() => {
    // Only initialize in production and on the client side
    if (typeof window !== 'undefined') {
      initializePaymentScheduler();
    }
  }, []);

  // This component doesn't render anything
  return null;
}
