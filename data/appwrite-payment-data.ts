import { databases } from '@/lib/appwrite';
import { Query, ID, AppwriteException } from 'appwrite';
import type { Payment as BasePayment, RoomAllocation as BaseRoomAllocation } from '@/types/hostel'; // Assuming RoomAllocation might be needed for context
import { updatePaymentStatus as updateAllocationPaymentStatus } from './appwrite-hostel-data'; // Renamed import for clarity

// Environment variables for Appwrite configuration
const APPWRITE_DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'DB_ID_PLACEHOLDER';
const PAYMENTS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_PAYMENTS_COLLECTION_ID || 'PAYMENTS_COLLECTION_ID_PLACEHOLDER';
const ROOM_ALLOCATIONS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_ROOM_ALLOCATIONS_COLLECTION_ID || 'ROOM_ALLOCATIONS_COLLECTION_ID_PLACEHOLDER';

// --- Appwrite-specific Type Definition ---
interface AppwriteDocument {
  $id: string;
  $collectionId: string;
  $databaseId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
}

export type Payment = BasePayment & AppwriteDocument;
// Type for RoomAllocation if needed directly from appwrite-hostel-data, but it's mostly for context
// export type RoomAllocation = BaseRoomAllocation & AppwriteDocument;


// Helper to map Appwrite doc to our Payment type
const mapDocToPayment = (doc: any): Payment => {
    const { $id, $collectionId, $databaseId, $createdAt, $updatedAt, $permissions, ...rest } = doc;
    return {
        ...rest,
        id: $id, // Ensure 'id' field from BasePayment is populated by $id
        $id, $collectionId, $databaseId, $createdAt, $updatedAt, $permissions
    } as Payment;
};


// --- Payment Data Functions ---

export type SubmitPaymentData = Omit<BasePayment, 'id' | 'submittedAt' | 'status' | 'approvedBy' | 'approvedAt' | 'rejectionReason' | '$id' | '$collectionId' | '$databaseId' | '$createdAt' | '$updatedAt' | '$permissions'>;

export const submitPayment = async (paymentDataInput: SubmitPaymentData): Promise<string> => {
  try {
    const paymentPayload = {
      ...paymentDataInput,
      submittedAt: new Date().toISOString(),
      status: 'Pending',
      // attachments should be an array of strings (file IDs or URLs)
      attachments: paymentDataInput.attachments || [],
    };
    const newDoc = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      PAYMENTS_COLLECTION_ID,
      ID.unique(),
      paymentPayload
    );
    return newDoc.$id;
  } catch (error) {
    console.error("Error submitting Appwrite payment:", error);
    throw error;
  }
};

export type UpdateStudentPaymentData = Partial<Pick<BasePayment, 'receiptNumber' | 'paymentMethod' | 'notes' | 'attachments'>>;

export const updateStudentPayment = async (paymentId: string, updates: UpdateStudentPaymentData): Promise<Payment> => {
  try {
    const updatedDoc = await databases.updateDocument(
      APPWRITE_DATABASE_ID,
      PAYMENTS_COLLECTION_ID,
      paymentId,
      updates
    );
    return mapDocToPayment(updatedDoc);
  } catch (error) {
    console.error(`Error updating Appwrite student payment ${paymentId}:`, error);
    throw error;
  }
};

export const fetchStudentPayments = async (studentRegNumber: string): Promise<Payment[]> => {
  try {
    const response = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      PAYMENTS_COLLECTION_ID,
      [Query.equal('studentRegNumber', studentRegNumber), Query.orderDesc('submittedAt')]
    );
    return response.documents.map(mapDocToPayment);
  } catch (error) {
    console.error(`Error fetching Appwrite payments for student ${studentRegNumber}:`, error);
    return [];
  }
};

export const fetchAllPayments = async (): Promise<Payment[]> => {
  try {
    // TODO: Implement pagination for large datasets
    const response = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      PAYMENTS_COLLECTION_ID,
      [Query.orderDesc('submittedAt'), Query.limit(1000)] // Added a limit, consider pagination
    );
    return response.documents.map(mapDocToPayment);
  } catch (error) {
    console.error("Error fetching all Appwrite payments:", error);
    return [];
  }
};

export const fetchPendingPayments = async (): Promise<Payment[]> => {
  try {
    // TODO: Implement pagination for large datasets
    const response = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      PAYMENTS_COLLECTION_ID,
      [Query.equal('status', 'Pending'), Query.orderAsc('submittedAt'), Query.limit(1000)] // Added a limit
    );
    return response.documents.map(mapDocToPayment);
  } catch (error) {
    console.error("Error fetching pending Appwrite payments:", error);
    return [];
  }
};

export const approvePayment = async (paymentId: string, adminEmail: string): Promise<Payment> => {
  try {
    const paymentToApprove = await fetchPaymentById(paymentId); // Use existing function to get full payment object
    if (!paymentToApprove) {
      throw new Error(`Payment with ID ${paymentId} not found.`);
    }
    if (!paymentToApprove.allocationId) {
        throw new Error(`Payment ${paymentId} does not have an associated allocation ID.`);
    }

    const updatedPaymentDoc = await databases.updateDocument(
      APPWRITE_DATABASE_ID,
      PAYMENTS_COLLECTION_ID,
      paymentId,
      { status: 'Approved', approvedBy: adminEmail, approvedAt: new Date().toISOString() }
    );

    // Update RoomAllocation paymentStatus and link paymentId
    await updateAllocationPaymentStatus(paymentToApprove.allocationId, 'Paid');
    await databases.updateDocument(
        APPWRITE_DATABASE_ID,
        ROOM_ALLOCATIONS_COLLECTION_ID,
        paymentToApprove.allocationId,
        { paymentId: paymentId } // Link the payment ID to the allocation
    );

    console.log(`Payment ${paymentId} approved. Allocation ${paymentToApprove.allocationId} status set to Paid and paymentId linked.`);
    return mapDocToPayment(updatedPaymentDoc);
  } catch (error) {
    console.error(`Error approving Appwrite payment ${paymentId}:`, error);
    throw error;
  }
};

