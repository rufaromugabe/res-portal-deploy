'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  Users, 
  Bed, 
  DollarSign,
  RotateCcw,
  MapPin
} from 'lucide-react';
import { Room } from '@/types/hostel';
import { getRoomDetailsFromAllocation } from '@/data/hostel-data';

interface CurrentAllocationCardProps {
  existingAllocation: any;
  allocationRoomDetails: Room & { hostelName: string; floorName: string };
  hostelSettings: any;
  onChangeRoom: () => void;
  loading?: boolean;
}

const CurrentAllocationCard: React.FC<CurrentAllocationCardProps> = ({
  existingAllocation,
  allocationRoomDetails,
  hostelSettings,
  onChangeRoom,
  loading = false
}) => {
  const [roomDetails, setRoomDetails] = useState<any>(allocationRoomDetails);
  
  useEffect(() => {
    // Fetch room details using the same approach as in student-application.tsx
    const fetchRoomDetails = async () => {
      if (existingAllocation) {
        const details = await getRoomDetailsFromAllocation(existingAllocation);
        if (details) {
          setRoomDetails({
            ...details.room,
            hostelName: details.hostel.name,
            floorName: details.room.floorName,
            price: details.price
          });
        }
      }
    };
    
    fetchRoomDetails();
  }, [existingAllocation]);
  
  if (!existingAllocation || !roomDetails) return null;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Helper function to safely parse dates
  const parseDate = (dateValue: any): string => {
    if (!dateValue) return 'Unknown';
    
    try {
      let date: Date | null = null;
      
      // Handle Firestore timestamp
      if (dateValue.seconds) {
        date = new Date(dateValue.seconds * 1000);
      }
      // Handle ISO string or other date strings
      else if (typeof dateValue === 'string') {
        date = new Date(dateValue);
      }
      // Handle Date object
      else if (dateValue instanceof Date) {
        date = dateValue;
      }
      // Handle timestamp number
      else if (typeof dateValue === 'number') {
        date = new Date(dateValue);
      }
      
      // Validate the date and return formatted string
      if (date && !isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    } catch (error) {
      console.error('Error parsing date:', error, 'Date value:', dateValue);
    }
    
    return 'Unknown';
  };
  
  const canChangeRoom = () => {
    if (!hostelSettings) return false;
    return hostelSettings.allowRoomChanges;
  };

  // Use allocation date if it exists, otherwise fall back to allocationDate
  const allocationDate = existingAllocation.allocatedAt || existingAllocation.allocationDate;

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-blue-800">Current Room Allocation</CardTitle>
            <CardDescription>Your assigned accommodation details</CardDescription>
          </div>          
          <Badge className={getStatusColor(existingAllocation.paymentStatus)}>
            {existingAllocation.paymentStatus}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Hostel:</span>
                <span>{roomDetails.hostelName}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Floor:</span>
                <span>{roomDetails.floorName}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Bed className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Room:</span>
                <span>{roomDetails.number}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Capacity:</span>
                <span>{roomDetails.capacity} students</span>
              </div>
              
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Price:</span>
                <span>${existingAllocation.totalCost || roomDetails.price}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="font-medium">Allocated:</span>
                <span>{parseDate(allocationDate)}</span>
              </div>
            </div>
          </div>
          
          {existingAllocation.paymentStatus === 'Pending' && existingAllocation.paymentDeadline && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">              
              <p className="text-sm text-yellow-800">
                <strong>Payment Required:</strong> Complete payment by{' '}
                {parseDate(existingAllocation.paymentDeadline)}
                {' '}to confirm your allocation.
              </p>
            </div>
          )}
          
          {canChangeRoom() && (
            <div className="pt-4 border-t">
              <Button 
                onClick={onChangeRoom}
                variant="outline"
                className="w-full sm:w-auto"
                disabled={loading}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Change Room
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Room changes are subject to availability and may incur additional fees.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentAllocationCard;
