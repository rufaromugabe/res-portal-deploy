import { useState, useEffect } from "react";
import { Mail, Phone, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { fetchAllApplications } from "@/data/firebase-data";
import { Separator } from "./ui/separator";
import { updateApplicationStatus } from "@/data/firebase-data";

// Skeleton Loader Component
const SkeletonLoader = ({ rows = 10, cols = 10 }) => {
  return (
    <div className="animate-pulse  max-w-6xl mx-auto ">
      {[...Array(rows)].map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid grid-cols-10 gap-4 mb-4 items-center p-2"
        >
          {[...Array(cols)].map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-8 bg-gray-200 rounded-md col-span-1"
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

const Applications = () => {
  const [selectedPart, setSelectedPart] = useState<string>("all");
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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

  const handleStatusChange = async (
    regNumber: string,
    newStatus: "Accepted" | "Archived" | "Pending"
  ) => {
    try {
      await updateApplicationStatus(regNumber, newStatus);
      setApplications((prevApps) =>
        prevApps.map((app) =>
          app.regNumber === regNumber ? { ...app, status: newStatus } : app
        )
      );
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  const filteredApplications = applications.filter((application) => {
    const partMatch =
      selectedPart === "all" || application.part.toString() === selectedPart;
    const genderMatch =
      selectedGender === "all" || application.gender === selectedGender;
    const statusMatch =
      selectedStatus === "all" || application.status === selectedStatus;
    const searchMatch =
      searchQuery === "" ||
      application.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      application.regNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return partMatch && genderMatch && statusMatch && searchMatch;
  });

  return (
    <div className="w-full bg-white p-8 rounded-lg shadow-sm">
      <h2 className="text-3xl font-bold mb-6 text-center">
        On-campus Res Applications
      </h2>
      <p className="text-gray-600 mb-8 text-center">
        These are all the students who have applied for on-campus residence so
        far.
      </p>

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

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Accepted">Accepted</SelectItem>
                <SelectItem value="Archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {loading ? (
        <SkeletonLoader rows={5} cols={10} />
      ) : (
        <Table className="max-w-6xl mx-auto rounded-t-md">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Reg Number</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Programme</TableHead>
              <TableHead>Part</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.map((application) => (
              <TableRow key={application.regNumber}>
                <TableCell className="font-medium">
                  {application.submittedAt}
                </TableCell>
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
                    <Select
                      value={application.status}
                      onValueChange={(status) =>
                        handleStatusChange(
                          application.regNumber,
                          status as "Accepted" | "Archived" | "Pending"
                        )
                      }
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Change Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Accepted">Accepted</SelectItem>
                        <SelectItem value="Archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Applications;
