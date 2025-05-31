"use client";
import type React from "react";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getAuth } from "firebase/auth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Phone,
  BookOpen,
  Mail,
  GraduationCap,
  Users,
  CheckCircle,
  Search,
  ArrowRight,
  UserCheck,
  Edit,
  Save,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { studentDatabase, findStudentByRegNumber, type StudentData } from "@/data/student-data";
import { useRouter } from "next/navigation";

// Updated Student interface to match StudentData structure
interface Student {
  email?: string; // Optional, will use sign-in email
  gender: "Male" | "Female";
  name: string; // Full name (first name + surname concatenated)
  part: "1" | "2" | "3" | "4" | "5";
  phone?: string; // Optional, students will update this
  programme: string;
  regNumber: string;
}

export interface StudentProfile {
  id: string;
  name: string; // Full name (first name + surname concatenated)
  email: string;
  phone?: string;
  regNumber: string;
  gender?: "Male" | "Female";
  part?: "1" | "2" | "3" | "4" | "5";
  programme?: string;
}

const StudentProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  regNumber: z.string().min(1, "Registration number is required"),
  gender: z.enum(["Male", "Female"], { required_error: "Gender is required" }),
  part: z.enum(["1", "2", "3", "4", "5"], {
    required_error: "Part is required",
  }),
  programme: z.string().min(1, "Programme is required"),
});

type FormValues = z.infer<typeof StudentProfileSchema>;

