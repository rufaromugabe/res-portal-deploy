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

// --- Occupant and Allocation Detail Functions ---

/**
 * Removes an occupant from a room, updates room availability, hostel occupancy, and deletes associated allocations.
 */
export const removeOccupantFromRoom = async (
  hostelId: string,
  roomId: string,
  studentRegNumber: string
): Promise<void> => {
  try {
    // 1. Fetch and Update Room
    const room = await databases.getDocument(APPWRITE_DATABASE_ID, ROOMS_COLLECTION_ID, roomId) as Room;
    let occupantRemovedFromRoom = false;

    if (room && Array.isArray(room.occupants)) {
      const initialOccupantCount = room.occupants.length;
      const updatedOccupants = room.occupants.filter(reg => reg !== studentRegNumber);

      if (updatedOccupants.length < initialOccupantCount) {
        occupantRemovedFromRoom = true;
        await databases.updateDocument(APPWRITE_DATABASE_ID, ROOMS_COLLECTION_ID, roomId, {
          occupants: updatedOccupants,
          isAvailable: true, // Room becomes available as a spot is freed
        });
        console.log(`Occupant ${studentRegNumber} removed from room ${roomId}. Room is now available.`);
      } else {
        console.log(`Occupant ${studentRegNumber} not found in room ${roomId}. No changes to room occupants.`);
      }
    } else if (room) {
        console.log(`Room ${roomId} has no occupants array or it's not an array. No occupants removed.`);
    } else {
      console.warn(`Room with ID ${roomId} not found. Cannot remove occupant.`);
      // If room not found, allocations for this room might still exist if data is inconsistent.
    }

    // 2. Update Hostel's currentOccupancy if an occupant was actually removed
    if (occupantRemovedFromRoom && hostelId) {
      const parentHostel = await databases.getDocument(APPWRITE_DATABASE_ID, HOSTELS_COLLECTION_ID, hostelId) as Hostel;
      if (parentHostel) {
        const newCurrentOccupancy = Math.max(0, (parentHostel.currentOccupancy || 0) - 1);
        await databases.updateDocument(APPWRITE_DATABASE_ID, HOSTELS_COLLECTION_ID, hostelId, {
          currentOccupancy: newCurrentOccupancy,
        });
        console.log(`Hostel ${hostelId} current occupancy updated to ${newCurrentOccupancy}.`);
      } else {
        console.warn(`Hostel ${hostelId} not found. Could not update current occupancy.`);
      }
    }

    // 3. Delete RoomAllocation(s) for this student, room, and hostel
    // This ensures if there were multiple (which shouldn't happen for a single student in a single room), they are all cleared.
    const allocationsResponse = await databases.listDocuments(APPWRITE_DATABASE_ID, ROOM_ALLOCATIONS_COLLECTION_ID, [
      Query.equal('studentRegNumber', studentRegNumber),
      Query.equal('roomId', roomId),
      Query.equal('hostelId', hostelId), // Ensure hostelId matches if it's part of the allocation record
      Query.limit(10) // Limit to 10, as there should ideally be only one or zero
    ]);

    if (allocationsResponse.documents.length > 0) {
      const deleteAllocationPromises = allocationsResponse.documents.map(allocDoc =>
        databases.deleteDocument(APPWRITE_DATABASE_ID, ROOM_ALLOCATIONS_COLLECTION_ID, allocDoc.$id)
      );
      await Promise.all(deleteAllocationPromises);
      console.log(`Deleted ${deleteAllocationPromises.length} allocation(s) for student ${studentRegNumber} in room ${roomId}.`);
    } else {
      console.log(`No allocations found for student ${studentRegNumber} in room ${roomId} to delete.`);
    }

  } catch (error) {
    console.error(`Error removing occupant ${studentRegNumber} from Appwrite room ${roomId}:`, error);
    throw error;
  }
};


// Define the expected return type for getRoomDetailsFromAllocation
export type RoomDetailsFromAllocationResult = {
  room: Room & { hostelName?: string; floorName?: string }; // Room type might need these optional fields
  hostel: Hostel;
  price: number;
} | null;


/**
 * Fetches detailed room and hostel information based on an allocation record.
 * Assumes 'hostelName' and 'floorName' are denormalized on the Room object or can be derived.
 */
