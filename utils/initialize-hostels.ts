// filepath: c:\Users\rufaro\Documents\Projects\res-portal-deploy\utils\initialize-hostels.ts
import { createHostel, fetchHostels } from '../data/hostel-data';
import { initialHostelData } from '../data/initial-hostel-data';

/**
 * Check if hostels exist in Firebase and initialize them if they don't
 * This function should be called when the app starts up
 */
export const checkAndInitializeHostels = async (): Promise<boolean> => {
  try {
    console.log('Checking for existing hostels in Firebase...');
    
    // Fetch existing hostels
    const existingHostels = await fetchHostels();
    
    if (existingHostels.length > 0) {
      console.log(`Found ${existingHostels.length} existing hostel(s). Skipping initialization.`);
      return true;
    }
    
    console.log('No hostels found. Initializing hostel data...');
    
    // Initialize hostels if none exist
    for (const hostelData of initialHostelData) {
      console.log(`Creating ${hostelData.name}...`);
      const hostelId = await createHostel(hostelData);
      console.log(`✅ Created ${hostelData.name} with ID: ${hostelId}`);
    }
    
    console.log('🎉 Hostel data initialization completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error checking/initializing hostel data:', error);
    return false;
  }
};

/**
 * Force initialize hostel data (will create duplicates if hostels already exist)
 * Use this only for testing or when you want to add new hostels
 */
export const forceInitializeHostelData = async (): Promise<boolean> => {
  try {
    console.log('Force initializing hostel data...');
    
    for (const hostelData of initialHostelData) {
      console.log(`Creating ${hostelData.name}...`);
      const hostelId = await createHostel(hostelData);
      console.log(`✅ Created ${hostelData.name} with ID: ${hostelId}`);
    }
    
    console.log('🎉 Force hostel data initialization completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error force initializing hostel data:', error);
    return false;
  }
};
