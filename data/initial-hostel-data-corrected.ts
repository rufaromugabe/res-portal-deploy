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
          }
        ]
      }
    ]
  }
];
