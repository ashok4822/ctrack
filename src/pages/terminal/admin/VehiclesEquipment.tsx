import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable, Column } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { adminNavItems } from '@/config/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { dummyVehicles, dummyEquipment } from '@/data/dummyData';
import type { Vehicle, Equipment } from '@/types';
import { Truck, Wrench, MapPin, Plus } from 'lucide-react';

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
  const activeVehicles = dummyVehicles.filter((v) => v.status === 'active').length;
  const operationalEquipment = dummyEquipment.filter((e) => e.status === 'operational').length;

  return (
    <DashboardLayout
      navItems={adminNavItems}
      pageTitle="Vehicles & Equipment"
      pageActions={
        <Button className="gap-2">
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
      <Tabs defaultValue="vehicles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vehicles">External Vehicles</TabsTrigger>
          <TabsTrigger value="equipment">Internal Equipment</TabsTrigger>
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
            data={dummyEquipment}
            columns={equipmentColumns}
            searchPlaceholder="Search equipment..."
          />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
