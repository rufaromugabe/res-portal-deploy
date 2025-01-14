import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";

// Define the type for the application
export type Applications = {
  name: string;
  regNumber: string;
  gender: "Male" | "Female";
  programme: string;
  part: number;
  preferredHostel: string;
  email: string;
  phone: string;
  status: "Pending" | "Accepted" | "Archived";
  submittedAt: string;
  date: string; // New field for date
  time: string; // New field for time
};

/**
 * Helper function to format the timestamp into date and time
 * @param timestamp - The timestamp to format
 * @returns An object with separate date and time strings
 */
const formatTimestamp = (timestamp: string | undefined) => {
  if (!timestamp) return { date: "", time: "" };
  const dateObj = new Date(timestamp);
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
};

/**
 * Fetches all student profiles and their application data from Firebase
 * @returns A list of Applications for all registration numbers
 */
export const fetchAllApplications = async (): Promise<Applications[]> => {
  try {
    // Fetch all student data from the "students" collection
    const studentsCollection = collection(db, "students");
    const studentSnap = await getDocs(studentsCollection);

    // Store the list of all applications
    const applicationsList: Applications[] = [];

    // Loop over all students
    for (const studentDoc of studentSnap.docs) {
      const studentData = studentDoc.data();
      const regNumber = studentDoc.id; // Get regNumber from document ID

      // Fetch application data from the "applications" collection using regNumber as document ID
      const applicationDoc = doc(db, "applications", regNumber);
      const applicationSnap = await getDoc(applicationDoc);

      if (applicationSnap.exists()) {
        const applicationData = applicationSnap.data();

        // Format the submittedAt timestamp into date and time
        const { date, time } = formatTimestamp(applicationData.submittedAt);

        // Combine the student and application data
        const application: Applications = {
          name: studentData.name,
          regNumber: studentData.regNumber,
          gender: studentData.gender,
          programme: studentData.programme,
          part: studentData.part,
          preferredHostel: applicationData.preferredHostel || "",
          email: studentData.email,
          phone: studentData.phone || "",
          status: applicationData.status || "Pending",
          submittedAt: applicationData.submittedAt || "",
          date, // Add the formatted date
          time, // Add the formatted time
        };

        applicationsList.push(application);
      }
    }

    return applicationsList;
  } catch (error) {
    console.error("Error fetching applications data:", error);
    return [];
  }
};

/**
 * Updates the status of a specific application
 * @param regNumber - The registration number of the application
 * @param status - The new status ("Pending", "Accepted", or "Archived")
 */
export const updateApplicationStatus = async (
  regNumber: string,
  status: "Pending" | "Accepted" | "Archived"
) => {
  try {
    const applicationRef = doc(db, "applications", regNumber);
    await updateDoc(applicationRef, { status });
    console.log(`Application ${regNumber} status updated to ${status}`);
  } catch (error) {
    console.error("Error updating application status:", error);
  }
};

/**
 * Fetches published students from the "PublishedStudents" collection
 * @returns A list of published students
 */
export const fetchPublishedStudents = async () => {
  const querySnapshot = await getDocs(collection(db, "PublishedStudents"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
