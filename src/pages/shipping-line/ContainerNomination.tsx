import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { shippingLineNavItems } from '@/config/navigation';
import { DataTable, Column } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KPICard } from '@/components/common/KPICard';
import { Container, Plus, CheckCircle, Clock, XCircle, FileText, Calendar } from 'lucide-react';
import { dummyNominations } from '@/data/dummyData';
import { useState } from 'react';

interface Nomination {
  id: string;
  containerNumber: string;
  size: string;
  type: string;
  customer: string;
  purpose: 'export' | 'import' | 'storage';
  requestedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

const mockNominations: Nomination[] = [
  { id: '1', containerNumber: 'MAEU1234567', size: '40ft', type: 'Dry', customer: 'ABC Logistics', purpose: 'export', requestedDate: '2024-01-20', status: 'approved' },
  { id: '2', containerNumber: 'MAEU2345678', size: '20ft', type: 'Reefer', customer: 'XYZ Trading', purpose: 'import', requestedDate: '2024-01-21', status: 'pending' },
  { id: '3', containerNumber: 'MAEU3456789', size: '40ft HC', type: 'Dry', customer: 'Global Freight', purpose: 'storage', requestedDate: '2024-01-19', status: 'approved' },
  { id: '4', containerNumber: 'MAEU4567890', size: '20ft', type: 'Dry', customer: 'Quick Ship Co.', purpose: 'export', requestedDate: '2024-01-22', status: 'rejected', notes: 'Container not available' },
  { id: '5', containerNumber: 'MAEU5678901', size: '40ft', type: 'Tank', customer: 'Chem Transport', purpose: 'import', requestedDate: '2024-01-23', status: 'pending' },
];

export default function ContainerNomination() {
  const [nominations, setNominations] = useState<Nomination[]>(mockNominations);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newNomination, setNewNomination] = useState<{
    containerNumber: string;
    size: string;
    type: string;
    customer: string;
    purpose: 'export' | 'import' | 'storage';
    requestedDate: string;
    notes: string;
  }>({
    containerNumber: '',
    size: '20ft',
    type: 'Dry',
    customer: '',
    purpose: 'export',
    requestedDate: '',
    notes: '',
  });

  const pendingCount = nominations.filter(n => n.status === 'pending').length;
  const approvedCount = nominations.filter(n => n.status === 'approved').length;
  const rejectedCount = nominations.filter(n => n.status === 'rejected').length;

  const handleSubmit = () => {
    const nomination: Nomination = {
      id: Date.now().toString(),
      ...newNomination,
      status: 'pending',
    };
    setNominations([nomination, ...nominations]);
    setIsDialogOpen(false);
    setNewNomination({
      containerNumber: '',
      size: '20ft',
      type: 'Dry',
      customer: '',
      purpose: 'export',
      requestedDate: '',
      notes: '',
    });
  };

  const columns: Column<Nomination>[] = [
    {
      key: 'containerNumber',
      header: 'Container No.',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2">
          <Container className="h-4 w-4 text-primary" />
          <span className="font-medium">{item.containerNumber}</span>
        </div>
      ),
    },
    { key: 'size', header: 'Size', sortable: true },
    { key: 'type', header: 'Type', sortable: true },
    { key: 'customer', header: 'Customer', sortable: true },
    {
      key: 'purpose',
      header: 'Purpose',
      render: (item) => (
        <span className="capitalize">{item.purpose}</span>
      ),
    },
    {
      key: 'requestedDate',
      header: 'Requested Date',
      sortable: true,
      render: (item) => new Date(item.requestedDate).toLocaleDateString(),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (item) => <StatusBadge status={item.status} />,
    },
  ];

  return (
    <DashboardLayout navItems={shippingLineNavItems} pageTitle="Container Nomination">
      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Nominations"
          value={nominations.length}
          icon={FileText}
          variant="primary"
        />
        <KPICard
          title="Pending"
          value={pendingCount}
          icon={Clock}
          variant="warning"
        />
        <KPICard
          title="Approved"
          value={approvedCount}
          icon={CheckCircle}
          variant="success"
        />
        <KPICard
          title="Rejected"
          value={rejectedCount}
          icon={XCircle}
          variant="danger"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All ({nominations.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({approvedCount})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({rejectedCount})</TabsTrigger>
          </TabsList>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Nomination
          </Button>
        </div>

        <TabsContent value="all">
          <DataTable
            data={nominations}
            columns={columns}
            searchable
            searchPlaceholder="Search nominations..."
          />
        </TabsContent>
        <TabsContent value="pending">
          <DataTable
            data={nominations.filter(n => n.status === 'pending')}
            columns={columns}
            searchable
            searchPlaceholder="Search pending nominations..."
          />
        </TabsContent>
        <TabsContent value="approved">
          <DataTable
            data={nominations.filter(n => n.status === 'approved')}
            columns={columns}
            searchable
            searchPlaceholder="Search approved nominations..."
          />
        </TabsContent>
        <TabsContent value="rejected">
          <DataTable
            data={nominations.filter(n => n.status === 'rejected')}
            columns={columns}
            searchable
            searchPlaceholder="Search rejected nominations..."
          />
        </TabsContent>
      </Tabs>

      {/* New Nomination Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New Container Nomination</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Container Number</Label>
              <Input
                placeholder="e.g., MAEU1234567"
                value={newNomination.containerNumber}
                onChange={(e) => setNewNomination({ ...newNomination, containerNumber: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Size</Label>
                <Select
                  value={newNomination.size}
                  onValueChange={(value) => setNewNomination({ ...newNomination, size: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20ft">20ft</SelectItem>
                    <SelectItem value="40ft">40ft</SelectItem>
                    <SelectItem value="40ft HC">40ft HC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={newNomination.type}
                  onValueChange={(value) => setNewNomination({ ...newNomination, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dry">Dry</SelectItem>
                    <SelectItem value="Reefer">Reefer</SelectItem>
                    <SelectItem value="Tank">Tank</SelectItem>
                    <SelectItem value="Open Top">Open Top</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Customer</Label>
              <Input
                placeholder="Customer name"
                value={newNomination.customer}
                onChange={(e) => setNewNomination({ ...newNomination, customer: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Purpose</Label>
                <Select
                  value={newNomination.purpose}
                  onValueChange={(value) => setNewNomination({ ...newNomination, purpose: value as 'export' | 'import' | 'storage' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="export">Export</SelectItem>
                    <SelectItem value="import">Import</SelectItem>
                    <SelectItem value="storage">Storage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Requested Date</Label>
                <Input
                  type="date"
                  value={newNomination.requestedDate}
                  onChange={(e) => setNewNomination({ ...newNomination, requestedDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Textarea
                placeholder="Additional notes..."
                value={newNomination.notes}
                onChange={(e) => setNewNomination({ ...newNomination, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Submit Nomination</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
