'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { fetchStudentAllocations } from '@/data/hostel-data';
import { toast } from 'react-toastify';

export const useStudentAllocation = (hostels: any[]) => {
  const [existingAllocation, setExistingAllocation] = useState<any>(null);
  const [allocationRoomDetails, setAllocationRoomDetails] = useState<any>(null);
  const [allocationChecked, setAllocationChecked] = useState(false);

  const checkExistingAllocation = useCallback(async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const emailDomain = user.email?.split("@")[1] || "";
    let regNumber = "";

    try {
      if (emailDomain === "hit.ac.zw") {
        regNumber = user.email?.split("@")[0] || "";
      } else if (emailDomain === "gmail.com" && user.email) {
        const usersRef = collection(db, "students");
        const q = query(usersRef, where("email", "==", user.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          regNumber = userData.regNumber || "";
        } else {
          console.log("User not found in database");
          return;
        }
      } else {
        console.log("Unsupported email domain");
        return;
      }

      if (regNumber) {
        const allocations = await fetchStudentAllocations(regNumber);
        if (allocations.length > 0) {
          const allocation = allocations[0];
          setExistingAllocation(allocation);
          
          // Find room details in hostels
          const hostel = hostels.find(h => h.id === allocation.hostelId);
          if (hostel) {
            let roomDetails = null;
            hostel.floors.forEach((floor: any) => {
              floor.rooms.forEach((room: any) => {
                if (room.id === allocation.roomId) {
                  roomDetails = {
                    ...room,
                    hostelName: hostel.name,
                    floorName: floor.name
                  };
                }
              });
            });
            setAllocationRoomDetails(roomDetails);
          }
        }
      }
    } catch (error) {
      console.error("Error checking existing allocation:", error);
    }
  }, [hostels]);

  useEffect(() => {
    if (hostels.length > 0 && !allocationChecked) {
      setAllocationChecked(true);
      checkExistingAllocation();
    }
  }, [hostels, allocationChecked, checkExistingAllocation]);

  return {
    existingAllocation,
    allocationRoomDetails,
    checkExistingAllocation
  };
};

export default useStudentAllocation;
