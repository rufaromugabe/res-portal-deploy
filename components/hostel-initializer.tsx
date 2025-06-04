'use client';

import { useEffect, useRef } from 'react';
import { checkAndInitializeHostels } from '@/utils/initialize-hostels';

/**
 * Component that checks and initializes hostels when the app starts
 * This component renders nothing but performs the initialization in the background
 */
export function  HostelInitializer() {
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Prevent multiple initializations
    if (hasInitialized.current) {
      console.log('Hostel initialization already attempted, skipping...');
      return;
    }

    const initializeHostels = async () => {
      try {
        hasInitialized.current = true;
        console.log('Starting hostel initialization...');
        await checkAndInitializeHostels();
      } catch (error) {
        console.error('Failed to initialize hostels:', error);
        // Reset flag on error so it can be retried
        hasInitialized.current = false;
      }
    };

    initializeHostels();
  }, []);

  // This component renders nothing
  return null;
}
