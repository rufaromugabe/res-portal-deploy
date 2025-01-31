import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { setDoc, doc, getFirestore } from "firebase/firestore";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaymentStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: any;
  onUpdate: (updatedStudent: any) => void; // Add this
}

const PAYMENT_STATUSES = [
  "Not Paid",
  "Fully Paid",
  
];

const PaymentStatusModal = ({ isOpen, onClose, student, onUpdate }: PaymentStatusModalProps) => {
  const [paymentStatus, setPaymentStatus] = useState("Not Paid");
  const [reference, setReference] = useState("");

  // Update state when the modal opens with new student data
  useEffect(() => {
    if (isOpen && student) {
      setPaymentStatus(student.paymentStatus || "Not Paid");
      setReference(student.reference || "");
    }
  }, [isOpen, student]);

  const handleSubmit = async () => {
    if (!paymentStatus || !reference) {
      toast.error("Please fill in all fields");
      return;
    }
  
    const db = getFirestore();
    const studentRef = doc(db, "applications", student.regNumber);
  
    try {
      await setDoc(studentRef, { paymentStatus, reference }, { merge: true });
  
      toast.success("Payment status updated successfully!");
  
      // Update the parent component's state
      onUpdate({ ...student, paymentStatus });
  
      onClose();
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Failed to update payment status. Please try again.");
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Update Payment Status</h2>
        
        <div className="mb-4">
          <Select
            value={paymentStatus}
            onValueChange={setPaymentStatus}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select payment status" />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Input
          placeholder="Reference"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          className="mb-4"
        />
        
        <div className="flex justify-end gap-2">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatusModal;