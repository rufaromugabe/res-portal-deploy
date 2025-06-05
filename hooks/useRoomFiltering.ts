'use client';

import { useMemo } from 'react';
import { Room, Hostel } from '@/types/hostel';

interface FilterOptions {
  selectedHostel: string;
  selectedFloor: string;
  searchTerm: string;
  priceFilter: string;
  capacityFilter: string;
  studentGender?: 'Male' | 'Female';
}

export const useRoomFiltering = (hostels: Hostel[], filters: FilterOptions) => {
  const filteredRooms = useMemo(() => {
    if (!filters.selectedHostel) return [];
    
    const hostel = hostels.find(h => h.id === filters.selectedHostel);
    if (!hostel) return [];

    let rooms: (Room & { hostelName: string; floorName: string; price: number })[] = [];
    
    hostel.floors.forEach(floor => {
      if (!filters.selectedFloor || filters.selectedFloor === 'all' || floor.id === filters.selectedFloor) {
        floor.rooms.forEach(room => {
          rooms.push({
            ...room,
            hostelName: hostel.name,
            floorName: floor.name,
            price: hostel.pricePerSemester
          });
        });
      }
    });    // Apply search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      rooms = rooms.filter(room => 
        room.number.toLowerCase().includes(searchLower) ||
        room.hostelName.toLowerCase().includes(searchLower) ||
        room.floorName.toLowerCase().includes(searchLower) ||
        room.gender.toLowerCase().includes(searchLower) ||
        (room.features && room.features.some(feature => 
          feature.toLowerCase().includes(searchLower)
        ))
      );
    }

    // Apply price filter
    if (filters.priceFilter && filters.priceFilter !== 'any') {
      const [min, max] = filters.priceFilter.split('-').map(Number);
      rooms = rooms.filter(room => {
        if (max) {
          return room.price >= min && room.price <= max;
        } else {
          return room.price >= min;
        }
      });
    }    // Apply capacity filter
    if (filters.capacityFilter && filters.capacityFilter !== 'any') {
      rooms = rooms.filter(room => room.capacity.toString() === filters.capacityFilter);
    }

    // Apply gender filter for first-time selection
    if (filters.studentGender) {
      rooms = rooms.filter(room => 
        room.gender === filters.studentGender || room.gender === 'Mixed'
      );
    }

    // Sort by availability first, then by room number
    return rooms.sort((a, b) => {
      // Available rooms first
      if (a.isAvailable && !b.isAvailable) return -1;
      if (!a.isAvailable && b.isAvailable) return 1;
      
      // Then by room number
      return a.number.localeCompare(b.number, undefined, { numeric: true });
    });
  }, [hostels, filters]);

  const availableRoomsCount = useMemo(() => {
    return filteredRooms.filter(room => 
      room.isAvailable && !room.isReserved && room.occupants.length < room.capacity
    ).length;
  }, [filteredRooms]);

  const selectedHostelData = useMemo(() => {
    return hostels.find(h => h.id === filters.selectedHostel);
  }, [hostels, filters.selectedHostel]);

  return {
    filteredRooms,
    availableRoomsCount,
    selectedHostelData
  };
};

export default useRoomFiltering;
