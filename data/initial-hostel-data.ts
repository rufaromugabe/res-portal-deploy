import { Hostel } from "@/types/hostel";

export const initialHostelData: Omit<Hostel, 'id'>[] = [
  {
    name: "Hostel 1",
    description: "Main accommodation facility with ground floor for males and upper floors for females",
    totalCapacity: 92, // 20 male students + 72 female students = 92 total
    currentOccupancy: 0,
    gender: 'Mixed',
    isActive: true,
    pricePerSemester: 575,
    features: ['WiFi', 'Common Areas', 'Security', 'Library Access', 'Canteen'],
    floors: [
      // GROUND FLOOR - MALE ONLY (20 students + 5 reserved rooms)
      {
        id: "hostel1_floor_ground",
        number: "G",
        name: "Ground Floor",
        rooms: [
          // Student Affairs - Reserved
          {
            id: "hostel1_floor_ground_G01",
            number: "G01",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 0,
            occupants: [],
            gender: 'Mixed',
            isReserved: true,
            reservedBy: "Student Affairs",
            isAvailable: false,
            features: ['Administrative Office']
          },
          // G02 - Male students 1-2
          {
            id: "hostel1_floor_ground_G02",
            number: "G02",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // G03 - Male students 3-4
          {
            id: "hostel1_floor_ground_G03",
            number: "G03",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Security - Reserved
          {
            id: "hostel1_floor_ground_G04",
            number: "G04",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 0,
            occupants: [],
            gender: 'Mixed',
            isReserved: true,
            reservedBy: "Security",
            isAvailable: false,
            features: ['Security Office']
          },
          // Library - Reserved
          {
            id: "hostel1_floor_ground_G05A",
            number: "G05A",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 0,
            occupants: [],
            gender: 'Mixed',
            isReserved: true,
            reservedBy: "Library",
            isAvailable: false,
            features: ['Library Space']
          },
          // G05B - Male students 5-6
          {
            id: "hostel1_floor_ground_G05B",
            number: "G05B",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // G06A - Male students 7-8
          {
            id: "hostel1_floor_ground_G06A",
            number: "G06A",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // G06B - Male students 9-10
          {
            id: "hostel1_floor_ground_G06B",
            number: "G06B",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // G07A - Male students 11-12
          {
            id: "hostel1_floor_ground_G07A",
            number: "G07A",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // G07B - Male students 13-14
          {
            id: "hostel1_floor_ground_G07B",
            number: "G07B",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // G08A - Male students 15-16
          {
            id: "hostel1_floor_ground_G08A",
            number: "G08A",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // G08B - Male students 17-18
          {
            id: "hostel1_floor_ground_G08B",
            number: "G08B",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Canteen - Reserved
          {
            id: "hostel1_floor_ground_G09",
            number: "G09",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 0,
            occupants: [],
            gender: 'Mixed',
            isReserved: true,
            reservedBy: "Canteen",
            isAvailable: false,
            features: ['Canteen Space']
          },
          // G10 - Male students 19-20
          {
            id: "hostel1_floor_ground_G10",
            number: "G10",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Additional Canteen - Reserved
          {
            id: "hostel1_floor_ground_G11",
            number: "G11",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 0,
            occupants: [],
            gender: 'Mixed',
            isReserved: true,
            reservedBy: "Canteen",
            isAvailable: false,
            features: ['Canteen Space']
          }
        ]
      },
      // FIRST FLOOR - FEMALE ONLY (36 students in 18 rooms)
      {
        id: "hostel1_floor_first",
        number: "F",
        name: "First Floor",
        rooms: [
          // F01 - Female students 21-22
          {
            id: "hostel1_floor_first_F01",
            number: "F01",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // F02A - Female students 23-24
          {
            id: "hostel1_floor_first_F02A",
            number: "F02A",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // F02B - Female students 25-26
          {
            id: "hostel1_floor_first_F02B",
            number: "F02B",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // F03A - Female students 27-28
          {
            id: "hostel1_floor_first_F03A",
            number: "F03A",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // F03B - Female students 29-30
          {
            id: "hostel1_floor_first_F03B",
            number: "F03B",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // F04 - Female students 31-32
          {
            id: "hostel1_floor_first_F04",
            number: "F04",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // F05 - Female students 33-34
          {
            id: "hostel1_floor_first_F05",
            number: "F05",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // F06A - Female students 35-36
          {
            id: "hostel1_floor_first_F06A",
            number: "F06A",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // F06B - Female students 37-38
          {
            id: "hostel1_floor_first_F06B",
            number: "F06B",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // F07A - Female students 39-40
          {
            id: "hostel1_floor_first_F07A",
            number: "F07A",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // F07B - Female students 41-42
          {
            id: "hostel1_floor_first_F07B",
            number: "F07B",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // F08A - Female students 43-44
          {
            id: "hostel1_floor_first_F08A",
            number: "F08A",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // F08B - Female students 45-46
          {
            id: "hostel1_floor_first_F08B",
            number: "F08B",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // F09A - Female students 47-48
          {
            id: "hostel1_floor_first_F09A",
            number: "F09A",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // F09B - Female students 49-50
          {
            id: "hostel1_floor_first_F09B",
            number: "F09B",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // F10 - Female students 51-52
          {
            id: "hostel1_floor_first_F10",
            number: "F10",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // F11 - Female students 53-54
          {
            id: "hostel1_floor_first_F11",
            number: "F11",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // F12 - Female students 55-56
          {
            id: "hostel1_floor_first_F12",
            number: "F12",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          }
        ]
      },
      // SECOND FLOOR - FEMALE ONLY (36 students in 18 rooms)
      {
        id: "hostel1_floor_second",
        number: "S",
        name: "Second Floor",
        rooms: [
          // S01 - Female students 57-58
          {
            id: "hostel1_floor_second_S01",
            number: "S01",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // S02A - Female students 59-60
          {
            id: "hostel1_floor_second_S02A",
            number: "S02A",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // S02B - Female students 61-62
          {
            id: "hostel1_floor_second_S02B",
            number: "S02B",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // S03A - Female students 63-64
          {
            id: "hostel1_floor_second_S03A",
            number: "S03A",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // S03B - Female students 65-66
          {
            id: "hostel1_floor_second_S03B",
            number: "S03B",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // S04 - Female students 67-68
          {
            id: "hostel1_floor_second_S04",
            number: "S04",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // S05 - Female students 69-70
          {
            id: "hostel1_floor_second_S05",
            number: "S05",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // S06A - Female students 71-72
          {
            id: "hostel1_floor_second_S06A",
            number: "S06A",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // S06B - Female students 73-74
          {
            id: "hostel1_floor_second_S06B",
            number: "S06B",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // S07A - Female students 75-76
          {
            id: "hostel1_floor_second_S07A",
            number: "S07A",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // S07B - Female students 77-78
          {
            id: "hostel1_floor_second_S07B",
            number: "S07B",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // S08A - Female students 79-80
          {
            id: "hostel1_floor_second_S08A",
            number: "S08A",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // S08B - Female students 81-82
          {
            id: "hostel1_floor_second_S08B",
            number: "S08B",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // S09A - Female students 83-84
          {
            id: "hostel1_floor_second_S09A",
            number: "S09A",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // S09B - Female students 85-86
          {
            id: "hostel1_floor_second_S09B",
            number: "S09B",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // S10 - Female students 87-88
          {
            id: "hostel1_floor_second_S10",
            number: "S10",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // S11 - Female students 89-90
          {
            id: "hostel1_floor_second_S11",
            number: "S11",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // S12 - Female students 91-92
          {
            id: "hostel1_floor_second_S12",
            number: "S12",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 1",
            price: 575,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          }        ]
      }
    ]
  },
  
  {
    name: "Hostel 2",
    description: "Boys accommodation facility with affordable pricing",
    totalCapacity: 130, // 65 rooms × 2 students per room = 130 total
    currentOccupancy: 0,
    gender: 'Male',
    isActive: true,
    pricePerSemester: 460,
    features: ['WiFi', 'Common Areas', 'Security'],
    floors: [
      // GROUND FLOOR - MALE ONLY
      {
        id: "hostel2_floor_ground",
        number: "G",
        name: "Ground Floor",
        rooms: [
          // Room 3
          {
            id: "hostel2_floor_ground_3",
            number: "3",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 4
          {
            id: "hostel2_floor_ground_4",
            number: "4",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 5
          {
            id: "hostel2_floor_ground_5",
            number: "5",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 7
          {
            id: "hostel2_floor_ground_7",
            number: "7",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 12
          {
            id: "hostel2_floor_ground_12",
            number: "12",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 13
          {
            id: "hostel2_floor_ground_13",
            number: "13",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 14
          {
            id: "hostel2_floor_ground_14",
            number: "14",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 15
          {
            id: "hostel2_floor_ground_15",
            number: "15",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 16
          {
            id: "hostel2_floor_ground_16",
            number: "16",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 17
          {
            id: "hostel2_floor_ground_17",
            number: "17",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 18
          {
            id: "hostel2_floor_ground_18",
            number: "18",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 19
          {
            id: "hostel2_floor_ground_19",
            number: "19",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 24
          {
            id: "hostel2_floor_ground_24",
            number: "24",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 25
          {
            id: "hostel2_floor_ground_25",
            number: "25",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 26
          {
            id: "hostel2_floor_ground_26",
            number: "26",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 27
          {
            id: "hostel2_floor_ground_27",
            number: "27",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 28
          {
            id: "hostel2_floor_ground_28",
            number: "28",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 29
          {
            id: "hostel2_floor_ground_29",
            number: "29",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 30
          {
            id: "hostel2_floor_ground_30",
            number: "30",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          }
        ]
      },
      // FIRST FLOOR - MALE ONLY
      {
        id: "hostel2_floor_first",
        number: "1",
        name: "First Floor",
        rooms: [
          // Room 102
          {
            id: "hostel2_floor_first_102",
            number: "102",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 103
          {
            id: "hostel2_floor_first_103",
            number: "103",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 104
          {
            id: "hostel2_floor_first_104",
            number: "104",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 105
          {
            id: "hostel2_floor_first_105",
            number: "105",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 106
          {
            id: "hostel2_floor_first_106",
            number: "106",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 109
          {
            id: "hostel2_floor_first_109",
            number: "109",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 110
          {
            id: "hostel2_floor_first_110",
            number: "110",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 111
          {
            id: "hostel2_floor_first_111",
            number: "111",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 114
          {
            id: "hostel2_floor_first_114",
            number: "114",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 115
          {
            id: "hostel2_floor_first_115",
            number: "115",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 116
          {
            id: "hostel2_floor_first_116",
            number: "116",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 117
          {
            id: "hostel2_floor_first_117",
            number: "117",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 118
          {
            id: "hostel2_floor_first_118",
            number: "118",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 119
          {
            id: "hostel2_floor_first_119",
            number: "119",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 120
          {
            id: "hostel2_floor_first_120",
            number: "120",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 121
          {
            id: "hostel2_floor_first_121",
            number: "121",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 126
          {
            id: "hostel2_floor_first_126",
            number: "126",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 127
          {
            id: "hostel2_floor_first_127",
            number: "127",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 128
          {
            id: "hostel2_floor_first_128",
            number: "128",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 129
          {
            id: "hostel2_floor_first_129",
            number: "129",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 130
          {
            id: "hostel2_floor_first_130",
            number: "130",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 131
          {
            id: "hostel2_floor_first_131",
            number: "131",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 132
          {
            id: "hostel2_floor_first_132",
            number: "132",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          }
        ]
      },
      // SECOND FLOOR - MALE ONLY
      {
        id: "hostel2_floor_second",
        number: "2",
        name: "Second Floor",
        rooms: [
          // Room 202
          {
            id: "hostel2_floor_second_202",
            number: "202",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 203
          {
            id: "hostel2_floor_second_203",
            number: "203",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 204
          {
            id: "hostel2_floor_second_204",
            number: "204",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 205
          {
            id: "hostel2_floor_second_205",
            number: "205",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 206
          {
            id: "hostel2_floor_second_206",
            number: "206",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 209
          {
            id: "hostel2_floor_second_209",
            number: "209",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 210
          {
            id: "hostel2_floor_second_210",
            number: "210",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 211
          {
            id: "hostel2_floor_second_211",
            number: "211",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 214
          {
            id: "hostel2_floor_second_214",
            number: "214",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 215
          {
            id: "hostel2_floor_second_215",
            number: "215",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 216
          {
            id: "hostel2_floor_second_216",
            number: "216",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 217
          {
            id: "hostel2_floor_second_217",
            number: "217",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 218
          {
            id: "hostel2_floor_second_218",
            number: "218",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 219
          {
            id: "hostel2_floor_second_219",
            number: "219",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 220
          {
            id: "hostel2_floor_second_220",
            number: "220",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 221
          {
            id: "hostel2_floor_second_221",
            number: "221",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 226
          {
            id: "hostel2_floor_second_226",
            number: "226",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 227
          {
            id: "hostel2_floor_second_227",
            number: "227",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 228
          {
            id: "hostel2_floor_second_228",
            number: "228",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 229
          {
            id: "hostel2_floor_second_229",
            number: "229",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 230
          {
            id: "hostel2_floor_second_230",
            number: "230",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 231
          {
            id: "hostel2_floor_second_231",
            number: "231",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 232
          {
            id: "hostel2_floor_second_232",
            number: "232",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 2",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          }        ]
      }
    ]
  },
  {
    name: "Hostel 3",
    description: "Boys accommodation facility with affordable pricing",
    totalCapacity: 130, // 65 rooms × 2 students per room = 130 total
    currentOccupancy: 0,
    gender: 'Male',
    isActive: true,
    pricePerSemester: 460,
    features: ['WiFi', 'Common Areas', 'Security'],
    floors: [
      // GROUND FLOOR - MALE ONLY
      {
        id: "hostel3_floor_ground",
        number: "G",
        name: "Ground Floor",
        rooms: [
          // Room 3
          {
            id: "hostel3_floor_ground_3",
            number: "3",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 4
          {
            id: "hostel3_floor_ground_4",
            number: "4",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 5
          {
            id: "hostel3_floor_ground_5",
            number: "5",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 7
          {
            id: "hostel3_floor_ground_7",
            number: "7",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 12
          {
            id: "hostel3_floor_ground_12",
            number: "12",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 13
          {
            id: "hostel3_floor_ground_13",
            number: "13",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 14
          {
            id: "hostel3_floor_ground_14",
            number: "14",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 15
          {
            id: "hostel3_floor_ground_15",
            number: "15",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 16
          {
            id: "hostel3_floor_ground_16",
            number: "16",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 17
          {
            id: "hostel3_floor_ground_17",
            number: "17",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 18
          {
            id: "hostel3_floor_ground_18",
            number: "18",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 19
          {
            id: "hostel3_floor_ground_19",
            number: "19",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 24
          {
            id: "hostel3_floor_ground_24",
            number: "24",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 25
          {
            id: "hostel3_floor_ground_25",
            number: "25",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 26
          {
            id: "hostel3_floor_ground_26",
            number: "26",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 27
          {
            id: "hostel3_floor_ground_27",
            number: "27",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 28
          {
            id: "hostel3_floor_ground_28",
            number: "28",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 29
          {
            id: "hostel3_floor_ground_29",
            number: "29",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 30
          {
            id: "hostel3_floor_ground_30",
            number: "30",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          }
        ]
      },
      // FIRST FLOOR - MALE ONLY
      {
        id: "hostel3_floor_first",
        number: "1",
        name: "First Floor",
        rooms: [
          // Room 102
          {
            id: "hostel3_floor_first_102",
            number: "102",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 103
          {
            id: "hostel3_floor_first_103",
            number: "103",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 104
          {
            id: "hostel3_floor_first_104",
            number: "104",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 105
          {
            id: "hostel3_floor_first_105",
            number: "105",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 106
          {
            id: "hostel3_floor_first_106",
            number: "106",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 109
          {
            id: "hostel3_floor_first_109",
            number: "109",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 110
          {
            id: "hostel3_floor_first_110",
            number: "110",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 111
          {
            id: "hostel3_floor_first_111",
            number: "111",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 114
          {
            id: "hostel3_floor_first_114",
            number: "114",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 115
          {
            id: "hostel3_floor_first_115",
            number: "115",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 116
          {
            id: "hostel3_floor_first_116",
            number: "116",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 117
          {
            id: "hostel3_floor_first_117",
            number: "117",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 118
          {
            id: "hostel3_floor_first_118",
            number: "118",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 119
          {
            id: "hostel3_floor_first_119",
            number: "119",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 120
          {
            id: "hostel3_floor_first_120",
            number: "120",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 121
          {
            id: "hostel3_floor_first_121",
            number: "121",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 126
          {
            id: "hostel3_floor_first_126",
            number: "126",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 127
          {
            id: "hostel3_floor_first_127",
            number: "127",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 128
          {
            id: "hostel3_floor_first_128",
            number: "128",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 129
          {
            id: "hostel3_floor_first_129",
            number: "129",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 130
          {
            id: "hostel3_floor_first_130",
            number: "130",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 131
          {
            id: "hostel3_floor_first_131",
            number: "131",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 132
          {
            id: "hostel3_floor_first_132",
            number: "132",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          }
        ]
      },
      // SECOND FLOOR - MALE ONLY
      {
        id: "hostel3_floor_second",
        number: "2",
        name: "Second Floor",
        rooms: [
          // Room 202
          {
            id: "hostel3_floor_second_202",
            number: "202",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 203
          {
            id: "hostel3_floor_second_203",
            number: "203",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 204
          {
            id: "hostel3_floor_second_204",
            number: "204",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 205
          {
            id: "hostel3_floor_second_205",
            number: "205",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 206
          {
            id: "hostel3_floor_second_206",
            number: "206",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 209
          {
            id: "hostel3_floor_second_209",
            number: "209",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 210
          {
            id: "hostel3_floor_second_210",
            number: "210",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 211
          {
            id: "hostel3_floor_second_211",
            number: "211",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 214
          {
            id: "hostel3_floor_second_214",
            number: "214",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 215
          {
            id: "hostel3_floor_second_215",
            number: "215",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 216
          {
            id: "hostel3_floor_second_216",
            number: "216",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 217
          {
            id: "hostel3_floor_second_217",
            number: "217",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 218
          {
            id: "hostel3_floor_second_218",
            number: "218",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 219
          {
            id: "hostel3_floor_second_219",
            number: "219",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 220
          {
            id: "hostel3_floor_second_220",
            number: "220",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 221
          {
            id: "hostel3_floor_second_221",
            number: "221",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 226
          {
            id: "hostel3_floor_second_226",
            number: "226",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 227
          {
            id: "hostel3_floor_second_227",
            number: "227",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 228
          {
            id: "hostel3_floor_second_228",
            number: "228",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 229
          {
            id: "hostel3_floor_second_229",
            number: "229",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 230
          {
            id: "hostel3_floor_second_230",
            number: "230",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 231
          {
            id: "hostel3_floor_second_231",
            number: "231",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 232
          {
            id: "hostel3_floor_second_232",
            number: "232",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 3",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Male',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          }
        ]
      }
    ]
  },{
    name: "Hostel 4",
    description: "Female accommodation facility with ground, first and second floors",
    totalCapacity: 122, // 122 female students total
    currentOccupancy: 0,
    gender: 'Female',
    isActive: true,
    pricePerSemester: 460,
    features: ['WiFi', 'Common Areas', 'Security', 'Study Areas'],
    floors: [
      // GROUND FLOOR - FEMALE ONLY (30 students)
      {
        id: "hostel4_floor_ground",
        number: "G",
        name: "Ground Floor",
        rooms: [
          // Room 12 - Female students 1-2
          {
            id: "hostel4_floor_ground_12",
            number: "12",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 13 - Female students 3-4
          {
            id: "hostel4_floor_ground_13",
            number: "13",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 14 - Female students 5-6
          {
            id: "hostel4_floor_ground_14",
            number: "14",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 15 - Female students 7-8
          {
            id: "hostel4_floor_ground_15",
            number: "15",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 16 - Female students 9-10
          {
            id: "hostel4_floor_ground_16",
            number: "16",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 17 - Female students 11-12
          {
            id: "hostel4_floor_ground_17",
            number: "17",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 18 - Female students 13-14
          {
            id: "hostel4_floor_ground_18",
            number: "18",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 19 - Female students 15-16
          {
            id: "hostel4_floor_ground_19",
            number: "19",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 24 - Female students 17-18
          {
            id: "hostel4_floor_ground_24",
            number: "24",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 25 - Female students 19-20
          {
            id: "hostel4_floor_ground_25",
            number: "25",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 26 - Female students 21-22
          {
            id: "hostel4_floor_ground_26",
            number: "26",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 27 - Female students 23-24
          {
            id: "hostel4_floor_ground_27",
            number: "27",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 28 - Female students 25-26
          {
            id: "hostel4_floor_ground_28",
            number: "28",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 29 - Female students 27-28
          {
            id: "hostel4_floor_ground_29",
            number: "29",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 30 - Female students 29-30
          {
            id: "hostel4_floor_ground_30",
            number: "30",
            floor: "Ground Floor",
            floorName: "Ground Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          }
        ]
      },
      // FIRST FLOOR - FEMALE ONLY (46 students)
      {
        id: "hostel4_floor_first",
        number: "1",
        name: "First Floor",
        rooms: [
          // Room 102 - Female students 31-32
          {
            id: "hostel4_floor_first_102",
            number: "102",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 103 - Female students 33-34
          {
            id: "hostel4_floor_first_103",
            number: "103",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 104 - Female students 35-36
          {
            id: "hostel4_floor_first_104",
            number: "104",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 105 - Female students 37-38
          {
            id: "hostel4_floor_first_105",
            number: "105",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 106 - Female students 39-40
          {
            id: "hostel4_floor_first_106",
            number: "106",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 109 - Female students 41-42
          {
            id: "hostel4_floor_first_109",
            number: "109",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 110 - Female students 43-44
          {
            id: "hostel4_floor_first_110",
            number: "110",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 111 - Female students 45-46
          {
            id: "hostel4_floor_first_111",
            number: "111",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 114 - Female students 47-48
          {
            id: "hostel4_floor_first_114",
            number: "114",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 115 - Female students 49-50
          {
            id: "hostel4_floor_first_115",
            number: "115",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 116 - Female students 51-52
          {
            id: "hostel4_floor_first_116",
            number: "116",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 117 - Female students 53-54
          {
            id: "hostel4_floor_first_117",
            number: "117",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 118 - Female students 55-56
          {
            id: "hostel4_floor_first_118",
            number: "118",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 119 - Female students 57-58
          {
            id: "hostel4_floor_first_119",
            number: "119",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 120 - Female students 59-60
          {
            id: "hostel4_floor_first_120",
            number: "120",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 121 - Female students 61-62
          {
            id: "hostel4_floor_first_121",
            number: "121",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 126 - Female students 63-64
          {
            id: "hostel4_floor_first_126",
            number: "126",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 127 - Female students 65-66
          {
            id: "hostel4_floor_first_127",
            number: "127",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 128 - Female students 67-68
          {
            id: "hostel4_floor_first_128",
            number: "128",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 129 - Female students 69-70
          {
            id: "hostel4_floor_first_129",
            number: "129",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 130 - Female students 71-72
          {
            id: "hostel4_floor_first_130",
            number: "130",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 131 - Female students 73-74
          {
            id: "hostel4_floor_first_131",
            number: "131",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 132 - Female students 75-76
          {
            id: "hostel4_floor_first_132",
            number: "132",
            floor: "First Floor",
            floorName: "First Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          }
        ]
      },
      // SECOND FLOOR - FEMALE ONLY (46 students)
      {
        id: "hostel4_floor_second",
        number: "2",
        name: "Second Floor",
        rooms: [
          // Room 202 - Female students 77-78
          {
            id: "hostel4_floor_second_202",
            number: "202",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 203 - Female students 79-80
          {
            id: "hostel4_floor_second_203",
            number: "203",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 204 - Female students 81-82
          {
            id: "hostel4_floor_second_204",
            number: "204",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 205 - Female students 83-84
          {
            id: "hostel4_floor_second_205",
            number: "205",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 206 - Female students 85-86
          {
            id: "hostel4_floor_second_206",
            number: "206",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 209 - Female students 87-88
          {
            id: "hostel4_floor_second_209",
            number: "209",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 210 - Female students 89-90
          {
            id: "hostel4_floor_second_210",
            number: "210",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 211 - Female students 91-92
          {
            id: "hostel4_floor_second_211",
            number: "211",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 214 - Female students 93-94
          {
            id: "hostel4_floor_second_214",
            number: "214",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 215 - Female students 95-96
          {
            id: "hostel4_floor_second_215",
            number: "215",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 216 - Female students 97-98
          {
            id: "hostel4_floor_second_216",
            number: "216",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 217 - Female students 99-100
          {
            id: "hostel4_floor_second_217",
            number: "217",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 218 - Female students 101-102
          {
            id: "hostel4_floor_second_218",
            number: "218",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 219 - Female students 103-104
          {
            id: "hostel4_floor_second_219",
            number: "219",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 220 - Female students 105-106
          {
            id: "hostel4_floor_second_220",
            number: "220",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 221 - Female students 107-108
          {
            id: "hostel4_floor_second_221",
            number: "221",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 226 - Female students 109-110
          {
            id: "hostel4_floor_second_226",
            number: "226",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 227 - Female students 111-112
          {
            id: "hostel4_floor_second_227",
            number: "227",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 228 - Female students 113-115
          {
            id: "hostel4_floor_second_228",
            number: "228",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 3,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 229 - Female student 116
          {
            id: "hostel4_floor_second_229",
            number: "229",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 1,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 230 - Female student 117
          {
            id: "hostel4_floor_second_230",
            number: "230",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 1,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 231 - Female students 118-120
          {
            id: "hostel4_floor_second_231",
            number: "231",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 3,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          // Room 232 - Female students 121-122
          {
            id: "hostel4_floor_second_232",
            number: "232",
            floor: "Second Floor",
            floorName: "Second Floor",
            hostelName: "Hostel 4",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          }        ]
      }
    ]
  },
  {
    name: "BTTC Hostel",
    description: "This is a hostel at BTTC for female only",
    totalCapacity: 100, // 50 rooms × 2 students each = 100 total
    currentOccupancy: 0,
    gender: 'Female',
    isActive: true,
    pricePerSemester: 460,
    features: ['WiFi', 'Common Areas', 'Security', 'Library Access', 'Canteen'],
    floors: [
      {
        id: "bttc_hostel_floor_1",
        number: "1",
        name: "Floor 1",
        rooms: [
          // BTTC1-BTTC50 - All Female rooms
          {
            id: "bttc_hostel_floor_1_BTTC1",
            number: "BTTC1",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC2",
            number: "BTTC2",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC3",
            number: "BTTC3",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC4",
            number: "BTTC4",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC5",
            number: "BTTC5",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC6",
            number: "BTTC6",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC7",
            number: "BTTC7",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC8",
            number: "BTTC8",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC9",
            number: "BTTC9",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC10",
            number: "BTTC10",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC11",
            number: "BTTC11",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC12",
            number: "BTTC12",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC13",
            number: "BTTC13",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC14",
            number: "BTTC14",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC15",
            number: "BTTC15",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC16",
            number: "BTTC16",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC17",
            number: "BTTC17",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC18",
            number: "BTTC18",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC19",
            number: "BTTC19",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC20",
            number: "BTTC20",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC21",
            number: "BTTC21",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC22",
            number: "BTTC22",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC23",
            number: "BTTC23",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC24",
            number: "BTTC24",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC25",
            number: "BTTC25",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC26",
            number: "BTTC26",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC27",
            number: "BTTC27",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC28",
            number: "BTTC28",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC29",
            number: "BTTC29",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC30",
            number: "BTTC30",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC31",
            number: "BTTC31",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC32",
            number: "BTTC32",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC33",
            number: "BTTC33",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC34",
            number: "BTTC34",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC35",
            number: "BTTC35",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC36",
            number: "BTTC36",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC37",
            number: "BTTC37",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC38",
            number: "BTTC38",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC39",
            number: "BTTC39",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC40",
            number: "BTTC40",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC41",
            number: "BTTC41",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC42",
            number: "BTTC42",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC43",
            number: "BTTC43",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC44",
            number: "BTTC44",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC45",
            number: "BTTC45",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC46",
            number: "BTTC46",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC47",
            number: "BTTC47",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC48",
            number: "BTTC48",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC49",
            number: "BTTC49",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          },
          {
            id: "bttc_hostel_floor_1_BTTC50",
            number: "BTTC50",
            floor: "Floor 1",
            floorName: "Floor 1",
            hostelName: "BTTC Hostel",
            price: 460,
            capacity: 2,
            occupants: [],
            gender: 'Female',
            isReserved: false,
            isAvailable: true,
            features: ['WiFi']
          }
        ]
      }
    ]
  }
];
