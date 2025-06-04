'use client';

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Users, Bed, MapPin, DollarSign } from 'lucide-react';
import { Hostel } from '@/types/hostel';

interface HostelInfoCardProps {
  hostel: Hostel;
}

const HostelInfoCard: React.FC<HostelInfoCardProps> = ({ hostel }) => {
  const totalRooms = hostel.floors.reduce((total, floor) => total + floor.rooms.length, 0);
  const occupiedRooms = hostel.floors.reduce((total, floor) => 
    total + floor.rooms.filter(room => !room.isAvailable || room.occupants.length > 0).length, 0
  );
  const occupancyPercentage = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  return (
    <Card>
      <CardContent className="pt-6">
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
              <span>{hostel.floors.length} floors</span>
            </div>
            <div className="flex items-center gap-2">
              <Bed className="w-4 h-4 text-gray-500" />
              <span>{totalRooms} rooms</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span>{hostel.totalCapacity} capacity</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>{hostel.name} Campus</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between text-sm">
              <span>Occupancy</span>
              <span className="font-medium">{occupiedRooms}/{totalRooms} rooms ({occupancyPercentage}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${occupancyPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HostelInfoCard;
