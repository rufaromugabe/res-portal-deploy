'use client'; 
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton"; // Importing react-loading-skeleton
import "react-loading-skeleton/dist/skeleton.css"; // Skeleton CSS
import { toast } from 'react-toastify';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getAuth } from "firebase/auth";
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
import { Combobox } from "./ui/combobox";
import { programmes } from "@/data/programmes";


export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  regNumber: string;
  gender?: "Male" | "Female";
  part?: "1" | "2" | "3" | "4" | "5";
  programme?: string;
}

const StudentProfileSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  regNumber: z.string().nullable(),
  gender: z.enum(["Male", "Female"], { required_error: "Gender is required" }),
  part: z.enum(["1", "2", "3", "4", "5"], {
    required_error: "Part is required",
  }),
  programme: z.string().min(1, "Programme is required"),
});

type FormValues = z.infer<typeof StudentProfileSchema>;

const StudentProfileForm: React.FC<{}> = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [authDetails, setAuthDetails] = useState({
    userName: "",
    userEmail: "",
    regNumber: "",
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(StudentProfileSchema),
    defaultValues: {
      phone: "",
      regNumber: "",
      gender: "Male",
      part: "1",
      programme: "",
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const regNumber = user.email?.split("@")[0] || "";
          setAuthDetails({
            userName: user.displayName || "",
            userEmail: user.email || "",
            regNumber,
          });

          const userDoc = doc(db, "students", regNumber);
          const docSnap = await getDoc(userDoc);

          if (docSnap.exists()) {
            const data = docSnap.data();
            form.reset({
              phone: data.phone || "",
              regNumber: data.regNumber || regNumber,
              gender: data.gender,
              part: data.part,
              programme: data.programme || "",
            });
          }
        }
      } catch (error) {
        toast.error("Error fetching profile");
      } finally {
        setIsLoading(false); // Hide loading skeleton
      }
    };

    fetchProfile();
  }, [form]);

  const onSubmit = async (data: FormValues) => {
    try {
      const userDoc = doc(db, "students", authDetails.regNumber);
      await setDoc(
        userDoc,
        {
          ...data,
          name: authDetails.userName,
          regNumber: authDetails.regNumber,
          email: authDetails.userEmail,
        },
        { merge: true }
      );
      toast.success("Profile updated successfully go to application form");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleEditClick = () => {
    if (isEditing) {
      form.handleSubmit(onSubmit)();
    } else {
      setIsEditing(true);
    }
  };




  if (isLoading) {
    return (
      <div className="w-full bg-white p-8 rounded-lg shadow-sm">
      <h2 className="text-3xl font-bold mb-6 text-center">
        <Skeleton width={200} />
      </h2>
      <p className="text-gray-600 mb-8 text-center">
        <Skeleton width={300} />
      </p>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <Skeleton height={20} width="50%" />
            <Skeleton height={40} />
          </div>
          <div className="space-y-2">
            <Skeleton height={20} width="50%" />
            <Skeleton height={40} />
          </div>
          <div className="space-y-2">
            <Skeleton height={20} width="50%" />
            <Skeleton height={40} />
          </div>
          <div className="space-y-2">
            <Skeleton height={20} width="50%" />
            <Skeleton height={40} />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton height={20} width="50%" />
          <Skeleton height={40} />
        </div>
        <div className="space-y-2">
          <Skeleton height={20} width="50%" />
          <Skeleton height={40} />
        </div>
        <div className="space-y-2">
          <Skeleton height={20} width="50%" />
          <Skeleton height={40} />
        </div>
        <div className="space-y-2">
          <Skeleton height={20} width="50%" />
          <Skeleton height={40} />
        </div>
        <Skeleton height={50} width="100%" />
      </div>
    </div>
    );
  }

  return (
    <div className="w-full bg-white p-8 rounded-lg shadow-sm">
      <h2 className="text-3xl font-bold mb-6 text-center">Student Profile</h2>
      <p className="text-gray-600 mb-8 text-center">
        View or update your profile information
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-lg font-medium text-gray-700 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Name
              </Label>
              <Input
                id="name"
                value={authDetails.userName}
                disabled
                className="bg-gray-100 text-lg"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-lg font-medium text-gray-700 flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Email
              </Label>
              <Input
                id="email"
                value={authDetails.userEmail}
                disabled
                className="bg-gray-100 text-lg"
              />
            </div>

            {/* Registration Number */}
            <FormField
              control={form.control}
              name="regNumber"
              render={() => (
                <FormItem>
                  <FormLabel className="text-lg font-medium flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Registration Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      value={authDetails.regNumber}
                      disabled
                      className="bg-gray-100 text-lg"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Phone */}
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

            {/* Gender */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Gender
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value} // Use field.value to bind the current value
                      className="flex flex-col space-y-1"
                      disabled={!isEditing}
                    >
                      <FormItem className="flex items-center space-x-3">
                        <FormControl>
                          <RadioGroupItem value="Male" />
                        </FormControl>
                        <FormLabel className="font-normal">Male</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3">
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

            {/* Part */}
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
                    value={field.value} // Use field.value to bind the current value
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


            {/* Programme (Using Combobox) */}
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
                    <Combobox
                      value={field.value}
                      onChange={field.onChange}
                      options={programmes}
                      placeholder="Select your programme"
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