export const rejectPayment = async (paymentId: string, adminEmail: string, rejectionReason: string): Promise<Payment> => {
  try {
    const updatedDoc = await databases.updateDocument(
      APPWRITE_DATABASE_ID,
      PAYMENTS_COLLECTION_ID,
      paymentId,
      { status: 'Rejected', approvedBy: adminEmail, approvedAt: new Date().toISOString(), rejectionReason }
    );
     // Optionally, update allocation status to 'Pending' or a specific 'Payment Rejected' status if needed
    const payment = await fetchPaymentById(paymentId);
    if (payment && payment.allocationId) {
        // updateAllocationPaymentStatus(payment.allocationId, 'Pending'); // Or a new status like 'PaymentIssue'
    }
    return mapDocToPayment(updatedDoc);
  } catch (error) {
    console.error(`Error rejecting Appwrite payment ${paymentId}:`, error);
    throw error;
  }
};

export const fetchPaymentById = async (paymentId: string): Promise<Payment | null> => {
  try {
    const doc = await databases.getDocument(APPWRITE_DATABASE_ID, PAYMENTS_COLLECTION_ID, paymentId);
    return mapDocToPayment(doc);
  } catch (error) {
    if (error instanceof AppwriteException && error.code === 404) {
      return null;
    }
    console.error(`Error fetching Appwrite payment by ID ${paymentId}:`, error);
    return null;
  }
};

export type AddAdminPaymentData = Omit<BasePayment, 'id' | 'submittedAt' | 'status' | 'approvedBy' | 'approvedAt' | 'rejectionReason' | '$id' | '$collectionId' | '$databaseId' | '$createdAt' | '$updatedAt' | '$permissions'>;

export const addAdminPayment = async (paymentDataInput: AddAdminPaymentData, adminEmail: string): Promise<string> => {
  try {
    const paymentPayload = {
      ...paymentDataInput,
      submittedAt: new Date().toISOString(),
      status: 'Approved',
      approvedBy: adminEmail,
      approvedAt: new Date().toISOString(),
      attachments: paymentDataInput.attachments || [],
    };
    const newDoc = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      PAYMENTS_COLLECTION_ID,
      ID.unique(),
      paymentPayload
    );
    const newPaymentId = newDoc.$id;

    if (!paymentDataInput.allocationId) {
        throw new Error(`Admin Payment for student ${paymentDataInput.studentRegNumber} is missing an allocation ID.`);
    }

    // Update RoomAllocation paymentStatus to 'Paid' and link paymentId
    await updateAllocationPaymentStatus(paymentDataInput.allocationId, 'Paid');
    await databases.updateDocument(
        APPWRITE_DATABASE_ID,
        ROOM_ALLOCATIONS_COLLECTION_ID,
        paymentDataInput.allocationId,
        { paymentId: newPaymentId }
    );

    console.log(`Admin payment ${newPaymentId} added and approved. Allocation ${paymentDataInput.allocationId} status set to Paid and paymentId linked.`);
    return newPaymentId;
  } catch (error) {
    console.error("Error adding Appwrite admin payment:", error);
    throw error;
  }
};

export const fetchPaymentForAllocation = async (allocationId: string): Promise<Payment | null> => {
  try {
    const response = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      PAYMENTS_COLLECTION_ID,
      [
        Query.equal('allocationId', allocationId),
        Query.equal('status', 'Approved'), // Only fetch approved payments linked to the allocation
        Query.limit(1) // Should only be one approved payment per allocation ideally
      ]
    );
    if (response.documents.length > 0) {
      return mapDocToPayment(response.documents[0]);
    }
    return null;
  } catch (error) {
    console.error(`Error fetching Appwrite payment for allocation ${allocationId}:`, error);
    return null;
  }
};

export const deletePayment = async (paymentId: string): Promise<void> => {
  try {
    // Optional: Before deleting, consider implications.
    // Should it revert allocation status? For now, just delete the payment record.
    // const paymentToDelete = await fetchPaymentById(paymentId);
    // if (paymentToDelete && paymentToDelete.allocationId && paymentToDelete.status === 'Approved') {
    //   // Potentially set allocation status back to 'Pending' or 'Overdue'
    //   // await updateAllocationPaymentStatus(paymentToDelete.allocationId, 'Pending');
    //   // await databases.updateDocument(APPWRITE_DATABASE_ID, ROOM_ALLOCATIONS_COLLECTION_ID, paymentToDelete.allocationId, { paymentId: null }); // Unlink paymentId
    // }
    await databases.deleteDocument(APPWRITE_DATABASE_ID, PAYMENTS_COLLECTION_ID, paymentId);
    console.log(`Payment ${paymentId} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting Appwrite payment ${paymentId}:`, error);
    throw error;
  }
};
