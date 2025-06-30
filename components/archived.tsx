"use client";

import { useState, useEffect, useMemo } from "react";
import { Archive, Printer, PieChart, Users, Upload } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { fetchAllApplications } from "@/data/firebase-data";
import { generateExcelFile } from "@/utils/generate_xl"; 
import { toast } from "react-toastify";

const SkeletonRow = () => (
  <TableRow>
    <TableCell>
      <div className="h-4 bg-gray-300 rounded-md animate-pulse"></div>
    </TableCell>
    <TableCell>
      <div className="h-4 bg-gray-300 rounded-md animate-pulse"></div>
    </TableCell>
    <TableCell>
      <div className="h-4 bg-gray-300 rounded-md animate-pulse"></div>
    </TableCell>
    <TableCell>
      <div className="h-4 bg-gray-300 rounded-md animate-pulse"></div>
    </TableCell>
  </TableRow>
);

const Archived = () => {
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
        toast.error("Failed to fetch archived students.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const archivedApplications = useMemo(() => {
    return applications.filter(
      (app) =>
        app.status === "Archived" &&
        (searchQuery === "" ||
          app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.regNumber.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [applications, searchQuery]);

  // handlePublish function if applicable

  return (
    <div className=" overflow-auto ">
      <h2 className="text-3xl mt-10 font-bold mb-6 text-center">Archived Applications</h2>

      {/* Search and Export */}
      <div className="max-w-5xl mx-auto mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Input
          placeholder="Search by name or registration number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>

      {/* Table */}
      <div className="max-w-5xl mx-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Reg Number</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Part</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array(5) // Render 5 skeleton rows as a placeholder
                  .fill(null)
                  .map((_, index) => <SkeletonRow key={index} />)
              : archivedApplications.map((app) => (
                  <TableRow key={app.regNumber}>
                    <TableCell>{app.name}</TableCell>
                    <TableCell>{app.regNumber}</TableCell>
                    <TableCell>{app.gender}</TableCell>
                    <TableCell>{app.part}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        {!loading && archivedApplications.length === 0 && (
          <p className="text-center mt-4 text-gray-500">No archived applications found.</p>
        )}
      </div>
    </div>
  );
};

export default Archived;