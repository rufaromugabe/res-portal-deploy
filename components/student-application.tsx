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
import { doc, getDoc, setDoc } from "firebase/firestore";
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

const StudentApplicationForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(StudentApplicationSchema),
    defaultValues: {
      reason: "",
    },
  });

  // Fetch authenticated user's profile
  useEffect(() => {
    const fetchProfile = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const regNumber = user.email?.split("@")[0] || "";
        const userDoc = doc(db, "students", regNumber);

        try {
          const docSnap = await getDoc(userDoc);
          if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            setProfile(docSnap.data() as StudentProfile);
          } else {
            console.error("No profile found for this user.");
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };

    fetchProfile();
  }, []);

  const onSubmit = async (data: FormValues) => {
    if (!profile) {
      toast.error("Profile data is missing. Please reload the page.");
      return;
    }

    const { regNumber, name, email } = profile;

    // Validate profile data
    if (!regNumber || !name || !email) {
      console.log("Profile data is incomplete:", profile , regNumber, name, email);
      toast.error("Required profile information is incomplete.");
      return;
    }

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

      setIsSubmitted(true);
      toast.success("Application submitted successfully.");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Alert>
        <AlertDescription>
          Your application has been submitted successfully. We will review it
          and get back to you soon.
        </AlertDescription>
      </Alert>
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
