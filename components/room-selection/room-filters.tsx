'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Hostel } from '@/types/hostel';

interface RoomFiltersProps {
  hostels: Hostel[];
  selectedHostel: string;
  selectedFloor: string;
  searchTerm: string;
  priceFilter: string;
  onHostelChange: (value: string) => void;
  onFloorChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onPriceFilterChange: (value: string) => void;
}

const RoomFilters: React.FC<RoomFiltersProps> = ({
  hostels,
  selectedHostel,
  selectedFloor,
  searchTerm,
  priceFilter,
  onHostelChange,
  onFloorChange,
  onSearchChange,
  onPriceFilterChange
}) => {
  const selectedHostelData = hostels.find(h => h.id === selectedHostel);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Rooms</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Hostel</label>
            <Select value={selectedHostel} onValueChange={onHostelChange}>
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
          
          {selectedHostel && selectedHostelData && (
            <div>
              <label className="block text-sm font-medium mb-2">Floor</label>
              <Select value={selectedFloor} onValueChange={onFloorChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All floors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All floors</SelectItem>
                  {selectedHostelData.floors.map(floor => (
                    <SelectItem key={floor.id} value={floor.id}>
                      {floor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Price Range</label>
            <Select value={priceFilter} onValueChange={onPriceFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="Any price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any price</SelectItem>
                <SelectItem value="0-450">$0 - $450</SelectItem>
                <SelectItem value="451-500">$451 - $500</SelectItem>
                <SelectItem value="501-600">$501 - $600</SelectItem>
                <SelectItem value="601-700">$601 - $700</SelectItem>
                <SelectItem value="701-1000">$701+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <Input
              placeholder="Search room number..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomFilters;
