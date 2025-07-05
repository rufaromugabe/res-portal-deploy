import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
} from "@/components/ui/form";
import { toast } from 'react-toastify';
import { doc, getDoc, setDoc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getAuth } from "firebase/auth";
import { StudentProfile } from "./student-profile";
import { fetchStudentAllocations, getRoomDetailsFromAllocation } from "@/data/hostel-data";
import { RoomAllocation } from "@/types/hostel";

// Simplified schema - no preferred hostel needed anymore
const StudentApplicationSchema = z.object({
  // No fields needed - just tracking that application was submitted
});

type FormValues = z.infer<typeof StudentApplicationSchema>;

interface ApplicationData {
  name: string;
  email: string;
  regNumber: string;
  submittedAt: string;
  status: "Pending" | "Accepted";
}

// Function to check if applications are restricted
const isApplicationRestricted = (regNumber: string): boolean => {
  const currentDate = new Date();
  const restrictionEndDate = new Date('2025-06-04T08:00:00'); // June 4, 2025 at 08:00
  
  // If current date is before restriction end date, only allow H250XXXX registration numbers
  if (currentDate < restrictionEndDate) {
    return !regNumber.startsWith('H250');
  }
  
  return false; // After June 4, 2025 08:00, all registrations are allowed
};

const StudentApplicationForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // State to manage loading
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [roomAllocation, setRoomAllocation] = useState<RoomAllocation | null>(null);
  const [roomDetails, setRoomDetails] = useState<{roomNumber: string, hostelName: string, floorName: string, price: number} | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(StudentApplicationSchema),
    defaultValues: {},
  });  // Fetch authenticated user's profile and application
  useEffect(() => {
    const fetchProfileAndApplication = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const emailDomain = user.email?.split("@")[1] || "";
        let regNumber = "";
        let userDoc;
        let applicationDoc;

        try {
          if (emailDomain === "hit.ac.zw") {
            // For hit.ac.zw domain users
            regNumber = user.email?.split("@")[0] || "";
            userDoc = doc(db, "students", regNumber);
            applicationDoc = doc(db, "applications", regNumber);
          } else if (emailDomain === "gmail.com" && user.email) {
            // For gmail.com users, find them by email first
            const usersRef = collection(db, "students");
            const q = query(usersRef, where("email", "==", user.email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
              // User exists in database
              const userData = querySnapshot.docs[0].data();
              regNumber = userData.regNumber || "";
              userDoc = doc(db, "students", regNumber);
              applicationDoc = doc(db, "applications", regNumber);
            } else {
              // User doesn't exist in database
              console.log("User not found in database");
              setIsLoading(false);
              return;
            }
          } else {
            // Unsupported email domain
            console.log("Unsupported email domain");
            setIsLoading(false);
            return;
          }

          // Fetch profile
          const profileSnap = await getDoc(userDoc);
          if (profileSnap.exists()) {
            setProfile(profileSnap.data() as StudentProfile);
          }

          // Fetch application
          const applicationSnap = await getDoc(applicationDoc);
          if (applicationSnap.exists()) {
            setApplication(applicationSnap.data() as ApplicationData);
          }

          // Check for room allocation
          if (profileSnap.exists() && regNumber) {
            const allocations = await fetchStudentAllocations(regNumber);
            if (allocations.length > 0) {
              const allocation = allocations[0];
              setRoomAllocation(allocation);
              // Fetch room details
              const details = await getRoomDetailsFromAllocation(allocation);
              if (details) {
                setRoomDetails({
                  roomNumber: details.room.number,
                  hostelName: details.hostel.name,
                  floorName: details.room.floorName,
                  price: details.price
                });
              }
            }
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false); // Loading is complete
        }
      }
    };

    fetchProfileAndApplication();
  }, []);

  const onSubmit = async (data: FormValues) => {
    if (!profile) {
      toast.error("Profile data is missing. Please update your profile first.");
      return;
    }
  
    const { regNumber, name, email } = profile;
  
    setIsSubmitting(true);
  
    try {
      const applicationDoc = doc(db, "applications", regNumber);
      const applicationsCollection = collection(db, "applications");
  
      // Fetch settings from Firestore
      const settingsDoc = doc(db, "Settings", "ApplicationLimits");
      const settingsSnap = await getDoc(settingsDoc);
  
      if (!settingsSnap.exists()) {
        throw new Error("Settings not found in Firestore.");
      }
  
      const settings = settingsSnap.data();
      const autoAcceptBoysLimit = settings.autoAcceptBoysLimit || 0;
      const autoAcceptGirlsLimit = settings.autoAcceptGirlsLimit || 0;
  
      // Fetch the count of accepted applications for boys and girls
      const boysQuery = query(
        applicationsCollection,
        where("status", "==", "Accepted"),
        where("gender", "==", "Male")
      );
      const girlsQuery = query(
        applicationsCollection,
        where("status", "==", "Accepted"),
        where("gender", "==", "Female")
      );
  
      const [boysSnap, girlsSnap] = await Promise.all([
        getDocs(boysQuery),
        getDocs(girlsQuery),
      ]);
  
      const boysCount = boysSnap.size;
      const girlsCount = girlsSnap.size;
  
      // Determine status based on auto-accept limits
      let status: "Pending" | "Pending" = "Pending";
      if (
        (profile.gender === "Male" && boysCount < autoAcceptBoysLimit) ||
        (profile.gender === "Female" && girlsCount < autoAcceptGirlsLimit)
      ) {
        status = "Pending";
      }      // Save the application with calculated status
      await setDoc(applicationDoc, {
        name,
        email,
        regNumber,
        submittedAt: new Date().toISOString(),
        status,
      });

      setApplication({
        name,
        email,
        regNumber,
        submittedAt: new Date().toISOString(),
        status,
      });
  
      toast.success(`Application submitted successfully! You can now proceed to room selection.`);
      
      // Redirect to room selection after successful application
      setTimeout(() => {
        window.location.href = '/student/room-selection';
      }, 2000);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to submit application."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  

  const deleteApplication = async () => {
    if (!profile) {
      toast.error("Profile data is missing. Please reload the page.");
      return;
    }

    const { regNumber } = profile;

    try {
      const applicationDoc = doc(db, "applications", regNumber);
      await deleteDoc(applicationDoc);

      setApplication(null); // Clear application state
      toast.success("Application deleted successfully.");
    } catch (error) {
      console.error("Error deleting application:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete application."
      );
    }
  };
  // Skeleton Loading UI
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="max-w-5xl w-full mx-auto bg-white p-8 rounded-lg shadow-sm animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
          <div className="h-12 bg-gray-300 rounded mt-8"></div>
        </div>
      </div>
    );
  }  if (application) {
    return (
      <div className="flex items-center justify-center h-full overflow-auto">
        <div className="max-w-5xl w-full mx-auto bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Your Application
          </h2>
          <p className="text-gray-600 mb-8 text-center">
            Below is your submitted application. You can delete it to submit a new one.
          </p>          <div className="bg-gray-100 p-6 rounded-lg">
          <p>
            <strong>Name:</strong> {application.name}
          </p>
          <p>
            <strong>Email:</strong> {application.email}
          </p>
          <p>
            <strong>Registration Number:</strong> {application.regNumber}
          </p>
          <p>
            <strong>Submitted At:</strong> {new Date(application.submittedAt).toLocaleString()}
          </p>
          <p>
            <strong>Status:</strong> 
            <span className={`ml-2 px-2 py-1 rounded text-sm ${
              application.status === 'Accepted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {application.status}
            </span>
          </p>{roomAllocation && roomDetails && (
            <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200">
              <p className="font-semibold text-blue-800">Room Allocation:</p>
              <p><strong>Hostel:</strong> {roomDetails.hostelName}</p>
              <p><strong>Room:</strong> {roomDetails.roomNumber}</p>
              <p><strong>Floor:</strong> {roomDetails.floorName}</p>
              <p><strong>Price:</strong> ${roomDetails.price}/semester</p>
              <p><strong>Payment Status:</strong> {roomAllocation.paymentStatus}</p>
              <p><strong>Allocated At:</strong> {new Date(roomAllocation.allocatedAt).toLocaleString()}</p>
            </div>
          )}
        </div>

        {!roomAllocation && application.status === 'Accepted' && (
          <div className="mt-6 p-4 bg-green-50 rounded border border-green-200">
            <p className="text-green-800 font-medium">🎉 Your application has been accepted!</p>
            <p className="text-green-700 mt-2">You can now proceed to select your room.</p>
            <Button
              onClick={() => window.location.href = '/student/room-selection'}
              className="mt-3 bg-green-600 hover:bg-green-700"
            >
              Select Room
            </Button>
          </div>
        )}        <Button
          onClick={deleteApplication}
          className="w-full mt-6 text-lg py-6"
          variant="destructive"
        >
          Delete Application
        </Button>
        </div>
      </div>
    );
  }
  // Check if profile data is missing (could happen for non-hit.ac.zw users)
  if (!profile) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="max-w-5xl w-full mx-auto bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-3xl font-bold mb-6 text-center text-red-600">
            Profile Required
          </h2>
          <p className="text-gray-600 mb-8 text-center">
            You need to complete your profile before submitting an application.
          </p>
          <div className="bg-yellow-50 p-4 rounded border border-yellow-200 mb-6">
            <p className="text-yellow-800">
              Please go to your profile page and complete all required information first.
            </p>
          </div>
          <Button
            onClick={() => window.location.href = '/student/profile'}
            className="w-full text-lg py-6 bg-blue-600 hover:bg-blue-700"
          >
            Go to Profile
          </Button>
        </div>
      </div>
    );
  }

  // Check if applications are restricted for this user
  if (isApplicationRestricted(profile.regNumber)) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="max-w-5xl w-full mx-auto bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-3xl font-bold mb-6 text-center text-orange-600">
            Applications Restricted
          </h2>
          <div className="bg-orange-50 p-6 rounded border border-orange-200 mb-6">
            <p className="text-orange-800 text-lg font-medium text-center">
              Only Part 1s can apply at the moment. Applications will open for everyone else on 4 June 2025 at 08:00. Thank you.
            </p>
          </div>
          <div className="text-center text-gray-600">
            <p>Your registration number: <strong>{profile.regNumber}</strong></p>
            <p className="mt-2">Please check back after the restriction period ends.</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center h-full overflow-auto">
      <div className="max-w-5xl w-full mx-auto bg-white p-8 rounded-lg shadow-sm">
        <h2 className="text-3xl font-bold mb-6 text-center">
          On-campus Res Application
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          Note: We will use data in your profile. Please ensure it is correct.
        </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-4xl mx-auto"
        >
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Ready to Apply for On-Campus Accommodation
            </h3>
            <p className="text-blue-700">
              Once you submit this application, you'll be able to select from available rooms. 
              Your application will be processed and you'll receive confirmation to proceed with room selection.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full text-lg py-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </Form>
      </div>
    </div>
  );
};

export default StudentApplicationForm;
