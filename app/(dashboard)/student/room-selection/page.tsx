'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RoomSelection from '@/components/room-selection';
import { StudentProfile } from '@/components/student-profile';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'react-toastify';
import { LoadingSpinner } from '@/components/loading-spinner';

const RoomSelectionPage: React.FC = () => {
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<any>(null);

  useEffect(() => {
    fetchStudentProfile();
  }, []);
  const fetchStudentProfile = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (user) {
        const regNumber = user.email?.split('@')[0] || '';
        const userDoc = doc(db, 'students', regNumber);
        const applicationDoc = doc(db, 'applications', regNumber);
        
        const [userSnap, applicationSnap] = await Promise.all([
          getDoc(userDoc),
          getDoc(applicationDoc)
        ]);
        
        if (userSnap.exists()) {
          setStudentProfile(userSnap.data() as StudentProfile);
        } else {
          toast.error('Please complete your profile before selecting a room');
        }

        if (applicationSnap.exists()) {
          setApplication(applicationSnap.data());
        }
      }
    } catch (error) {
      console.error('Error fetching student profile:', error);
      toast.error('Failed to load student profile');
    } finally {
      setLoading(false);
    }
  };

  const handleRoomSelected = (roomId: string, hostelId: string) => {
    toast.success('Room allocation successful! Check your application status for payment details.');
  };

  if (loading) {
    return <LoadingSpinner />;
  }  if (!studentProfile) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="max-w-2xl w-full mx-auto p-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Required</CardTitle>
              <CardDescription>
                Please complete your student profile before selecting a room.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Go to your profile page and fill in all required information, then return here to select your accommodation.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  if (!application) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="max-w-2xl w-full mx-auto p-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Required</CardTitle>
              <CardDescription>
                Please submit your accommodation application before selecting a room.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                You need to submit an accommodation application first. Once your application is approved, you can proceed with room selection.
              </p>
              <a 
                href="/student/application" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Submit Application
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (application.status !== 'Accepted') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="max-w-2xl w-full mx-auto p-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Pending</CardTitle>
              <CardDescription>
                Your accommodation application is currently being reviewed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Your application status: <span className={`px-2 py-1 rounded text-sm ${
                  application.status === 'Accepted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {application.status}
                </span>
              </p>
              <p className="text-gray-600 mt-2">
                You will be able to select a room once your application is approved.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <RoomSelection 
        onRoomSelected={handleRoomSelected}
        studentProfile={studentProfile}
      />
    </div>
  );
};

export default RoomSelectionPage;
