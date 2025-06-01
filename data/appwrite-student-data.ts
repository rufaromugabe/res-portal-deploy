import { databases } from '@/lib/appwrite';
import { Query, AppwriteException } from 'appwrite';

// Environment variables for Appwrite configuration
const APPWRITE_DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'DB_ID_PLACEHOLDER';
const APPWRITE_USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || 'USERS_COLLECTION_ID_PLACEHOLDER'; // Assuming student data is in the 'users' collection

// --- Appwrite-specific Type Definitions ---
interface AppwriteDocument {
  $id: string;
  $collectionId: string;
  $databaseId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
}

// StudentData interface as it might be defined (ensure fields match Appwrite collection attributes)
export interface StudentData {
  id: string; // Will map to $id
  regNumber: string;
  name: string; // Assuming 'name' is stored, not 'firstName'/'lastName' separately for simplicity matching Firebase
  surname?: string; // Optional if 'name' is full name
  gender: "Male" | "Female" | "Other";
  programme: string;
  part: "1" | "2" | "3" | "4" | "5"; // Consider if this should be number
  phone?: string;
  email: string;
  // Add other fields like 'role', 'displayName' if they are part of your student records in 'users' collection
  role?: string;
  displayName?: string;
}

export type AppwriteStudent = StudentData & AppwriteDocument;

// Helper to map Appwrite doc to our AppwriteStudent type
const mapDocToStudent = (doc: any): AppwriteStudent => {
    const { $id, $collectionId, $databaseId, $createdAt, $updatedAt, $permissions, ...rest } = doc;
    return {
        ...rest,
        id: $id, // Map $id to id
        $id, $collectionId, $databaseId, $createdAt, $updatedAt, $permissions
    } as AppwriteStudent;
};

// --- Student Data Functions ---

export const findStudentByRegNumber = async (regNumber: string): Promise<AppwriteStudent | undefined> => {
  try {
    const response = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_USERS_COLLECTION_ID,
      [Query.equal('regNumber', regNumber), Query.limit(1)]
    );
    if (response.documents.length > 0) {
      return mapDocToStudent(response.documents[0]);
    }
    return undefined;
  } catch (error) {
    console.error(`Error fetching Appwrite student by regNumber ${regNumber}:`, error);
    // Do not throw, return undefined as per original logic
    return undefined;
  }
};

const MAX_DOCUMENTS_PER_QUERY = 500; // A practical limit for simple list operations without full pagination

export const getStudentsByProgramme = async (programme: string): Promise<AppwriteStudent[]> => {
  try {
    const response = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_USERS_COLLECTION_ID,
      [Query.equal('programme', programme), Query.limit(MAX_DOCUMENTS_PER_QUERY)]
    );
    // Note: For > MAX_DOCUMENTS_PER_QUERY results, pagination would be needed.
    return response.documents.map(mapDocToStudent);
  } catch (error) {
    console.error(`Error fetching Appwrite students by programme ${programme}:`, error);
    return [];
  }
};

export const getStudentsByGender = async (gender: "Male" | "Female" | "Other"): Promise<AppwriteStudent[]> => {
  try {
    const response = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_USERS_COLLECTION_ID,
      [Query.equal('gender', gender), Query.limit(MAX_DOCUMENTS_PER_QUERY)]
    );
    // Note: For > MAX_DOCUMENTS_PER_QUERY results, pagination would be needed.
    return response.documents.map(mapDocToStudent);
  } catch (error) {
    console.error(`Error fetching Appwrite students by gender ${gender}:`, error);
    return [];
  }
};

export const getStudentsByPart = async (part: "1" | "2" | "3" | "4" | "5" | number): Promise<AppwriteStudent[]> => {
  try {
    // Ensure part is queried as the correct type (string or number) based on collection schema
    const partValue = typeof part === 'number' ? part : parseInt(part, 10);
    const response = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_USERS_COLLECTION_ID,
      [Query.equal('part', partValue), Query.limit(MAX_DOCUMENTS_PER_QUERY)]
    );
    // Note: For > MAX_DOCUMENTS_PER_QUERY results, pagination would be needed.
    return response.documents.map(mapDocToStudent);
  } catch (error) {
    console.error(`Error fetching Appwrite students by part ${part}:`, error);
    return [];
  }
};

export const getStudentStats = async (): Promise<{
  totalStudents: number;
  maleCount: number;
  femaleCount: number;
  otherGenderCount: number;
  programmeCounts: Record<string, number>;
}> => {
  let totalStudents = 0;
  let maleCount = 0;
  let femaleCount = 0;
  let otherGenderCount = 0; // Added for "Other" gender
  const programmeCounts: Record<string, number> = {};

  try {
    // Get total students
    const initialResponse = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        APPWRITE_USERS_COLLECTION_ID,
        [Query.limit(1)] // Limit 1 just to get total
    );
    totalStudents = initialResponse.total;

    // Get gender counts
    const maleResponse = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        APPWRITE_USERS_COLLECTION_ID,
        [Query.equal('gender', 'Male'), Query.limit(1)]
    );
    maleCount = maleResponse.total;

    const femaleResponse = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        APPWRITE_USERS_COLLECTION_ID,
        [Query.equal('gender', 'Female'), Query.limit(1)]
    );
    femaleCount = femaleResponse.total;

    const otherResponse = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        APPWRITE_USERS_COLLECTION_ID,
        [Query.equal('gender', 'Other'), Query.limit(1)]
    );
    otherGenderCount = otherResponse.total;


    // For programme counts, fetch all students (with pagination)
    const allStudents: AppwriteStudent[] = [];
    let offset = 0;
    const limit = 100; // Appwrite's recommended max limit for listDocuments is 100
    let currentResponse;

    do {
      currentResponse = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        APPWRITE_USERS_COLLECTION_ID,
        [Query.offset(offset), Query.limit(limit)]
      );
      currentResponse.documents.forEach(doc => {
        const student = mapDocToStudent(doc);
        allStudents.push(student);
        if (student.programme) {
          programmeCounts[student.programme] = (programmeCounts[student.programme] || 0) + 1;
        }
      });
      offset += limit;
    } while (allStudents.length < totalStudents && currentResponse.documents.length > 0); // Ensure loop terminates if total changes or empty page

    // If totalStudents was 0 initially, allStudents.length will be 0, so this check is fine.
    // If allStudents.length is still less than totalStudents after loop, it implies an issue or change during fetch.
    // The programmeCounts will be based on successfully fetched students.


    return { totalStudents, maleCount, femaleCount, otherGenderCount, programmeCounts };

  } catch (error) {
    console.error("Error fetching Appwrite student stats:", error);
    // Return empty/zeroed stats on error
    return { totalStudents: 0, maleCount: 0, femaleCount: 0, otherGenderCount: 0, programmeCounts: {} };
  }
};
