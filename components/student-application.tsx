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
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from 'react-toastify';
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getAuth } from "firebase/auth";
import { StudentProfile } from "./student-profile";

const StudentApplicationSchema = z.object({
  reason: z
    .string()
    .min(1, "Reason is required")
    .min(50, "Please provide a more detailed reason (at least 50 characters)"),
});

type FormValues = z.infer<typeof StudentApplicationSchema>;

interface ApplicationData {
  reason: string;
  name: string;
  email: string;
  regNumber: string;
  submittedAt: string;
}

const StudentApplicationForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(StudentApplicationSchema),
    defaultValues: {
      reason: "",
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
        }
      }
    };

    fetchProfileAndApplication();
  }, []);

  const onSubmit = async (data: FormValues) => {
    if (!profile) {
      toast.error("Profile data is missing. Please reload the page.");
      return;
    }

    const { regNumber, name, email } = profile;

    setIsSubmitting(true);

    try {
      const applicationDoc = doc(db, "applications", regNumber);

      await setDoc(applicationDoc, {
        ...data,
        name,
        email,
        regNumber,
        submittedAt: new Date().toISOString(),
      });

      setApplication({
        ...data,
        name,
        email,
        regNumber,
        submittedAt: new Date().toISOString(),
      });

      toast.success("Application submitted successfully.");
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

  if (application) {
    return (
      <div className="w-full bg-white p-8 rounded-lg shadow-sm">
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
            <strong>Reason:</strong> {application.reason}
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
    <div className="w-full bg-white p-8 rounded-lg shadow-sm">
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
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium">
                  Justification for Application
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Please provide a detailed reason for your on-campus residence application..."
                    className="min-h-[150px]"
                    {...field}
                  />
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
