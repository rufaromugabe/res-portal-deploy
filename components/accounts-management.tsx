import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, startAfter, limit, doc, updateDoc, setDoc, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { toast } from "react-toastify";
import { Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { getAuth } from "@firebase/auth";

const PAGE_SIZE = 10;

type UserData = {
  id: string;
  displayName: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
};

const AdminAccountManagement = () => {
  const { role } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const observerRef = useRef(null);

  const fetchUsers = useCallback(async (paginate = false) => {
    if (!hasMore && paginate) return;
    try {
      let usersQuery = query(
        collection(db, "users"),
        orderBy("createdAt", "desc"),
        lastDoc ? startAfter(lastDoc) : limit(PAGE_SIZE)
      );

      const snapshot = await getDocs(usersQuery);
      const userList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as UserData));
      
      setUsers((prev) => (paginate ? [...prev, ...userList] : userList));
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === PAGE_SIZE);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users.");
    }
  }, [lastDoc, hasMore]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newStatus: "user" | "admin") => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { role: newStatus });
      setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, role: newStatus } : user)));
      toast.success("User role updated successfully!");
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update user role.");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleObserver = useCallback((entries: { isIntersecting: any; }[]) => {
    if (entries[0].isIntersecting) {
      fetchUsers(true);
    }
  }, [fetchUsers]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 1 });
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  const filteredUsers = users.filter((user) =>
    user.displayName.toLowerCase().includes(searchQuery) ||
    user.email.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="max-w-6xl mx-auto h-full p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">User Account Management</h1>
      <div className="relative mb-6">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search by name or email" value={searchQuery} onChange={handleSearchChange} className="pl-8" />
      </div>
      <Table className="w-full">
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.displayName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Select value={user.role} onValueChange={(role) => handleRoleChange(user.id, role as "user" | "admin")}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Change Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div ref={observerRef} className="h-10"></div>
    </div>
  );
};

export default AdminAccountManagement;
