"use client";
export type Applications = {
  id: number;
  name: string;
  regNumber: string;
  gender: "Male" | "Female";
  programme: string;
  part: number;
  reason: string;
  email: string;
  phone: string;
};



export const mockApplications = [
  {
    id: 1,
    name: "Rutendo Murewa",
    regNumber: "H23001C",
    gender: "Female",
    programme: "Software Engineering",
    part: 3,
    reason: "Need a more stable environment for academic excellence.",
    email: "h23001c@hit.ac.zw",
    phone: "078886740",
  },
  {
    id: 2,
    name: "Ruvimbo Chamisa",
    regNumber: "H23002C",
    gender: "Female",
    programme: "Biotechnology",
    part: 2,
    reason:
      "Final year project requires late-night access to university facilities.",
    email: "h23002c@hit.ac.zw",
    phone: "071335658",
  },
  {
    id: 3,
    name: "Promise Shumba",
    regNumber: "H23003E",
    gender: "Male",
    programme: "Industrial & Manufacturing Engineering",
    part: 3,
    reason: "Want to minimize travel time and maximize study time.",
    email: "h23003e@hit.ac.zw",
    phone: "073636189",
  },
];
