import { databases } from '@/lib/appwrite';
import { Query, ID, AppwriteException } from 'appwrite';
import type { Hostel as BaseHostel, RoomAllocation as BaseRoomAllocation, HostelSettings as BaseHostelSettings, Floor as BaseFloor, Room as BaseRoom } from '@/types/hostel';

// Environment variables for Appwrite configuration
const APPWRITE_DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'DB_ID_PLACEHOLDER';
const HOSTELS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_HOSTELS_COLLECTION_ID || 'HOSTELS_COLLECTION_ID_PLACEHOLDER';
const ROOM_ALLOCATIONS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_ROOM_ALLOCATIONS_COLLECTION_ID || 'ROOM_ALLOCATIONS_COLLECTION_ID_PLACEHOLDER';
const FLOORS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_FLOORS_COLLECTION_ID || 'FLOORS_COLLECTION_ID_PLACEHOLDER'; // For future cascade delete
const ROOMS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_ROOMS_COLLECTION_ID || 'ROOMS_COLLECTION_ID_PLACEHOLDER'; // For future cascade delete
const SETTINGS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_SETTINGS_COLLECTION_ID || 'SETTINGS_COLLECTION_ID_PLACEHOLDER';
const HOSTEL_SETTINGS_DOC_ID = 'currentHostelSettings'; // Fixed ID for the settings document

// --- Appwrite-specific Type Definitions ---
// These types include Appwrite's system attributes.
interface AppwriteDocument {
  $id: string;
  $collectionId: string;
  $databaseId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
}

export type Hostel = BaseHostel & AppwriteDocument;
export type RoomAllocation = BaseRoomAllocation & AppwriteDocument;
export type HostelSettings = BaseHostelSettings & AppwriteDocument;
// Add Floor and Room types if they are directly manipulated here, otherwise keep as Base
export type Floor = BaseFloor & AppwriteDocument;
export type Room = BaseRoom & AppwriteDocument;


// --- Helper Functions ---
export function getCurrentSemester(): string {
  const now = new Date();
  const month = now.getMonth() + 1; // getMonth() is 0-indexed
  return month >= 8 || month <= 1 ? "Semester 1" : "Semester 2";
}

export function getCurrentAcademicYear(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // getMonth() is 0-indexed

  if (month >= 8) { // August or later
    return `${year}/${year + 1}`;
  } else { // January to July
    return `${year - 1}/${year}`;
  }
}

// --- Data Functions ---

export const fetchHostels = async (): Promise<Hostel[]> => {
  try {
    const response = await databases.listDocuments(APPWRITE_DATABASE_ID, HOSTELS_COLLECTION_ID);
    // Explicitly map to ensure 'id' field from BaseHostel is populated by $id
    return response.documents.map(doc => {
        const { $id, $collectionId, $databaseId, $createdAt, $updatedAt, $permissions, ...rest } = doc;
        return {
            ...rest,
            id: $id, // Map $id to id
            $id, $collectionId, $databaseId, $createdAt, $updatedAt, $permissions
        } as Hostel;
    });
  } catch (error) {
    console.error("Error fetching Appwrite hostels:", error);
    return [];
  }
};

export const fetchHostelById = async (hostelId: string): Promise<Hostel | null> => {
  try {
    const doc = await databases.getDocument(APPWRITE_DATABASE_ID, HOSTELS_COLLECTION_ID, hostelId);
    const { $id, $collectionId, $databaseId, $createdAt, $updatedAt, $permissions, ...rest } = doc;
    return {
        ...rest,
        id: $id, // Map $id to id
        $id, $collectionId, $databaseId, $createdAt, $updatedAt, $permissions
    } as Hostel;
  } catch (error) {
    if (error instanceof AppwriteException && error.code === 404) { // More specific error check
        return null;
    }
    console.error(`Error fetching Appwrite hostel by ID ${hostelId}:`, error);
    return null; // Or rethrow, depending on desired error handling
  }
};

// Input type for creating a hostel, excluding Appwrite system fields and 'id'
export type CreateHostelData = Omit<BaseHostel, 'id' | 'floors' | 'currentOccupancy'> & { currentOccupancy?: number };


export const createHostel = async (hostelData: CreateHostelData): Promise<string> => {
  try {
    const trimmedName = hostelData.name.trim();
    // Check for existing hostel by name
    const existing = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      HOSTELS_COLLECTION_ID,
      [Query.equal('name', trimmedName)]
    );
    if (existing.total > 0 && existing.documents[0]) {
      console.warn(`Hostel "${trimmedName}" already exists with ID: ${existing.documents[0].$id}. Skipping creation.`);
      return existing.documents[0].$id;
    }

    // Prepare data for Appwrite (ensure 'floors' is not included if it was part of original BaseHostel)
    const dataToCreate = {
        ...hostelData,
        name: trimmedName,
        currentOccupancy: hostelData.currentOccupancy || 0, // Default currentOccupancy if not provided
        // features and images should be handled if they are part of CreateHostelData and are string arrays
        features: hostelData.features || [],
        images: hostelData.images || [],
    };


    const newDoc = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      HOSTELS_COLLECTION_ID,
      ID.unique(),
      dataToCreate
    );
    console.log(`Successfully created Appwrite hostel "${newDoc.name}" with ID: ${newDoc.$id}`);
    return newDoc.$id;
  } catch (error) {
    console.error("Error creating Appwrite hostel:", error);
    throw error; // Rethrow to allow caller to handle
  }
};

// Input type for updating a hostel
export type UpdateHostelData = Partial<Omit<BaseHostel, 'id' | 'floors'>>;

