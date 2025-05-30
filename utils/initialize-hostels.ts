import { createHostel } from '../data/hostel-data';
import { initialHostelData } from '../data/initial-hostel-data';

/**
 * Initialize hostel data in Firebase
 * This should be run once to set up the initial hostel structure
 */
export const initializeHostelData = async () => {
  try {
    console.log('Initializing hostel data...');
    
    for (const hostelData of initialHostelData) {
      console.log(`Creating ${hostelData.name}...`);
      const hostelId = await createHostel(hostelData);
      console.log(`Created ${hostelData.name} with ID: ${hostelId}`);
    }
    
    console.log('Hostel data initialization completed successfully!');
    return true;
  } catch (error) {
    console.error('Error initializing hostel data:', error);
    return false;
  }
};

// Uncomment the line below to run the initialization (only run once!)
// initializeHostelData();
