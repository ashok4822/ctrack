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
  LogIn,
  LogOut,
  Send,
} from 'lucide-react';
import { dummyVehicles, dummyEquipment, dummyStuffingOperations } from '@/data/dummyData';
import type { Vehicle, Equipment } from '@/types';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function OperatorEquipmentVehicles() {
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState(dummyVehicles);
  const [equipment, setEquipment] = useState(dummyEquipment);
  const [assignTaskOpen, setAssignTaskOpen] = useState(false);
  const [updateStatusOpen, setUpdateStatusOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);

  // Vehicle Gate In/Out state
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [gateInOpen, setGateInOpen] = useState(false);
  const [gateOutOpen, setGateOutOpen] = useState(false);
  const [gateInForm, setGateInForm] = useState({
    operationType: '',
    containerId: '',
    purpose: 'stuffing',
    remarks: '',
  });
  const [gateOutForm, setGateOutForm] = useState({
    operationType: '',
    containerId: '',
    purpose: 'stuffing',
    remarks: '',
  });

  const [newVehicleGateInOpen, setNewVehicleGateInOpen] = useState(false);
  const [newVehicleForm, setNewVehicleForm] = useState({
    vehicleNumber: '',
    driverName: '',
    driverPhone: '',
    type: 'truck' as Vehicle['type'],
  });

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

  // Request Approval state
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [approvalType, setApprovalType] = useState<'vehicle' | 'equipment'>('vehicle');
  const [approvalItem, setApprovalItem] = useState<Vehicle | Equipment | null>(null);
  const [approvalForm, setApprovalForm] = useState({
    requestType: '',
    priority: 'normal',
    reason: '',
    remarks: '',
  });

  const activeVehicles = vehicles.filter(v => v.status === 'active');
  const activeEquipment = equipment.filter(e => e.status === 'operational');
  const maintenanceEquipment = equipment.filter(e => e.status === 'maintenance');

  // Pending stuffing/destuffing operations at terminal
  const pendingTerminalOps = dummyStuffingOperations.filter(
    op => op.location === 'terminal' && (op.status === 'pending' || op.status === 'in-progress')
  );

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

  const openGateIn = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setGateInForm({ operationType: '', containerId: '', purpose: 'stuffing', remarks: '' });
    setGateInOpen(true);
  };

  const openGateOut = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setGateOutForm({ operationType: '', containerId: '', purpose: 'stuffing', remarks: '' });
    setGateOutOpen(true);
  };

  const openApprovalDialog = (item: Vehicle | Equipment, type: 'vehicle' | 'equipment') => {
    setApprovalItem(item);
    setApprovalType(type);
    setApprovalForm({ requestType: '', priority: 'normal', reason: '', remarks: '' });
    setApprovalDialogOpen(true);
  };

  const handleRequestApproval = () => {
    if (!approvalItem || !approvalForm.requestType || !approvalForm.reason) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const itemName = approvalType === 'vehicle'
      ? (approvalItem as Vehicle).vehicleNumber
      : (approvalItem as Equipment).name;

    toast({
      title: "Approval Request Submitted",
      description: `Request for ${itemName} has been sent to manager for approval.`,
    });
    setApprovalDialogOpen(false);
    setApprovalItem(null);
  };

  const handleVehicleGateIn = () => {
    if (!selectedVehicle || !gateInForm.operationType || !gateInForm.containerId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setVehicles(prev => prev.map(v =>
      v.id === selectedVehicle.id
        ? { ...v, status: 'active' as const, currentLocation: 'Terminal - Stuffing Area' }
        : v
    ));

    toast({
      title: "Vehicle Gate-In Successful",
      description: `${selectedVehicle.vehicleNumber} has entered for ${gateInForm.operationType} of container ${gateInForm.containerId}.`,
    });
    setGateInOpen(false);
    setSelectedVehicle(null);
  };

  const handleVehicleGateOut = () => {
    if (!selectedVehicle || !gateOutForm.operationType || !gateOutForm.containerId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setVehicles(prev => prev.map(v =>
      v.id === selectedVehicle.id
        ? { ...v, status: 'inactive' as const, currentLocation: 'Exited Terminal' }
        : v
    ));

    toast({
      title: "Vehicle Gate-Out Successful",
      description: `${selectedVehicle.vehicleNumber} has exited after ${gateOutForm.operationType} of container ${gateOutForm.containerId}.`,
    });
    setGateOutOpen(false);
    setSelectedVehicle(null);
  };

  const handleNewVehicleGateIn = () => {
    if (!newVehicleForm.vehicleNumber || !newVehicleForm.driverName || !newVehicleForm.driverPhone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newVehicle: Vehicle = {
      id: Math.random().toString(36).substr(2, 9),
      ...newVehicleForm,
      status: 'active',
      currentLocation: 'Gate A',
    };

    setVehicles(prev => [newVehicle, ...prev]);

    toast({
      title: "Vehicle Gate-In Successful",
      description: `${newVehicle.vehicleNumber} has entered the terminal.`,
    });
    setNewVehicleGateInOpen(false);
    setNewVehicleForm({
      vehicleNumber: '',
      driverName: '',
      driverPhone: '',
      type: 'truck',
    });
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
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => openGateIn(item)}>
            <LogIn className="h-3 w-3 mr-1" />
            Gate In
          </Button>
          <Button size="sm" variant="outline" onClick={() => openGateOut(item)}>
            <LogOut className="h-3 w-3 mr-1" />
            Gate Out
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="ghost">Details</Button>
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
          <Button size="sm" variant="secondary" onClick={() => openApprovalDialog(item, 'vehicle')}>
            <Send className="h-3 w-3 mr-1" />
            Request Approval
          </Button>
        </div>
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
          <Button size="sm" variant="secondary" onClick={() => openApprovalDialog(item, 'equipment')}>
            <Send className="h-3 w-3 mr-1" />
            Request Approval
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
              <div className="flex justify-end mb-4">
                <Button onClick={() => setNewVehicleGateInOpen(true)}>
                  <LogIn className="h-4 w-4 mr-2" />
                  Vehicle Gate-In
                </Button>
              </div>
              <DataTable
                data={vehicles}
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

      {/* Vehicle Gate In Dialog */}
      <Dialog open={gateInOpen} onOpenChange={setGateInOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogIn className="h-5 w-5 text-success" />
              Vehicle Gate-In for Stuffing/Destuffing
            </DialogTitle>
            <DialogDescription>
              {selectedVehicle?.vehicleNumber} - Driver: {selectedVehicle?.driverName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Operation Type *</Label>
              <Select
                value={gateInForm.operationType}
                onValueChange={(v) => setGateInForm(prev => ({ ...prev, operationType: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select operation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stuffing">Stuffing</SelectItem>
                  <SelectItem value="destuffing">Destuffing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Container ID *</Label>
              <Select
                value={gateInForm.containerId}
                onValueChange={(v) => setGateInForm(prev => ({ ...prev, containerId: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select container" />
                </SelectTrigger>
                <SelectContent>
                  {pendingTerminalOps.map(op => (
                    <SelectItem key={op.id} value={op.containerNumber}>
                      {op.containerNumber} - {op.type}
                    </SelectItem>
                  ))}
                  <SelectItem value="manual">Enter Manually</SelectItem>
                </SelectContent>
              </Select>
              {gateInForm.containerId === 'manual' && (
                <Input
                  placeholder="Enter container ID"
                  className="mt-2"
                  onChange={(e) => setGateInForm(prev => ({ ...prev, containerId: e.target.value }))}
                />
              )}
            </div>

            <div className="space-y-2">
              <Label>Purpose</Label>
              <Select
                value={gateInForm.purpose}
                onValueChange={(v) => setGateInForm(prev => ({ ...prev, purpose: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stuffing">Terminal Stuffing</SelectItem>
                  <SelectItem value="destuffing">Terminal Destuffing</SelectItem>
                  <SelectItem value="cargo-delivery">Cargo Delivery</SelectItem>
                  <SelectItem value="cargo-pickup">Cargo Pickup</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Remarks</Label>
              <Textarea
                placeholder="Any additional notes..."
                value={gateInForm.remarks}
                onChange={(e) => setGateInForm(prev => ({ ...prev, remarks: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGateInOpen(false)}>Cancel</Button>
            <Button onClick={handleVehicleGateIn}>
              <LogIn className="h-4 w-4 mr-2" />
              Confirm Gate-In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Vehicle Gate Out Dialog */}
      <Dialog open={gateOutOpen} onOpenChange={setGateOutOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogOut className="h-5 w-5 text-primary" />
              Vehicle Gate-Out after Stuffing/Destuffing
            </DialogTitle>
            <DialogDescription>
              {selectedVehicle?.vehicleNumber} - Driver: {selectedVehicle?.driverName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Operation Completed *</Label>
              <Select
                value={gateOutForm.operationType}
                onValueChange={(v) => setGateOutForm(prev => ({ ...prev, operationType: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select completed operation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stuffing">Stuffing Completed</SelectItem>
                  <SelectItem value="destuffing">Destuffing Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Container ID *</Label>
              <Select
                value={gateOutForm.containerId}
                onValueChange={(v) => setGateOutForm(prev => ({ ...prev, containerId: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select container" />
                </SelectTrigger>
                <SelectContent>
                  {pendingTerminalOps.map(op => (
                    <SelectItem key={op.id} value={op.containerNumber}>
                      {op.containerNumber} - {op.type}
                    </SelectItem>
                  ))}
                  <SelectItem value="manual">Enter Manually</SelectItem>
                </SelectContent>
              </Select>
              {gateOutForm.containerId === 'manual' && (
                <Input
                  placeholder="Enter container ID"
                  className="mt-2"
                  onChange={(e) => setGateOutForm(prev => ({ ...prev, containerId: e.target.value }))}
                />
              )}
            </div>

            <div className="space-y-2">
              <Label>Exit Purpose</Label>
              <Select
                value={gateOutForm.purpose}
                onValueChange={(v) => setGateOutForm(prev => ({ ...prev, purpose: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stuffing">Stuffing Complete - Exiting</SelectItem>
                  <SelectItem value="destuffing">Destuffing Complete - Cargo Loaded</SelectItem>
                  <SelectItem value="cargo-delivered">Cargo Delivered</SelectItem>
                  <SelectItem value="cargo-collected">Cargo Collected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Remarks</Label>
              <Textarea
                placeholder="Any additional notes..."
                value={gateOutForm.remarks}
                onChange={(e) => setGateOutForm(prev => ({ ...prev, remarks: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGateOutOpen(false)}>Cancel</Button>
            <Button onClick={handleVehicleGateOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Confirm Gate-Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Approval Dialog */}
      <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request Manager Approval</DialogTitle>
            <DialogDescription>
              {approvalType === 'vehicle'
                ? (approvalItem as Vehicle)?.vehicleNumber
                : (approvalItem as Equipment)?.name} - {approvalType}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Request Type *</Label>
              <Select value={approvalForm.requestType} onValueChange={(v) => setApprovalForm(prev => ({ ...prev, requestType: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select request type" />
                </SelectTrigger>
                <SelectContent>
                  {approvalType === 'vehicle' ? (
                    <>
                      <SelectItem value="extended-stay">Extended Terminal Stay</SelectItem>
                      <SelectItem value="special-access">Special Access Request</SelectItem>
                      <SelectItem value="driver-change">Driver Change</SelectItem>
                      <SelectItem value="damage-clearance">Damage Clearance</SelectItem>
                      <SelectItem value="overweight">Overweight Approval</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="maintenance-request">Maintenance Request</SelectItem>
                      <SelectItem value="overtime-use">Overtime Usage</SelectItem>
                      <SelectItem value="special-operation">Special Operation</SelectItem>
                      <SelectItem value="repair-approval">Repair Approval</SelectItem>
                      <SelectItem value="decommission">Decommission Request</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={approvalForm.priority} onValueChange={(v) => setApprovalForm(prev => ({ ...prev, priority: v }))}>
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
              <Label>Reason *</Label>
              <Textarea
                placeholder="Explain why approval is needed..."
                value={approvalForm.reason}
                onChange={(e) => setApprovalForm(prev => ({ ...prev, reason: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Additional Remarks</Label>
              <Textarea
                placeholder="Any additional information..."
                value={approvalForm.remarks}
                onChange={(e) => setApprovalForm(prev => ({ ...prev, remarks: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApprovalDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRequestApproval}>
              <Send className="h-4 w-4 mr-2" />
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* New Vehicle Gate-In Dialog */}
      <Dialog open={newVehicleGateInOpen} onOpenChange={setNewVehicleGateInOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogIn className="h-5 w-5 text-success" />
              Vehicle Gate-In
            </DialogTitle>
            <DialogDescription>
              Enter vehicle and driver details to process gate-in.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-vehicle-number">Vehicle Number *</Label>
              <Input
                id="new-vehicle-number"
                placeholder="e.g., TN-01-AB-1234"
                value={newVehicleForm.vehicleNumber}
                onChange={(e) => setNewVehicleForm(prev => ({ ...prev, vehicleNumber: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-driver-name">Driver Name *</Label>
              <Input
                id="new-driver-name"
                placeholder="Enter driver name"
                value={newVehicleForm.driverName}
                onChange={(e) => setNewVehicleForm(prev => ({ ...prev, driverName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-driver-phone">Driver Mobile Number *</Label>
              <Input
                id="new-driver-phone"
                placeholder="e.g., +91 98765 43210"
                value={newVehicleForm.driverPhone}
                onChange={(e) => setNewVehicleForm(prev => ({ ...prev, driverPhone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-vehicle-type">Vehicle Type *</Label>
              <Select
                value={newVehicleForm.type}
                onValueChange={(v) => setNewVehicleForm(prev => ({ ...prev, type: v as any }))}
              >
                <SelectTrigger id="new-vehicle-type">
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="truck">Truck</SelectItem>
                  <SelectItem value="trailer">Trailer</SelectItem>
                  <SelectItem value="chassis">Chassis</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewVehicleGateInOpen(false)}>Cancel</Button>
            <Button onClick={handleNewVehicleGateIn}>Confirm Gate-In</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
