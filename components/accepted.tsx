"use client";

import { useState, useEffect, useMemo } from "react";
import { BarChart2, Users, PieChart, Printer, Upload, Home, MapPin } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { getAuth } from "firebase/auth";
import { fetchAllApplications } from "@/data/firebase-data";
import { fetchStudentAllocations, getRoomDetailsFromAllocation } from "@/data/hostel-data";
import { fetchAllPayments } from "@/data/payment-data";
import { setDoc, collection, getFirestore, doc, getDocs, deleteDoc } from "firebase/firestore";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement } from "chart.js";
import { toast } from "react-toastify";
import { generateExcelFile } from "@/utils/generate_xl"; // Ensure correct import path
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

// Register ChartJS components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement);


const Skeleton = ({ rows = 5 }) => (
  <div className="w-full max-w-5xl mx-auto p-4">
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
    <div className="max-w-5xl mx-auto mb-4 pt-10">
    <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse mx-auto pt-10"></div>
     
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto mb-4 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm">
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
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [hostelDetails, setHostelDetails] = useState<{[key: string]: {hostelName: string, roomNumber: string, floor: string}}>({});
  const [paymentStatuses, setPaymentStatuses] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const [apps, payments] = await Promise.all([
          fetchAllApplications(),
          fetchAllPayments()
        ]);
        
        setApplications(apps);
        
        // Create payment status map
        const paymentMap: {[key: string]: string} = {};
        const acceptedApps = apps.filter(app => app.status === "Accepted");
        
        for (const app of acceptedApps) {
          try {
            const allocations = await fetchStudentAllocations(app.regNumber);
            if (allocations.length > 0) {
              // Find payments for this student's allocations
              const studentPayments = payments.filter(payment => 
                allocations.some(alloc => alloc.id === payment.allocationId) &&
                payment.status === 'Approved'
              );
              
              if (studentPayments.length > 0) {
                // Calculate total paid amount
                const totalPaid = studentPayments.reduce((sum, payment) => sum + payment.amount, 0);
                const allocation = allocations[0];
                const roomDetails = await getRoomDetailsFromAllocation(allocation);
                
                if (roomDetails) {
                  const requiredAmount = roomDetails.price;
                  if (totalPaid >= requiredAmount) {
                    paymentMap[app.regNumber] = 'Paid';
                  } else if (totalPaid > 0) {
                    paymentMap[app.regNumber] = 'Partial';
                  } else {
                    paymentMap[app.regNumber] = 'Pending';
                  }
                } else {
                  paymentMap[app.regNumber] = 'Pending';
                }
              } else {
                paymentMap[app.regNumber] = 'Pending';
              }
            } else {
              paymentMap[app.regNumber] = 'Not Allocated';
            }
          } catch (error) {
            console.error(`Error processing payment status for ${app.regNumber}:`, error);
            paymentMap[app.regNumber] = 'Pending';
          }
        }
        
        setPaymentStatuses(paymentMap);
        
        // Load hostel details for accepted applications
        await loadHostelDetails(acceptedApps);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const loadHostelDetails = async (acceptedApps: any[]) => {
    try {
      const details: {[key: string]: {hostelName: string, roomNumber: string, floor: string}} = {};
      
      for (const app of acceptedApps) {
        try {
          const allocations = await fetchStudentAllocations(app.regNumber);
          if (allocations.length > 0) {
            const allocation = allocations[0]; // Get the most recent allocation
            const roomDetails = await getRoomDetailsFromAllocation(allocation);
            
            if (roomDetails) {
              details[app.regNumber] = {
                hostelName: roomDetails.hostel.name,
                roomNumber: roomDetails.room.number,
                floor: roomDetails.room.floor
              };
            }
          }
        } catch (error) {
          console.error(`Error loading hostel details for ${app.regNumber}:`, error);
          // Set default values if allocation not found
          details[app.regNumber] = {
            hostelName: "Not Allocated",
            roomNumber: "-",
            floor: "-"
          };
        }
      }
      
      setHostelDetails(details);
    } catch (error) {
      console.error("Error loading hostel details:", error);
    }
  };

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
      paymentStats: {
        paid: 0,
        partial: 0,
        pending: 0,
        notAllocated: 0
      }
    };

    acceptedApplications.forEach((app) => {
      if (app.gender === "Male") stats.totalMales++;
      else if (app.gender === "Female") stats.totalFemales++;
      stats.perPart[app.part as keyof typeof stats.perPart]++;
      
      // Count payment statuses
      const paymentStatus = paymentStatuses[app.regNumber] || 'Pending';
      if (paymentStatus === 'Paid') stats.paymentStats.paid++;
      else if (paymentStatus === 'Partial') stats.paymentStats.partial++;
      else if (paymentStatus === 'Not Allocated') stats.paymentStats.notAllocated++;
      else stats.paymentStats.pending++;
    });

    return stats;
  }, [acceptedApplications, paymentStatuses]);

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

  

  const handleExportAcceptedStudents = () => {
    if (!acceptedApplications.length) {
      toast.info('No accepted students to export.');
      return;
    }

    console.log('Exporting data for', acceptedApplications.length, 'students');
    console.log('Hostel details:', hostelDetails);
    console.log('Payment statuses:', paymentStatuses);

    const headers = [
      'Name',
      'Registration Number',
      'Gender',
      'Part',
      'Hostel Name',
      'Room Number',
      'Floor',
      'Payment Status'
    ];

    const data: any[] = [];
    
    acceptedApplications.forEach(app => {
      const hostelInfo = hostelDetails[app.regNumber] || { hostelName: 'Not Allocated', roomNumber: '-', floor: '-' };
      const paymentStatus = paymentStatuses[app.regNumber] || 'Pending';
      
      console.log(`Processing ${app.regNumber}: hostel=${hostelInfo.hostelName}, payment=${paymentStatus}`);
      
      data.push([
        app.name || '',
        app.regNumber || '',
        app.gender || '',
        app.part || '',
        hostelInfo.hostelName || 'Not Allocated',
        hostelInfo.roomNumber || '-',
        hostelInfo.floor || '-',
        paymentStatus
      ]);
    });

    console.log('Final export data:', data);

    try {
      generateExcelFile({
        headers,
        data,
        fileName: 'accepted_students.xlsx',
      });
      toast.success('Excel file generated successfully!');
    } catch (e) {
      console.error('Export error:', e);
      toast.error('Failed to generate Excel file.');
    }
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
    <div className="w-full h-full bg-white p-8 rounded-lg shadow-sm overflow-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Accepted Applications</h2>

      {/* Statistics */}
      <div className="max-w-5xl mx-auto mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm">
        <h3 className="text-2xl font-semibold mb-4 text-center text-gray-800">Application Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <p className="text-2xl font-bold text-indigo-600">{statistics.totalMales}</p>
                <p className="text-sm text-gray-600">Males</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-pink-600">{statistics.totalFemales}</p>
                <p className="text-sm text-gray-600">Females</p>
              </div>
            </div>
            <div className="mt-4 h-16">
              <Pie data={genderData} options={{ plugins: { legend: { display: false } } }} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h4 className="text-lg font-medium text-gray-700 mb-2">Part Distribution</h4>
            <div className="grid grid-cols-5 gap-1 mb-2">
              {Object.entries(statistics.perPart).map(([part, count]) => (
                <div key={part} className="text-center">
                  <p className="text-lg font-semibold text-gray-800">{count}</p>
                  <p className="text-xs text-gray-600">P{part}</p>
                </div>
              ))}
            </div>
            <div className="h-16">
              <Bar data={partData} options={{ plugins: { legend: { display: false } } }} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h4 className="text-lg font-medium text-gray-700 mb-2">Payment Status</h4>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-600">Paid</span>
                <span className="text-sm font-semibold text-green-800">{statistics.paymentStats.paid}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-yellow-600">Partial</span>
                <span className="text-sm font-semibold text-yellow-800">{statistics.paymentStats.partial}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-red-600">Pending</span>
                <span className="text-sm font-semibold text-red-800">{statistics.paymentStats.pending}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Not Allocated</span>
                <span className="text-sm font-semibold text-gray-800">{statistics.paymentStats.notAllocated}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search, Export, Print, and Publish */}
      <div className="max-w-5xl mx-auto mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Input
          placeholder="Search by name or registration number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 flex-1"
        />
        <div className="flex gap-2">
          <Button onClick={handleExportAcceptedStudents} variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
          <Button onClick={() => setConfirmDialogOpen(true)} className="bg-green-600 hover:bg-green-700" disabled={publishing}>
            <Upload className="mr-2 h-5 w-5" />
            {publishing ? "Publishing..." : "Publish List"}
          </Button>
        </div>
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
      </Dialog>      {/* Table */}
      <Table className="max-w-5xl mx-auto border-separate border-spacing-y-2">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Reg Number</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Part</TableHead>
            <TableHead>Hostel</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>Floor</TableHead>
            <TableHead>Payment Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {acceptedApplications.map((app) => {
            const hostelInfo = hostelDetails[app.regNumber] || { hostelName: 'Not Allocated', roomNumber: '-', floor: '-' };
            const paymentStatus = paymentStatuses[app.regNumber] || 'Pending';
            return (
              <TableRow key={app.regNumber} className="hover:bg-gray-50">
                <TableCell>{app.name}</TableCell>
                <TableCell>{app.regNumber}</TableCell>
                <TableCell>{app.gender}</TableCell>
                <TableCell>{app.part}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-blue-600" />
                    <span className={hostelInfo.hostelName === 'Not Allocated' ? 'text-red-500' : 'text-gray-900'}>
                      {hostelInfo.hostelName}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={hostelInfo.roomNumber === '-' ? 'text-red-500' : 'text-gray-900'}>
                    {hostelInfo.roomNumber}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span className={hostelInfo.floor === '-' ? 'text-red-500' : 'text-gray-900'}>
                      {hostelInfo.floor}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    paymentStatus === 'Paid' 
                      ? 'bg-green-100 text-green-800' 
                      : paymentStatus === 'Partial'
                      ? 'bg-yellow-100 text-yellow-800'
                      : paymentStatus === 'Not Allocated'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {paymentStatus}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

    </div>
  );
};

export default Accepted;