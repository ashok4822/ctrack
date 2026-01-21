import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { customerNavItems } from '@/config/navigation';
import { DataTable, Column } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { KPICard } from '@/components/common/KPICard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Truck, ArrowDownToLine, ArrowUpFromLine, Clock } from 'lucide-react';
import { dummyGateOperations } from '@/data/dummyData';
import type { GateOperation } from '@/types';

export default function CustomerMovements() {
  // Filter movements for customer's containers
  const customerMovements = dummyGateOperations;
  
  const gateIns = customerMovements.filter(m => m.type === 'gate-in').length;
  const gateOuts = customerMovements.filter(m => m.type === 'gate-out').length;
  const pending = customerMovements.filter(m => m.status === 'pending').length;

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
    <DashboardLayout navItems={customerNavItems} pageTitle="Movements">
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
    </DashboardLayout>
  );
}
