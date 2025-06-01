import { databases } from '@/lib/appwrite';
import { Query, ID } from 'appwrite'; // Query might be used for sorting/filtering

// Ensure these environment variables are set in your .env.local or equivalent
const APPWRITE_DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'DB_ID_PLACEHOLDER';
const APPWRITE_APPLICATIONS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_APPLICATIONS_COLLECTION_ID || 'APPLICATIONS_COLLECTION_ID_PLACEHOLDER';

export type ApplicationStatus = "Pending" | "Accepted" | "Archived";
export type Gender = "Male" | "Female" | "Other"; // Added "Other" for inclusivity

// Define the Applications type, including Appwrite's system attributes
export type Applications = {
  $id: string; // Appwrite document ID
  $collectionId: string; // Appwrite collection ID
  $databaseId: string; // Appwrite database ID
  $createdAt: string; // Appwrite metadata: ISO string date
  $updatedAt: string; // Appwrite metadata: ISO string date
  $permissions: string[]; // Appwrite metadata: Array of permission strings

  // Application specific fields as defined in the collection schema
  regNumber: string; // Should match $id if used as primary key, or be an indexed attribute
  name: string;
  gender: Gender;
  programme: string;
  part: number;
  preferredHostel: string;
  email: string;
  phone: string;
  status: ApplicationStatus;
  submittedAt: string; // ISO string date from Appwrite
  paymentStatus: string;
  reference?: string; // Optional field

  // Derived fields (client-side)
  date: string; // Formatted date from submittedAt
  time: string; // Formatted time from submittedAt
};

// Helper function to format the timestamp into date and time
const formatTimestamp = (timestamp: string | undefined | null): { date: string; time: string } => {
  if (!timestamp) return { date: "N/A", time: "N/A" };
  try {
    const dateObj = new Date(timestamp);
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
        return { date: "Invalid Date", time: "Invalid Time" };
    }
    const date = dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const time = dateObj.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return { date, time };
  } catch (e) {
    console.error("Error formatting timestamp:", e);
    return { date: "Error", time: "Error" };
  }
};

/**
 * Fetches all student applications from Appwrite.
 * Assumes the 'applications' collection in Appwrite contains all necessary fields.
 * The `regNumber` field in the application data is expected to be the Appwrite Document ID ($id).
 * @returns A list of Applications
 */
export const fetchAllApplications = async (): Promise<Applications[]> => {
  try {
    const response = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_APPLICATIONS_COLLECTION_ID,
      [
        Query.orderDesc('$createdAt') // Example: order by creation date
      ]
    );

    return response.documents.map((doc: any) => {
      const { date, time } = formatTimestamp(doc.submittedAt || doc.$createdAt); // Use submittedAt, fallback to $createdAt
      // It's assumed that 'doc' directly contains all fields of the Applications type
      // that are stored in the Appwrite collection.
      // Appwrite returns $id, $collectionId, $databaseId, $createdAt, $updatedAt, $permissions automatically.
      return {
        ...doc, // Spreads all fields from the Appwrite document
        date,   // Overwrites or adds formatted date
        time,   // Overwrites or adds formatted time
        // Ensure type consistency if any fields need explicit mapping or default values
        status: doc.status as ApplicationStatus,
        gender: doc.gender as Gender,
      } as Applications; // Type assertion
    });
  } catch (error) {
    console.error("Error fetching applications from Appwrite:", error);
    // Depending on how this is used, you might want to throw the error
    // or return an empty array / specific error object.
    return [];
  }
};

/**
 * Updates the status of a specific application in Appwrite.
 * @param documentId - The Appwrite Document ID ($id) of the application to update.
 * @param status - The new status.
 */
export const updateApplicationStatus = async (
  documentId: string, // This should be the Appwrite $id of the application document
  status: ApplicationStatus
): Promise<void> => {
  if (!documentId) {
    console.error("Appwrite: Document ID is required to update application status.");
    throw new Error("Document ID is required.");
  }
  try {
    await databases.updateDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_APPLICATIONS_COLLECTION_ID,
      documentId, // Appwrite Document ID ($id)
      { status }  // Data to update
    );
    console.log(`Appwrite: Application ${documentId} status updated to ${status}`);
  } catch (error) {
    console.error(`Error updating application status for ${documentId} in Appwrite:`, error);
    // Optionally re-throw or handle more gracefully, e.g., by returning a boolean or error object
    throw error;
  }
};
```