export const updateHostel = async (hostelId: string, updates: UpdateHostelData): Promise<Hostel> => {
  try {
    // Remove 'floors' if present in 'updates' object, as it's not part of the hostel document structure
    const { floors, ...restUpdates } = updates as any;

    const updatedDoc = await databases.updateDocument(
        APPWRITE_DATABASE_ID,
        HOSTELS_COLLECTION_ID,
        hostelId,
        restUpdates
    );
    const { $id, $collectionId, $databaseId, $createdAt, $updatedAt, $permissions, ...rest } = updatedDoc;
    return {
        ...rest,
        id: $id,
        $id, $collectionId, $databaseId, $createdAt, $updatedAt, $permissions
    } as Hostel;
  } catch (error) {
    console.error(`Error updating Appwrite hostel ${hostelId}:`, error);
    throw error;
  }
};

export const deleteHostel = async (hostelId: string): Promise<void> => {
  try {
    // 1. Delete related room allocations
    console.log(`Starting deletion process for hostel ${hostelId}. Fetching room allocations...`);
    const allocationsResponse = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        ROOM_ALLOCATIONS_COLLECTION_ID,
        [Query.equal('hostelId', hostelId), Query.limit(500)] // Adjust limit as needed, Appwrite max is usually 100-500 for safety
    );

    if (allocationsResponse.documents.length > 0) {
        console.log(`Found ${allocationsResponse.documents.length} allocations to delete for hostel ${hostelId}.`);
        const deletePromises = allocationsResponse.documents.map(allocDoc =>
            databases.deleteDocument(APPWRITE_DATABASE_ID, ROOM_ALLOCATIONS_COLLECTION_ID, allocDoc.$id)
        );
        await Promise.all(deletePromises);
        console.log(`Deleted ${deletePromises.length} allocations for hostel ${hostelId}`);
    } else {
        console.log(`No room allocations found for hostel ${hostelId}.`);
    }

    // TODO: Implement cascade deletion for Floors and Rooms belonging to this hostel.
    // This would involve listing floors by hostelId, then for each floor, listing its rooms and deleting them,
    // then deleting the floor, and repeating for all floors.
    // Example (conceptual):
    // const floors = await databases.listDocuments(APPWRITE_DATABASE_ID, FLOORS_COLLECTION_ID, [Query.equal('hostelId', hostelId)]);
    // for (const floor of floors.documents) {
    //   const rooms = await databases.listDocuments(APPWRITE_DATABASE_ID, ROOMS_COLLECTION_ID, [Query.equal('floorId', floor.$id)]);
    //   await Promise.all(rooms.documents.map(r => databases.deleteDocument(APPWRITE_DATABASE_ID, ROOMS_COLLECTION_ID, r.$id)));
    //   await databases.deleteDocument(APPWRITE_DATABASE_ID, FLOORS_COLLECTION_ID, floor.$id);
    // }
    // console.log("Cascade deletion of floors and rooms would go here.");


    // 2. Delete the hostel document
    await databases.deleteDocument(APPWRITE_DATABASE_ID, HOSTELS_COLLECTION_ID, hostelId);
    console.log(`Successfully deleted Appwrite hostel ${hostelId}.`);
  } catch (error) {
    console.error(`Error deleting Appwrite hostel ${hostelId}:`, error);
    throw error;
  }
};


export const fetchHostelSettings = async (): Promise<BaseHostelSettings> => {
  try {
    const settingsDoc = await databases.getDocument(
        APPWRITE_DATABASE_ID,
        SETTINGS_COLLECTION_ID,
        HOSTEL_SETTINGS_DOC_ID
    );
    // Exclude Appwrite system fields before returning, to match BaseHostelSettings
    const { $id, $collectionId, $databaseId, $createdAt, $updatedAt, $permissions, ...rest } = settingsDoc;
    return rest as BaseHostelSettings;

  } catch (error) {
    if (error instanceof AppwriteException && error.code === 404) {
      console.warn("Hostel settings not found in Appwrite, returning defaults.");
       // Default settings if not found
        return {
            paymentGracePeriod: 168, // hours (7 days)
            autoRevokeUnpaidAllocations: true,
            maxRoomCapacity: 4, // Default max capacity
            allowMixedGender: false, // Default policy
            // Add any other fields from BaseHostelSettings with their defaults
        };
    }
    console.error("Error fetching Appwrite hostel settings:", error);
    // Return defaults on other errors too, or rethrow based on policy
    return { // Fallback defaults
        paymentGracePeriod: 168,
        autoRevokeUnpaidAllocations: true,
        maxRoomCapacity: 4,
        allowMixedGender: false
    };
  }
};

export const updateHostelSettings = async (settings: Partial<BaseHostelSettings>): Promise<void> => {
  try {
    // Attempt to update first. If it fails with 404, then create.
    await databases.updateDocument(
        APPWRITE_DATABASE_ID,
        SETTINGS_COLLECTION_ID,
        HOSTEL_SETTINGS_DOC_ID,
        settings // Data to update/create
    );
    console.log(`Hostel settings updated successfully.`);
  } catch (error) {
     if (error instanceof AppwriteException && error.code === 404) {
        try {
            // If document doesn't exist, create it with the provided settings
            // Ensure all required fields for HostelSettings are present if creating new,
            // or merge with defaults if 'settings' is truly partial.
            // For simplicity, assuming 'settings' contains all necessary fields if creating.
            await databases.createDocument(
                APPWRITE_DATABASE_ID,
                SETTINGS_COLLECTION_ID,
                HOSTEL_SETTINGS_DOC_ID, // Use the fixed ID
                settings // Full settings object expected here for creation
            );
            console.log(`Hostel settings created successfully as document was not found.`);
        } catch (createError) {
            console.error("Error creating Appwrite hostel settings:", createError);
            throw createError;
        }
    } else {
        console.error("Error updating Appwrite hostel settings:", error);
        throw error;
    }
  }
};
