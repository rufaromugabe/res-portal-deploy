'use client';

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Building, 
  Users, 
  Bed, 
  DollarSign, 
  MapPin,
  Search
} from 'lucide-react';
import { Room } from '@/types/hostel';

interface RoomChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableRooms: (Room & { hostelName: string; floorName: string; price: number })[];
  selectedRoom: (Room & { hostelName: string; floorName: string; price: number }) | null;
  onRoomSelect: (room: Room & { hostelName: string; floorName: string; price: number }) => void;
  onConfirm: () => void;
  isChanging: boolean;
}

const RoomChangeModal: React.FC<RoomChangeModalProps> = ({
  isOpen,
  onClose,
  availableRooms,
  selectedRoom,
  onRoomSelect,
  onConfirm,
  isChanging
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRooms = availableRooms.filter(room =>
    room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.hostelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.floorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Change Room</DialogTitle>
          <DialogDescription>
            Select a new room from the available options. Room changes may incur additional fees.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            <Input
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>

          {filteredRooms.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No rooms available for change at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {filteredRooms.map((room) => (
                <Card 
                  key={`${room.hostelName}-${room.floorName}-${room.id}`}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedRoom?.id === room.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => onRoomSelect(room)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">Room {room.number}</h4>
                          <p className="text-sm text-gray-600">{room.hostelName} - {room.floorName}</p>
                        </div>
                        <Badge variant="outline">{room.gender}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{room.capacity} capacity</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          <span>${room.price}</span>
                        </div>
                      </div>                      {room.features && room.features.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {room.features.slice(0, 2).map((feature: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {room.features.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{room.features.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {selectedRoom && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium mb-2">Selected Room Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-blue-600" />
                    <span>{selectedRoom.hostelName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>{selectedRoom.floorName}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Bed className="w-4 h-4 text-blue-600" />
                    <span>Room {selectedRoom.number}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold">${selectedRoom.price}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isChanging}>
            Cancel
          </Button>
          <Button 
            onClick={onConfirm} 
            disabled={!selectedRoom || isChanging}
          >
            {isChanging ? 'Changing Room...' : 'Confirm Change'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoomChangeModal;
