import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";

// Define the type for the application
export type Applications = {
  name: string;
  regNumber: string;
  gender: "Male" | "Female";
  programme: string;
  part: number;
  email: string;
  phone: string;
  status: "Pending" | "Accepted" | "Archived";
  submittedAt: string;
  date: string; // New field for date
  time: string; // New field for time
  paymentStatus: string;
  reference: string;
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
    // Fetch all applications in one query
    const applicationsCollection = collection(db, "applications");
    const applicationsSnap = await getDocs(applicationsCollection);

    // Fetch all students in one query
    const studentsCollection = collection(db, "students");
    const studentsSnap = await getDocs(studentsCollection);

    // Create a map of students by registration number
    const studentsMap = new Map<string, any>();
    studentsSnap.forEach((studentDoc) => {
      studentsMap.set(studentDoc.id, studentDoc.data());
    });

    // Merge application data with student data
    const applicationsList: Applications[] = [];
    applicationsSnap.forEach((applicationDoc) => {
      const applicationData = applicationDoc.data();
      const regNumber = applicationDoc.id;
      const studentData = studentsMap.get(regNumber);

      if (!studentData) {
        console.warn(`Student data not found for ${regNumber}`);
        return;
      }

      const { date, time } = formatTimestamp(applicationData.submittedAt);

      applicationsList.push({
        name: studentData.name,
        regNumber,
        gender: studentData.gender,
        programme: studentData.programme,
        part: studentData.part,
        email: studentData.email,
        phone: studentData.phone || "",
        status: applicationData.status || "Pending",
        submittedAt: applicationData.submittedAt || "",
        paymentStatus: applicationData.paymentStatus || "Not Paid",
        reference: applicationData.reference || "",

        date,
        time,
      });
    });

    return applicationsList;
  } catch (error) {
    console.error("Error fetching applications:", error);
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
// export const fetchPublishedStudents = async () => {
//   const querySnapshot = await getDocs(collection(db, "PublishedStudents"));
//   return querySnapshot.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   }));
// };
