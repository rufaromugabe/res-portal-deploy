"use client";
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Input } from "./ui/input";
import { fetchPublishedStudents } from "@/data/firebase-data";

const PublishedStudents = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const studentList = await fetchPublishedStudents();
        setStudents(studentList);
      } catch (error) {
        console.error("Error fetching published students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = students.filter(
    (student) =>
      searchQuery === "" ||
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.regNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="max-w-[1000px] mx-auto h-full  p-8 rounded-lg shadow-lg animate-pulse">
        {/* Header with Logo */}
        <div className="flex items-center justify-between mb-6">
          <div className="h-12 w-32 bg-gray-200 rounded" />
          <div className="h-8 w-64 bg-gray-200 rounded" />
        </div>

        {/* Search Bar */}
        <div className="max-w-6xl mx-auto mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="h-12 w-full sm:w-1/2 bg-gray-200 rounded" />
        </div>

        {/* Table */}
        <div className="overflow-x-auto shadow-md rounded-lg">
          <Table className="min-w-full text-sm">
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="p-4 text-left text-sm font-semibold text-gray-600 bg-gray-300 animate-pulse" />
                <TableHead className="p-4 text-left text-sm font-semibold text-gray-600 bg-gray-300 animate-pulse" />
                <TableHead className="p-4 text-left text-sm font-semibold text-gray-600 bg-gray-300 animate-pulse" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, idx) => (
                <TableRow
                  key={idx}
                  className="hover:bg-gray-50 border-b border-gray-200 animate-pulse"
                >
                  <TableCell className="p-4 bg-gray-200" />
                  <TableCell className="p-4 bg-gray-200" />
                  <TableCell className="p-4 bg-gray-200" />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto h-full p-8 ">
      {/* Header with Logo */}
      <div className="flex items-center justify-between mb-6">
        <img src="/hit_logo.png" alt="Logo" className="h-12" />
        <h2 className="text-3xl font-bold text-indigo-700">Rez List</h2>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <Input
          placeholder="Search by name or registration number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 py-3 border-2 border-indigo-500 rounded-lg w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <Table className="min-w-full text-sm">
          <TableHeader>
            <TableRow className="bg-indigo-100">
              <TableHead className="p-4 text-left text-sm font-semibold text-gray-600">Name</TableHead>
              <TableHead className="p-4 text-left text-sm font-semibold text-gray-600">Reg Number</TableHead>
              <TableHead className="p-4 text-left text-sm font-semibold text-gray-600">Gender</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow
                key={student.id}
                className="hover:bg-indigo-50 border-b border-gray-200"
              >
                <TableCell className="p-4">{student.name}</TableCell>
                <TableCell className="p-4">{student.regNumber}</TableCell>
                <TableCell className="p-4">{student.gender}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PublishedStudents;
