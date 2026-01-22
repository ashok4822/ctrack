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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Receipt,
  DollarSign,
  Clock,
  CheckCircle,
  FileText,
  Printer,
  Plus,
  Trash2,
} from 'lucide-react';
import { dummyBills, dummyShippingLines, dummyCustomers } from '@/data/dummyData';
import type { Bill } from '@/types';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface MiscLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export default function OperatorBilling() {
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [miscBillOpen, setMiscBillOpen] = useState(false);
  const { toast } = useToast();
  
  // Miscellaneous bill form state
  const [miscForm, setMiscForm] = useState({
    shippingLine: '',
    customer: '',
    containerNumber: '',
    remarks: '',
  });
  const [lineItems, setLineItems] = useState<MiscLineItem[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0, amount: 0 }
  ]);

  const pendingBills = dummyBills.filter(b => b.status === 'pending');
  const paidBills = dummyBills.filter(b => b.status === 'paid');
  const overdueBills = dummyBills.filter(b => b.status === 'overdue');

  const totalPending = pendingBills.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalCollected = paidBills.reduce((sum, b) => sum + b.totalAmount, 0);

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0, amount: 0 }
    ]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id));
    }
  };

  const updateLineItem = (id: string, field: keyof MiscLineItem, value: string | number) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.amount = updated.quantity * updated.unitPrice;
        }
        return updated;
      }
      return item;
    }));
  };

  const getTotalAmount = () => lineItems.reduce((sum, item) => sum + item.amount, 0);

  const handleGenerateMiscBill = () => {
    if (!miscForm.shippingLine) {
      toast({ title: 'Error', description: 'Please select a shipping line', variant: 'destructive' });
      return;
    }
    if (lineItems.some(item => !item.description || item.unitPrice <= 0)) {
      toast({ title: 'Error', description: 'Please fill all line items with valid amounts', variant: 'destructive' });
      return;
    }

    const billNumber = `MISC-${Date.now().toString().slice(-6)}`;
    toast({
      title: 'Miscellaneous Bill Generated',
      description: `Bill ${billNumber} created for ₹${getTotalAmount().toLocaleString()}`,
    });
    
    // Reset form
    setMiscForm({ shippingLine: '', customer: '', containerNumber: '', remarks: '' });
    setLineItems([{ id: '1', description: '', quantity: 1, unitPrice: 0, amount: 0 }]);
    setMiscBillOpen(false);
  };

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

      {/* Action Button */}
      <div className="mb-6 flex justify-end">
        <Dialog open={miscBillOpen} onOpenChange={setMiscBillOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Generate Miscellaneous Bill
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Generate Miscellaneous Bill</DialogTitle>
              <DialogDescription>
                Create a bill for miscellaneous charges not linked to standard activities
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Bill Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Shipping Line *</Label>
                  <Select
                    value={miscForm.shippingLine}
                    onValueChange={(value) => setMiscForm({ ...miscForm, shippingLine: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select shipping line" />
                    </SelectTrigger>
                    <SelectContent>
                      {dummyShippingLines.map((sl) => (
                        <SelectItem key={sl.id} value={sl.name}>{sl.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Customer (Optional)</Label>
                  <Select
                    value={miscForm.customer}
                    onValueChange={(value) => setMiscForm({ ...miscForm, customer: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {dummyCustomers.map((c) => (
                        <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Container Number (Optional)</Label>
                  <Input
                    placeholder="e.g., MSCU1234567"
                    value={miscForm.containerNumber}
                    onChange={(e) => setMiscForm({ ...miscForm, containerNumber: e.target.value })}
                  />
                </div>
              </div>

              <Separator />

              {/* Line Items */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Line Items</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addLineItem}>
                    <Plus className="mr-1 h-3 w-3" />
                    Add Item
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {lineItems.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-5 space-y-1">
                        {index === 0 && <Label className="text-xs text-muted-foreground">Description</Label>}
                        <Input
                          placeholder="Charge description"
                          value={item.description}
                          onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                        />
                      </div>
                      <div className="col-span-2 space-y-1">
                        {index === 0 && <Label className="text-xs text-muted-foreground">Qty</Label>}
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div className="col-span-2 space-y-1">
                        {index === 0 && <Label className="text-xs text-muted-foreground">Unit Price</Label>}
                        <Input
                          type="number"
                          min="0"
                          placeholder="₹0"
                          value={item.unitPrice || ''}
                          onChange={(e) => updateLineItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-2 space-y-1">
                        {index === 0 && <Label className="text-xs text-muted-foreground">Amount</Label>}
                        <div className="h-10 flex items-center px-3 bg-muted rounded-md text-sm font-medium">
                          ₹{item.amount.toLocaleString()}
                        </div>
                      </div>
                      <div className="col-span-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeLineItem(item.id)}
                          disabled={lineItems.length === 1}
                          className="h-10 w-10"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Total */}
              <div className="flex justify-between items-center bg-muted/50 p-4 rounded-lg">
                <span className="font-semibold">Total Amount</span>
                <span className="text-2xl font-bold">₹{getTotalAmount().toLocaleString()}</span>
              </div>

              {/* Remarks */}
              <div className="space-y-2">
                <Label>Remarks (Optional)</Label>
                <Textarea
                  placeholder="Any additional notes or remarks..."
                  value={miscForm.remarks}
                  onChange={(e) => setMiscForm({ ...miscForm, remarks: e.target.value })}
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setMiscBillOpen(false)}>Cancel</Button>
              <Button onClick={handleGenerateMiscBill}>
                <FileText className="mr-2 h-4 w-4" />
                Generate Bill
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