export const getRoomDetailsFromAllocation = async (
  allocation: RoomAllocation // Expects Appwrite RoomAllocation type with $id etc.
): Promise<RoomDetailsFromAllocationResult> => {
  if (!allocation || !allocation.hostelId || !allocation.roomId) {
    console.error("Invalid allocation object provided.");
    return null;
  }

  try {
    // 1. Fetch Hostel document
    const hostelDoc = await databases.getDocument(APPWRITE_DATABASE_ID, HOSTELS_COLLECTION_ID, allocation.hostelId) as Hostel;
    if (!hostelDoc) {
      console.error(`Hostel with ID ${allocation.hostelId} not found.`);
      return null;
    }
     const { $id: hId, $collectionId: hcId, $databaseId: hdbId, $createdAt: hcAt, $updatedAt: huAt, $permissions: hPerm, ...hostelRest } = hostelDoc;
     const hostel = { ...hostelRest, id: hId, $id:hId, $collectionId:hcId, $databaseId:hdbId, $createdAt:hcAt, $updatedAt:huAt, $permissions:hPerm } as Hostel;


    // 2. Fetch Room document
    const roomDoc = await databases.getDocument(APPWRITE_DATABASE_ID, ROOMS_COLLECTION_ID, allocation.roomId) as Room;
    if (!roomDoc) {
      console.error(`Room with ID ${allocation.roomId} not found.`);
      return null;
    }
    const { $id: rId, $collectionId: rcId, $databaseId: rdbId, $createdAt: rcAt, $updatedAt: ruAt, $permissions: rPerm, ...roomRest } = roomDoc;
    const room = {
        ...roomRest,
        id: rId,
        $id:rId, $collectionId:rcId, $databaseId:rdbId, $createdAt:rcAt, $updatedAt:ruAt, $permissions:rPerm,
        hostelName: roomDoc.hostelName || hostel.name, // Use denormalized, fallback to hostel name
        floorName: roomDoc.floorName || 'N/A' // Use denormalized, fallback or leave as is
    } as Room & { hostelName?: string; floorName?: string };


    // 3. Determine price
    const price = room.price ?? hostel.pricePerSemester ?? 0;

    return {
      room,
      hostel,
      price,
    };

  } catch (error) {
    console.error(`Error fetching room details for allocation ${allocation.$id || 'unknown ID'}:`, error);
    return null;
  }
};

// --- Floor and Room Management Functions ---

/**
 * Adds a new floor to a hostel.
 */
export const addFloorToHostel = async (
  hostelId: string,
  floorNumber: string,
  floorName: string
): Promise<Floor | null> => {
  try {
    // Optional: Fetch parent hostel to ensure it exists
    const parentHostel = await fetchHostelById(hostelId);
    if (!parentHostel) {
      throw new Error(`Hostel with ID ${hostelId} not found.`);
    }

    // Check for duplicate floor number within the same hostel
    const existingFloors = await databases.listDocuments(APPWRITE_DATABASE_ID, FLOORS_COLLECTION_ID, [
      Query.equal('hostelId', hostelId),
      Query.equal('number', floorNumber),
    ]);
    if (existingFloors.total > 0) {
      console.warn(`Floor number ${floorNumber} already exists in hostel ${hostelId}.`);
      // Assuming we return the existing floor if duplicate
      const doc = existingFloors.documents[0];
      const { $id, $collectionId, $databaseId, $createdAt, $updatedAt, $permissions, ...rest } = doc;
      return { ...rest, id: $id, $id, $collectionId, $databaseId, $createdAt, $updatedAt, $permissions } as Floor;
    }

    const newFloorData = {
      hostelId,
      number: floorNumber,
      name: floorName,
    };
    const newDoc = await databases.createDocument(APPWRITE_DATABASE_ID, FLOORS_COLLECTION_ID, ID.unique(), newFloorData);

    const { $id, $collectionId, $databaseId, $createdAt, $updatedAt, $permissions, ...rest } = newDoc;
    return { ...rest, id: $id, $id, $collectionId, $databaseId, $createdAt, $updatedAt, $permissions } as Floor;

  } catch (error) {
    console.error("Error adding floor to Appwrite hostel:", error);
    throw error;
  }
};

