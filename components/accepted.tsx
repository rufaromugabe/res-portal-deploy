"use client";

import { useState, useEffect, useMemo } from "react";
import { BarChart2, Users, PieChart, Printer, Upload } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { getAuth } from "firebase/auth";
import { fetchAllApplications } from "@/data/firebase-data";
import { setDoc, collection, getFirestore, doc, getDocs, deleteDoc } from "firebase/firestore";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement } from "chart.js";
import { toast } from "react-toastify";

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
    if (publishing) return; // Prevent duplicate submissions
    setPublishing(true);
  
    const db = getFirestore();
    const publishedCollectionRef = collection(db, "PublishedStudents");
    const activityLogsCollectionRef = collection(db, "ActivityLogs");
    const adminEmail = getAuth().currentUser?.email || "Unknown Admin";
  
    try {
      // Fetch all existing documents in the collection and delete them
      const existingDocs = await getDocs(publishedCollectionRef);
      const deletePromises = existingDocs.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
  
      // Publish the new list
      const publishPromises = acceptedApplications.map((app) =>
        setDoc(doc(db, "PublishedStudents", app.regNumber), {
          name: app.name,
          gender: app.gender,
          regNumber: app.regNumber,
        })
      );
      await Promise.all(publishPromises);
  
      // Save activity log
      await setDoc(doc(activityLogsCollectionRef), {
        adminEmail,
        activity: "Published the list of accepted applications",
        timestamp: new Date().toISOString(),
      });
  
      toast.success("Published list successfully!");
    } catch (error) {
      console.error("Error publishing list:", error);
      toast.error("Failed to publish list. Please try again.");
    } finally {
      setPublishing(false);
    }
  };
  
  const handlePrint = () => {
    const adminEmail = getAuth().currentUser?.email || "Unknown Admin";
    const db = getFirestore();
    const activityLogsCollectionRef = collection(db, "ActivityLogs");
  
    // Save activity log
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
      <div className="max-w-6xl mx-auto mb-4 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Total Accepted Students</h4>
            <p className="text-xl font-bold">{statistics.totalAccepted}</p>
            <Users className="h-6 w-6 text-blue-500" />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Gender Distribution</h4>
            <div className="h-32">
              <Pie data={genderData} />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Part Distribution</h4>
            <div className="h-32">
              <Bar data={partData} />
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
        <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 ml-auto">
          <Printer className="mr-2 h-5 w-5" />
          Print as PDF
        </Button>
        <Button
          onClick={handlePublish}
          className="bg-green-600 hover:bg-green-700"
          disabled={publishing}
        >
          <Upload className="mr-2 h-5 w-5" />
          {publishing ? "Publishing..." : "Publish List"}
        </Button>
      </div>

      {/* Table */}
      <Table className="max-w-6xl mx-auto border-separate border-spacing-y-2">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Reg Number</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Part</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {acceptedApplications.map((app) => (
            <TableRow key={app.regNumber} className="hover:bg-gray-50">
              <TableCell>{app.name}</TableCell>
              <TableCell>{app.regNumber}</TableCell>
              <TableCell>{app.gender}</TableCell>
              <TableCell>{app.part}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Accepted;
