"use client";

import { mockAcceptedApplications } from "@/data/mock-applications";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

const PublishedAccepted = () => {
  const [selectedPart, setSelectedPart] = useState<string>("all");
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredApplications = useMemo(() => {
    return mockAcceptedApplications.filter((application) => {
      const partMatch =
        selectedPart === "all" || application.part.toString() === selectedPart;
      const genderMatch =
        selectedGender === "all" || application.gender === selectedGender;
      const searchMatch =
        searchQuery === "" ||
        application.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        application.regNumber.toLowerCase().includes(searchQuery.toLowerCase());
      return partMatch && genderMatch && searchMatch;
    });
  }, [selectedPart, selectedGender, searchQuery]);

  const statistics = useMemo(() => {
    const stats = {
      totalMales: 0,
      totalFemales: 0,
      malesPerPart: { 1: 0, 2: 0, 3: 0, 4: 0 },
      femalesPerPart: { 1: 0, 2: 0, 3: 0, 4: 0 },
    };

    mockAcceptedApplications.forEach((app) => {
      if (app.gender === "Male") {
        stats.totalMales++;
        stats.malesPerPart[app.part as keyof typeof stats.malesPerPart]++;
      } else {
        stats.totalFemales++;
        stats.femalesPerPart[app.part as keyof typeof stats.femalesPerPart]++;
      }
    });

    return stats;
  }, []);

  return (
    <div className="w-full bg-white p-8 rounded-lg shadow-sm">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Accepted Applications
      </h2>

      {/* Search and Filters */}
      <div className="max-w-6xl mx-auto mb-6 flex flex-col sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or registration number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Table className="max-w-6xl mx-auto rounded-t-md">
        <TableHeader className="bg-gray-100 ">
          <TableRow>
            <TableHead className="w-[30px]"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Reg Number</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Programme</TableHead>
            <TableHead>Part</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredApplications.map((application) => (
            <TableRow key={application.id}>
              <TableCell className="font-medium">{application.id}</TableCell>
              <TableCell>{application.name}</TableCell>
              <TableCell>{application.regNumber}</TableCell>
              <TableCell>{application.gender}</TableCell>
              <TableCell>{application.programme}</TableCell>
              <TableCell>{application.part}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PublishedAccepted;
