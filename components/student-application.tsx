"use client";

import React, { useState } from "react";
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
import { StudentProfile } from "./student-profile";

interface StudentApplication {
  id: string;
  name: string;
  reason: string;
}

const StudentApplicationSchema = z.object({
  reason: z
    .string()
    .min(1, "Reason is required")
    .min(50, "Please provide a more detailed reason (at least 50 characters)"),
});

type FormValues = z.infer<typeof StudentApplicationSchema>;

const StudentApplicationForm: React.FC<{ profile: StudentProfile }> = ({
  profile,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(StudentApplicationSchema),
    defaultValues: {
      reason: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Form submitted:", {
      ...data,
      name: profile.name,
      id: profile.id,
    });
    setIsSubmitting(false);
    setIsSubmitted(true);
    // Here you would typically send this data to your backend
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