const OnboardingModal: React.FC<{
  isOpen: boolean;
  userEmail: string;
  regNumber: string;
  onComplete: (studentData: Student) => void;
}> = ({ isOpen, userEmail, regNumber, onComplete }) => {
  const [step, setStep] = useState(1);
  const [inputRegNumber, setInputRegNumber] = useState("");
  const [foundStudent, setFoundStudent] = useState<Student | null>(null);
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const handleRegNumberSubmit = async () => {
    setIsSearching(true);
    setError("");

    // Simulate search delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const studentData = findStudentByRegNumber(inputRegNumber);    if (studentData) {
      // Convert StudentData to Student format for compatibility
      const student: Student = {
        email: studentData.email || userEmail, // Use sign-in email if not provided
        gender: studentData.gender,
        name: `${studentData.name} ${studentData.surname}`, // Concatenate first name and surname
        part: studentData.part,
        phone: studentData.phone || "", // Will be updated by student
        programme: studentData.programme,
        regNumber: studentData.regNumber,
      };
      setFoundStudent(student);
      setStep(2);
    } else {
      setError("Registration number not found. Please try again.");
    }
    setIsSearching(false);
  };

  const handleConfirmDetails = () => {
    if (foundStudent) {
      onComplete(foundStudent);
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold">Welcome!</DialogTitle>
              <DialogDescription className="mt-1">
                Let's set up your profile to get started
              </DialogDescription>
            </div>
            <div className="flex space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  step >= 1 ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
              <div
                className={`w-3 h-3 rounded-full ${
                  step >= 2 ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Enter Your Registration Number
                  </h3>
                  <p className="text-sm text-gray-600">
                    We'll search for your details in our system
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="regNumber"
                      className="text-sm font-medium text-gray-700"
                    >
                      Registration Number
                    </Label>
                    <Input
                      id="regNumber"
                      value={inputRegNumber}
                      onChange={(e) => setInputRegNumber(e.target.value)}
                      placeholder="Enter your registration number"
                      className="mt-1"
                    />
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200"
                    >
                      {error}
                    </motion.div>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    onClick={handleRegNumberSubmit}
                    disabled={!inputRegNumber || isSearching}
                    className="w-full"
                  >
                    {isSearching ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                        Searching...
                      </>
                    ) : (
                      <>
                        Search <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && foundStudent && (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserCheck className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Confirm Your Details
                  </h3>
                  <p className="text-sm text-gray-600">
                    Please verify that these details are correct
                  </p>
                </div>

                <Card>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium capitalize">
                        {foundStudent.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{foundStudent.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{foundStudent.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gender:</span>
                      <span className="font-medium">{foundStudent.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Part:</span>
                      <span className="font-medium">
                        Part {foundStudent.part}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Programme:</span>
                      <span className="font-medium text-sm">
                        {foundStudent.programme}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button onClick={handleConfirmDetails} className="flex-1">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm & Save
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const StudentProfileForm: React.FC<{}> = () => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [authDetails, setAuthDetails] = useState({
    userName: "",
    userEmail: "",
    regNumber: "",
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(StudentProfileSchema),
    defaultValues: {
      name: "",
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
          const emailDomain = user.email?.split("@")[1] || "";
          let regNumber = "";

          setAuthDetails({
            userName: user.displayName || "",
            userEmail: user.email || "",
            regNumber,
          });

          if (emailDomain === "hit.ac.zw") {
            // For hit.ac.zw domain users
            regNumber = user.email?.split("@")[0] || "";
            setAuthDetails((prev) => ({ ...prev, regNumber }));

            const userDoc = doc(db, "students", regNumber);
            const docSnap = await getDoc(userDoc);

            if (docSnap.exists()) {
              const data = docSnap.data();
              form.reset({
                name: data.name || user.displayName || "",
                phone: data.phone || "",
                regNumber: data.regNumber || regNumber,
                gender: data.gender,
                part: data.part,
                programme: data.programme || "",
              });
            }
          } else if (emailDomain === "gmail.com" && user.email) {
            // For gmail.com users, first check if they exist in Firebase by email
            const usersRef = collection(db, "students");
            const q = query(usersRef, where("email", "==", user.email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
              // User exists in database, populate form with their data
              const userData = querySnapshot.docs[0].data();
              form.reset({
                name: userData.name || user.displayName || "",
                phone: userData.phone || "",
                regNumber: userData.regNumber || "",
                gender: userData.gender,
                part: userData.part,
                programme: userData.programme || "",
              });

              setAuthDetails((prev) => ({
                ...prev,
                userName: userData.name || user.displayName || "",
                regNumber: userData.regNumber || "",
              }));
            } else {
              // User doesn't exist, show onboarding modal
              setShowOnboardingModal(true);
            }
          }
        }
      } catch (error) {
        toast.error("Error fetching profile");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [form]);

  const handleOnboardingComplete = async (studentData: Student) => {
    try {
      // Create or update the user in Firebase
      const userDoc = doc(db, "students", studentData.regNumber);
      await setDoc(
        userDoc,
        {
          ...studentData,
          name: studentData.name,
          email: authDetails.userEmail,
        },
        { merge: true }
      );

      // Update form with the student data
      form.reset({
        name: studentData.name,
        phone: studentData.phone,
        regNumber: studentData.regNumber, // This is correct but may not be updating properly
        gender: studentData.gender,
        part: studentData.part,
        programme: studentData.programme,
      });

      // Update auth details with the registration number
      setAuthDetails((prev) => ({
        ...prev,
        userName: studentData.name,
        regNumber: studentData.regNumber, // Make sure this is being set
      }));

      setShowOnboardingModal(false);
      setIsEditing(true);
      toast.success(
        "Profile details saved! You can now edit your information."
      );
    } catch (error) {
      toast.error("Failed to save profile details");
      console.error(error);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const userDoc = doc(db, "students", data.regNumber);
      await setDoc(
        userDoc,
        {
          ...data,
          email: authDetails.userEmail,
        },
        { merge: true }
      );

      // Update authDetails with the saved name
      setAuthDetails((prev) => ({
        ...prev,
        userName: data.name,
        regNumber: data.regNumber,
      }));

      toast.success("Profile updated successfully!");
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
      <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <div className="text-center">
              <Skeleton height={32} width={200} className="mx-auto mb-2" />
              <Skeleton height={20} width={300} className="mx-auto" />
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton height={20} width="40%" />
                  <Skeleton height={40} />
                </div>
              ))}
            </div>
            <Skeleton height={50} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <OnboardingModal
        isOpen={showOnboardingModal}
        userEmail={authDetails.userEmail}
        regNumber={authDetails.regNumber}
        onComplete={handleOnboardingComplete}
      />

      <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
        {/* Welcome Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome, {authDetails.userName || "Student"}!
          </h1>
          <p className="text-lg text-gray-600">
            This is your personal dashboard. Keep your information up to date for
            the best experience.
          </p>
        </div>

        {/* Profile Information Card */}
        <Card>          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center">
                  <User className="w-6 h-6 mr-2 text-blue-600" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  {isEditing
                    ? "Update your personal information below"
                    : "View your personal information and make changes when needed"}
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                {!isEditing && (
                  <Badge variant="secondary" className="flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Profile Complete
                  </Badge>
                )}
                <div className="flex gap-2">
                  {isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  )}
                  <Button
                    type="button"
                    onClick={handleEditClick}
                    className={isEditing ? "" : ""}
                  >
                    {isEditing ? (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium flex items-center">
                          <User className="w-4 h-4 mr-2 text-gray-500" />
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value || authDetails.userName}
                            onChange={(e) => {
                              field.onChange(e);
                              setAuthDetails((prev) => ({
                                ...prev,
                                userName: e.target.value,
                              }));
                            }}
                            disabled={!isEditing}
                            className={!isEditing ? "bg-gray-50" : ""}
                            placeholder="Enter your full name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email */}
                  <div className="space-y-2">
                    <Label className="text-base font-medium flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-500" />
                      Email Address
                    </Label>
                    <Input
                      value={authDetails.userEmail}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500">
                      Email cannot be changed
                    </p>
                  </div>

                  {/* Registration Number */}
                  <FormField
                    control={form.control}
                    name="regNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium flex items-center">
                          <BookOpen className="w-4 h-4 mr-2 text-gray-500" />
                          Registration Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value || authDetails.regNumber}
                            disabled={!isEditing}
                            className={!isEditing ? "bg-gray-50" : ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Phone */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-gray-500" />
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your phone number"
                            {...field}
                            disabled={!isEditing}
                            className={!isEditing ? "bg-gray-50" : ""}
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
                        <FormLabel className="text-base font-medium flex items-center">
                          <Users className="w-4 h-4 mr-2 text-gray-500" />
                          Gender
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex flex-row space-x-6"
                            disabled={!isEditing}
                          >
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value="Male" />
                              </FormControl>
                              <FormLabel className="font-normal">Male</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2">
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
                        <FormLabel className="text-base font-medium flex items-center">
                          <GraduationCap className="w-4 h-4 mr-2 text-gray-500" />
                          Academic Year (Part)
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!isEditing}
                        >
                          <FormControl>
                            <SelectTrigger className={!isEditing ? "bg-gray-50" : ""}>
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

                  {/* Programme - Full Width */}
                  <FormField
                    control={form.control}
                    name="programme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium flex items-center">
                          <BookOpen className="w-4 h-4 mr-2 text-gray-500" />
                          Programme of Study
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
                  />                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Quick Actions</CardTitle>
            <CardDescription>
              Access the most common features from here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-20 flex flex-col space-y-2"
                onClick={() => router.push("/student/room-selection")}
              >
                <BookOpen className="w-6 h-6" />
                <span>Room Selection</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col space-y-2"
                onClick={() => router.push("/student/payments")}
              >
                <GraduationCap className="w-6 h-6" />
                <span>View Payments</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col space-y-2"
                onClick={() => router.push("/student/applications")}
              >
                <User className="w-6 h-6" />
                <span>Application Status</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default StudentProfileForm;
