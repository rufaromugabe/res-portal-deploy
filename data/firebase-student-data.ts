import { db } from "@/lib/firebase";
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy 
} from "firebase/firestore";

// Keep the original interface for compatibility
export interface StudentData {
  regNumber: string;
  name: string;
  surname: string;
  gender: "Male" | "Female";
  programme: string;
  part: "1" | "2" | "3" | "4" | "5";
  phone?: string;
  email?: string;
  // Additional fields for Firebase version
  createdAt?: string;
  updatedAt?: string;
  migrationSource?: string;
  migrationDate?: string;
}

// Cache for performance
let studentCache: StudentData[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch all students from Firebase new-students collection
 */
export const fetchAllStudentsFromFirebase = async (): Promise<StudentData[]> => {
  try {
    const now = Date.now();
    
    // Return cached data if still valid
    if (studentCache && (now - cacheTimestamp) < CACHE_DURATION) {
      return studentCache;
    }

    console.log('Fetching students from Firebase...');
    const studentsCollection = collection(db, "new-students");
    const studentsSnap = await getDocs(studentsCollection);
    
    const students = studentsSnap.docs.map(doc => ({
      regNumber: doc.id,
      ...doc.data()
    })) as StudentData[];    // Update cache
    studentCache = students;
    cacheTimestamp = now;
    console.log(`Loaded ${students.length} students from Firebase`);
    return students;
  } catch (error) {
    console.error("Error fetching students from Firebase:", error);
    throw new Error("Failed to fetch students from Firebase. Please ensure the new-students collection is populated.");
  }
};

/**
 * Find a student by registration number (Firebase version)
 */
export const findStudentByRegNumber = async (regNumber: string): Promise<StudentData | undefined> => {
  try {
    // First try to get from cache
    if (studentCache) {
      const cachedStudent = studentCache.find(student => student.regNumber === regNumber);
      if (cachedStudent) {
        return cachedStudent;
      }
    }

    // If not in cache, fetch directly from Firebase
    const studentDoc = doc(db, "new-students", regNumber);
    const studentSnap = await getDoc(studentDoc);
    
    if (studentSnap.exists()) {
      const studentData = {
        regNumber: studentSnap.id,
        ...studentSnap.data()
      } as StudentData;
        // Update cache with this student
      if (studentCache) {
        studentCache.push(studentData);
      }
      return studentData;
    }
    
    return undefined;
  } catch (error) {
    console.error("Error finding student by registration number:", error);
    throw new Error(`Failed to find student ${regNumber} in Firebase.`);
  }
};

/**
 * Get students by programme (Firebase version)
 */
export const getStudentsByProgramme = async (programme: string): Promise<StudentData[]> => {
  try {
    const students = await fetchAllStudentsFromFirebase();
    return students.filter(student => student.programme === programme);
  } catch (error) {
    console.error("Error fetching students by programme:", error);
    throw new Error("Failed to fetch students by programme from Firebase.");
  }
};

/**
 * Get students by gender (Firebase version)
 */
export const getStudentsByGender = async (gender: "Male" | "Female"): Promise<StudentData[]> => {
  try {
    const students = await fetchAllStudentsFromFirebase();
    return students.filter(student => student.gender === gender);
  } catch (error) {
    console.error("Error fetching students by gender:", error);
    throw new Error("Failed to fetch students by gender from Firebase.");
  }
};

/**
 * Get students by part (Firebase version)
 */
export const getStudentsByPart = async (part: "1" | "2" | "3" | "4" | "5"): Promise<StudentData[]> => {
  try {
    const students = await fetchAllStudentsFromFirebase();
    return students.filter(student => student.part === part);
  } catch (error) {
    console.error("Error fetching students by part:", error);
    throw new Error("Failed to fetch students by part from Firebase.");
  }
};

/**
 * Get student statistics (Firebase version)
 */
export const getStudentStats = async () => {
  try {
    const students = await fetchAllStudentsFromFirebase();
    const total = students.length;
    const maleCount = students.filter(s => s.gender === "Male").length;
    const femaleCount = students.filter(s => s.gender === "Female").length;
    
    const programmeCounts = students.reduce((acc, student) => {
      acc[student.programme] = (acc[student.programme] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);    return {
      total,
      maleCount,
      femaleCount,
      programmeCounts
    };
  } catch (error) {
    console.error("Error calculating student statistics:", error);
    throw new Error("Failed to calculate student statistics from Firebase.");
  }
};

/**
 * Search students by name or registration number
 */
export const searchStudents = async (searchTerm: string): Promise<StudentData[]> => {
  try {
    const students = await fetchAllStudentsFromFirebase();
    const term = searchTerm.toLowerCase();
    
    return students.filter(student => 
      student.regNumber.toLowerCase().includes(term) ||
      student.name.toLowerCase().includes(term) ||
      student.surname.toLowerCase().includes(term) ||
      `${student.name} ${student.surname}`.toLowerCase().includes(term)
    );
  } catch (error) {
    console.error("Error searching students:", error);
    throw new Error("Failed to search students in Firebase.");
  }
};

/**
 * Verify if a student exists in the new-students collection
 */
export const verifyStudentExists = async (regNumber: string): Promise<boolean> => {
  try {
    const studentDoc = doc(db, "new-students", regNumber);
    const studentSnap = await getDoc(studentDoc);
    return studentSnap.exists();
  } catch (error) {
    console.error("Error verifying student existence:", error);
    return false;
  }
};

/**
 * Clear the student cache (useful for admin operations)
 */
export const clearStudentCache = (): void => {
  studentCache = null;
  cacheTimestamp = 0;
  console.log("Student cache cleared");
};

/**
 * Preload student data into cache
 */
export const preloadStudentData = async (): Promise<void> => {
  try {
    await fetchAllStudentsFromFirebase();
    console.log("Student data preloaded into cache");
  } catch (error) {
    console.error("Error preloading student data:", error);
  }
};

