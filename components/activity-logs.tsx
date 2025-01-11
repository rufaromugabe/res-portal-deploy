"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { collection, getDocs, query, orderBy ,getFirestore } from "firebase/firestore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Skeleton component for loading animation
const Skeleton = ({ rows = 5, columns = 6 }) => (
  <div className="animate-pulse">
    {[...Array(rows)].map((_, rowIndex) => (
      <div key={rowIndex} className="flex items-center gap-4 mb-4">
        {[...Array(columns)].map((_, colIndex) => (
          <div
            key={colIndex}
            className="h-5 bg-gray-300 rounded-md"
            style={{ flex: 1, margin: "0 4px" }}
          ></div>
        ))}
      </div>
    ))}
  </div>
);

const Logs = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null,
  });

  const db = getFirestore();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const logsQuery = query(collection(db, "ActivityLogs"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(logsQuery);
        const logsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLogs(logsData);
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [db]);

  const filteredLogs = logs.filter((log) => {
    const matchesQuery =
      searchQuery === "" ||
      log.adminEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.activity?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.regNumber?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDateRange =
      (!dateRange.startDate || new Date(log.timestamp) >= dateRange.startDate) &&
      (!dateRange.endDate || new Date(log.timestamp) <= dateRange.endDate);

    return matchesQuery && matchesDateRange;
  });

  return (
    <div className="max-w-6xl mx-auto h-full bg-gray-50 p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Activity Logs</h2>

      {/* Filters */}
<div className="flex flex-col sm:flex-row gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
  <Input
    className="border border-gray-300 rounded-md px-4 py-2 text-gray-700"
    placeholder="Search by admin email, activity, or registration number..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
  <div className="flex flex-col sm:flex-row gap-4 sm:ml-4 mt-4 sm:mt-0">
    <DatePicker
      selected={dateRange.startDate}
      onChange={(date) => setDateRange((prev) => ({ ...prev, startDate: date }))}
      placeholderText="Start Date"
      className="border border-gray-300 rounded-md px-4 py-2 text-gray-700"
    />
    <DatePicker
      selected={dateRange.endDate}
      onChange={(date) => setDateRange((prev) => ({ ...prev, endDate: date }))}
      placeholderText="End Date"
      className="border border-gray-300 rounded-md px-4 py-2 text-gray-700"
    />
  </div>
</div>

      {/* Logs Table */}
      {loading ? (
        <Skeleton rows={5} columns={6} />
      ) : filteredLogs.length === 0 ? (
        <div className="text-center text-gray-500">No logs found for the selected criteria.</div>
      ) : (
        <Table className="w-full border-collapse bg-white rounded-lg shadow-md">
          <TableHeader className="bg-gray-200">
            <TableRow>
              <TableHead className="text-gray-700 uppercase text-sm font-bold py-3">Admin Email</TableHead>
              <TableHead className="text-gray-700 uppercase text-sm font-bold py-3">Activity</TableHead>
              <TableHead className="text-gray-700 uppercase text-sm font-bold py-3">Reg Number</TableHead>
              <TableHead className="text-gray-700 uppercase text-sm font-bold py-3">Old Status</TableHead>
              <TableHead className="text-gray-700 uppercase text-sm font-bold py-3">New Status</TableHead>
              <TableHead className="text-gray-700 uppercase text-sm font-bold py-3">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id} className="hover:bg-gray-100">
                <TableCell className="text-gray-600 py-2 px-4">{log.adminEmail}</TableCell>
                <TableCell className="text-gray-600 py-2 px-4">{log.activity}</TableCell>
                <TableCell className="text-gray-600 py-2 px-4">{log.regNumber}</TableCell>
                <TableCell className="text-gray-600 py-2 px-4">{log.oldStatus}</TableCell>
                <TableCell className="text-gray-600 py-2 px-4">{log.newStatus}</TableCell>
                <TableCell className="text-gray-600 py-2 px-4">
                  {new Date(log.timestamp).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Logs;