// Define input type for addRoomToFloor, extending BaseRoom but making some fields optional or derived
export type AddRoomData = Omit<BaseRoom, 'id' | 'floorName' | 'hostelName' | 'price' | 'occupants' | 'isAvailable' | 'isReserved'> & {
    price?: number; // Price is optional, defaults to hostel's pricePerSemester
};

/**
 * Adds a single room to a floor.
 */
export const addRoomToFloor = async (
  hostelId: string,
  floorId: string,
  roomData: AddRoomData
): Promise<Room | null> => {
  try {
    const parentFloor = await databases.getDocument(APPWRITE_DATABASE_ID, FLOORS_COLLECTION_ID, floorId) as Floor;
    if (!parentFloor) throw new Error(`Floor with ID ${floorId} not found.`);

    const parentHostel = await databases.getDocument(APPWRITE_DATABASE_ID, HOSTELS_COLLECTION_ID, hostelId) as Hostel;
    if (!parentHostel) throw new Error(`Hostel with ID ${hostelId} not found.`);

    // Check for duplicate room number within the same floor
    const existingRooms = await databases.listDocuments(APPWRITE_DATABASE_ID, ROOMS_COLLECTION_ID, [
      Query.equal('floorId', floorId),
      Query.equal('number', roomData.number),
    ]);
    if (existingRooms.total > 0) {
      console.warn(`Room number ${roomData.number} already exists on floor ${floorId}.`);
      const doc = existingRooms.documents[0];
      const { $id, $collectionId, $databaseId, $createdAt, $updatedAt, $permissions, ...rest } = doc;
      return { ...rest, id: $id, $id, $collectionId, $databaseId, $createdAt, $updatedAt, $permissions } as Room;
    }

    const newRoomData = {
      ...roomData,
      floorId,
      hostelId,
      floorName: parentFloor.name,
      hostelName: parentHostel.name,
      price: roomData.price ?? parentHostel.pricePerSemester,
      occupants: [],
      isAvailable: true,
      isReserved: false,
      // features can be part of roomData
      features: roomData.features || [],
    };

    const newRoomDoc = await databases.createDocument(APPWRITE_DATABASE_ID, ROOMS_COLLECTION_ID, ID.unique(), newRoomData);

    // Update hostel's totalCapacity
    const newTotalCapacity = (parentHostel.totalCapacity || 0) + roomData.capacity;
    await databases.updateDocument(APPWRITE_DATABASE_ID, HOSTELS_COLLECTION_ID, hostelId, {
      totalCapacity: newTotalCapacity,
    });

    const { $id, $collectionId, $databaseId, $createdAt, $updatedAt, $permissions, ...rest } = newRoomDoc;
    return { ...rest, id: $id, $id, $collectionId, $databaseId, $createdAt, $updatedAt, $permissions } as Room;

  } catch (error) {
    console.error("Error adding room to Appwrite floor:", error);
    throw error;
  }
};

/**
 * Adds multiple rooms in a number range to a floor.
 */
