'use client';

import { useEffect } from 'react';
import { checkAndInitializeHostels } from '@/utils/initialize-hostels';

/**
 * Component that checks and initializes hostels when the app starts
 * This component renders nothing but performs the initialization in the background
 */
export function HostelInitializer() {
  useEffect(() => {
    const initializeHostels = async () => {
      try {
        await checkAndInitializeHostels();
      } catch (error) {
        console.error('Failed to initialize hostels:', error);
      }
    };

    initializeHostels();
  }, []);

  // This component renders nothing
  return null;
}
