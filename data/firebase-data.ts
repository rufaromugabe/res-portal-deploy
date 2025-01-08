import { db } from "@/lib/firebase"; 
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { deoptional } from "zod";

// Define the type for the application
export type Applications = {
  name: string;
  regNumber: string;
  gender: "Male" | "Female";
  programme: string;
  part: number;
  reason: string;
  email: string;
  phone: string;
  status: "Pending" | "Accepted" | "Archived";
  submittedAt: string;
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
        
        // Combine the student and application data
        const application: Applications = {
          name: studentData.name,
          regNumber: studentData.regNumber,
          gender: studentData.gender,
          programme: studentData.programme,
          part: studentData.part,
          reason: applicationData.reason,
          email: studentData.email,
          phone: studentData.phone || "",
          status: applicationData.status || "Pending",  
          submittedAt: applicationData.submittedAt
  ? new Date(applicationData.submittedAt).toLocaleString()
  : "",

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


export const updateApplicationStatus = async (regNumber: string, status:"Pending" | "Accepted" | "Archived") => {
  try {
    const applicationRef = doc(db, "applications", regNumber);
    await updateDoc(applicationRef, { status });
    console.log(`Application ${regNumber} status updated to ${status}`);
  } catch (error) {
    console.error("Error updating application status:", error);
  }
};
export const fetchPublishedStudents = async () => {
  const querySnapshot = await getDocs(collection(db, "PublishedStudents"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};