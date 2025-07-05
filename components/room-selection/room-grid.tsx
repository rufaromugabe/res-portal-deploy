'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Bed, 
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { Room } from '@/types/hostel';

interface RoomGridProps {
  rooms: (Room & { hostelId: string; hostelName: string; floorName: string; price: number })[];
  onRoomSelect: (room: Room & { hostelId: string; hostelName: string; floorName: string; price: number }) => void;
  isSelecting: boolean;
  existingAllocation: any;
  loading: boolean;
}

const ROOMS_PER_PAGE = 12;

const RoomGrid: React.FC<RoomGridProps> = ({
  rooms,
  onRoomSelect,
  isSelecting,
  existingAllocation,
  loading
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Memoize paginated rooms to prevent unnecessary re-renders
  const paginatedRooms = useMemo(() => {
    const startIndex = (currentPage - 1) * ROOMS_PER_PAGE;
    const endIndex = startIndex + ROOMS_PER_PAGE;
    return rooms.slice(startIndex, endIndex);
  }, [rooms, currentPage]);

  const totalPages = Math.ceil(rooms.length / ROOMS_PER_PAGE);

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

  const isRoomSelectable = (room: Room) => {
    return room.isAvailable && !room.isReserved && room.occupants.length < room.capacity;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No rooms available</h3>
          <p className="text-gray-500">
            Try adjusting your filters or selecting a different hostel.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {((currentPage - 1) * ROOMS_PER_PAGE) + 1}-{Math.min(currentPage * ROOMS_PER_PAGE, rooms.length)} of {rooms.length} rooms
        </p>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-500" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3 text-blue-500" />
            <span>Partially Occupied</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-yellow-500" />
            <span>Reserved</span>
          </div>
          <div className="flex items-center gap-1">
            <XCircle className="w-3 h-3 text-red-500" />
            <span>Full</span>
          </div>
        </div>
      </div>

      {/* Room Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedRooms.map((room) => (
          <Card 
            key={`${room.hostelName}-${room.floorName}-${room.id}`} 
            className={`transition-all duration-200 hover:shadow-md cursor-pointer ${getRoomStatusColor(room)}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-lg">Room {room.number}</h4>
                  <p className="text-sm text-gray-600">{room.floorName}</p>
                </div>
                <div className="flex flex-col items-end">
                  {getRoomStatusIcon(room)}
                  <span className="text-xs text-gray-500 mt-1">
                    {getRoomStatusText(room)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>Capacity</span>
                  </div>
                  <span>{room.capacity} students</span>
                </div>
                  <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Bed className="w-3 h-3" />
                    <span>Gender</span>
                  </div>
                  <span>{room.gender}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    <span>Price</span>
                  </div>
                  <span className="font-semibold">${room.price}</span>
                </div>
              </div>              {room.features && room.features.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {room.features.slice(0, 3).map((feature: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {room.features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{room.features.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
              
              <Button
                onClick={() => onRoomSelect(room)}
                disabled={!isRoomSelectable(room) || isSelecting || !!existingAllocation}
                className="w-full"
                variant={isRoomSelectable(room) ? "default" : "secondary"}
              >
                {isSelecting ? 'Selecting...' : 
                 existingAllocation ? 'Already Allocated' :
                 !isRoomSelectable(room) ? 'Not Available' : 'Select Room'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default RoomGrid;
