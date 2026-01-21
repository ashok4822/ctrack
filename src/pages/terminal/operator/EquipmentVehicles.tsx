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
import { Textarea } from '@/components/ui/textarea';
import {
  Truck,
  Forklift,
  CheckCircle,
  AlertTriangle,
  Wrench,
} from 'lucide-react';
import { dummyVehicles, dummyEquipment } from '@/data/dummyData';
import type { Vehicle, Equipment } from '@/types';
import { useState } from 'react';

export default function OperatorEquipmentVehicles() {
  const activeVehicles = dummyVehicles.filter(v => v.status === 'active');
  const activeEquipment = dummyEquipment.filter(e => e.status === 'operational');
  const maintenanceEquipment = dummyEquipment.filter(e => e.status === 'maintenance');

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
      key: 'nextMaintenance',
      header: 'Next Maintenance',
      render: (item) => item.nextMaintenance ? new Date(item.nextMaintenance).toLocaleDateString() : 'N/A',
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
              <DialogTitle>Equipment Details</DialogTitle>
              <DialogDescription>{item.name}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Name</Label>
                  <p className="font-medium">{item.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Type</Label>
                  <p className="font-medium capitalize">{item.type.replace('-', ' ')}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Operator</Label>
                  <p className="font-medium">{item.operator || 'Unassigned'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <p className="font-medium capitalize">{item.status}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="issue">Report Issue</Label>
                <Textarea id="issue" placeholder="Describe the issue..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Close</Button>
              <Button variant="destructive">Report Issue</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
              <TabsTrigger value="equipment">Equipment ({dummyEquipment.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="vehicles">
              <DataTable
                data={dummyVehicles}
                columns={vehicleColumns}
                searchable
                searchPlaceholder="Search vehicles..."
              />
            </TabsContent>
            <TabsContent value="equipment">
              <DataTable
                data={dummyEquipment}
                columns={equipmentColumns}
                searchable
                searchPlaceholder="Search equipment..."
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