export const addRoomsInRange = async (
  hostelId: string,
  floorId: string,
  startNumber: number,
  endNumber: number,
  capacity: number,
  gender: 'Male' | 'Female' | 'Mixed',
  roomPrice?: number, // Optional price for these rooms
  roomFeatures?: string[]
): Promise<Room[]> => {
  const addedRooms: Room[] = [];
  let totalCapacityAdded = 0;

  try {
    const parentFloor = await databases.getDocument(APPWRITE_DATABASE_ID, FLOORS_COLLECTION_ID, floorId) as Floor;
    if (!parentFloor) throw new Error(`Floor with ID ${floorId} not found.`);

    const parentHostel = await databases.getDocument(APPWRITE_DATABASE_ID, HOSTELS_COLLECTION_ID, hostelId) as Hostel;
    if (!parentHostel) throw new Error(`Hostel with ID ${hostelId} not found.`);

    for (let i = startNumber; i <= endNumber; i++) {
      const roomNumber = `${parentFloor.number}${String(i).padStart(2, '0')}`; // e.g., G01, 101

      // Check for duplicate room number
      const existingRooms = await databases.listDocuments(APPWRITE_DATABASE_ID, ROOMS_COLLECTION_ID, [
        Query.equal('floorId', floorId),
        Query.equal('number', roomNumber),
      ]);
      if (existingRooms.total > 0) {
        console.warn(`Room number ${roomNumber} already exists on floor ${floorId}. Skipping.`);
        continue;
      }

      const newRoomData: Omit<Room, '$id'|'$collectionId'|'$databaseId'|'$createdAt'|'$updatedAt'|'$permissions'|'id'> = {
        number: roomNumber,
        capacity,
        gender,
        floorId,
        hostelId,
        floorName: parentFloor.name,
        hostelName: parentHostel.name,
        price: roomPrice ?? parentHostel.pricePerSemester,
        occupants: [],
        isAvailable: true,
        isReserved: false,
        features: roomFeatures || [],
        // Denormalized fields for convenience, if part of your Room type
        paymentDeadline: undefined, // Or some default if applicable
        reservedBy: undefined,
        reservedUntil: undefined,
      };

      const newRoomDoc = await databases.createDocument(APPWRITE_DATABASE_ID, ROOMS_COLLECTION_ID, ID.unique(), newRoomData);
      totalCapacityAdded += capacity;

      const { $id, $collectionId, $databaseId, $createdAt, $updatedAt, $permissions, ...rest } = newRoomDoc;
      addedRooms.push({ ...rest, id: $id, $id, $collectionId, $databaseId, $createdAt, $updatedAt, $permissions } as Room);
    }

    if (totalCapacityAdded > 0) {
      const currentHostelState = await databases.getDocument(APPWRITE_DATABASE_ID, HOSTELS_COLLECTION_ID, hostelId) as Hostel;
      const newTotalCapacity = (currentHostelState.totalCapacity || 0) + totalCapacityAdded;
      await databases.updateDocument(APPWRITE_DATABASE_ID, HOSTELS_COLLECTION_ID, hostelId, {
        totalCapacity: newTotalCapacity,
      });
    }
    return addedRooms;
  } catch (error) {
    console.error("Error adding rooms in range to Appwrite floor:", error);
    throw error; // Re-throw, or handle by returning partially added rooms if desired
  }
};

/**
 * Removes a room and its allocations, updates hostel capacity.
 */
export const removeRoom = async (roomId: string): Promise<void> => {
  try {
    const roomToRemove = await databases.getDocument(APPWRITE_DATABASE_ID, ROOMS_COLLECTION_ID, roomId) as Room;
    if (!roomToRemove) {
      console.warn(`Room with ID ${roomId} not found. Nothing to remove.`);
      return;
    }

    // 1. Delete related RoomAllocations
    const allocationsResponse = await databases.listDocuments(APPWRITE_DATABASE_ID, ROOM_ALLOCATIONS_COLLECTION_ID, [
      Query.equal('roomId', roomId),
      Query.limit(100) // Assuming a room won't have more than 100 allocations at once
    ]);
    if (allocationsResponse.documents.length > 0) {
      const deleteAllocationPromises = allocationsResponse.documents.map(alloc =>
        databases.deleteDocument(APPWRITE_DATABASE_ID, ROOM_ALLOCATIONS_COLLECTION_ID, alloc.$id)
      );
      await Promise.all(deleteAllocationPromises);
      console.log(`Deleted ${deleteAllocationPromises.length} allocations for room ${roomId}.`);
    }

    // 2. Delete the Room document
    await databases.deleteDocument(APPWRITE_DATABASE_ID, ROOMS_COLLECTION_ID, roomId);

    // 3. Update Hostel's totalCapacity and currentOccupancy
    if (roomToRemove.hostelId) {
      const parentHostel = await databases.getDocument(APPWRITE_DATABASE_ID, HOSTELS_COLLECTION_ID, roomToRemove.hostelId) as Hostel;
      if (parentHostel) {
        const newTotalCapacity = Math.max(0, (parentHostel.totalCapacity || 0) - roomToRemove.capacity);
        // Occupants array on roomToRemove might not be up-to-date if not fetched with full details,
        // or if allocations were deleted above. A safer way for currentOccupancy is to re-count.
        // For simplicity, if roomToRemove.occupants is accurate:
        const occupantsCount = Array.isArray(roomToRemove.occupants) ? roomToRemove.occupants.length : 0;
        const newCurrentOccupancy = Math.max(0, (parentHostel.currentOccupancy || 0) - occupantsCount);

        await databases.updateDocument(APPWRITE_DATABASE_ID, HOSTELS_COLLECTION_ID, roomToRemove.hostelId, {
          totalCapacity: newTotalCapacity,
          currentOccupancy: newCurrentOccupancy, // Only adjust if you are sure about occupantsCount
        });
        console.log(`Hostel ${roomToRemove.hostelId} capacity updated.`);
      }
    }
    console.log(`Room ${roomId} removed successfully.`);
  } catch (error) {
    console.error(`Error removing Appwrite room ${roomId}:`, error);
    throw error;
  }
};

