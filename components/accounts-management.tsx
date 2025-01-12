import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { Search } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';

type UserData = {
  id: string;
  displayName: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
};

const SkeletonLoader = ({ rows = 10, cols = 10 }) => {
  return (
    <div className="animate-pulse max-w-6xl mx-auto">
      {[...Array(rows)].map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-10 gap-4 mb-4 items-center p-2">
          {[...Array(cols)].map((_, colIndex) => (
            <div key={colIndex} className="h-8 bg-gray-200 rounded-md col-span-1"></div>
          ))}
        </div>
      ))}
    </div>
  );
};

const AdminAccountManagement = () => {
  const { role, signOut } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const usersCollection = collection(db, 'users');
        const snapshot = await getDocs(usersCollection);

        const userList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as UserData[];

        setUsers(userList);
        setFilteredUsers(userList);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to fetch users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { role: newRole });
  
      // Update both users and filteredUsers to reflect the role change
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
  
      // If there's a search query, also update filteredUsers
      if (searchQuery) {
        setFilteredUsers((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
      } else {
        // Otherwise, update filteredUsers to reflect the entire users list
        setFilteredUsers((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
      }
  
      toast.success('User role updated successfully!');
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role.');
    }
  };
  

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = users.filter(
      (user) =>
        user.displayName?.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto h-full p-4">
        <SkeletonLoader rows={5} cols={10} />
      </div>
    );
  }

  if (role !== 'admin') {
    return <p>Access denied. Admins only.</p>;
  }

  return (
    <div className="max-w-6xl mx-auto h-full p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Account Management</h1>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-8"
        />
      </div>

      <div className="overflow-x-auto max-w-6xl mx-auto">
        <Table className="w-full">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="text-left ">Name</TableHead>
              <TableHead className="text-left">Email</TableHead>
              <TableHead className="text-left">Role</TableHead>
              <TableHead className="text-left">Actions</TableHead>
            </TableRow>
          </TableHeader>
          {loading ? (
            <SkeletonLoader rows={5} cols={4} />
          ) : (
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="min-w-[150px]">{user.displayName}</TableCell>
                  <TableCell className="min-w-[200px]">{user.email}</TableCell>
                  <TableCell className="min-w-[100px]">{user.role}</TableCell>
                  <TableCell className="text-right min-w-[150px]">
                    <div className="flex space-x-2">
                      <Select
                        value={user.role}
                        onValueChange={(role) => handleRoleChange(user.id, role as 'user' | 'admin')}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Change Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </div>

      <button
        onClick={signOut}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Sign Out
      </button>
    </div>
  );
};

export default AdminAccountManagement;
