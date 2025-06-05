'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'react-toastify';
import { LoadingSpinner } from './loading-spinner';
import { Hostel, Room } from '@/types/hostel';
import { fetchHostels, allocateRoom, fetchHostelSettings, changeRoomAllocation, getAvailableRoomsForChange } from '@/data/hostel-data';
import { StudentProfile } from './student-profile';
import { getAuth } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import StudentPaymentManagement from './student-payment-management';

// Import new components
import CurrentAllocationCard from './room-selection/current-allocation-card';
import RoomFilters from './room-selection/room-filters';
import HostelInfoCard from './room-selection/hostel-info-card';
import RoomGrid from './room-selection/room-grid';
import RoomSelectionModal from './room-selection/room-selection-modal';
import RoomChangeModal from './room-selection/room-change-modal';

// Import custom hooks
import useStudentAllocation from '@/hooks/useStudentAllocation';
import useRoomFiltering from '@/hooks/useRoomFiltering';

interface RoomSelectionProps {
  onRoomSelected: (roomId: string, hostelId: string) => void;
  studentProfile: StudentProfile | null;
}

const RoomSelection: React.FC<RoomSelectionProps> = ({ onRoomSelected, studentProfile }) => {
  // Core state
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [hostelSettings, setHostelSettings] = useState<any>(null);

  // Filter state
  const [selectedHostel, setSelectedHostel] = useState<string>('');
  const [selectedFloor, setSelectedFloor] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [priceFilter, setPriceFilter] = useState<string>('any');

  // Selection state
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);

  // Room change state
  const [showChangeRoomDialog, setShowChangeRoomDialog] = useState(false);
  const [availableRoomsForChange, setAvailableRoomsForChange] = useState<(Room & { hostelName: string; floorName: string; price: number })[]>([]);
  const [selectedNewRoom, setSelectedNewRoom] = useState<Room & { hostelName: string; floorName: string; price: number } | null>(null);
  const [isChangingRoom, setIsChangingRoom] = useState(false);
  // Custom hooks
  const { existingAllocation, allocationRoomDetails, checkExistingAllocation } = useStudentAllocation(hostels);
  const { filteredRooms, availableRoomsCount, selectedHostelData } = useRoomFiltering(hostels, {
    selectedHostel,
    selectedFloor,
    searchTerm,
    priceFilter,
    capacityFilter: 'any',
    // Only apply gender filter for first-time selection (no existing allocation)
    studentGender: !existingAllocation && studentProfile?.gender ? studentProfile.gender as 'Male' | 'Female' : undefined
  });

  useEffect(() => {
    loadHostels();
    loadHostelSettings();
  }, []);

  const loadHostels = async () => {
    try {
      const hostelData = await fetchHostels();
      setHostels(hostelData.filter(h => h.isActive));
    } catch (error) {
      toast.error('Failed to load hostels');
    } finally {
      setLoading(false);
    }
  };

  const loadHostelSettings = async () => {
    try {
      const settings = await fetchHostelSettings();
      setHostelSettings(settings);
    } catch (error) {
      console.error('Failed to load hostel settings:', error);
    }
  };

  const handleRoomSelect = (room: Room & { hostelName: string; floorName: string; price: number }) => {
    if (isSelecting || existingAllocation) return;
    setSelectedRoom(room);
  };

  const confirmRoomSelection = async () => {
    if (!selectedRoom || !studentProfile || isSelecting) return;

    try {
      setIsSelecting(true);
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const emailDomain = user.email?.split("@")[1] || "";
      let regNumber = "";

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
          toast.error("Profile not found. Please complete your profile first.");
          return;
        }
      } else {
        toast.error("Unsupported email domain.");
        return;
      }

      if (!regNumber) {
        toast.error("Registration number not found. Please complete your profile first.");
        return;
      }
      
      const settings = await fetchHostelSettings();
      await allocateRoom(regNumber, selectedRoom.id, selectedHostel);
      
      const deadlineHours = settings.paymentGracePeriod;
      const deadlineDays = Math.round(deadlineHours / 24);
      toast.success(`Room ${selectedRoom.number} allocated successfully! Please pay within ${deadlineHours} hours (${deadlineDays} days) to confirm.`);
      onRoomSelected(selectedRoom.id, selectedHostel);
      
      // Refresh data
      loadHostels();
      checkExistingAllocation();
      setSelectedRoom(null);
    } catch (error) {
      toast.error('Failed to allocate room. Please try again.');
    } finally {
      setIsSelecting(false);
    }
  };

  // Room change functionality
  const handleChangeRoom = async () => {
    if (!studentProfile || !existingAllocation || !studentProfile.gender) return;
    
    try {
      const availableRooms = await getAvailableRoomsForChange(
        existingAllocation.studentRegNumber, 
        studentProfile.gender as 'Male' | 'Female'
      );
      setAvailableRoomsForChange(availableRooms);
      setShowChangeRoomDialog(true);
    } catch (error) {
      toast.error('Failed to load available rooms for change');
    }
  };

  const confirmRoomChange = async () => {
    if (!selectedNewRoom || !studentProfile || !existingAllocation || !studentProfile.gender) return;
    
    try {
      setIsChangingRoom(true);
      
      const targetHostelId = selectedNewRoom.hostelName === allocationRoomDetails?.hostelName 
        ? existingAllocation.hostelId 
        : hostels.find(h => h.name === selectedNewRoom.hostelName)?.id || existingAllocation.hostelId;
      
      await changeRoomAllocation(
        existingAllocation.studentRegNumber,
        selectedNewRoom.id,
        targetHostelId,
        studentProfile.gender as 'Male' | 'Female'
      );

      toast.success(`Room changed successfully to ${selectedNewRoom.number}!`);
      
      // Close dialog and refresh data
      setShowChangeRoomDialog(false);
      setSelectedNewRoom(null);
      loadHostels();
      checkExistingAllocation();
      
    } catch (error) {
      console.error('Room change error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to change room');
    } finally {
      setIsChangingRoom(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  // Show existing allocation with new component
  if (existingAllocation && allocationRoomDetails) {
    return (
      <div className="h-full w-full p-6 space-y-6">
        <CurrentAllocationCard
          existingAllocation={existingAllocation}
          allocationRoomDetails={allocationRoomDetails}
          hostelSettings={hostelSettings}
          onChangeRoom={handleChangeRoom}
          loading={isChangingRoom}
        />
        
        <Card>
          <CardHeader>
            <CardTitle>Payment Management</CardTitle>
          </CardHeader>
          <CardContent>
            <StudentPaymentManagement />
          </CardContent>
        </Card>

        <RoomChangeModal
          isOpen={showChangeRoomDialog}
          onClose={() => setShowChangeRoomDialog(false)}
          availableRooms={availableRoomsForChange}
          selectedRoom={selectedNewRoom}
          onRoomSelect={setSelectedNewRoom}
          onConfirm={confirmRoomChange}
          isChanging={isChangingRoom}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="text-center py-6 border-b bg-white">
        <h2 className="text-3xl font-bold text-gray-900">Select Your Room</h2>
        <p className="text-gray-600 mt-2">Choose from available accommodations that match your preferences</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 space-y-6">        {/* Filters */}
        <RoomFilters
          hostels={hostels}
          selectedHostel={selectedHostel}
          selectedFloor={selectedFloor}
          searchTerm={searchTerm}
          priceFilter={priceFilter}
          onHostelChange={setSelectedHostel}
          onFloorChange={setSelectedFloor}
          onSearchChange={setSearchTerm}
          onPriceFilterChange={setPriceFilter}
          studentGender={studentProfile?.gender as 'Male' | 'Female'}
          showGenderFilter={!existingAllocation && !!studentProfile?.gender}
        />

        {/* Hostel Info */}
        {selectedHostelData && (
          <HostelInfoCard hostel={selectedHostelData} />
        )}

        {/* Room Summary */}
        {selectedHostel && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-blue-800">Available Rooms</h3>
                  <p className="text-blue-600">
                    {availableRoomsCount} of {filteredRooms.length} rooms available for selection
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{filteredRooms.length}</p>
                  <p className="text-sm text-blue-500">total rooms</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rooms Grid */}
        {selectedHostel && (
          <RoomGrid
            rooms={filteredRooms}
            onRoomSelect={handleRoomSelect}
            isSelecting={isSelecting}
            existingAllocation={existingAllocation}
            loading={loading}
          />
        )}

        {/* Room Selection Modal */}
        <RoomSelectionModal
          room={selectedRoom}
          isOpen={!!selectedRoom}
          onClose={() => setSelectedRoom(null)}
          onConfirm={confirmRoomSelection}
          isSelecting={isSelecting}
          hostelSettings={hostelSettings}
        />
      </div>
    </div>
  );
};

export default RoomSelection;