/**
 * Removes a floor and all its rooms (and their allocations).
 */
export const removeFloor = async (floorId: string): Promise<void> => {
  try {
    const floorToRemove = await databases.getDocument(APPWRITE_DATABASE_ID, FLOORS_COLLECTION_ID, floorId) as Floor;
    if (!floorToRemove) {
      console.warn(`Floor with ID ${floorId} not found. Nothing to remove.`);
      return;
    }

    // 1. Remove all rooms in this floor
    //    This will also handle updating hostel capacity and deleting allocations for each room.
    const roomsResponse = await databases.listDocuments(APPWRITE_DATABASE_ID, ROOMS_COLLECTION_ID, [
      Query.equal('floorId', floorId),
      Query.limit(500) // Max limit, assuming a floor won't have more than this. Paginate if necessary.
    ]);

    if (roomsResponse.documents.length > 0) {
      console.log(`Found ${roomsResponse.documents.length} rooms to remove for floor ${floorId}.`);
      // Sequential removal for simplicity, can be slow. Parallel with Promise.all might hit rate limits for many rooms.
      for (const roomDoc of roomsResponse.documents) {
        await removeRoom(roomDoc.$id); // removeRoom handles its own console logs and errors
      }
      console.log(`All rooms for floor ${floorId} processed for removal.`);
    }

    // 2. Delete the Floor document
    await databases.deleteDocument(APPWRITE_DATABASE_ID, FLOORS_COLLECTION_ID, floorId);
    console.log(`Floor ${floorId} removed successfully.`);

  } catch (error) {
    console.error(`Error removing Appwrite floor ${floorId}:`, error);
    throw error;
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

// --- Allocation and Payment Status Functions ---

/**
 * Fetches all room allocations for a specific student.
 */
export const fetchStudentAllocations = async (studentRegNumber: string): Promise<RoomAllocation[]> => {
  try {
    const response = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      ROOM_ALLOCATIONS_COLLECTION_ID,
      [Query.equal('studentRegNumber', studentRegNumber), Query.orderDesc('$createdAt')]
    );
    return response.documents.map(doc => {
        const { $id, $collectionId, $databaseId, $createdAt, $updatedAt, $permissions, ...rest } = doc;
        return {
            ...rest,
            id: $id,
            $id, $collectionId, $databaseId, $createdAt, $updatedAt, $permissions
        } as RoomAllocation;
    });
  } catch (error) {
    console.error(`Error fetching Appwrite allocations for student ${studentRegNumber}:`, error);
    return [];
  }
};

/**
 * Fetches a specific room allocation by its ID.
 */
export const fetchAllocationById = async (allocationId: string): Promise<RoomAllocation | null> => {
  try {
    const doc = await databases.getDocument(APPWRITE_DATABASE_ID, ROOM_ALLOCATIONS_COLLECTION_ID, allocationId);
    const { $id, $collectionId, $databaseId, $createdAt, $updatedAt, $permissions, ...rest } = doc;
    return {
        ...rest,
        id: $id,
        $id, $collectionId, $databaseId, $createdAt, $updatedAt, $permissions
    } as RoomAllocation;
  } catch (error) {
    if (error instanceof AppwriteException && error.code === 404) {
      return null;
    }
    console.error(`Error fetching Appwrite allocation by ID ${allocationId}:`, error);
    return null;
  }
};

/**
 * Updates the payment status of a specific room allocation.
 */
export const updatePaymentStatus = async (
  allocationId: string,
  paymentStatus: 'Pending' | 'Paid' | 'Overdue' | 'Failed' // Added 'Failed' as a possible status
): Promise<RoomAllocation> => {
  try {
    const updatedDoc = await databases.updateDocument(
      APPWRITE_DATABASE_ID,
      ROOM_ALLOCATIONS_COLLECTION_ID,
      allocationId,
      { paymentStatus }
    );
    const { $id, $collectionId, $databaseId, $createdAt, $updatedAt, $permissions, ...rest } = updatedDoc;
    return {
        ...rest,
        id: $id,
        $id, $collectionId, $databaseId, $createdAt, $updatedAt, $permissions
    } as RoomAllocation;
  } catch (error) {
    console.error(`Error updating payment status for Appwrite allocation ${allocationId}:`, error);
    throw error;
  }
};

/**
 * Checks for pending allocations whose payment deadline has passed and updates their status to 'Overdue'.
 */
export const checkAndUpdateOverduePayments = async (): Promise<{
  checkedCount: number;
  overdueCount: number;
  updatedCount: number;
  errorCount: number;
}> => {
  let checkedCount = 0;
  let overdueCount = 0;
  let updatedCount = 0;
  let errorCount = 0;
  const now = new Date();
  let hasMore = true;
  let offset = 0;
  const limit = 100; // Process in batches of 100

  console.log("Starting check for overdue payments...");

  try {
    while (hasMore) {
      const response = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        ROOM_ALLOCATIONS_COLLECTION_ID,
        [
          Query.equal('paymentStatus', 'Pending'),
          Query.limit(limit),
          Query.offset(offset)
        ]
      );

      const pendingAllocations = response.documents as RoomAllocation[];
      checkedCount += pendingAllocations.length;

      if (pendingAllocations.length < limit) {
        hasMore = false; // Last page
      } else {
        offset += limit;
      }

      const overdueUpdates: Promise<void>[] = [];

      for (const allocation of pendingAllocations) {
        if (allocation.paymentDeadline) {
          const deadlineDate = new Date(allocation.paymentDeadline);
          if (now > deadlineDate) {
            overdueCount++;
            // Update status to 'Overdue'
            overdueUpdates.push(
              updatePaymentStatus(allocation.$id, 'Overdue')
                .then(() => {
                  updatedCount++;
                  console.log(`Allocation ${allocation.$id} marked as Overdue.`);
                })
                .catch(err => {
                  errorCount++;
                  console.error(`Failed to update allocation ${allocation.$id} to Overdue:`, err);
                })
            );
          }
        }
      }
      await Promise.all(overdueUpdates); // Process updates for the current batch
    }

    console.log(`Checked: ${checkedCount}, Overdue found: ${overdueCount}, Successfully updated: ${updatedCount}, Errors: ${errorCount}`);
    return { checkedCount, overdueCount, updatedCount, errorCount };

  } catch (error) {
    console.error("Error during checkAndUpdateOverduePayments:", error);
    // Depending on how critical this is, you might want to rethrow or handle differently
    return { checkedCount, overdueCount, updatedCount, errorCount: errorCount + (checkedCount - overdueCount) }; // Assume all non-processed are errors in this case
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

// --- Additional Functions ---

/**
 * Fetches available rooms based on gender.
 * Assumes rooms collection has denormalized hostelName and floorName.
 */
export const fetchAvailableRooms = async (gender: 'Male' | 'Female' | 'Mixed'): Promise<Room[]> => {
  const availableRooms: Room[] = [];
  try {
    // 1. Fetch active hostels matching gender or 'Mixed'
    const hostelResponse = await databases.listDocuments(APPWRITE_DATABASE_ID, HOSTELS_COLLECTION_ID, [
      Query.equal('isActive', true),
      // Query for gender: either direct match or hostel is 'Mixed'
      // Appwrite doesn't support OR directly in a single Query.equal array for different fields.
      // So, fetch all active and filter client-side, or do two queries if gender list is small.
      // For simplicity here, fetch all active and filter hostel gender client-side.
      // A more optimized way might involve tags or multiple queries combined.
    ]);

    const relevantHostels = hostelResponse.documents.filter(h => h.gender === gender || h.gender === 'Mixed');

    for (const hostelDoc of relevantHostels) {
      const hostel = { ...hostelDoc, id: hostelDoc.$id } as Hostel;

      // 2. For each hostel, fetch its floors
      // Assuming no specific floor criteria other than belonging to the hostel
      const floorResponse = await databases.listDocuments(APPWRITE_DATABASE_ID, FLOORS_COLLECTION_ID, [
        Query.equal('hostelId', hostel.$id),
        Query.limit(100) // Assuming a hostel won't have more than 100 floors
      ]);

      for (const floorDoc of floorResponse.documents) {
        const floor = { ...floorDoc, id: floorDoc.$id } as Floor;

        // 3. For each floor, fetch its rooms
        const roomResponse = await databases.listDocuments(APPWRITE_DATABASE_ID, ROOMS_COLLECTION_ID, [
          Query.equal('floorId', floor.$id),
          Query.equal('isAvailable', true), // Only available rooms
          Query.equal('isReserved', false), // Only non-reserved rooms
          // Query for gender: either direct match or room is 'Mixed'
          // Similar to hostels, direct OR is tricky. Fetch and filter.
          Query.limit(500) // Assuming a floor won't have extreme number of rooms
        ]);

        const processableRooms = roomResponse.documents.filter(r => r.gender === gender || r.gender === 'Mixed');

        for (const roomDoc of processableRooms) {
          // Ensure occupants is an array, default to empty if null/undefined
          const occupants = Array.isArray(roomDoc.occupants) ? roomDoc.occupants : [];
          if (occupants.length < roomDoc.capacity) {
            // Room is available, not reserved, matches gender, and has space
            // Assuming roomDoc contains denormalized hostelName and floorName as per plan
            availableRooms.push({
                ...roomDoc,
                id: roomDoc.$id,
                // hostelName and floorName should be directly on roomDoc if denormalized
                hostelName: roomDoc.hostelName || hostel.name, // Fallback to fetched hostel name
                floorName: roomDoc.floorName || floor.name, // Fallback to fetched floor name
            } as Room);
          }
        }
      }
    }
    return availableRooms;
  } catch (error) {
    console.error("Error fetching available Appwrite rooms:", error);
    return [];
  }
};

/**
 * Allocates a room to a student.
 */
export const allocateRoom = async (
  studentRegNumber: string,
  roomId: string,
  hostelId: string
): Promise<RoomAllocation | null> => {
  try {
    // 1. Fetch HostelSettings for paymentGracePeriod
    const settings = await fetchHostelSettings(); // Assuming BaseHostelSettings is returned

    // 2. Create RoomAllocation document data
    const allocationData = {
      studentRegNumber,
      roomId,
      hostelId,
      allocatedAt: new Date().toISOString(),
      paymentStatus: 'Pending',
      paymentDeadline: new Date(Date.now() + (settings.paymentGracePeriod || 168) * 60 * 60 * 1000).toISOString(),
      semester: getCurrentSemester(),
      academicYear: getCurrentAcademicYear(),
      // paymentId is optional and not set initially
    };

    const newAllocationDoc = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      ROOM_ALLOCATIONS_COLLECTION_ID,
      ID.unique(),
      allocationData
    );

    // 3. Update Room Occupancy
    const room = await databases.getDocument(APPWRITE_DATABASE_ID, ROOMS_COLLECTION_ID, roomId) as Room;
    if (!room) throw new Error(`Room with ID ${roomId} not found.`);

    const occupants = Array.isArray(room.occupants) ? room.occupants : [];
    const updatedOccupants = [...occupants, studentRegNumber];
    const newAvailability = updatedOccupants.length < room.capacity;

    await databases.updateDocument(APPWRITE_DATABASE_ID, ROOMS_COLLECTION_ID, roomId, {
      occupants: updatedOccupants,
      isAvailable: newAvailability,
    });

    console.log(`Room ${roomId} updated. Occupants: ${updatedOccupants.length}, Available: ${newAvailability}`);

    const { $id, $collectionId, $databaseId, $createdAt, $updatedAt, $permissions, ...rest } = newAllocationDoc;
    return {
        ...rest,
        id: $id, // Map $id to id
        $id, $collectionId, $databaseId, $createdAt, $updatedAt, $permissions
    } as RoomAllocation;

  } catch (error) {
    console.error("Error allocating Appwrite room:", error);
    throw error; // Re-throw for the caller to handle
  }
};

/**
 * Revokes a student's room allocation.
 */
export const revokeRoomAllocation = async (allocationId: string): Promise<void> => {
  try {
    // 1. Fetch the RoomAllocation document
    const allocationDoc = await databases.getDocument(
        APPWRITE_DATABASE_ID,
        ROOM_ALLOCATIONS_COLLECTION_ID,
        allocationId
    ) as RoomAllocation; // Cast to Appwrite specific type

    if (!allocationDoc) {
      console.warn(`Room allocation with ID ${allocationId} not found. Nothing to revoke.`);
      return;
    }

    const { roomId, studentRegNumber } = allocationDoc;

    // 2. Update the Room document
    const room = await databases.getDocument(APPWRITE_DATABASE_ID, ROOMS_COLLECTION_ID, roomId) as Room;
    if (room) {
      const occupants = Array.isArray(room.occupants) ? room.occupants : [];
      const updatedOccupants = occupants.filter(reg => reg !== studentRegNumber);

      await databases.updateDocument(APPWRITE_DATABASE_ID, ROOMS_COLLECTION_ID, roomId, {
        occupants: updatedOccupants,
        isAvailable: true, // Room becomes available as one spot is freed
      });
      console.log(`Occupancy updated for room ${roomId}.`);
    } else {
      console.warn(`Room with ID ${roomId} not found while revoking allocation. Proceeding to delete allocation record.`);
    }

    // 3. Delete the RoomAllocation document
    await databases.deleteDocument(APPWRITE_DATABASE_ID, ROOM_ALLOCATIONS_COLLECTION_ID, allocationId);
    console.log(`Room allocation ${allocationId} revoked successfully.`);

  } catch (error) {
    console.error(`Error revoking Appwrite room allocation ${allocationId}:`, error);
    throw error;
  }
};

/**
 * Reserves a room.
 */
export const reserveRoom = async (
  roomId: string,
  adminEmail: string, // hostelId removed as roomId is global $id
  reservationDays: number = 30
): Promise<void> => {
  try {
    const reservedUntil = new Date(Date.now() + reservationDays * 24 * 60 * 60 * 1000).toISOString();
    await databases.updateDocument(APPWRITE_DATABASE_ID, ROOMS_COLLECTION_ID, roomId, {
      isReserved: true,
      reservedBy: adminEmail,
      reservedUntil: reservedUntil,
      isAvailable: false, // Typically a reserved room is not available for general allocation
    });
    console.log(`Room ${roomId} reserved by ${adminEmail} until ${reservedUntil}.`);
  } catch (error) {
    console.error(`Error reserving Appwrite room ${roomId}:`, error);
    throw error;
  }
};

/**
 * Unreserves a room.
 */
export const unreserveRoom = async (roomId: string): Promise<void> => { // hostelId removed
  try {
    // Check current occupancy vs capacity to determine if it should become available
    const room = await databases.getDocument(APPWRITE_DATABASE_ID, ROOMS_COLLECTION_ID, roomId) as Room;
    if (!room) throw new Error(`Room with ID ${roomId} not found during unreserve.`);

    const occupants = Array.isArray(room.occupants) ? room.occupants : [];
    const isNowAvailable = occupants.length < room.capacity;

    await databases.updateDocument(APPWRITE_DATABASE_ID, ROOMS_COLLECTION_ID, roomId, {
      isReserved: false,
      reservedBy: null, // Using null to clear the field
      reservedUntil: null, // Using null to clear the field
      isAvailable: isNowAvailable,
    });
    console.log(`Room ${roomId} unreserved. Available status: ${isNowAvailable}`);
  } catch (error) {
    console.error(`Error unreserving Appwrite room ${roomId}:`, error);
    throw error;
  }
};
