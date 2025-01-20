'use client'; 
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toast } from 'react-toastify';
import { doc, getDoc, setDoc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getAuth } from "firebase/auth";
import { StudentProfile } from "./student-profile";

// Define Zod schema for validation
const StudentApplicationSchema = z.object({
  preferredHostel: z
    .string()
    .min(1, "Preferred hostel is required")
});

type FormValues = z.infer<typeof StudentApplicationSchema>;

interface ApplicationData {
  preferredHostel: string;
  name: string;
  email: string;
  regNumber: string;
  submittedAt: string;
  status: "Pending" | "Pending";
}

const StudentApplicationForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // State to manage loading
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(StudentApplicationSchema),
    defaultValues: {
      preferredHostel: "",
    },
  });

  // Fetch authenticated user's profile and application
  useEffect(() => {
    const fetchProfileAndApplication = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const regNumber = user.email?.split("@")[0] || "";
        const userDoc = doc(db, "students", regNumber);
        const applicationDoc = doc(db, "applications", regNumber);

        try {
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
      }
  
      // Save the application with calculated status
      await setDoc(applicationDoc, {
        ...data,
        name,
        email,
        regNumber,
        submittedAt: new Date().toISOString(),
        status,
      });
  
      setApplication({
        ...data,
        name,
        email,
        regNumber,
        submittedAt: new Date().toISOString(),
        status,
      });
  
      toast.success(`Application submitted successfully`);
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
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-sm animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-8"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
        </div>
        <div className="h-12 bg-gray-300 rounded mt-8"></div>
      </div>
    );
  }

  if (application) {
    return (
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-sm">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Your Application
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          Below is your submitted application. You can delete it to submit a new one.
        </p>

        <div className="bg-gray-100 p-6 rounded-lg">
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
            <strong>Preferred Hostel:</strong> {application.preferredHostel}
          </p>
          <p>
            <strong>Submitted At:</strong> {new Date(application.submittedAt).toLocaleString()}
          </p>
        </div>

        <Button
          onClick={deleteApplication}
          className="w-full mt-6 text-lg py-6"
          variant="destructive"
        >
          Delete Application
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-sm">
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
          <FormField
            control={form.control}
            name="preferredHostel"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium">
                  Preferred Hostel
                </FormLabel>
                <FormControl>
                  <select
                    className="form-select block w-full mt-1"
                    {...field}
                  >
                    <option value="">Select a hostel</option>
                    <option value="Hostel 1">Hostel 1 (560)</option>
                    <option value="Other hostels">Other Hostel (460)</option>
                    {/* Add other hostel options here */}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
  );
};

export default StudentApplicationForm;
