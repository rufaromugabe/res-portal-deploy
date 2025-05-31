import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAuth } from 'firebase/auth';
import { toast } from 'react-toastify';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Plus, 
  Eye, 
  DollarSign, 
  AlertTriangle,
  FileText,
  Filter
} from 'lucide-react';
import { 
  fetchAllPayments, 
  fetchPendingPayments, 
  approvePayment, 
  rejectPayment,
  addAdminPayment,
  deletePayment
} from '@/data/payment-data';
import { fetchStudentAllocations } from '@/data/hostel-data';
import { Payment, RoomAllocation } from '@/types/hostel';

const AdminPaymentManagement: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [pendingPayments, setPendingPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dialog states
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [addPaymentDialogOpen, setAddPaymentDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  
  // Form states
  const [rejectionReason, setRejectionReason] = useState('');
  const [addPaymentForm, setAddPaymentForm] = useState({
    studentRegNumber: '',
    allocationId: '',
    receiptNumber: '',
    amount: '',
    paymentMethod: 'Bank Transfer' as Payment['paymentMethod'],
    notes: ''
  });

  const auth = getAuth();
  const adminEmail = auth.currentUser?.email || '';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [allPayments, pendingPayments] = await Promise.all([
        fetchAllPayments(),
        fetchPendingPayments()
      ]);
      
      setPayments(allPayments);
      setPendingPayments(pendingPayments);
    } catch (error) {
      toast.error('Failed to load payment data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePayment = async () => {
    if (!selectedPayment) return;

    try {
      await approvePayment(selectedPayment.id, adminEmail);
      toast.success('Payment approved successfully!');
      setApproveDialogOpen(false);
      setSelectedPayment(null);
      loadData();
    } catch (error) {
      toast.error('Failed to approve payment');
    }
  };

  const handleRejectPayment = async () => {
    if (!selectedPayment || !rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      await rejectPayment(selectedPayment.id, adminEmail, rejectionReason);
      toast.success('Payment rejected');
      setRejectDialogOpen(false);
      setSelectedPayment(null);
      setRejectionReason('');
      loadData();
    } catch (error) {
      toast.error('Failed to reject payment');
    }
  };

  const handleAddPayment = async () => {
    if (!addPaymentForm.studentRegNumber || !addPaymentForm.receiptNumber || !addPaymentForm.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // First fetch student allocations to find the right allocation
      const allocations = await fetchStudentAllocations(addPaymentForm.studentRegNumber);
      const unpaidAllocation = allocations.find(a => a.paymentStatus !== 'Paid');
      
      if (!unpaidAllocation) {
        toast.error('No unpaid allocation found for this student');
        return;
      }

      await addAdminPayment({
        studentRegNumber: addPaymentForm.studentRegNumber,
        allocationId: unpaidAllocation.id,
        receiptNumber: addPaymentForm.receiptNumber,
        amount: parseFloat(addPaymentForm.amount),
        paymentMethod: addPaymentForm.paymentMethod,
        notes: addPaymentForm.notes
      }, adminEmail);

      toast.success('Payment added and approved successfully!');
      setAddPaymentDialogOpen(false);
      resetAddPaymentForm();
      loadData();
    } catch (error) {
      toast.error('Failed to add payment');
    }
  };

  const resetAddPaymentForm = () => {
    setAddPaymentForm({
      studentRegNumber: '',
      allocationId: '',
      receiptNumber: '',
      amount: '',
      paymentMethod: 'Bank Transfer',
      notes: ''
    });
  };

  const openApproveDialog = (payment: Payment) => {
    setSelectedPayment(payment);
    setApproveDialogOpen(true);
  };

  const openRejectDialog = (payment: Payment) => {
    setSelectedPayment(payment);
    setRejectDialogOpen(true);
  };

  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'Pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'Approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: Payment['status']) => {
    const variants = {
      'Pending': 'secondary',
      'Approved': 'default',
      'Rejected': 'destructive'
    } as const;

    return (
      <Badge variant={variants[status]} className="flex items-center gap-1">
        {getStatusIcon(status)}
        {status}
      </Badge>
    );
  };

  const filteredPayments = payments.filter(payment => {
    const statusMatch = filterStatus === 'all' || payment.status === filterStatus;
    const searchMatch = searchQuery === '' || 
      payment.studentRegNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && searchMatch;
  });

  const stats = {
    total: payments.length,
    pending: payments.filter(p => p.status === 'Pending').length,
    approved: payments.filter(p => p.status === 'Approved').length,
    rejected: payments.filter(p => p.status === 'Rejected').length,
    totalAmount: payments.filter(p => p.status === 'Approved').reduce((sum, p) => sum + p.amount, 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Payments</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-green-600">${stats.totalAmount}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All Payments</TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({stats.pending})
            </TabsTrigger>
          </TabsList>
          <Dialog open={addPaymentDialogOpen} onOpenChange={setAddPaymentDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Payment
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>

        <TabsContent value="all" className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by student reg number or receipt number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payments Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Receipt Number</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.studentRegNumber}</TableCell>
                      <TableCell>{payment.receiptNumber}</TableCell>
                      <TableCell>${payment.amount}</TableCell>
                      <TableCell>{payment.paymentMethod}</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>{new Date(payment.submittedAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {payment.status === 'Pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openApproveDialog(payment)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openRejectDialog(payment)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pendingPayments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No pending payments</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingPayments.map((payment) => (
                <Card key={payment.id} className="border-yellow-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Student: {payment.studentRegNumber}</span>
                          {getStatusBadge(payment.status)}
                        </div>
                        <p className="text-sm text-gray-600">
                          Receipt: {payment.receiptNumber} | Amount: ${payment.amount}
                        </p>
                        <p className="text-sm text-gray-600">
                          Method: {payment.paymentMethod} | Submitted: {new Date(payment.submittedAt).toLocaleDateString()}
                        </p>
                        {payment.notes && (
                          <p className="text-sm text-gray-600">Notes: {payment.notes}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => openApproveDialog(payment)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openRejectDialog(payment)}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Approve Payment Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Payment</DialogTitle>
            <DialogDescription>
              Confirm approval of this payment receipt
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded">
                <p><strong>Student:</strong> {selectedPayment.studentRegNumber}</p>
                <p><strong>Receipt Number:</strong> {selectedPayment.receiptNumber}</p>
                <p><strong>Amount:</strong> ${selectedPayment.amount}</p>
                <p><strong>Payment Method:</strong> {selectedPayment.paymentMethod}</p>
                {selectedPayment.notes && (
                  <p><strong>Notes:</strong> {selectedPayment.notes}</p>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleApprovePayment} className="bg-green-600 hover:bg-green-700">
                  Approve Payment
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Payment Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Payment</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this payment
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded">
                <p><strong>Student:</strong> {selectedPayment.studentRegNumber}</p>
                <p><strong>Receipt Number:</strong> {selectedPayment.receiptNumber}</p>
                <p><strong>Amount:</strong> ${selectedPayment.amount}</p>
              </div>
              <div>
                <Label htmlFor="rejectionReason">Rejection Reason *</Label>
                <Textarea
                  id="rejectionReason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why this payment is being rejected..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleRejectPayment}
                  disabled={!rejectionReason.trim()}
                >
                  Reject Payment
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Payment Dialog */}
      <Dialog open={addPaymentDialogOpen} onOpenChange={setAddPaymentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Payment</DialogTitle>
            <DialogDescription>
              Add a payment on behalf of a student
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="studentRegNumber">Student Registration Number *</Label>
              <Input
                id="studentRegNumber"
                value={addPaymentForm.studentRegNumber}
                onChange={(e) => setAddPaymentForm({...addPaymentForm, studentRegNumber: e.target.value})}
                placeholder="Enter student reg number"
              />
            </div>
            <div>
              <Label htmlFor="receiptNumber">Receipt Number *</Label>
              <Input
                id="receiptNumber"
                value={addPaymentForm.receiptNumber}
                onChange={(e) => setAddPaymentForm({...addPaymentForm, receiptNumber: e.target.value})}
                placeholder="Enter receipt number"
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                value={addPaymentForm.amount}
                onChange={(e) => setAddPaymentForm({...addPaymentForm, amount: e.target.value})}
                placeholder="Enter payment amount"
              />
            </div>
            <div>
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select
                value={addPaymentForm.paymentMethod}
                onValueChange={(value) => setAddPaymentForm({...addPaymentForm, paymentMethod: value as Payment['paymentMethod']})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={addPaymentForm.notes}
                onChange={(e) => setAddPaymentForm({...addPaymentForm, notes: e.target.value})}
                placeholder="Any additional notes"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setAddPaymentDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPayment}>
                Add Payment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPaymentManagement;
