import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable, Column } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { adminNavItems } from '@/config/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dummyVehicles, dummyEquipment } from '@/data/dummyData';
import type { Vehicle, Equipment } from '@/types';
import { Truck, Wrench, MapPin, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const vehicleColumns: Column<Vehicle>[] = [
  {
    key: 'vehicleNumber',
    header: 'Vehicle No.',
    sortable: true,
    render: (item) => (
      <span className="font-medium text-foreground">{item.vehicleNumber}</span>
    ),
  },
  {
    key: 'driverName',
    header: 'Driver',
    sortable: true,
  },
  {
    key: 'driverPhone',
    header: 'Phone',
  },
  {
    key: 'type',
    header: 'Type',
    render: (item) => <span className="capitalize">{item.type}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    render: (item) => <StatusBadge status={item.status} />,
  },
  {
    key: 'currentLocation',
    header: 'Location',
    render: (item) => item.currentLocation || '-',
  },
  {
    key: 'gpsDeviceId',
    header: 'GPS Device',
    render: (item) => item.gpsDeviceId || '-',
  },
];

const equipmentColumns: Column<Equipment>[] = [
  {
    key: 'name',
    header: 'Equipment ID',
    sortable: true,
    render: (item) => (
      <span className="font-medium text-foreground">{item.name}</span>
    ),
  },
  {
    key: 'type',
    header: 'Type',
    render: (item) => <span className="capitalize">{item.type.replace('-', ' ')}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    render: (item) => <StatusBadge status={item.status} />,
  },
  {
    key: 'operator',
    header: 'Operator',
    render: (item) => item.operator || '-',
  },
  {
    key: 'lastMaintenance',
    header: 'Last Maintenance',
    render: (item) =>
      item.lastMaintenance ? new Date(item.lastMaintenance).toLocaleDateString() : '-',
  },
  {
    key: 'nextMaintenance',
    header: 'Next Maintenance',
    render: (item) =>
      item.nextMaintenance ? new Date(item.nextMaintenance).toLocaleDateString() : '-',
  },
];

export default function VehiclesEquipment() {
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>(dummyVehicles);
  const [equipment, setEquipment] = useState<Equipment[]>(dummyEquipment);
  const [activeTab, setActiveTab] = useState('vehicles');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  
  const [vehicleForm, setVehicleForm] = useState({
    vehicleNumber: '',
    driverName: '',
    driverPhone: '',
    type: 'truck' as 'truck' | 'trailer' | 'chassis',
    gpsDeviceId: '',
  });

  const [equipmentForm, setEquipmentForm] = useState({
    name: '',
    type: 'reach-stacker' as 'reach-stacker' | 'forklift' | 'crane' | 'straddle-carrier',
    operator: '',
  });

  const activeVehicles = vehicles.filter((v) => v.status === 'active').length;
  const operationalEquipment = equipment.filter((e) => e.status === 'operational').length;

  const handleAddVehicle = () => {
    const newVehicle: Vehicle = {
      id: `VEH-${Date.now()}`,
      vehicleNumber: vehicleForm.vehicleNumber,
      driverName: vehicleForm.driverName,
      driverPhone: vehicleForm.driverPhone,
      type: vehicleForm.type,
      status: 'inactive',
      gpsDeviceId: vehicleForm.gpsDeviceId || undefined,
    };
    setVehicles([newVehicle, ...vehicles]);
    toast({
      title: 'Vehicle Added',
      description: `Vehicle ${vehicleForm.vehicleNumber} has been added successfully.`,
    });
    setVehicleForm({ vehicleNumber: '', driverName: '', driverPhone: '', type: 'truck', gpsDeviceId: '' });
    setAddDialogOpen(false);
  };

  const handleAddEquipment = () => {
    const newEquipment: Equipment = {
      id: `EQP-${Date.now()}`,
      name: equipmentForm.name,
      type: equipmentForm.type,
      status: 'operational',
      operator: equipmentForm.operator || undefined,
    };
    setEquipment([newEquipment, ...equipment]);
    toast({
      title: 'Equipment Added',
      description: `Equipment ${equipmentForm.name} has been added successfully.`,
    });
    setEquipmentForm({ name: '', type: 'reach-stacker', operator: '' });
    setAddDialogOpen(false);
  };

  return (
    <DashboardLayout
      navItems={adminNavItems}
      pageTitle="Vehicles & Equipment"
      pageActions={
        <Button className="gap-2" onClick={() => setAddDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Add New
        </Button>
      }
    >
      {/* Summary Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{dummyVehicles.length}</p>
                <p className="text-sm text-muted-foreground">Total Vehicles</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <MapPin className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{activeVehicles}</p>
                <p className="text-sm text-muted-foreground">Active Vehicles</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <Wrench className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{dummyEquipment.length}</p>
                <p className="text-sm text-muted-foreground">Total Equipment</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
                <Wrench className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{operationalEquipment}</p>
                <p className="text-sm text-muted-foreground">Operational</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="vehicles">External Vehicles</TabsTrigger>
          <TabsTrigger value="equipment">Internal Equipment</TabsTrigger>
        </TabsList>

        <TabsContent value="vehicles">
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

      {/* Add New Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New {activeTab === 'vehicles' ? 'Vehicle' : 'Equipment'}
            </DialogTitle>
          </DialogHeader>
          
          {activeTab === 'vehicles' ? (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleNumber">Vehicle Number *</Label>
                <Input
                  id="vehicleNumber"
                  placeholder="e.g., TRK-001"
                  value={vehicleForm.vehicleNumber}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, vehicleNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="driverName">Driver Name *</Label>
                <Input
                  id="driverName"
                  placeholder="Enter driver name"
                  value={vehicleForm.driverName}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, driverName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="driverPhone">Driver Phone *</Label>
                <Input
                  id="driverPhone"
                  placeholder="Enter phone number"
                  value={vehicleForm.driverPhone}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, driverPhone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <Select
                  value={vehicleForm.type}
                  onValueChange={(value: 'truck' | 'trailer' | 'chassis') => 
                    setVehicleForm({ ...vehicleForm, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="truck">Truck</SelectItem>
                    <SelectItem value="trailer">Trailer</SelectItem>
                    <SelectItem value="chassis">Chassis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gpsDeviceId">GPS Device ID (Optional)</Label>
                <Input
                  id="gpsDeviceId"
                  placeholder="Enter GPS device ID"
                  value={vehicleForm.gpsDeviceId}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, gpsDeviceId: e.target.value })}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="equipmentName">Equipment ID/Name *</Label>
                <Input
                  id="equipmentName"
                  placeholder="e.g., RS-001"
                  value={equipmentForm.name}
                  onChange={(e) => setEquipmentForm({ ...equipmentForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="equipmentType">Equipment Type</Label>
                <Select
                  value={equipmentForm.type}
                  onValueChange={(value: 'reach-stacker' | 'forklift' | 'crane' | 'straddle-carrier') => 
                    setEquipmentForm({ ...equipmentForm, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reach-stacker">Reach Stacker</SelectItem>
                    <SelectItem value="forklift">Forklift</SelectItem>
                    <SelectItem value="crane">Crane</SelectItem>
                    <SelectItem value="straddle-carrier">Straddle Carrier</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="operator">Assigned Operator (Optional)</Label>
                <Input
                  id="operator"
                  placeholder="Enter operator name"
                  value={equipmentForm.operator}
                  onChange={(e) => setEquipmentForm({ ...equipmentForm, operator: e.target.value })}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={activeTab === 'vehicles' ? handleAddVehicle : handleAddEquipment}
              disabled={activeTab === 'vehicles' 
                ? !vehicleForm.vehicleNumber || !vehicleForm.driverName || !vehicleForm.driverPhone
                : !equipmentForm.name
              }
            >
              Add {activeTab === 'vehicles' ? 'Vehicle' : 'Equipment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
