import { db } from "@/lib/firebase";
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  addDoc
} from "firebase/firestore";
import { Hostel, Room, RoomAllocation, HostelSettings } from "@/types/hostel";

/**
 * Fetch all hostels from Firebase
 */
export const fetchHostels = async (): Promise<Hostel[]> => {
  try {
    const hostelsCollection = collection(db, "hostels");
    const hostelsSnap = await getDocs(hostelsCollection);
    return hostelsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Hostel[];
  } catch (error) {
    console.error("Error fetching hostels:", error);
    return [];
  }
};

/**
 * Fetch a specific hostel by ID
 */
export const fetchHostelById = async (hostelId: string): Promise<Hostel | null> => {
  try {
    const hostelDoc = doc(db, "hostels", hostelId);
    const hostelSnap = await getDoc(hostelDoc);
    
    if (hostelSnap.exists()) {
      return {
        id: hostelSnap.id,
        ...hostelSnap.data()
      } as Hostel;
    }
    return null;
  } catch (error) {
    console.error("Error fetching hostel:", error);
    return null;
  }
};

/**
 * Create a new hostel
 */
export const createHostel = async (hostel: Omit<Hostel, 'id'>): Promise<string> => {
  try {
    // Final safety check: ensure no hostel with the same name exists
    const existingHostels = await fetchHostels();
    const duplicate = existingHostels.find(
      existing => existing.name.toLowerCase().trim() === hostel.name.toLowerCase().trim()
    );
    
    if (duplicate) {
      console.log(`Hostel "${hostel.name}" already exists with ID: ${duplicate.id}. Skipping creation.`);
      return duplicate.id;
    }

    const hostelsCollection = collection(db, "hostels");
    const docRef = await addDoc(hostelsCollection, hostel);
    console.log(`Successfully created hostel "${hostel.name}" with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error("Error creating hostel:", error);
    throw error;
  }
};

/**
 * Update an existing hostel
 */
export const updateHostel = async (hostelId: string, updates: Partial<Hostel>): Promise<void> => {
  try {
    const hostelDoc = doc(db, "hostels", hostelId);
    await updateDoc(hostelDoc, updates);
  } catch (error) {
    console.error("Error updating hostel:", error);
    throw error;
  }
};

/**
 * Delete a hostel
 */
export const deleteHostel = async (hostelId: string): Promise<void> => {
  try {
    // Remove all related room allocations before deleting the hostel
    const allocationsCollection = collection(db, "roomAllocations");
    const q = query(allocationsCollection, where("hostelId", "==", hostelId));
    
    const allocationsSnap = await getDocs(q);
    const deletePromises = allocationsSnap.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    console.log(`Removed ${allocationsSnap.docs.length} allocation(s) for hostel ${hostelId}`);

    // Delete the hostel document
    const hostelDoc = doc(db, "hostels", hostelId);
    await deleteDoc(hostelDoc);
  } catch (error) {
    console.error("Error deleting hostel:", error);
    throw error;
  }
};

/**
 * Fetch available rooms for a specific gender
 */
export const fetchAvailableRooms = async (gender: 'Male' | 'Female'): Promise<Room[]> => {
  try {
    const hostels = await fetchHostels();
    const availableRooms: Room[] = [];

    hostels.forEach(hostel => {
      if (hostel.isActive && (hostel.gender === gender || hostel.gender === 'Mixed')) {
        hostel.floors.forEach(floor => {
          floor.rooms.forEach(room => {
            if (room.isAvailable && 
                !room.isReserved && 
                room.occupants.length < room.capacity &&
                (room.gender === gender || room.gender === 'Mixed')) {
              availableRooms.push({
                ...room,
                hostelName: hostel.name,
                floorName: floor.name
              } as Room & { hostelName: string; floorName: string });
            }
          });
        });
      }
    });

    return availableRooms;
  } catch (error) {
    console.error("Error fetching available rooms:", error);
    return [];
  }
};

/**
 * Allocate a room to a student
 */
export const allocateRoom = async (
  studentRegNumber: string,
  roomId: string,
  hostelId: string
): Promise<RoomAllocation> => {
  try {
    // Fetch hostel settings to get the grace period (which equals the deadline)
    const settings = await fetchHostelSettings();
    
    // Create room allocation record
    const allocation: Omit<RoomAllocation, 'id'> = {
      studentRegNumber,
      roomId,
      hostelId,
      allocatedAt: new Date().toISOString(),
      paymentStatus: 'Pending',
      paymentDeadline: new Date(Date.now() + settings.paymentGracePeriod * 60 * 60 * 1000).toISOString(),
      semester: getCurrentSemester(),
      academicYear: getCurrentAcademicYear()
    };

    const allocationsCollection = collection(db, "roomAllocations");
    const docRef = await addDoc(allocationsCollection, allocation);

    // Update room occupancy
    const hostel = await fetchHostelById(hostelId);
    if (hostel) {
      const updatedHostel = { ...hostel };
      updatedHostel.floors.forEach(floor => {
        floor.rooms.forEach(room => {
          if (room.id === roomId) {
            room.occupants.push(studentRegNumber);
            if (room.occupants.length >= room.capacity) {
              room.isAvailable = false;
            }
          }
        });
      });
      
      await updateHostel(hostelId, updatedHostel);
    }

    return {
      id: docRef.id,
      ...allocation
    };
  } catch (error) {
    console.error("Error allocating room:", error);
    throw error;
  }
};

/**
 * Revoke room allocation (for unpaid allocations)
 */
export const revokeRoomAllocation = async (allocationId: string): Promise<void> => {
  try {
    const allocationDoc = doc(db, "roomAllocations", allocationId);
    const allocationSnap = await getDoc(allocationDoc);
    
    if (allocationSnap.exists()) {
      const allocation = allocationSnap.data() as RoomAllocation;
      
      // Remove student from room
      const hostel = await fetchHostelById(allocation.hostelId);
      if (hostel) {
        const updatedHostel = { ...hostel };
        updatedHostel.floors.forEach(floor => {
          floor.rooms.forEach(room => {
            if (room.id === allocation.roomId) {
              room.occupants = room.occupants.filter(reg => reg !== allocation.studentRegNumber);
              room.isAvailable = true;
            }
          });
        });
        
        await updateHostel(allocation.hostelId, updatedHostel);
      }
      
      // Delete allocation record
      await deleteDoc(allocationDoc);
    }
  } catch (error) {
    console.error("Error revoking room allocation:", error);
    throw error;
  }
};

/**
 * Reserve a room (admin function)
 */
export const reserveRoom = async (
  roomId: string, 
  hostelId: string, 
  adminEmail: string, 
  reservationDays: number = 30
): Promise<void> => {
  try {
    const hostel = await fetchHostelById(hostelId);
    if (hostel) {
      const updatedHostel = { ...hostel };
      updatedHostel.floors.forEach(floor => {
        floor.rooms.forEach(room => {
          if (room.id === roomId) {
            room.isReserved = true;
            room.reservedBy = adminEmail;
            room.reservedUntil = new Date(Date.now() + reservationDays * 24 * 60 * 60 * 1000).toISOString();
          }
        });
      });
      
      await updateHostel(hostelId, updatedHostel);
    }
  } catch (error) {
    console.error("Error reserving room:", error);
    throw error;
  }
};

/**
 * Unreserve a room
 */
export const unreserveRoom = async (roomId: string, hostelId: string): Promise<void> => {
  try {
    console.log(`Attempting to unreserve room ${roomId} in hostel ${hostelId}`);
    
    const hostel = await fetchHostelById(hostelId);
    if (!hostel) {
      throw new Error(`Hostel with ID ${hostelId} not found`);
    }

    const updatedHostel = { ...hostel };
    let roomFound = false;
      updatedHostel.floors.forEach(floor => {
      floor.rooms.forEach(room => {
        if (room.id === roomId) {
          console.log(`Found room ${room.number}, unreserving...`);
          room.isReserved = false;
          // Remove the reservation fields entirely instead of setting to undefined
          delete room.reservedBy;
          delete room.reservedUntil;
          roomFound = true;
        }
      });
    });

    if (!roomFound) {
      throw new Error(`Room with ID ${roomId} not found in hostel ${hostelId}`);
    }
    
    console.log(`Updating hostel data...`);
    await updateHostel(hostelId, updatedHostel);
    console.log(`Room ${roomId} successfully unreserved`);
  } catch (error) {
    console.error("Error unreserving room:", error);
    throw error;
  }
};

/**
 * Fetch room allocations for a student
 */
export const fetchStudentAllocations = async (studentRegNumber: string): Promise<RoomAllocation[]> => {
  try {
    const allocationsCollection = collection(db, "roomAllocations");
    const q = query(allocationsCollection, where("studentRegNumber", "==", studentRegNumber));
    const allocationsSnap = await getDocs(q);
    
    return allocationsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as RoomAllocation[];
  } catch (error) {
    console.error("Error fetching student allocations:", error);
    return [];
  }
};

/**
 * Fetch a specific allocation by ID
 */
export const fetchAllocationById = async (allocationId: string): Promise<RoomAllocation | null> => {
  try {
    const allocationDoc = doc(db, "roomAllocations", allocationId);
    const allocationSnap = await getDoc(allocationDoc);
    
    if (allocationSnap.exists()) {
      return {
        id: allocationSnap.id,
        ...allocationSnap.data()
      } as RoomAllocation;
    }
    return null;
  } catch (error) {
    console.error("Error fetching allocation by ID:", error);
    return null;
  }
};

/**
 * Update payment status for an allocation
 */
export const updatePaymentStatus = async (
  allocationId: string, 
  status: 'Pending' | 'Paid' | 'Overdue'
): Promise<void> => {
  try {
    const allocationDoc = doc(db, "roomAllocations", allocationId);
    await updateDoc(allocationDoc, { paymentStatus: status });
  } catch (error) {
    console.error("Error updating payment status:", error);
    throw error;
  }
};

/**
 * Check and update overdue payment statuses
 */
export const checkAndUpdateOverduePayments = async (): Promise<{
  checkedCount: number;
  overdueCount: number;
  updatedCount: number;
}> => {
  try {
    const now = new Date();
    
    // Fetch all pending allocations
    const allocationsCollection = collection(db, "roomAllocations");
    const pendingQuery = query(
      allocationsCollection,
      where("paymentStatus", "==", "Pending")
    );
    
    const pendingAllocationsSnap = await getDocs(pendingQuery);
    const overdueAllocations: string[] = [];
    
    // Check which allocations are overdue
    pendingAllocationsSnap.docs.forEach(doc => {
      const allocation = doc.data() as RoomAllocation;
      const deadlineDate = new Date(allocation.paymentDeadline);
      
      if (now > deadlineDate) {
        overdueAllocations.push(doc.id);
      }
    });
    
    // Update overdue allocations
    const updatePromises = overdueAllocations.map(allocationId => 
      updatePaymentStatus(allocationId, 'Overdue')
    );
    
    await Promise.all(updatePromises);
    
    console.log(`Updated ${overdueAllocations.length} allocations to overdue status`);
    
    return {
      checkedCount: pendingAllocationsSnap.docs.length,
      overdueCount: overdueAllocations.length,
      updatedCount: overdueAllocations.length
    };
  } catch (error) {
    console.error("Error checking and updating overdue payments:", error);
    throw error;
  }
};

/**
 * Get hostel settings
 */
export const fetchHostelSettings = async (): Promise<HostelSettings> => {
  try {
    const settingsDoc = doc(db, "settings", "hostelSettings");
    const settingsSnap = await getDoc(settingsDoc);
    
    if (settingsSnap.exists()) {
      return settingsSnap.data() as HostelSettings;
    }
      // Default settings
    return {
      paymentGracePeriod: 168, // 168 hours = 7 days (grace period = deadline)
      autoRevokeUnpaidAllocations: true,
      maxRoomCapacity: 4,
      allowMixedGender: false
    };
  } catch (error) {
    console.error("Error fetching hostel settings:", error);
    return {
      paymentGracePeriod: 168, // 168 hours = 7 days (grace period = deadline)
      autoRevokeUnpaidAllocations: true,
      maxRoomCapacity: 4,
      allowMixedGender: false
    };
  }
};

/**
 * Update hostel settings
 */
export const updateHostelSettings = async (settings: HostelSettings): Promise<void> => {
  try {
    const settingsDoc = doc(db, "settings", "hostelSettings");
    await setDoc(settingsDoc, settings, { merge: true });
  } catch (error) {
    console.error("Error updating hostel settings:", error);
    throw error;
  }
};

/**
 * Add a room to a specific floor in a hostel
 */
export const addRoomToFloor = async (
  hostelId: string, 
  floorId: string, 
  room: Omit<Room, 'id'>
): Promise<void> => {
  try {
    const hostel = await fetchHostelById(hostelId);
    if (!hostel) throw new Error("Hostel not found");

    const floor = hostel.floors.find(f => f.id === floorId);
    if (!floor) throw new Error("Floor not found");

    // Generate unique room ID
    const roomId = `${hostelId}_${floorId}_${room.number}`;
    const newRoom: Room = {
      id: roomId,
      ...room
    };

    floor.rooms.push(newRoom);
    
    // Update total capacity
    hostel.totalCapacity += room.capacity;

    await updateHostel(hostelId, hostel);
  } catch (error) {
    console.error("Error adding room to floor:", error);
    throw error;
  }
};

/**
 * Add multiple rooms in a range to a specific floor
 */
export const addRoomsInRange = async (
  hostelId: string,
  floorId: string,
  startNumber: number,
  endNumber: number,
  prefix: string = '',
  suffix: string = '',
  capacity: number = 2,
  gender: 'Male' | 'Female' | 'Mixed' = 'Mixed',
  features: string[] = []
): Promise<void> => {
  try {
    const hostel = await fetchHostelById(hostelId);
    if (!hostel) throw new Error("Hostel not found");

    const floor = hostel.floors.find(f => f.id === floorId);
    if (!floor) throw new Error("Floor not found");

    const newRooms: Room[] = [];
    let totalCapacityAdded = 0;

    for (let i = startNumber; i <= endNumber; i++) {
      const roomNumber = `${prefix}${i}${suffix}`;
      const roomId = `${hostelId}_${floorId}_${roomNumber}`;

      // Check if room already exists
      const existingRoom = floor.rooms.find(r => r.number === roomNumber);
      if (existingRoom) {
        console.warn(`Room ${roomNumber} already exists in floor ${floor.name}`);
        continue;
      }

      const newRoom: Room = {
        id: roomId,
        number: roomNumber,
        floor: floor.name,
        floorName: floor.name,
        hostelName: hostel.name,
        price: hostel.pricePerSemester,
        capacity,
        occupants: [],
        gender,
        isReserved: false,
        isAvailable: true,
        features
      };

      newRooms.push(newRoom);
      totalCapacityAdded += capacity;
    }

    // Add all new rooms to the floor
    floor.rooms.push(...newRooms);
    
    // Update total capacity
    hostel.totalCapacity += totalCapacityAdded;

    await updateHostel(hostelId, hostel);
  } catch (error) {
    console.error("Error adding rooms in range:", error);
    throw error;
  }
};

/**
 * Add a new floor to a hostel
 */
export const addFloorToHostel = async (
  hostelId: string,
  floorNumber: string,
  floorName: string
): Promise<void> => {
  try {
    const hostel = await fetchHostelById(hostelId);
    if (!hostel) throw new Error("Hostel not found");

    // Check if floor already exists
    const existingFloor = hostel.floors.find(f => f.number === floorNumber);
    if (existingFloor) {
      throw new Error(`Floor ${floorNumber} already exists`);
    }

    const newFloor = {
      id: `${hostelId}_floor_${floorNumber}`,
      number: floorNumber,
      name: floorName,
      rooms: []
    };

    hostel.floors.push(newFloor);
    await updateHostel(hostelId, hostel);
  } catch (error) {
    console.error("Error adding floor to hostel:", error);
    throw error;
  }
};

/**
 * Remove a room from a hostel
 */
export const removeRoom = async (hostelId: string, roomId: string): Promise<void> => {
  try {
    const hostel = await fetchHostelById(hostelId);
    if (!hostel) throw new Error("Hostel not found");

    let roomFound = false;
    let roomCapacity = 0;

    hostel.floors.forEach(floor => {
      const roomIndex = floor.rooms.findIndex(r => r.id === roomId);
      if (roomIndex !== -1) {
        roomCapacity = floor.rooms[roomIndex].capacity;
        floor.rooms.splice(roomIndex, 1);
        roomFound = true;
      }
    });

    if (!roomFound) {
      throw new Error("Room not found");
    }

    // Remove all related room allocations before removing the room
    const allocationsCollection = collection(db, "roomAllocations");
    const q = query(
      allocationsCollection,
      where("roomId", "==", roomId),
      where("hostelId", "==", hostelId)
    );
    
    const allocationsSnap = await getDocs(q);
    const deletePromises = allocationsSnap.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    console.log(`Removed ${allocationsSnap.docs.length} allocation(s) for room ${roomId}`);

    // Update total capacity
    hostel.totalCapacity -= roomCapacity;

    await updateHostel(hostelId, hostel);
  } catch (error) {
    console.error("Error removing room:", error);
    throw error;
  }
};

/**
 * Remove a floor from a hostel and all its related allocations
 */
export const removeFloor = async (hostelId: string, floorId: string): Promise<void> => {
  try {
    const hostel = await fetchHostelById(hostelId);
    if (!hostel) throw new Error("Hostel not found");

    const floorIndex = hostel.floors.findIndex(f => f.id === floorId);
    if (floorIndex === -1) {
      throw new Error("Floor not found");
    }

    const floor = hostel.floors[floorIndex];
    
    // Remove all related room allocations for all rooms in this floor
    const allocationsCollection = collection(db, "roomAllocations");
    const roomIds = floor.rooms.map(room => room.id);
    
    if (roomIds.length > 0) {
      const q = query(
        allocationsCollection,
        where("hostelId", "==", hostelId),
        where("roomId", "in", roomIds)
      );
      
      const allocationsSnap = await getDocs(q);
      const deletePromises = allocationsSnap.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      console.log(`Removed ${allocationsSnap.docs.length} allocation(s) for floor ${floor.name}`);
    }

    // Calculate total capacity being removed
    const removedCapacity = floor.rooms.reduce((total, room) => total + room.capacity, 0);

    // Remove the floor
    hostel.floors.splice(floorIndex, 1);
    
    // Update total capacity
    hostel.totalCapacity -= removedCapacity;

    await updateHostel(hostelId, hostel);
  } catch (error) {
    console.error("Error removing floor:", error);
    throw error;
  }
};

/**
 * Remove an occupant from a room and clean up allocation
 */
export const removeOccupantFromRoom = async (
  hostelId: string,
  roomId: string,
  studentRegNumber: string
): Promise<void> => {
  try {
    // Remove student from room
    const hostel = await fetchHostelById(hostelId);
    if (!hostel) {
      throw new Error("Hostel not found");
    }

    const updatedHostel = { ...hostel };
    let roomFound = false;
    
    updatedHostel.floors.forEach(floor => {
      floor.rooms.forEach(room => {
        if (room.id === roomId) {
          room.occupants = room.occupants.filter(reg => reg !== studentRegNumber);
          room.isAvailable = room.occupants.length < room.capacity;
          roomFound = true;
        }
      });
    });

    if (!roomFound) {
      throw new Error("Room not found");
    }

    // Update total occupancy
    const totalOccupancy = updatedHostel.floors.reduce((total, floor) => 
      total + floor.rooms.reduce((floorTotal, room) => floorTotal + room.occupants.length, 0), 0
    );
    updatedHostel.currentOccupancy = totalOccupancy;

    // Update hostel data
    await updateHostel(hostelId, updatedHostel);

    // Remove allocation record
    const allocationsCollection = collection(db, "roomAllocations");
    const q = query(
      allocationsCollection,
      where("studentRegNumber", "==", studentRegNumber),
      where("roomId", "==", roomId),
      where("hostelId", "==", hostelId)
    );
    
    const allocationsSnap = await getDocs(q);
    const deletePromises = allocationsSnap.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

  } catch (error) {
    console.error("Error removing occupant from room:", error);
    throw error;
  }
};

/**
 * Get room details with price from allocation
 */
export const getRoomDetailsFromAllocation = async (allocation: RoomAllocation): Promise<{room: Room, hostel: Hostel, price: number} | null> => {
  try {
    const hostel = await fetchHostelById(allocation.hostelId);
    if (!hostel) return null;
    
    let roomDetails: Room | null = null;
    
    // Find the room in the hostel
    for (const floor of hostel.floors) {
      const room = floor.rooms.find(r => r.id === allocation.roomId);
      if (room) {
        roomDetails = {
          ...room,
          hostelName: hostel.name,
          floorName: floor.name,
          price: hostel.pricePerSemester
        };
        break;
      }
    }
    
    if (!roomDetails) return null;
    
    return {
      room: roomDetails,
      hostel: hostel,
      price: hostel.pricePerSemester
    };
  } catch (error) {
    console.error("Error getting room details from allocation:", error);
    return null;
  }
};

// Helper functions
function getCurrentSemester(): string {
  const now = new Date();
  const month = now.getMonth() + 1;
  return month >= 8 || month <= 1 ? "Semester 1" : "Semester 2";
}

function getCurrentAcademicYear(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  
  if (month >= 8) {
    return `${year}/${year + 1}`;
  } else {
    return `${year - 1}/${year}`;
  }
}
