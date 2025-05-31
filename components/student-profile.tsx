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
import { useRouter } from "next/navigation";

interface Student {
  email: string;
  gender: "Male" | "Female";
  name: string;
  part: "1" | "2" | "3" | "4" | "5";
  phone: string;
  programme: string;
  regNumber: string;
}

const students: Student[] = [
  {
    email: "rufarorevmugabe@gmail.com",
    gender: "Male",
    name: "rufaro mugabe",
    part: "1",
    phone: "0779826816",
    programme: "BTECH_SOFTWARE_ENGINEERING",
    regNumber: "rufarorevmugabe",
  },
  {
    email: "tendaimoyo23@gmail.com",
    gender: "Male",
    name: "tendai moyo",
    part: "2",
    phone: "0772345678",
    programme: "BTECH_COMPUTER_SCIENCE",
    regNumber: "tendaimoyo23",
  },
  {
    email: "chiedzamukandiwa@gmail.com",
    gender: "Female",
    name: "chiedza mukandiwa",
    part: "1",
    phone: "0789012345",
    programme: "BTECH_INFORMATION_TECHNOLOGY",
    regNumber: "chiedzamukandiwa",
  },
  {
    email: "tatendanjiva@gmail.com",
    gender: "Male",
    name: "tatenda njiva",
    part: "3",
    phone: "0733456789",
    programme: "BTECH_SOFTWARE_ENGINEERING",
    regNumber: "tatendanjiva",
  },
  {
    email: "ruvarashesibanda@gmail.com",
    gender: "Female",
    name: "ruvarashe sibanda",
    part: "2",
    phone: "0771122334",
    programme: "BTECH_COMPUTER_SCIENCE",
    regNumber: "ruvarashesibanda",
  },
  {
    email: "kudzanainyati@gmail.com",
    gender: "Male",
    name: "kudzai inyati",
    part: "4",
    phone: "0712233445",
    programme: "BTECH_ELECTRONIC_ENGINEERING",
    regNumber: "kudzanainyati",
  },
  {
    email: "nyashachikowore@gmail.com",
    gender: "Female",
    name: "nyasha chikowore",
    part: "1",
    phone: "0798765432",
    programme: "BTECH_INFORMATION_TECHNOLOGY",
    regNumber: "nyashachikowore",
  },
  {
    email: "takudzwanyoni@gmail.com",
    gender: "Male",
    name: "takudzwa nyoni",
    part: "3",
    phone: "0765432109",
    programme: "BTECH_SOFTWARE_ENGINEERING",
    regNumber: "takudzwanyoni",
  },
  {
    email: "lorrainekufa@gmail.com",
    gender: "Female",
    name: "lorraine kufa",
    part: "2",
    phone: "0787654321",
    programme: "BTECH_COMPUTER_SCIENCE",
    regNumber: "lorrainekufa",
  },
  {
    email: "tanyaradzikamoyo@gmail.com",
    gender: "Female",
    name: "tanyaradzika moyo",
    part: "4",
    phone: "0743210987",
    programme: "BTECH_INFORMATION_SECURITY",
    regNumber: "tanyaradzikamoyo",
  },
];

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

    const student = students.find((s) => s.regNumber === inputRegNumber);

    if (student) {
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

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Welcome!</h2>
            <div className="flex space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  step >= 1 ? "bg-white" : "bg-white/30"
                }`}
              />
              <div
                className={`w-3 h-3 rounded-full ${
                  step >= 2 ? "bg-white" : "bg-white/30"
                }`}
              />
            </div>
          </div>
          <p className="text-blue-100 mt-2">Let's set up your profile</p>
        </div>

        <div className="p-6">
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Enter Your Registration Number
                  </h3>
                  <p className="text-gray-600">
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
                      className="text-red-600 text-sm bg-red-50 p-3 rounded-lg"
                    >
                      {error}
                    </motion.div>
                  )}

                  <Button
                    onClick={handleRegNumberSubmit}
                    disabled={!inputRegNumber || isSearching}
                    className="w-full"
                  >
                    {isSearching ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Confirm Your Details
                  </h3>
                  <p className="text-gray-600">
                    Please verify that these details are correct
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
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
                </div>

                <Button onClick={handleConfirmDetails} className="w-full">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm & Save Details
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
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
    <>
      <OnboardingModal
        isOpen={showOnboardingModal}
        userEmail={authDetails.userEmail}
        regNumber={authDetails.regNumber}
        onComplete={handleOnboardingComplete}
      />

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
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Name
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
                        className={
                          !isEditing ? "bg-gray-100 text-lg" : "text-lg"
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
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
                  value={authDetails.userEmail}
                  disabled
                  className="bg-gray-100 text-lg"
                />
              </div>

              {/* Registration Number */}
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
                        {...field}
                        value={field.value || authDetails.regNumber}
                        disabled={!isEditing}
                        className={
                          !isEditing ? "bg-gray-100 text-lg" : "text-lg"
                        }
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
                        value={field.value}
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
                      value={field.value}
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
    </>
  );
};

export default StudentProfileForm;
