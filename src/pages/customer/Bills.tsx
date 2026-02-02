import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { customerNavItems } from '@/config/navigation';
import { DataTable, Column } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { KPICard } from '@/components/common/KPICard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';
import { Receipt, Clock, CheckCircle, AlertCircle, Eye, CreditCard, Container } from 'lucide-react';
import { dummyBills } from '@/data/dummyData';
import type { Bill } from '@/types';

export default function CustomerBills() {
  const navigate = useNavigate();
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  
  // Filter bills for this customer
  const customerBills = dummyBills.filter(b => b.customer === 'ABC Manufacturing' || b.customer);

  const pendingBills = customerBills.filter(b => b.status === 'pending');
  const paidBills = customerBills.filter(b => b.status === 'paid');
  const overdueBills = customerBills.filter(b => b.status === 'overdue');
  const totalPending = pendingBills.reduce((sum, b) => sum + b.totalAmount, 0);

  const handlePayBill = (bill: Bill) => {
    navigate(`/customer/payment/${bill.id}`);
  };

  const columns: Column<Bill>[] = [
    {
      key: 'billNumber',
      header: 'Bill No.',
      sortable: true,
      render: (item) => (
        <span className="font-mono font-medium text-primary">{item.billNumber}</span>
      ),
    },
    {
      key: 'containerNumber',
      header: 'Container',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2">
          <Container className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono text-sm">{item.containerNumber}</span>
        </div>
      ),
    },
    {
      key: 'activities',
      header: 'Items',
      render: (item) => (
        <span className="text-sm">{item.activities.length} activities</span>
      ),
    },
    {
      key: 'totalAmount',
      header: 'Amount',
      sortable: true,
      render: (item) => (
        <span className="font-semibold">₹{item.totalAmount.toLocaleString()}</span>
      ),
    },
    {
      key: 'generatedAt',
      header: 'Bill Date',
      sortable: true,
      render: (item) => new Date(item.generatedAt).toLocaleDateString(),
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      sortable: true,
      render: (item) => {
        const isOverdue = new Date(item.dueDate) < new Date() && item.status !== 'paid';
        return (
          <span className={isOverdue ? 'text-destructive font-medium' : ''}>
            {new Date(item.dueDate).toLocaleDateString()}
          </span>
        );
      },
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
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedBill(item);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          {item.status !== 'paid' && (
            <Button
              variant="default"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handlePayBill(item);
              }}
            >
              <CreditCard className="h-4 w-4 mr-1" />
              Pay
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout
      navItems={customerNavItems}
      pageTitle="Bills"
    >
      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Bills"
          value={customerBills.length}
          icon={Receipt}
          variant="primary"
        />
        <KPICard
          title="Pending Payment"
          value={`₹${totalPending.toLocaleString()}`}
          icon={Clock}
          variant="warning"
        />
        <KPICard
          title="Paid"
          value={paidBills.length}
          icon={CheckCircle}
          variant="success"
        />
        <KPICard
          title="Overdue"
          value={overdueBills.length}
          icon={AlertCircle}
          variant="danger"
        />
      </div>

      {/* Bills Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Bills</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Bills</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <DataTable
                data={customerBills}
                columns={columns}
                searchable
                searchPlaceholder="Search bills..."
                onRowClick={setSelectedBill}
                emptyMessage="No bills found"
              />
            </TabsContent>
            
            <TabsContent value="pending">
              <DataTable
                data={pendingBills}
                columns={columns}
                searchable
                searchPlaceholder="Search pending bills..."
                onRowClick={setSelectedBill}
                emptyMessage="No pending bills"
              />
            </TabsContent>
            
            <TabsContent value="paid">
              <DataTable
                data={paidBills}
                columns={columns}
                searchable
                searchPlaceholder="Search paid bills..."
                onRowClick={setSelectedBill}
                emptyMessage="No paid bills"
              />
            </TabsContent>
            
            <TabsContent value="overdue">
              <DataTable
                data={overdueBills}
                columns={columns}
                searchable
                searchPlaceholder="Search overdue bills..."
                onRowClick={setSelectedBill}
                emptyMessage="No overdue bills"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Bill Details Dialog */}
      <Dialog open={!!selectedBill} onOpenChange={() => setSelectedBill(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bill Details</DialogTitle>
          </DialogHeader>
          {selectedBill && (
            <div className="space-y-6">
              {/* Bill Header */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Bill Number</p>
                  <p className="font-mono font-semibold text-lg text-primary">{selectedBill.billNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <StatusBadge status={selectedBill.status} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Container</p>
                  <p className="font-mono font-medium">{selectedBill.containerNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bill Date</p>
                  <p className="font-medium">{new Date(selectedBill.generatedAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p className="font-medium">{new Date(selectedBill.dueDate).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Activities Table */}
              <div>
                <h4 className="font-semibold mb-3">Activity Breakdown</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Activity</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedBill.activities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell>{activity.name}</TableCell>
                        <TableCell className="text-right">{activity.quantity}</TableCell>
                        <TableCell className="text-right">₹{activity.unitPrice.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-medium">₹{activity.amount.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-semibold">Total Amount</TableCell>
                      <TableCell className="text-right font-bold text-lg">₹{selectedBill.totalAmount.toLocaleString()}</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>

              {selectedBill.paidAt && (
                <div className="p-4 bg-success/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">Paid On</p>
                  <p className="font-medium text-success">{new Date(selectedBill.paidAt).toLocaleString()}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedBill(null)}>
              Close
            </Button>
            {selectedBill && selectedBill.status !== 'paid' && (
              <Button onClick={() => {
                setSelectedBill(null);
                handlePayBill(selectedBill);
              }}>
                <CreditCard className="h-4 w-4 mr-2" />
                Pay Now
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
