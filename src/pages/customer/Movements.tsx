import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { customerNavItems } from '@/config/navigation';
import { DataTable, Column } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { KPICard } from '@/components/common/KPICard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { Truck, ArrowDownToLine, ArrowUpFromLine, Clock, Plus, Container } from 'lucide-react';
import { dummyGateOperations, dummyContainers } from '@/data/dummyData';
import { toast } from '@/hooks/use-toast';
import type { GateOperation } from '@/types';

export default function CustomerMovements() {
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [formData, setFormData] = useState({
    containerId: '',
    vehicleNumber: '',
    driverName: '',
    driverPhone: '',
    purpose: '',
    preferredDate: '',
    remarks: '',
  });

  // Filter containers for this customer
  const myContainers = dummyContainers.filter(c => c.customer === 'ABC Manufacturing');
  
  // Filter movements for customer's containers
  const customerMovements = dummyGateOperations;
  
  const gateIns = customerMovements.filter(m => m.type === 'gate-in').length;
  const gateOuts = customerMovements.filter(m => m.type === 'gate-out').length;
  const pending = customerMovements.filter(m => m.status === 'pending').length;

  const handleSubmitRequest = () => {
    if (!formData.containerId || !formData.vehicleNumber || !formData.driverName || !formData.purpose) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Movement Request Submitted',
      description: 'Your gate-out request has been submitted for approval',
    });
    setShowRequestDialog(false);
    setFormData({
      containerId: '',
      vehicleNumber: '',
      driverName: '',
      driverPhone: '',
      purpose: '',
      preferredDate: '',
      remarks: '',
    });
  };

  const columns: Column<GateOperation>[] = [
    {
      key: 'containerNumber',
      header: 'Container No.',
      sortable: true,
      render: (item) => (
        <span className="font-mono font-medium text-foreground">{item.containerNumber}</span>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2">
          {item.type === 'gate-in' ? (
            <ArrowDownToLine className="h-4 w-4 text-success" />
          ) : (
            <ArrowUpFromLine className="h-4 w-4 text-primary" />
          )}
          <span className="capitalize font-medium">{item.type}</span>
        </div>
      ),
    },
    {
      key: 'vehicleNumber',
      header: 'Vehicle',
      sortable: true,
    },
    {
      key: 'driverName',
      header: 'Driver',
      sortable: true,
    },
    {
      key: 'purpose',
      header: 'Purpose',
      sortable: true,
      render: (item) => <span className="capitalize">{item.purpose}</span>,
    },
    {
      key: 'timestamp',
      header: 'Date/Time',
      sortable: true,
      render: (item) => new Date(item.timestamp).toLocaleString(),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (item) => <StatusBadge status={item.status} />,
    },
  ];

  return (
    <DashboardLayout 
      navItems={customerNavItems} 
      pageTitle="Movements"
      pageActions={
        <Button onClick={() => setShowRequestDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Request Movement
        </Button>
      }
    >
      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Movements"
          value={customerMovements.length}
          icon={Truck}
          variant="primary"
        />
        <KPICard
          title="Gate In"
          value={gateIns}
          icon={ArrowDownToLine}
          variant="success"
        />
        <KPICard
          title="Gate Out"
          value={gateOuts}
          icon={ArrowUpFromLine}
        />
        <KPICard
          title="Pending"
          value={pending}
          icon={Clock}
          variant="warning"
        />
      </div>

      {/* Movements Table */}
      <Card>
        <CardHeader>
          <CardTitle>Movement History</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Movements</TabsTrigger>
              <TabsTrigger value="gate-in">Gate In</TabsTrigger>
              <TabsTrigger value="gate-out">Gate Out</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <DataTable
                data={customerMovements}
                columns={columns}
                searchable
                searchPlaceholder="Search movements..."
                emptyMessage="No movements found"
              />
            </TabsContent>
            
            <TabsContent value="gate-in">
              <DataTable
                data={customerMovements.filter(m => m.type === 'gate-in')}
                columns={columns}
                searchable
                searchPlaceholder="Search gate-in movements..."
                emptyMessage="No gate-in movements found"
              />
            </TabsContent>
            
            <TabsContent value="gate-out">
              <DataTable
                data={customerMovements.filter(m => m.type === 'gate-out')}
                columns={columns}
                searchable
                searchPlaceholder="Search gate-out movements..."
                emptyMessage="No gate-out movements found"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Request Movement Dialog */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Request Gate-Out Movement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Container *</Label>
              <Select
                value={formData.containerId || '_none'}
                onValueChange={(value) => setFormData(prev => ({ ...prev, containerId: value === '_none' ? '' : value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select container" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">Select container</SelectItem>
                  {myContainers.filter(c => c.status === 'in-yard').map((container) => (
                    <SelectItem key={container.id} value={container.id}>
                      <div className="flex items-center gap-2">
                        <Container className="h-4 w-4" />
                        {container.containerNumber} ({container.size})
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Vehicle Number *</Label>
                <Input
                  placeholder="e.g., TN-01-AB-1234"
                  value={formData.vehicleNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, vehicleNumber: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Driver Name *</Label>
                <Input
                  placeholder="Driver's full name"
                  value={formData.driverName}
                  onChange={(e) => setFormData(prev => ({ ...prev, driverName: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Driver Phone</Label>
                <Input
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.driverPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, driverPhone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Purpose *</Label>
                <Select
                  value={formData.purpose || '_none'}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, purpose: value === '_none' ? '' : value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_none">Select purpose</SelectItem>
                    <SelectItem value="port">Port Delivery</SelectItem>
                    <SelectItem value="factory">Factory Delivery</SelectItem>
                    <SelectItem value="transfer">Terminal Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Preferred Date & Time</Label>
              <Input
                type="datetime-local"
                value={formData.preferredDate}
                onChange={(e) => setFormData(prev => ({ ...prev, preferredDate: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Remarks</Label>
              <Textarea
                placeholder="Any special instructions or notes..."
                value={formData.remarks}
                onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRequestDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitRequest}>
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
