import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KPICard } from '@/components/common/KPICard';
import { DataTable, Column } from '@/components/common/DataTable';
import { operatorNavItems } from '@/config/navigation';
import { Card, CardContent } from '@/components/ui/card';
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
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Truck,
  Forklift,
  Wrench,
  ClipboardList,
  RefreshCw,
} from 'lucide-react';
import { dummyVehicles, dummyEquipment } from '@/data/dummyData';
import type { Vehicle, Equipment } from '@/types';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function OperatorEquipmentVehicles() {
  const { toast } = useToast();
  const [equipment, setEquipment] = useState(dummyEquipment);
  const [assignTaskOpen, setAssignTaskOpen] = useState(false);
  const [updateStatusOpen, setUpdateStatusOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [taskForm, setTaskForm] = useState({
    taskType: '',
    containerId: '',
    fromLocation: '',
    toLocation: '',
    priority: 'normal',
    notes: '',
  });
  const [statusForm, setStatusForm] = useState({
    status: '',
    notes: '',
  });

  const activeVehicles = dummyVehicles.filter(v => v.status === 'active');
  const activeEquipment = equipment.filter(e => e.status === 'operational');
  const maintenanceEquipment = equipment.filter(e => e.status === 'maintenance');

  const handleAssignTask = () => {
    if (!selectedEquipment || !taskForm.taskType || !taskForm.containerId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Task Assigned",
      description: `Task assigned to ${selectedEquipment.name} for container ${taskForm.containerId}.`,
    });
    setAssignTaskOpen(false);
    setSelectedEquipment(null);
    setTaskForm({
      taskType: '',
      containerId: '',
      fromLocation: '',
      toLocation: '',
      priority: 'normal',
      notes: '',
    });
  };

  const handleUpdateStatus = () => {
    if (!selectedEquipment || !statusForm.status) {
      toast({
        title: "Missing Information",
        description: "Please select a status.",
        variant: "destructive",
      });
      return;
    }

    setEquipment(prev => prev.map(eq => 
      eq.id === selectedEquipment.id 
        ? { ...eq, status: statusForm.status as Equipment['status'] }
        : eq
    ));
    
    toast({
      title: "Status Updated",
      description: `${selectedEquipment.name} status updated to ${statusForm.status}.`,
    });
    setUpdateStatusOpen(false);
    setSelectedEquipment(null);
    setStatusForm({ status: '', notes: '' });
  };

  const openAssignTask = (eq: Equipment) => {
    setSelectedEquipment(eq);
    setAssignTaskOpen(true);
  };

  const openUpdateStatus = (eq: Equipment) => {
    setSelectedEquipment(eq);
    setStatusForm({ status: eq.status, notes: '' });
    setUpdateStatusOpen(true);
  };

  const vehicleColumns: Column<Vehicle>[] = [
    { key: 'vehicleNumber', header: 'Vehicle No.', sortable: true },
    { key: 'type', header: 'Type', render: (item) => <span className="capitalize">{item.type}</span> },
    { key: 'driverName', header: 'Driver' },
    { key: 'driverPhone', header: 'Phone' },
    { key: 'currentLocation', header: 'Location' },
    {
      key: 'status',
      header: 'Status',
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">Details</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Vehicle Details</DialogTitle>
              <DialogDescription>{item.vehicleNumber}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Vehicle Number</Label>
                  <p className="font-medium">{item.vehicleNumber}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Type</Label>
                  <p className="font-medium capitalize">{item.type}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Driver</Label>
                  <p className="font-medium">{item.driverName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Phone</Label>
                  <p className="font-medium">{item.driverPhone}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Current Location</Label>
                  <p className="font-medium">{item.currentLocation || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">GPS Device</Label>
                  <p className="font-medium">{item.gpsDeviceId || 'N/A'}</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ),
    },
  ];

  const equipmentColumns: Column<Equipment>[] = [
    { key: 'name', header: 'Equipment', sortable: true },
    { key: 'type', header: 'Type', render: (item) => <span className="capitalize">{item.type.replace('-', ' ')}</span> },
    { key: 'operator', header: 'Operator' },
    {
      key: 'status',
      header: 'Status',
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: 'lastMaintenance',
      header: 'Last Maintenance',
      render: (item) => item.lastMaintenance ? new Date(item.lastMaintenance).toLocaleDateString() : 'N/A',
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => openAssignTask(item)}>
            <ClipboardList className="h-3 w-3 mr-1" />
            Assign Task
          </Button>
          <Button size="sm" variant="outline" onClick={() => openUpdateStatus(item)}>
            <RefreshCw className="h-3 w-3 mr-1" />
            Update Status
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout navItems={operatorNavItems} pageTitle="Equipment & Vehicles">
      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Active Vehicles"
          value={activeVehicles.length}
          icon={Truck}
          variant="success"
        />
        <KPICard
          title="Total Vehicles"
          value={dummyVehicles.length}
          icon={Truck}
        />
        <KPICard
          title="Operational Equipment"
          value={activeEquipment.length}
          icon={Forklift}
          variant="primary"
        />
        <KPICard
          title="Under Maintenance"
          value={maintenanceEquipment.length}
          icon={Wrench}
          variant="warning"
        />
      </div>

      {/* Tabs for Vehicles and Equipment */}
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="vehicles">
            <TabsList className="mb-4">
              <TabsTrigger value="vehicles">Vehicles ({dummyVehicles.length})</TabsTrigger>
              <TabsTrigger value="equipment">Equipment ({equipment.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="vehicles">
              <DataTable
                data={dummyVehicles}
                columns={vehicleColumns}
                searchPlaceholder="Search vehicles..."
              />
            </TabsContent>
            <TabsContent value="equipment">
              <DataTable
                data={equipment}
                columns={equipmentColumns}
                searchPlaceholder="Search equipment..."
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Assign Task Dialog */}
      <Dialog open={assignTaskOpen} onOpenChange={setAssignTaskOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Task to Equipment</DialogTitle>
            <DialogDescription>
              {selectedEquipment?.name} - {selectedEquipment?.type.replace('-', ' ')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Task Type *</Label>
              <Select value={taskForm.taskType} onValueChange={(v) => setTaskForm(prev => ({ ...prev, taskType: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select task type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lift">Lift Container</SelectItem>
                  <SelectItem value="move">Move Container</SelectItem>
                  <SelectItem value="stack">Stack Container</SelectItem>
                  <SelectItem value="load">Load to Truck</SelectItem>
                  <SelectItem value="unload">Unload from Truck</SelectItem>
                  <SelectItem value="stuffing">Stuffing Support</SelectItem>
                  <SelectItem value="destuffing">Destuffing Support</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Container ID *</Label>
              <Input 
                placeholder="e.g., MSKU1234567"
                value={taskForm.containerId}
                onChange={(e) => setTaskForm(prev => ({ ...prev, containerId: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>From Location</Label>
                <Input 
                  placeholder="e.g., A-01-02-3"
                  value={taskForm.fromLocation}
                  onChange={(e) => setTaskForm(prev => ({ ...prev, fromLocation: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>To Location</Label>
                <Input 
                  placeholder="e.g., B-02-05-1"
                  value={taskForm.toLocation}
                  onChange={(e) => setTaskForm(prev => ({ ...prev, toLocation: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={taskForm.priority} onValueChange={(v) => setTaskForm(prev => ({ ...prev, priority: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea 
                placeholder="Additional instructions..."
                value={taskForm.notes}
                onChange={(e) => setTaskForm(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignTaskOpen(false)}>Cancel</Button>
            <Button onClick={handleAssignTask}>Assign Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={updateStatusOpen} onOpenChange={setUpdateStatusOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Equipment Status</DialogTitle>
            <DialogDescription>
              {selectedEquipment?.name} - Current: <span className="capitalize">{selectedEquipment?.status}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>New Status *</Label>
              <Select value={statusForm.status} onValueChange={(v) => setStatusForm(prev => ({ ...prev, status: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="in-use">In Use</SelectItem>
                  <SelectItem value="maintenance">Under Maintenance</SelectItem>
                  <SelectItem value="idle">Idle</SelectItem>
                  <SelectItem value="breakdown">Breakdown</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea 
                placeholder="Reason for status change..."
                value={statusForm.notes}
                onChange={(e) => setStatusForm(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateStatusOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateStatus}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
