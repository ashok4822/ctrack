import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KPICard } from '@/components/common/KPICard';
import { DataTable, Column } from '@/components/common/DataTable';
import { operatorNavItems } from '@/config/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Receipt,
  DollarSign,
  Clock,
  CheckCircle,
  FileText,
  Printer,
} from 'lucide-react';
import { dummyBills } from '@/data/dummyData';
import type { Bill } from '@/types';
import { useState } from 'react';

export default function OperatorBilling() {
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  const pendingBills = dummyBills.filter(b => b.status === 'pending');
  const paidBills = dummyBills.filter(b => b.status === 'paid');
  const overdueBills = dummyBills.filter(b => b.status === 'overdue');

  const totalPending = pendingBills.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalCollected = paidBills.reduce((sum, b) => sum + b.totalAmount, 0);

  const columns: Column<Bill>[] = [
    { key: 'billNumber', header: 'Bill No.', sortable: true },
    { key: 'containerNumber', header: 'Container', sortable: true },
    { key: 'shippingLine', header: 'Shipping Line' },
    { key: 'customer', header: 'Customer' },
    {
      key: 'totalAmount',
      header: 'Amount',
      render: (item) => (
        <span className="font-medium">₹{item.totalAmount.toLocaleString()}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: (item) => new Date(item.dueDate).toLocaleDateString(),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" onClick={() => setSelectedBill(item)}>
              View
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Bill Details</DialogTitle>
              <DialogDescription>{item.billNumber}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Bill Number</p>
                  <p className="font-bold text-lg">{item.billNumber}</p>
                </div>
                <StatusBadge status={item.status} />
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Container</Label>
                  <p className="font-medium">{item.containerNumber}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Shipping Line</Label>
                  <p className="font-medium">{item.shippingLine}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Customer</Label>
                  <p className="font-medium">{item.customer || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Due Date</Label>
                  <p className="font-medium">{new Date(item.dueDate).toLocaleDateString()}</p>
                </div>
              </div>
              <Separator />
              <div>
                <Label className="text-muted-foreground mb-2 block">Activities</Label>
                <div className="space-y-2">
                  {item.activities.map((activity) => (
                    <div key={activity.id} className="flex justify-between items-center text-sm">
                      <span>{activity.name}</span>
                      <span className="text-muted-foreground">
                        {activity.quantity} × ₹{activity.unitPrice} = ₹{activity.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Amount</span>
                <span className="text-xl font-bold">₹{item.totalAmount.toLocaleString()}</span>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              {item.status === 'pending' && (
                <Button>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark as Paid
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ),
    },
  ];

  return (
    <DashboardLayout navItems={operatorNavItems} pageTitle="Billing">
      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Bills"
          value={dummyBills.length}
          icon={Receipt}
        />
        <KPICard
          title="Pending Amount"
          value={`₹${totalPending.toLocaleString()}`}
          icon={Clock}
          variant="warning"
        />
        <KPICard
          title="Collected Today"
          value={`₹${totalCollected.toLocaleString()}`}
          icon={DollarSign}
          variant="success"
        />
        <KPICard
          title="Overdue Bills"
          value={overdueBills.length}
          icon={Receipt}
          variant="danger"
        />
      </div>

      {/* Bills Table */}
      <Card>
        <CardHeader>
          <CardTitle>Bills</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All ({dummyBills.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingBills.length})</TabsTrigger>
              <TabsTrigger value="paid">Paid ({paidBills.length})</TabsTrigger>
              <TabsTrigger value="overdue">Overdue ({overdueBills.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <DataTable
                data={dummyBills}
                columns={columns}
                searchable
                searchPlaceholder="Search bills..."
              />
            </TabsContent>
            <TabsContent value="pending">
              <DataTable data={pendingBills} columns={columns} searchable />
            </TabsContent>
            <TabsContent value="paid">
              <DataTable data={paidBills} columns={columns} searchable />
            </TabsContent>
            <TabsContent value="overdue">
              <DataTable
                data={overdueBills}
                columns={columns}
                searchable
                emptyMessage="No overdue bills"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
