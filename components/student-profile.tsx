"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Phone,
  BookOpen,
  Mail,
  GraduationCap,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  regNumber?: string;
  gender?: "Male" | "Female";
  part?: "1" | "2" | "3" | "4" | "5";
  programme?: string;
}

const StudentProfileSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  regNumber: z.string().min(1, "Registration number is required"),
  gender: z.enum(["Male", "Female"], { required_error: "Gender is required" }),
  part: z.enum(["1", "2", "3", "4", "5"], {
    required_error: "Part is required",
  }),
  programme: z.string().min(1, "Programme is required"),
});

type FormValues = z.infer<typeof StudentProfileSchema>;

const StudentProfileForm: React.FC<{ profile: StudentProfile }> = ({
  profile,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(StudentProfileSchema),
    defaultValues: {
      phone: profile.phone || "",
      regNumber: profile.regNumber || "",
      gender: profile.gender,
      part: profile.part,
      programme: profile.programme || "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    // Here you would typically send this data to your backend
    setIsEditing(false);
  };

  const handleEditClick = () => {
    if (isEditing) {
      form.handleSubmit(onSubmit)();
    } else {
      setIsEditing(true);
    }
  };

  return (
    <div className="w-full bg-white p-8 rounded-lg shadow-sm">
      <h2 className="text-3xl font-bold mb-6 text-center">Student Profile</h2>
      <p className="text-gray-600 mb-8 text-center">
        View or update your profile information
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-lg font-medium text-gray-700 flex items-center"
              >
                <User className="w-5 h-5 mr-2" />
                Name
              </Label>
              <Input
                id="name"
                value={profile.name}
                disabled
                className="bg-gray-100 text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-lg font-medium text-gray-700 flex items-center"
              >
                <Mail className="w-5 h-5 mr-2" />
                Email
              </Label>
              <Input
                id="email"
                value={profile.email}
                disabled
                className="bg-gray-100 text-lg"
              />
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium flex items-center">
                    <Phone className="w-5 h-5 mr-2" />
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your phone number"
                      {...field}
                      className="text-lg"
                      disabled={!isEditing}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="regNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Registration Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your registration number"
                      {...field}
                      className="text-lg"
                      disabled={!isEditing}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-lg font-medium flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Gender
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                      disabled={!isEditing}
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Male" />
                        </FormControl>
                        <FormLabel className="font-normal">Male</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Female" />
                        </FormControl>
                        <FormLabel className="font-normal">Female</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="part"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2" />
                    Part
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!isEditing}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your part" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["1", "2", "3", "4", "5"].map((part) => (
                        <SelectItem key={part} value={part}>
                          Part {part}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="programme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Programme
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your programme"
                      {...field}
                      className="text-lg"
                      disabled={!isEditing}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="button"
            onClick={handleEditClick}
            className="w-full text-lg py-6"
          >
            {isEditing ? "Save Changes" : "Edit Profile"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default StudentProfileForm;
