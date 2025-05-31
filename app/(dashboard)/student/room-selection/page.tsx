'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RoomSelection from '@/components/room-selection';
import { StudentProfile } from '@/components/student-profile';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'react-toastify';
import { LoadingSpinner } from '@/components/loading-spinner';

const RoomSelectionPage: React.FC = () => {
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<any>(null);
  const [fetchAttempted, setFetchAttempted] = useState(false);
  useEffect(() => {
    if (!fetchAttempted) {
      setFetchAttempted(true);
      fetchStudentProfile();
    }
  }, [fetchAttempted]);

  const fetchStudentProfile = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (user && user.email) {
        const emailDomain = user.email.split('@')[1];
        let regNumber = '';
        
        if (emailDomain === 'hit.ac.zw') {
          // For hit.ac.zw emails, use email prefix as registration number
          regNumber = user.email.split('@')[0];
        } else if (emailDomain === 'gmail.com') {
          // For gmail.com emails, query the database to find the registration number
          try {
            const studentsQuery = query(
              collection(db, 'students'),
              where('email', '==', user.email)
            );
            const querySnapshot = await getDocs(studentsQuery);
            
            if (!querySnapshot.empty) {
              regNumber = querySnapshot.docs[0].id;
            } else {
              // User not found in database - don't show toast here, let the UI handle it
              console.log('User not found in database');
              setLoading(false);
              return;
            }
          } catch (queryError) {
            console.error('Error querying student by email:', queryError);
            // Don't show toast here, let the general error handler deal with it
            setLoading(false);
            return;
          }
        } else {
          // Unsupported email domain - don't show toast here, let the UI handle it
          console.log('Unsupported email domain');
          setLoading(false);
          return;
        }
        
        const userDoc = doc(db, 'students', regNumber);
        const applicationDoc = doc(db, 'applications', regNumber);
        
        const [userSnap, applicationSnap] = await Promise.all([
          getDoc(userDoc),
          getDoc(applicationDoc)
        ]);
        
        if (userSnap.exists()) {
          setStudentProfile(userSnap.data() as StudentProfile);
        }
        // Don't show toast if profile doesn't exist - let the UI handle it

        if (applicationSnap.exists()) {
          setApplication(applicationSnap.data());
        }
      }
    } catch (error) {
      console.error('Error fetching student profile:', error);
      // Only show one toast for general errors
      toast.error('Failed to load student data');
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
              <div className="space-y-4">
                <p className="text-gray-600">
                  Go to your profile page and fill in all required information, then return here to select your accommodation.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> If you're using a non-HIT email address, make sure to complete the profile setup process first.
                  </p>
                </div>
                <a 
                  href="/student/profile" 
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Complete Profile
                </a>
              </div>
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
