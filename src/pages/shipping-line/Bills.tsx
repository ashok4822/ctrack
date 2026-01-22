import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { shippingLineNavItems } from '@/config/navigation';
import { DataTable, Column } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KPICard } from '@/components/common/KPICard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Receipt,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  Eye,
  Printer,
  CreditCard,
} from 'lucide-react';
import { dummyBills } from '@/data/dummyData';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Bill } from '@/types';

export default function Bills() {
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const navigate = useNavigate();

  const handlePayNow = (bill: Bill) => {
    navigate('/shipping-line/payment', { state: { bill } });
  };

  // Use dummy bills data
  const myBills = dummyBills;
  
  const totalAmount = myBills.reduce((sum, b) => sum + b.totalAmount, 0);
  const paidAmount = myBills.filter(b => b.status === 'paid').reduce((sum, b) => sum + b.totalAmount, 0);
  const pendingAmount = myBills.filter(b => b.status === 'pending').reduce((sum, b) => sum + b.totalAmount, 0);
  const overdueCount = myBills.filter(b => b.status === 'overdue').length;

  const columns: Column<Bill>[] = [
    {
      key: 'billNumber',
      header: 'Bill No.',
      sortable: true,
      render: (item) => (
        <span className="font-medium text-primary">{item.billNumber}</span>
      ),
    },
    {
      key: 'containerNumber',
      header: 'Container',
      sortable: true,
    },
    {
      key: 'customer',
      header: 'Customer',
      sortable: true,
    },
    {
      key: 'generatedAt',
      header: 'Issue Date',
      sortable: true,
      render: (item) => new Date(item.generatedAt).toLocaleDateString(),
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      sortable: true,
      render: (item) => new Date(item.dueDate).toLocaleDateString(),
    },
    {
      key: 'totalAmount',
      header: 'Amount',
      sortable: true,
      render: (item) => (
        <span className="font-semibold">${item.totalAmount.toLocaleString()}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setSelectedBill(item)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout navItems={shippingLineNavItems} pageTitle="Bills & Invoices">
      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Billed"
          value={`$${totalAmount.toLocaleString()}`}
          icon={DollarSign}
          variant="primary"
        />
        <KPICard
          title="Paid"
          value={`$${paidAmount.toLocaleString()}`}
          icon={CheckCircle}
          variant="success"
        />
        <KPICard
          title="Pending"
          value={`$${pendingAmount.toLocaleString()}`}
          icon={Clock}
          variant="warning"
        />
        <KPICard
          title="Overdue"
          value={overdueCount}
          icon={AlertTriangle}
          variant="danger"
        />
      </div>

      {/* Summary Card */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Account Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-2xl font-bold text-foreground">${pendingAmount.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Last Payment</p>
              <p className="text-2xl font-bold text-foreground">$2,500</p>
              <p className="text-xs text-muted-foreground">Jan 15, 2024</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Credit Limit</p>
              <p className="text-2xl font-bold text-foreground">$50,000</p>
              <p className="text-xs text-muted-foreground">Available: $42,500</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bills Table */}
      <Tabs defaultValue="all">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all">All ({myBills.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="overdue">Overdue ({overdueCount})</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => {
              const pendingBill = myBills.find(b => b.status === 'pending' || b.status === 'overdue');
              if (pendingBill) handlePayNow(pendingBill);
            }}>
              <CreditCard className="h-4 w-4 mr-2" />
              Pay Now
            </Button>
          </div>
        </div>

        <TabsContent value="all">
          <DataTable
            data={myBills}
            columns={columns}
            searchable
            searchPlaceholder="Search bills..."
            onRowClick={setSelectedBill}
          />
        </TabsContent>
        <TabsContent value="pending">
          <DataTable
            data={myBills.filter(b => b.status === 'pending')}
            columns={columns}
            searchable
          />
        </TabsContent>
        <TabsContent value="paid">
          <DataTable
            data={myBills.filter(b => b.status === 'paid')}
            columns={columns}
            searchable
          />
        </TabsContent>
        <TabsContent value="overdue">
          <DataTable
            data={myBills.filter(b => b.status === 'overdue')}
            columns={columns}
            searchable
          />
        </TabsContent>
      </Tabs>

      {/* Bill Details Dialog */}
      <Dialog open={!!selectedBill} onOpenChange={() => setSelectedBill(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Bill Details - {selectedBill?.billNumber}
              </span>
              <StatusBadge status={selectedBill?.status || 'pending'} />
            </DialogTitle>
          </DialogHeader>
          {selectedBill && (
            <div className="space-y-6">
              {/* Bill Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Container</p>
                  <p className="font-medium">{selectedBill.containerNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Customer</p>
                  <p className="font-medium">{selectedBill.customer || selectedBill.shippingLine}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Issue Date</p>
                  <p className="font-medium">{new Date(selectedBill.generatedAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Due Date</p>
                  <p className="font-medium">{new Date(selectedBill.dueDate).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Activities */}
              <div>
                <h4 className="font-medium mb-3">Billable Activities</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Activity</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedBill.activities?.map((activity, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{activity.name}</TableCell>
                        <TableCell className="text-muted-foreground">Qty: {activity.quantity}</TableCell>
                        <TableCell className="text-right">${activity.amount.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50">
                      <TableCell colSpan={2} className="font-semibold">Total</TableCell>
                      <TableCell className="text-right font-bold">${selectedBill.totalAmount.toLocaleString()}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-end">
                <Button variant="outline">
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                {selectedBill.status !== 'paid' && (
                  <Button onClick={() => handlePayNow(selectedBill)}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay Now
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
