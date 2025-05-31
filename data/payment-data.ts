import { db } from "@/lib/firebase";
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  addDoc,
  Timestamp
} from "firebase/firestore";
import { Payment, RoomAllocation } from "@/types/hostel";
import { updatePaymentStatus } from "./hostel-data";

/**
 * Submit a new payment by student
 */
export const submitPayment = async (payment: Omit<Payment, 'id' | 'submittedAt' | 'status'>): Promise<string> => {
  try {
    const paymentData = {
      ...payment,
      submittedAt: new Date().toISOString(),
      status: 'Pending' as const
    };

    const paymentsCollection = collection(db, "payments");
    const docRef = await addDoc(paymentsCollection, paymentData);
    
    return docRef.id;
  } catch (error) {
    console.error("Error submitting payment:", error);
    throw error;
  }
};

/**
 * Update payment by student (for editing receipt number or details)
 */
export const updateStudentPayment = async (
  paymentId: string, 
  updates: Partial<Pick<Payment, 'receiptNumber' | 'paymentMethod' | 'notes' | 'attachments'>>
): Promise<void> => {
  try {
    const paymentDoc = doc(db, "payments", paymentId);
    await updateDoc(paymentDoc, updates);
  } catch (error) {
    console.error("Error updating payment:", error);
    throw error;
  }
};

/**
 * Fetch payments for a specific student
 */
export const fetchStudentPayments = async (studentRegNumber: string): Promise<Payment[]> => {  try {
    const paymentsCollection = collection(db, "payments");
    const q = query(
      paymentsCollection, 
      where("studentRegNumber", "==", studentRegNumber)
    );
    const paymentsSnap = await getDocs(q);
    
    // Sort manually in JavaScript to avoid composite index requirement
    const payments = paymentsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Payment[];
    
    return payments.sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  } catch (error) {
    console.error("Error fetching student payments:", error);
    return [];
  }
};

/**
 * Fetch all payments (admin function)
 */
export const fetchAllPayments = async (): Promise<Payment[]> => {
  try {
    const paymentsCollection = collection(db, "payments");
    const q = query(paymentsCollection, orderBy("submittedAt", "desc"));
    const paymentsSnap = await getDocs(q);
    
    return paymentsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Payment[];
  } catch (error) {
    console.error("Error fetching all payments:", error);
    return [];
  }
};

/**
 * Fetch pending payments (admin function)
 */
export const fetchPendingPayments = async (): Promise<Payment[]> => {
  try {
    const paymentsCollection = collection(db, "payments");
    const q = query(
      paymentsCollection, 
      where("status", "==", "Pending")
    );
    const paymentsSnap = await getDocs(q);
    
    // Sort manually in JavaScript to avoid composite index requirement
    const payments = paymentsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Payment[];
    
    return payments.sort((a, b) => 
      new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
    );
  } catch (error) {
    console.error("Error fetching pending payments:", error);
    return [];
  }
};

/**
 * Approve payment (admin function)
 */
export const approvePayment = async (
  paymentId: string, 
  adminEmail: string
): Promise<void> => {
  try {
    const paymentDoc = doc(db, "payments", paymentId);
    const paymentSnap = await getDoc(paymentDoc);
    
    if (!paymentSnap.exists()) {
      throw new Error("Payment not found");
    }
    
    const payment = paymentSnap.data() as Payment;
    
    // Update payment status
    await updateDoc(paymentDoc, {
      status: 'Approved',
      approvedBy: adminEmail,
      approvedAt: new Date().toISOString()
    });
    
    // Update room allocation payment status
    await updatePaymentStatus(payment.allocationId, 'Paid');
    
    // Update allocation with payment reference
    const allocationDoc = doc(db, "roomAllocations", payment.allocationId);
    await updateDoc(allocationDoc, {
      paymentId: paymentId
    });
    
  } catch (error) {
    console.error("Error approving payment:", error);
    throw error;
  }
};

/**
 * Reject payment (admin function)
 */
export const rejectPayment = async (
  paymentId: string, 
  adminEmail: string, 
  rejectionReason: string
): Promise<void> => {
  try {
    const paymentDoc = doc(db, "payments", paymentId);
    await updateDoc(paymentDoc, {
      status: 'Rejected',
      approvedBy: adminEmail,
      approvedAt: new Date().toISOString(),
      rejectionReason
    });
  } catch (error) {
    console.error("Error rejecting payment:", error);
    throw error;
  }
};

/**
 * Get payment details by ID
 */
export const fetchPaymentById = async (paymentId: string): Promise<Payment | null> => {
  try {
    const paymentDoc = doc(db, "payments", paymentId);
    const paymentSnap = await getDoc(paymentDoc);
    
    if (paymentSnap.exists()) {
      return {
        id: paymentSnap.id,
        ...paymentSnap.data()
      } as Payment;
    }
    return null;
  } catch (error) {
    console.error("Error fetching payment:", error);
    return null;
  }
};

/**
 * Add admin payment (admin function to add payment on behalf of student)
 */
export const addAdminPayment = async (
  payment: Omit<Payment, 'id' | 'submittedAt' | 'status' | 'approvedBy' | 'approvedAt'>,
  adminEmail: string
): Promise<string> => {
  try {
    const paymentData = {
      ...payment,
      submittedAt: new Date().toISOString(),
      status: 'Approved' as const,
      approvedBy: adminEmail,
      approvedAt: new Date().toISOString()
    };

    const paymentsCollection = collection(db, "payments");
    const docRef = await addDoc(paymentsCollection, paymentData);
    
    // Update room allocation payment status
    await updatePaymentStatus(payment.allocationId, 'Paid');
    
    // Update allocation with payment reference
    const allocationDoc = doc(db, "roomAllocations", payment.allocationId);
    await updateDoc(allocationDoc, {
      paymentId: docRef.id
    });
    
    return docRef.id;
  } catch (error) {
    console.error("Error adding admin payment:", error);
    throw error;
  }
};

/**
 * Get payment for allocation
 */
export const fetchPaymentForAllocation = async (allocationId: string): Promise<Payment | null> => {
  try {
    const paymentsCollection = collection(db, "payments");
    const q = query(
      paymentsCollection, 
      where("allocationId", "==", allocationId),
      where("status", "==", "Approved")
    );
    const paymentsSnap = await getDocs(q);
    
    if (!paymentsSnap.empty) {
      const paymentDoc = paymentsSnap.docs[0];
      return {
        id: paymentDoc.id,
        ...paymentDoc.data()
      } as Payment;
    }
    return null;
  } catch (error) {
    console.error("Error fetching payment for allocation:", error);
    return null;
  }
};

/**
 * Delete payment (admin function)
 */
export const deletePayment = async (paymentId: string): Promise<void> => {
  try {
    const paymentDoc = doc(db, "payments", paymentId);
    await deleteDoc(paymentDoc);
  } catch (error) {
    console.error("Error deleting payment:", error);
    throw error;
  }
};
