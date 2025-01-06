import React from "react";
import StudentProfileForm from "../components/student-profile";

const ProfilePage = () => {
  // In a real application, you'd fetch this data from an API or database
  const profile = {
    id: "1",
    name: "John Doe",
    email: "h230513c@hit.ac.zw",
    phone: "",
    regNumber: "",
  };

  return (
    <div className="container mx-auto py-8">
      <StudentProfileForm profile={profile} />
    </div>
  );
};

export default ProfilePage;

