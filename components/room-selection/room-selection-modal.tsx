'use client';

import React from 'react';
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
import { 
  Building, 
  Users, 
  Bed, 
  DollarSign, 
  MapPin,
  Wifi,
  Shield
} from 'lucide-react';
import { Room } from '@/types/hostel';

interface RoomSelectionModalProps {
  room: Room & { hostelName: string; floorName: string; price: number } | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSelecting: boolean;
  hostelSettings: any;
}

const RoomSelectionModal: React.FC<RoomSelectionModalProps> = ({
  room,
  isOpen,
  onClose,
  onConfirm,
  isSelecting,
  hostelSettings
}) => {
  if (!room) return null;

  const deadlineHours = hostelSettings?.paymentGracePeriod || 72;
  const deadlineDays = Math.round(deadlineHours / 24);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Room Selection</DialogTitle>
          <DialogDescription>
            Please review the details before confirming your room selection.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Hostel:</span>
                <span>{room.hostelName}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Floor:</span>
                <span>{room.floorName}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Bed className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Room Number:</span>
                <span className="text-lg font-semibold">{room.number}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Room Type:</span>
                <span>{room.gender} ({room.capacity} capacity)</span>
              </div>
              
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Price:</span>
                <span className="text-lg font-bold text-blue-600">${room.price}</span>
              </div>
            </div>
          </div>          {room.features && room.features.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Room Features</h4>
              <div className="flex flex-wrap gap-1">
                {room.features.map((feature: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Payment Required:</strong> You have {deadlineHours} hours ({deadlineDays} days) 
              to complete payment after allocation to confirm your room.
            </p>
          </div>

          {room.occupants && room.occupants.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Current Occupants</h4>
              <p className="text-sm text-gray-600">
                {room.occupants.length} of {room.capacity} spaces occupied
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSelecting}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isSelecting}>
            {isSelecting ? 'Allocating...' : 'Confirm Selection'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoomSelectionModal;
