"use client";

import { useState, useEffect, useMemo } from "react";
import { BarChart2, Users, PieChart, Printer, Upload, DollarSign, Check } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { getAuth } from "firebase/auth";
import { fetchAllApplications } from "@/data/firebase-data";
import { setDoc, collection, getFirestore, doc, getDocs, deleteDoc } from "firebase/firestore";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement } from "chart.js";
import { toast } from "react-toastify";
import { generateExcelFile } from "@/utils/generate_xl"; // Ensure correct import path
import PaymentStatusModal from "./payment-modal"; // Import the modal component
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

// Register ChartJS components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement);


const Skeleton = ({ rows = 5 }) => (
  <div className="w-full max-w-6xl mx-auto p-4">
    {[...Array(rows)].map((_, index) => (
      <div key={index} className="animate-pulse flex space-x-4 mb-4">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      </div>
    ))}
  </div>
);

const StatisticsSkeleton = () => (
  <>
    <div className="max-w-6xl mx-auto mb-4 pt-10">
    <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse mx-auto pt-10"></div>
     
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto mb-4 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow-sm animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-20 bg-gray-200 rounded mt-4"></div>
        </div>
      ))}
    </div>
  </>
);


const Accepted = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [publishing, setPublishing] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const apps = await fetchAllApplications();
        setApplications(apps);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const acceptedApplications = useMemo(() => {
    return applications.filter(
      (app) =>
        app.status === "Accepted" &&
        (searchQuery === "" ||
          app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.regNumber.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [applications, searchQuery]);

  const statistics = useMemo(() => {
    const stats = {
      totalMales: 0,
      totalFemales: 0,
      totalAccepted: acceptedApplications.length,
      perPart: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };

    acceptedApplications.forEach((app) => {
      if (app.gender === "Male") stats.totalMales++;
      else if (app.gender === "Female") stats.totalFemales++;
      stats.perPart[app.part as keyof typeof stats.perPart]++;
    });

    return stats;
  }, [acceptedApplications]);

  const handlePublish = async () => {
    setConfirmDialogOpen(false);
    setPublishing(true);
    try {
      const db = getFirestore();
      const activityLogsCollectionRef = collection(db, "ActivityLogs");
      const adminEmail = getAuth().currentUser?.email || "Unknown Admin";
      const publishedList = acceptedApplications.map((app) => ({
        name: app.name,
        gender: app.gender,
        regNumber: app.regNumber,
      }));

      const response = await fetch("/api/savePublishedLists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publishedList }),
      });
      if (!response.ok) throw new Error("Failed to save the published list");

      await setDoc(doc(activityLogsCollectionRef), {
        adminEmail,
        activity: "Published the list of accepted applications",
        timestamp: new Date().toISOString(),
      });
      toast.success("Published list saved successfully!");
    } catch (error) {
      toast.error("Failed to publish list. Please try again.");
    } finally {
      setPublishing(false);
    }
  };

  const handlePrint = () => {
    const adminEmail = getAuth().currentUser?.email || "Unknown Admin";
    const db = getFirestore();
    const activityLogsCollectionRef = collection(db, "ActivityLogs");
  
    setDoc(doc(activityLogsCollectionRef), {
      adminEmail,
      activity: "Printed the accepted applications list",
      timestamp: new Date().toISOString(),
    })
      .then(() => {
        console.log("Activity logged successfully.");
      })
      .catch((error) => {
        console.error("Error logging activity:", error);
      });
  
    window.print();
  };

  const handleExportExcel = () => {
    const headers = ['Name', 'Email', 'Registration Number', 'Gender', 'Programme', 'Payment', 'Reference'];
    const data = acceptedApplications.map(app => ({
      name: app.name,
      email: app.email,
      registration_number: app.regNumber,
      gender: app.gender,
      programme: app.programme,
      payment: app.paymentStatus,
      reference: app.reference,
    }));
  
    generateExcelFile({
      headers,
      data,
      fileName: 'Accepted_Applications.xlsx',
    });
  
    toast.success('Excel file generated successfully!');
  };

  const handleOpenModal = (student: any) => {
  
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };
  const handlePaymentStatusUpdate = (updatedStudent: any) => {
    setApplications((prevApplications) =>
      prevApplications.map((app) =>
        app.regNumber === updatedStudent.regNumber
          ? { ...app, paymentStatus: updatedStudent.paymentStatus }
          : app
      )
    );
  };
  

  // ... (keep the existing genderData and partData definitions)
   
  // Pie chart data
  const genderData = {
    labels: ["Male", "Female"],
    datasets: [
      {
        data: [statistics.totalMales, statistics.totalFemales],
        backgroundColor: ["#4F46E5", "#F43F5E"],
      },
    ],
  };

// Bar chart data
const partData = {
  labels: ["Part 1", "Part 2", "Part 3", "Part 4", "Part 5"],
  datasets: [
    {
      label: "Students",
      
      data: [
        statistics.perPart[1],
        statistics.perPart[2],
        statistics.perPart[3],
        statistics.perPart[4],
        statistics.perPart[5]
      ],
      backgroundColor: [
        "#10B981",  
        "#3B82F6",  
        "#F59E0B",  
        "#9333EA",  
        "#F43F5E"   
      ],
      borderColor: [
        "#059669", 
        "#2563EB",  
        "#D97706",  
        "#7C3AED", 
        "#DB2777"   
      ],
      borderWidth: 1,
    },
  ],
};

  if (loading) {
    return (
      <div>
        <StatisticsSkeleton />
        <Skeleton rows={8} />
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white p-8 rounded-lg shadow-sm">
      <h2 className="text-3xl font-bold mb-6 text-center">Accepted Applications</h2>

      {/* Statistics */}
      <div className="max-w-6xl mx-auto mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm">
        <h3 className="text-2xl font-semibold mb-4 text-center text-gray-800">Application Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h4 className="text-lg font-medium text-gray-700 mb-2">Total Accepted</h4>
            <p className="text-3xl font-bold text-blue-600">{statistics.totalAccepted}</p>
            <div className="flex items-center mt-2">
              <Users className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-sm text-gray-600">Accepted Students</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h4 className="text-lg font-medium text-gray-700 mb-2">Gender Distribution</h4>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-3xl font-bold text-indigo-600">{statistics.totalMales}</p>
                <p className="text-sm text-gray-600">Males</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-pink-600">{statistics.totalFemales}</p>
                <p className="text-sm text-gray-600">Females</p>
              </div>
            </div>
            <div className="mt-4 h-24">
              <Pie data={genderData} options={{ plugins: { legend: { display: false } } }} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h4 className="text-lg font-medium text-gray-700 mb-2">Part Distribution</h4>
            <div className="grid grid-cols-5 gap-2 mb-4">
              {Object.entries(statistics.perPart).map(([part, count]) => (
                <div key={part} className="text-center">
                  <p className="text-lg font-semibold text-gray-800">{count}</p>
                  <p className="text-xs text-gray-600">Part {part}</p>
                </div>
              ))}
            </div>
            <div className="h-24">
              <Bar data={partData} options={{ plugins: { legend: { display: false } } }} />
            </div>
          </div>
        </div>
      </div>

      {/* Search, Print, and Publish */}
      <div className="max-w-6xl mx-auto mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Input
          placeholder="Search by name or registration number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
        <Button onClick={handleExportExcel} className="bg-blue-600 hover:bg-blue-700 ">
          <Printer className="mr-2 h-5 w-5" />
          Save as Excel
        </Button>
      
        <Button onClick={() => setConfirmDialogOpen(true)} className="bg-green-600 hover:bg-green-700" disabled={publishing}>
          <Upload className="mr-2 h-5 w-5" />
          {publishing ? "Publishing..." : "Publish List"}
        </Button>
      </div>

      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Publish</DialogTitle>
        <DialogContent>
          Are you sure you want to publish the new list?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} className="bg-gray-400">Cancel</Button>
          <Button onClick={handlePublish} className="bg-green-600 hover:bg-green-700">Confirm</Button>
        </DialogActions>
      </Dialog>

      {/* Table */}
      <Table className="max-w-6xl mx-auto border-separate border-spacing-y-2">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Reg Number</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Part</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {acceptedApplications.map((app) => (
            <TableRow key={app.regNumber} className="hover:bg-gray-50">
              <TableCell>{app.name}</TableCell>
              <TableCell>{app.regNumber}</TableCell>
              <TableCell>{app.gender}</TableCell>
              <TableCell>{app.part}</TableCell>
              <TableCell>
              <Button
      onClick={() => handleOpenModal(app)}
      variant="outline"
      className={`mr-2 ${
        app.paymentStatus === "Fully Paid"
          ? "bg-green-500 text-white hover:bg-green-600"
          : "bg-red-500 text-white hover:bg-red-600"
      }`}
      
    >
      {app.paymentStatus === "Fully Paid" ? (
        <span className="flex items-center">
          <Check className="mr-2 h-4 w-4" /> {/* Checkmark icon for fully paid */}
          Fully Paid
        </span>
      ) : (
        <span className="flex items-center">
          <DollarSign className="mr-2 h-4 w-4" /> {/* Dollar sign icon for payment status */}
          {app.paymentStatus}
        </span>
      )}
    </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Payment Status Modal */}
      <PaymentStatusModal
  isOpen={isModalOpen}
  onClose={handleCloseModal}
  student={selectedStudent}
  onUpdate={handlePaymentStatusUpdate} // Pass the update function
/>

    </div>
  );
};

export default Accepted;