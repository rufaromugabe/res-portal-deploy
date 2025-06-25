/**
 * Hostel ID Validation Utilities
 * These utilities ensure strict ID usage throughout the system to prevent duplicate hostels
 */

export interface HostelIdValidationResult {
  isValid: boolean;
  hostelId?: string;
  hostelName?: string;
  error?: string;
}

/**
 * Validates a hostel ID and ensures it exists in the system
 */
export const validateHostelId = async (hostelId: string): Promise<HostelIdValidationResult> => {
  try {
    if (!hostelId || typeof hostelId !== 'string') {
      return {
        isValid: false,
        error: 'Hostel ID must be a non-empty string'
      };
    }

    // Import here to avoid circular dependency
    const { fetchHostelById } = await import('@/data/hostel-data');
    const hostel = await fetchHostelById(hostelId);
    
    if (!hostel) {
      return {
        isValid: false,
        error: `Hostel with ID ${hostelId} not found`
      };
    }

    return {
      isValid: true,
      hostelId: hostel.id,
      hostelName: hostel.name
    };
  } catch (error) {
    return {
      isValid: false,
      error: `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

/**
 * Validates multiple hostel IDs and ensures they all exist
 */
export const validateMultipleHostelIds = async (hostelIds: string[]): Promise<{
  allValid: boolean;
  results: HostelIdValidationResult[];
  invalidIds: string[];
}> => {
  const results = await Promise.all(hostelIds.map(id => validateHostelId(id)));
  const invalidIds = results
    .filter(result => !result.isValid)
    .map(result => result.error || 'Unknown error');

  return {
    allValid: results.every(result => result.isValid),
    results,
    invalidIds
  };
};

/**
 * Finds a hostel ID by name (for migration/cleanup purposes only)
 * This should NOT be used in normal application flow
 */
export const findHostelIdByName = async (hostelName: string): Promise<HostelIdValidationResult> => {
  try {
    if (!hostelName || typeof hostelName !== 'string') {
      return {
        isValid: false,
        error: 'Hostel name must be a non-empty string'
      };
    }

    const { fetchHostels } = await import('@/data/hostel-data');
    const hostels = await fetchHostels();
    
    const normalizedName = hostelName.toLowerCase().trim();
    const matchingHostel = hostels.find(h => h.name.toLowerCase().trim() === normalizedName);
    
    if (!matchingHostel) {
      return {
        isValid: false,
        error: `No hostel found with name "${hostelName}"`
      };
    }

    console.warn(`[ID LOOKUP] Found hostel "${matchingHostel.name}" with ID: ${matchingHostel.id}. Consider using IDs directly.`);

    return {
      isValid: true,
      hostelId: matchingHostel.id,
      hostelName: matchingHostel.name
    };
  } catch (error) {
    return {
      isValid: false,
      error: `Lookup failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

/**
 * Logs hostel operations for debugging duplicate creation issues
 */
export const logHostelOperation = (
  operation: 'CREATE' | 'UPDATE' | 'DELETE' | 'ALLOCATE' | 'CHANGE',
  details: {
    hostelId?: string;
    hostelName?: string;
    roomId?: string;
    studentRegNumber?: string;
    [key: string]: any;
  }
) => {
  const timestamp = new Date().toISOString();
  console.log(`[HOSTEL_OP] ${timestamp} - ${operation}:`, details);
};
