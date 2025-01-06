"use client";

import { mockAcceptedApplications } from "@/data/mock-applications";
import {
  Download,
  Mail,
  Phone,
  Search,
  BarChart2,
  UserIcon as Male,
  UserIcon as Female,
  Users,
  PieChart,
  GraduationCap,
  CloudUpload,
} from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { PublishListModal } from "@/components/publish-modal";

const Accepted = () => {
  const [selectedPart, setSelectedPart] = useState<string>("all");
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

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

      {/* Statistics and Actions */}
      <div className="max-w-6xl mx-auto mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <BarChart2 className="mr-2 h-5 w-5 text-blue-600" />
              Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Total Students
                </h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">
                      {statistics.totalMales + statistics.totalFemales}
                    </p>
                    <p className="text-sm text-gray-500">Accepted</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Gender Distribution
                </h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold">
                      <Male className="inline mr-1 h-4 w-4 text-blue-500" />{" "}
                      {statistics.totalMales}
                    </p>
                    <p className="text-lg font-semibold">
                      <Female className="inline mr-1 h-4 w-4 text-pink-500" />{" "}
                      {statistics.totalFemales}
                    </p>
                  </div>
                  <PieChart className="h-8 w-8 text-indigo-500" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Males per Part
                </h4>
                {Object.entries(statistics.malesPerPart).map(
                  ([part, count]) => (
                    <p key={`male-${part}`} className="text-sm">
                      <GraduationCap className="inline mr-1 h-3 w-3 text-blue-500" />
                      Part {part}:{" "}
                      <span className="font-semibold">{count}</span>
                    </p>
                  )
                )}
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Females per Part
                </h4>
                {Object.entries(statistics.femalesPerPart).map(
                  ([part, count]) => (
                    <p key={`female-${part}`} className="text-sm">
                      <GraduationCap className="inline mr-1 h-3 w-3 text-pink-500" />
                      Part {part}:{" "}
                      <span className="font-semibold">{count}</span>
                    </p>
                  )
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-center">Actions</h3>
            <Button
              onClick={() => setIsPublishModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 w-full max-w-xs"
            >
              <CloudUpload className="mr-2 h-5 w-5" />
              Publish list of accepted students
            </Button>
            <p className="text-sm text-gray-500 mt-4 text-center">
              Click to publish list of accepted students to this url:
              https://res-portal.hit.ac.zw/accepted-students
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-6xl mx-auto mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or registration number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Part:</span>
            <Select value={selectedPart} onValueChange={setSelectedPart}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select part" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Parts</SelectItem>
                <SelectItem value="1">Part 1</SelectItem>
                <SelectItem value="2">Part 2</SelectItem>
                <SelectItem value="3">Part 3</SelectItem>
                <SelectItem value="4">Part 4</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Gender:</span>
            <Select value={selectedGender} onValueChange={setSelectedGender}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
            <TableHead>Reason</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead className="text-right"></TableHead>
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
              <TableCell className="max-w-xs">{application.reason}</TableCell>
              <TableCell className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-3 w-3" />
                  <p className="text-xs text-gray-800">{application.email}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-3 w-3" />
                  <p className="text-xs text-gray-800">{application.phone}</p>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col space-y-2">
                  <Button size="sm" className="bg-red-800">
                    Remove
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <PublishListModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
      />
    </div>
  );
};

export default Accepted;
