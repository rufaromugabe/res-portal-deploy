"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Input } from "./ui/input"

const PublishedStudents = () => {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true)
      try {
        const response = await fetch("/publishedList.json")
        if (!response.ok) throw new Error("Failed to load published list")

        const data = await response.json()
        setStudents(data)
      } catch (error) {
        console.error("Error fetching published students:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])

  const filteredStudents = students.filter(
    (student) =>
      searchQuery === "" ||
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.regNumber.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="w-full h-screen p-4 sm:p-8 animate-pulse">
        {/* Header with Logo */}
        <div className="flex items-center justify-between mb-6">
          <div className="h-12 w-32 bg-gray-200 rounded" />
          <div className="h-8 w-64 bg-gray-200 rounded" />
        </div>

        {/* Search Bar */}
        <div className="mb-6 w-full">
          <div className="h-12 w-full bg-gray-200 rounded" />
        </div>

        {/* Table Skeleton */}
        <div className="overflow-x-auto shadow-md rounded-lg">
          <Table className="w-full text-sm">
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="p-4 text-left text-sm font-semibold text-gray-600 bg-gray-300 animate-pulse" />
                <TableHead className="p-4 text-left text-sm font-semibold text-gray-600 bg-gray-300 animate-pulse" />
                <TableHead className="p-4 text-left text-sm font-semibold text-gray-600 bg-gray-300 animate-pulse" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, idx) => (
                <TableRow key={idx} className="hover:bg-gray-50 border-b border-gray-200 animate-pulse">
                  <TableCell className="p-4 bg-gray-200" />
                  <TableCell className="p-4 bg-gray-200" />
                  <TableCell className="p-4 bg-gray-200" />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-screen p-4 sm:p-8 flex flex-col">
      {/* Header with Logo */}
      <div className="flex items-center justify-between mb-6">
        <img src="/hit_logo.png" alt="Logo" className="h-12" />
        <h2 className="text-sm font-bold text-indigo-700">Accommodation List</h2>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <Input
          placeholder="Search by name or registration number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-4 py-3 border-2 border-indigo-500 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg flex-grow">
        <Table className="w-full text-sm">
          <TableHeader>
            <TableRow className="bg-indigo-100">
              <TableHead className="p-4 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                Name
              </TableHead>
              <TableHead className="p-4 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                Reg Number
              </TableHead>
              <TableHead className="p-4 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                Gender
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.regNumber} className="hover:bg-indigo-50 border-b border-gray-200">
                <TableCell className="p-4 whitespace-nowrap">{student.name}</TableCell>
                <TableCell className="p-4 whitespace-nowrap">{student.regNumber}</TableCell>
                <TableCell className="p-4 whitespace-nowrap">{student.gender}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default PublishedStudents

