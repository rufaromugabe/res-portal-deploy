'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'react-toastify';
import { 
  Building, 
  Users, 
  Bed, 
  Wifi, 
  Shield, 
  Coffee,
  BookOpen,
  MapPin,
  DollarSign,
  Clock,  AlertTriangle,
  CheckCircle,
  XCircle,
  RotateCcw
} from 'lucide-react';
import { Hostel, Room } from '@/types/hostel';
import { fetchHostels, allocateRoom, fetchStudentAllocations, fetchHostelSettings, changeRoomAllocation, getAvailableRoomsForChange } from '@/data/hostel-data';
import { StudentProfile } from './student-profile';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import StudentPaymentManagement from './student-payment-management';

interface RoomSelectionProps {
  onRoomSelected: (roomId: string, hostelId: string) => void;
  studentProfile: StudentProfile | null;
}

const RoomSelection: React.FC<RoomSelectionProps> = ({ onRoomSelected, studentProfile }) => {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [selectedHostel, setSelectedHostel] = useState<string>('');
  const [selectedFloor, setSelectedFloor] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [priceFilter, setPriceFilter] = useState<string>('any');
  const [capacityFilter, setCapacityFilter] = useState<string>('any');
  const [loading, setLoading] = useState(true);  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);  const [isSelecting, setIsSelecting] = useState<boolean>(false);  const [existingAllocation, setExistingAllocation] = useState<any>(null);
  const [allocationRoomDetails, setAllocationRoomDetails] = useState<any>(null);
  const [allocationChecked, setAllocationChecked] = useState(false);
  const [hostelSettings, setHostelSettings] = useState<any>(null);
  
  // Room change functionality state
  const [showChangeRoomDialog, setShowChangeRoomDialog] = useState(false);
  const [availableRoomsForChange, setAvailableRoomsForChange] = useState<(Room & { hostelName: string; floorName: string; price: number })[]>([]);
  const [selectedNewRoom, setSelectedNewRoom] = useState<Room & { hostelName: string; floorName: string; price: number } | null>(null);
  const [isChangingRoom, setIsChangingRoom] = useState(false);
  useEffect(() => {
    loadHostels();
    loadHostelSettings();
  }, []);

  useEffect(() => {
    if (hostels.length > 0 && !allocationChecked) {
      setAllocationChecked(true);
      checkExistingAllocation();
    }
  }, [hostels, allocationChecked]);
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
  };const checkExistingAllocation = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const emailDomain = user.email?.split("@")[1] || "";
      let regNumber = "";

      try {
        if (emailDomain === "hit.ac.zw") {
          // For hit.ac.zw domain users
          regNumber = user.email?.split("@")[0] || "";
        } else if (emailDomain === "gmail.com" && user.email) {
          // For gmail.com users, find them by email first
          const usersRef = collection(db, "students");
          const q = query(usersRef, where("email", "==", user.email));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            // User exists in database
            const userData = querySnapshot.docs[0].data();
            regNumber = userData.regNumber || "";
          } else {
            // User doesn't exist in database
            console.log("User not found in database");
            return;
          }
        } else {
          // Unsupported email domain
          console.log("Unsupported email domain");
          return;
        }

        if (regNumber) {
          const allocations = await fetchStudentAllocations(regNumber);
          if (allocations.length > 0) {
            setExistingAllocation(allocations[0]);
            
            // Fetch room details for the allocation
            const allocation = allocations[0];
            const hostel = hostels.find(h => h.id === allocation.hostelId);
            if (hostel) {
              let roomDetails = null;
              hostel.floors.forEach(floor => {
                floor.rooms.forEach(room => {
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
    }
  };

  const getFilteredRooms = () => {
    if (!selectedHostel) return [];
    
    const hostel = hostels.find(h => h.id === selectedHostel);
    if (!hostel) return [];

    let rooms: (Room & { hostelName: string; floorName: string; price: number })[] = [];
      hostel.floors.forEach(floor => {
      if (!selectedFloor || selectedFloor === 'all' || floor.id === selectedFloor) {
        floor.rooms.forEach(room => {
          // Filter by student gender compatibility
          const isGenderCompatible = !studentProfile?.gender || 
            room.gender === 'Mixed' || 
            room.gender === studentProfile.gender;
          
          if (isGenderCompatible && room.isAvailable && !room.isReserved) {
            rooms.push({
              ...room,
              hostelName: hostel.name,
              floorName: floor.name,
              price: hostel.pricePerSemester
            });
          }
        });
      }
    });

    // Apply filters
    if (searchTerm) {
      rooms = rooms.filter(room => 
        room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.hostelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.floorName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }    if (priceFilter && priceFilter !== 'any') {
      const [min, max] = priceFilter.split('-').map(Number);
      rooms = rooms.filter(room => room.price >= min && room.price <= max);
    }    if (capacityFilter && capacityFilter !== 'any') {
      rooms = rooms.filter(room => room.capacity.toString() === capacityFilter);
    }

    return rooms;
  };
  const handleRoomSelect = async (room: Room & { hostelName: string; floorName: string; price: number }) => {
    // Prevent double-clicks by checking if already selecting
    if (isSelecting) return;
    
    if (existingAllocation) {
      toast.error('You already have a room allocation. Please contact admin to change.');
      return;
    }

    setIsSelecting(true);
    setSelectedRoom(room);
    
    // Reset the selecting state after a short delay
    setTimeout(() => setIsSelecting(false), 1000);
  };  const confirmRoomSelection = async () => {
    if (!selectedRoom || !studentProfile || isSelecting) return;

    try {
      setIsSelecting(true);
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const emailDomain = user.email?.split("@")[1] || "";
      let regNumber = "";

      if (emailDomain === "hit.ac.zw") {
        // For hit.ac.zw domain users
        regNumber = user.email?.split("@")[0] || "";
      } else if (emailDomain === "gmail.com" && user.email) {
        // For gmail.com users, find them by email first
        const usersRef = collection(db, "students");
        const q = query(usersRef, where("email", "==", user.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // User exists in database
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
        return;      }
      
      // Fetch settings to get the grace period (deadline)
      const settings = await fetchHostelSettings();
      await allocateRoom(regNumber, selectedRoom.id, selectedHostel);
      
      const deadlineHours = settings.paymentGracePeriod;
      const deadlineDays = Math.round(deadlineHours / 24);
      toast.success(`Room ${selectedRoom.number} allocated successfully! Please pay within ${deadlineHours} hours (${deadlineDays} days) to confirm.`);
      onRoomSelected(selectedRoom.id, selectedHostel);      
      // Refresh data
      loadHostels();
      checkExistingAllocation();
      setSelectedRoom(null); // Close the modal
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
      );      // Update local state immediately
      const updatedHostels = hostels.map(hostel => {
        const updatedHostel = { ...hostel };
        
        // Handle same-hostel transfer (both remove and add in same hostel)
        if (hostel.id === existingAllocation.hostelId && hostel.id === targetHostelId) {
          updatedHostel.floors = hostel.floors.map(floor => ({
            ...floor,
            rooms: floor.rooms.map(room => {
              // Remove student from current room
              if (room.id === existingAllocation.roomId) {
                return {
                  ...room,
                  occupants: room.occupants.filter(reg => reg !== existingAllocation.studentRegNumber),
                  isAvailable: room.occupants.filter(reg => reg !== existingAllocation.studentRegNumber).length < room.capacity
                };
              }
              // Add student to new room
              if (room.id === selectedNewRoom.id) {
                const newOccupants = [...room.occupants, existingAllocation.studentRegNumber];
                return {
                  ...room,
                  occupants: newOccupants,
                  isAvailable: newOccupants.length < room.capacity
                };
              }
              return room;
            })
          }));
          // No change in total occupancy for same-hostel transfers
        } else {
          // Handle cross-hostel transfer
          // Remove student from current room
          if (hostel.id === existingAllocation.hostelId) {
            updatedHostel.floors = hostel.floors.map(floor => ({
              ...floor,
              rooms: floor.rooms.map(room => {
                if (room.id === existingAllocation.roomId) {
                  return {
                    ...room,
                    occupants: room.occupants.filter(reg => reg !== existingAllocation.studentRegNumber),
                    isAvailable: room.occupants.filter(reg => reg !== existingAllocation.studentRegNumber).length < room.capacity
                  };
                }
                return room;
              })
            }));
            updatedHostel.currentOccupancy = Math.max(0, hostel.currentOccupancy - 1);
          }
          
          // Add student to new room
          if (hostel.id === targetHostelId) {
            updatedHostel.floors = hostel.floors.map(floor => ({
              ...floor,
              rooms: floor.rooms.map(room => {
                if (room.id === selectedNewRoom.id) {
                  const newOccupants = [...room.occupants, existingAllocation.studentRegNumber];
                  return {
                    ...room,
                    occupants: newOccupants,
                    isAvailable: newOccupants.length < room.capacity
                  };
                }
                return room;
              })
            }));
            updatedHostel.currentOccupancy = hostel.currentOccupancy + 1;
          }
        }
        
        return updatedHostel;
      });
      
      // Update hostels state
      setHostels(updatedHostels);
      
      toast.success(`Room changed successfully to ${selectedNewRoom.number}!`);
      
      // Close dialog and refresh allocation data
      setShowChangeRoomDialog(false);
      setSelectedNewRoom(null);
      checkExistingAllocation();
      
    } catch (error) {
      console.error('Room change error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to change room');
    } finally {
      setIsChangingRoom(false);
    }
  };

  const getRoomStatusColor = (room: Room) => {
    if (!room.isAvailable) return 'bg-red-100 border-red-200';
    if (room.isReserved) return 'bg-yellow-100 border-yellow-200';
    if (room.occupants.length === 0) return 'bg-green-100 border-green-200';
    return 'bg-blue-100 border-blue-200';
  };

  const getRoomStatusIcon = (room: Room) => {
    if (!room.isAvailable) return <XCircle className="w-4 h-4 text-red-500" />;
    if (room.isReserved) return <Clock className="w-4 h-4 text-yellow-500" />;
    if (room.occupants.length === 0) return <CheckCircle className="w-4 h-4 text-green-500" />;
    return <Users className="w-4 h-4 text-blue-500" />;
  };

  const getRoomStatusText = (room: Room) => {
    if (!room.isAvailable) return 'Full';
    if (room.isReserved) return 'Reserved';
    if (room.occupants.length === 0) return 'Available';
    return `${room.occupants.length}/${room.capacity} occupied`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (existingAllocation) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Room Already Allocated
          </CardTitle>
          <CardDescription>
            You have been allocated a room. Check your payment status below.
          </CardDescription>
        </CardHeader>        <CardContent>
          <div className="space-y-4">
            {allocationRoomDetails && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-blue-800 mb-2">Room Details</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p><strong>Hostel:</strong> {allocationRoomDetails.hostelName}</p>
                  <p><strong>Floor:</strong> {allocationRoomDetails.floorName}</p>
                  <p><strong>Room Number:</strong> {allocationRoomDetails.number}</p>
                  <p><strong>Capacity:</strong> {allocationRoomDetails.capacity} {allocationRoomDetails.capacity === 1 ? 'person' : 'people'}</p>
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Room Number</p>
                <p className="text-lg font-semibold">{allocationRoomDetails ? allocationRoomDetails.number : existingAllocation.roomId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Payment Status</p>
                <Badge variant={existingAllocation.paymentStatus === 'Paid' ? 'default' : 'destructive'}>
                  {existingAllocation.paymentStatus}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Payment Deadline</p>
                <p className="text-sm">{new Date(existingAllocation.paymentDeadline).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Allocated Date</p>
                <p className="text-sm">{new Date(existingAllocation.allocatedAt).toLocaleDateString()}</p>
              </div>
            </div>            {existingAllocation.paymentStatus !== 'Paid' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <p className="text-sm font-medium text-yellow-800">Payment Required</p>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  Please complete your payment by the deadline to secure your room allocation.
                </p>
              </div>            )}
            
            {/* Room Change Section */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Room Management</h4>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleChangeRoom}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Change Room
                </Button>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-700">
                  You can change to a different room within the same hostel. 
                  Your current payment status will be maintained.
                </p>
              </div>
            </div>
            
            {/* Payment Management Section */}
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-4">Payment Management</h4>
              <StudentPaymentManagement />
            </div>
          </div>
        </CardContent>
      </Card>
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
      <div className="flex-1 overflow-auto p-6 space-y-6">

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Rooms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Hostel</label>
              <Select value={selectedHostel} onValueChange={setSelectedHostel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select hostel" />
                </SelectTrigger>
                <SelectContent>
                  {hostels.map(hostel => (
                    <SelectItem key={hostel.id} value={hostel.id}>
                      {hostel.name} (${hostel.pricePerSemester})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedHostel && (
              <div>
                <label className="block text-sm font-medium mb-2">Floor</label>                  <Select value={selectedFloor} onValueChange={setSelectedFloor}>
                    <SelectTrigger>
                      <SelectValue placeholder="All floors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All floors</SelectItem>
                      {hostels.find(h => h.id === selectedHostel)?.floors.map(floor => (
                        <SelectItem key={floor.id} value={floor.id}>
                          {floor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Price Range</label>              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Any price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any price</SelectItem>
                  <SelectItem value="0-450">$0 - $450</SelectItem>
                  <SelectItem value="451-500">$451 - $500</SelectItem>
                  <SelectItem value="501-600">$501 - $600</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <Input
                placeholder="Search room number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hostel Info */}
      {selectedHostel && (
        <Card>
          <CardContent className="pt-6">
            {(() => {
              const hostel = hostels.find(h => h.id === selectedHostel);
              if (!hostel) return null;
              
              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{hostel.name}</h3>
                      <p className="text-gray-600">{hostel.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-indigo-600">${hostel.pricePerSemester}</p>
                      <p className="text-sm text-gray-500">per semester</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {hostel.features.map((feature, index) => (
                      <Badge key={index} variant="secondary">{feature}</Badge>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-500" />
                      <span>Capacity: {hostel.totalCapacity}</span>
                    </div>                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span>Occupied: {hostel.currentOccupancy}/{hostel.totalCapacity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{hostel.floors.length} floors</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bed className="w-4 h-4 text-gray-500" />
                      <span>{hostel.gender} accommodation</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* Rooms Grid */}
      {selectedHostel && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {getFilteredRooms().map((room) => (            <Card 
              key={room.id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${getRoomStatusColor(room)} ${
                selectedRoom?.id === room.id ? 'ring-2 ring-indigo-500' : ''
              } ${isSelecting ? 'opacity-50' : ''}`}
              onClick={() => room.isAvailable && !room.isReserved && !isSelecting && handleRoomSelect(room)}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-lg">Room {room.number}</h4>
                    {getRoomStatusIcon(room)}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-gray-500" />
                      <span>{room.floorName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3 h-3 text-gray-500" />
                      <span>Capacity: {room.capacity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-3 h-3 text-gray-500" />
                      <span>${room.price}/semester</span>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <Badge variant={room.isAvailable && !room.isReserved ? 'default' : 'secondary'}>
                      {getRoomStatusText(room)}
                    </Badge>
                  </div>
                  
                  {room.features && room.features.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {room.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {selectedHostel && getFilteredRooms().length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No rooms available</h3>
            <p className="text-gray-600">Try adjusting your filters or selecting a different hostel.</p>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Confirm Room Selection</CardTitle>
              <CardDescription>
                Are you sure you want to select this room?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold">Room {selectedRoom.number}</h4>
                  <p className="text-sm text-gray-600">{selectedRoom.hostelName} - {selectedRoom.floorName}</p>
                  <p className="text-sm">Capacity: {selectedRoom.capacity} students</p>
                  <p className="text-lg font-semibold text-indigo-600">${selectedRoom.price}/semester</p>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <p className="text-sm font-medium text-yellow-800">Payment Required</p>
                  </div>                  <p className="text-sm text-yellow-700 mt-1">
                    {hostelSettings 
                      ? `You must pay within ${hostelSettings.paymentGracePeriod} hours (${Math.round(hostelSettings.paymentGracePeriod / 24)} days) to confirm your room allocation.`
                      : 'You must pay within the specified time period to confirm your room allocation.'
                    }
                  </p>
                </div>
                
                <div className="flex gap-3">                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setSelectedRoom(null);
                      setIsSelecting(false);
                    }}
                  >
                    Cancel
                  </Button>                  <Button 
                    className="flex-1"
                    onClick={confirmRoomSelection}
                    disabled={isSelecting}
                  >
                    {isSelecting ? 'Selecting...' : 'Confirm Selection'}
                  </Button>
                </div>
              </div>
            </CardContent>          </Card>
        </div>
      )}      {/* Change Room Dialog */}
      {showChangeRoomDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Change Room</CardTitle>
              <CardDescription>
                Select a new room from the available options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Current Room Information */}
                {allocationRoomDetails && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <Bed className="w-4 h-4" />
                      Your Current Room
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Room Number</p>
                        <p className="font-medium">{allocationRoomDetails.number}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Hostel</p>
                        <p className="font-medium">{allocationRoomDetails.hostelName}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Floor</p>
                        <p className="font-medium">{allocationRoomDetails.floorName}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Price</p>
                        <p className="font-medium text-green-600">${allocationRoomDetails.price}/semester</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Price Validation Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-blue-600" />
                    <p className="text-sm font-medium text-blue-800">Price Matching Required</p>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    You can only change to rooms with the same price as your current room (${allocationRoomDetails?.price || 'N/A'}/semester) to maintain payment consistency.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {availableRoomsForChange.length === 0 ? (
                    <div className="text-center py-8">
                      <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Available Rooms</h3>
                      <p className="text-sm text-gray-500">
                        No rooms with the same price (${allocationRoomDetails?.price || 'N/A'}/semester) are currently available for change.
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Please try again later or contact administration for assistance.
                      </p>
                    </div>
                  ) : (                    availableRoomsForChange.map(room => (
                      <Card 
                        key={room.id} 
                        className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${getRoomStatusColor(room)} ${
                          selectedNewRoom?.id === room.id ? 'ring-2 ring-indigo-500' : ''
                        }`}
                        onClick={() => setSelectedNewRoom(room)}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-lg">Room {room.number}</h4>
                              <div className="flex items-center gap-2">
                                {room.price === allocationRoomDetails?.price && (
                                  <Badge variant="default" className="text-xs">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Price Match
                                  </Badge>
                                )}
                                {getRoomStatusIcon(room)}
                              </div>
                            </div>
                            
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <Building className="w-3 h-3 text-gray-500" />
                                <span>{room.hostelName}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-3 h-3 text-gray-500" />
                                <span>{room.floorName}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="w-3 h-3 text-gray-500" />
                                <span>Capacity: {room.capacity}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-3 h-3 text-gray-500" />
                                <span className={`font-medium ${
                                  room.price === allocationRoomDetails?.price 
                                    ? 'text-green-600' 
                                    : 'text-red-600'
                                }`}>
                                  ${room.price}/semester
                                </span>
                                {room.price === allocationRoomDetails?.price && (
                                  <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                                    Same Price
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="pt-2 border-t">
                              <Badge variant={room.isAvailable && !room.isReserved ? 'default' : 'secondary'}>
                                {getRoomStatusText(room)}
                              </Badge>
                            </div>
                            
                            {room.features && room.features.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {room.features.map((feature, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>                
                {/* Selected Room Summary */}
                {selectedNewRoom && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Selected New Room
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-green-600">Room Number</p>
                        <p className="font-medium">{selectedNewRoom.number}</p>
                      </div>
                      <div>
                        <p className="text-green-600">Hostel</p>
                        <p className="font-medium">{selectedNewRoom.hostelName}</p>
                      </div>
                      <div>
                        <p className="text-green-600">Floor</p>
                        <p className="font-medium">{selectedNewRoom.floorName}</p>
                      </div>
                      <div>
                        <p className="text-green-600">Price</p>
                        <p className="font-medium">${selectedNewRoom.price}/semester</p>
                      </div>
                    </div>
                    {selectedNewRoom.price === allocationRoomDetails?.price && (
                      <div className="mt-2 flex items-center gap-2 text-green-700">
                        <CheckCircle className="w-4 h-4" />
                        <p className="text-sm font-medium">Price matches your current room - no payment adjustment needed</p>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowChangeRoomDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={confirmRoomChange}
                    disabled={isChangingRoom || !selectedNewRoom}
                  >
                    {isChangingRoom ? 'Changing...' : 'Confirm Change'}
                  </Button>
                </div>
              </div>
            </CardContent>          </Card>
        </div>
      )}
      </div>
    </div>
  );
};

export default RoomSelection;
