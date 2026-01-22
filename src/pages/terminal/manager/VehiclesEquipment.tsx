import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable, Column } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { KPICard } from '@/components/common/KPICard';
import { managerNavItems } from '@/config/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { dummyVehicles, dummyEquipment } from '@/data/dummyData';
import type { Vehicle, Equipment } from '@/types';
import { Truck, Wrench, CheckCircle, AlertTriangle } from 'lucide-react';

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
    key: 'type',
    header: 'Type',
    sortable: true,
    render: (item) => <span className="capitalize">{item.type}</span>,
  },
  { key: 'driverName', header: 'Driver', sortable: true },
  { key: 'driverPhone', header: 'Phone' },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (item) => (
      <Badge
        variant={
          item.status === 'active'
            ? 'default'
            : item.status === 'maintenance'
            ? 'secondary'
            : 'outline'
        }
      >
        {item.status}
      </Badge>
    ),
  },
  {
    key: 'currentLocation',
    header: 'Location',
    render: (item) => item.currentLocation || '-',
  },
];

const equipmentColumns: Column<Equipment>[] = [
  {
    key: 'name',
    header: 'Equipment',
    sortable: true,
    render: (item) => (
      <span className="font-medium text-foreground">{item.name}</span>
    ),
  },
  {
    key: 'type',
    header: 'Type',
    sortable: true,
    render: (item) => <span className="capitalize">{item.type.replace('-', ' ')}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (item) => (
      <Badge
        variant={
          item.status === 'operational'
            ? 'default'
            : item.status === 'maintenance'
            ? 'secondary'
            : 'destructive'
        }
      >
        {item.status}
      </Badge>
    ),
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

export default function ManagerVehiclesEquipment() {
  const activeVehicles = dummyVehicles.filter((v) => v.status === 'active');
  const maintenanceVehicles = dummyVehicles.filter((v) => v.status === 'maintenance');
  const operationalEquipment = dummyEquipment.filter((e) => e.status === 'operational');
  const downEquipment = dummyEquipment.filter((e) => e.status === 'down' || e.status === 'maintenance');

  return (
    <DashboardLayout navItems={managerNavItems} pageTitle="Vehicles & Equipment">
      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Active Vehicles"
          value={activeVehicles.length}
          subtitle={`of ${dummyVehicles.length} total`}
          icon={Truck}
          variant="success"
        />
        <KPICard
          title="Vehicles in Maintenance"
          value={maintenanceVehicles.length}
          icon={Wrench}
          variant={maintenanceVehicles.length > 0 ? 'warning' : 'default'}
        />
        <KPICard
          title="Operational Equipment"
          value={operationalEquipment.length}
          subtitle={`of ${dummyEquipment.length} total`}
          icon={CheckCircle}
          variant="success"
        />
        <KPICard
          title="Equipment Down/Maintenance"
          value={downEquipment.length}
          icon={AlertTriangle}
          variant={downEquipment.length > 0 ? 'danger' : 'default'}
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="vehicles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vehicles">Vehicles ({dummyVehicles.length})</TabsTrigger>
          <TabsTrigger value="equipment">Equipment ({dummyEquipment.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="vehicles" className="space-y-6">
          {/* Vehicle Status Summary */}
          <div className="grid gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary">{activeVehicles.length}</p>
                <p className="text-sm text-muted-foreground">Currently in operation</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Maintenance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-warning">{maintenanceVehicles.length}</p>
                <p className="text-sm text-muted-foreground">Under maintenance</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Inactive</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-muted-foreground">
                  {dummyVehicles.filter((v) => v.status === 'inactive').length}
                </p>
                <p className="text-sm text-muted-foreground">Not in use</p>
              </CardContent>
            </Card>
          </div>

          <DataTable
            data={dummyVehicles}
            columns={vehicleColumns}
            searchPlaceholder="Search vehicles..."
          />
        </TabsContent>

        <TabsContent value="equipment" className="space-y-6">
          {/* Equipment Status Summary */}
          <div className="grid gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Operational</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary">{operationalEquipment.length}</p>
                <p className="text-sm text-muted-foreground">Ready to use</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Maintenance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-warning">
                  {dummyEquipment.filter((e) => e.status === 'maintenance').length}
                </p>
                <p className="text-sm text-muted-foreground">Scheduled maintenance</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Down</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-destructive">
                  {dummyEquipment.filter((e) => e.status === 'down').length}
                </p>
                <p className="text-sm text-muted-foreground">Out of service</p>
              </CardContent>
            </Card>
          </div>

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
