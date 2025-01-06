import StudentApplicationForm from "@/components/student-application";
import React from "react";

const page = () => {
  const profile = {
    id: "1",
    name: "John Doe",
    email: "h230513c@hit.ac.zw",
    phone: "",
    regNumber: "",
  };
  return <StudentApplicationForm profile={profile} />;
};

export default page;
