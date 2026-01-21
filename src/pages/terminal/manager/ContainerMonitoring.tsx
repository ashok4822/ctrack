import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable, Column } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { KPICard } from '@/components/common/KPICard';
import { managerNavItems } from '@/config/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { dummyContainers, dummyYardBlocks } from '@/data/dummyData';
import type { Container } from '@/types';
import { Container as ContainerIcon, AlertTriangle, Clock, MapPin } from 'lucide-react';

const columns: Column<Container>[] = [
  {
    key: 'containerNumber',
    header: 'Container No.',
    sortable: true,
    render: (item) => (
      <span className="font-medium text-foreground">{item.containerNumber}</span>
    ),
  },
  { key: 'size', header: 'Size', sortable: true },
  {
    key: 'type',
    header: 'Type',
    sortable: true,
    render: (item) => <span className="capitalize">{item.type}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (item) => <StatusBadge status={item.status} />,
  },
  { key: 'shippingLine', header: 'Shipping Line', sortable: true },
  {
    key: 'yardLocation',
    header: 'Location',
    render: (item) =>
      item.yardLocation
        ? `${item.yardLocation.block}-${item.yardLocation.row}-${item.yardLocation.bay}-${item.yardLocation.tier}`
        : '-',
  },
  {
    key: 'dwellTime',
    header: 'Dwell (days)',
    sortable: true,
    render: (item) => {
      const dwell = item.dwellTime ?? 0;
      return (
        <span className={dwell > 5 ? 'text-destructive font-medium' : ''}>
          {dwell || '-'}
        </span>
      );
    },
  },
  {
    key: 'movementType',
    header: 'Movement',
    sortable: true,
    render: (item) => <span className="capitalize">{item.movementType}</span>,
  },
];

export default function ContainerMonitoring() {
  const inYard = dummyContainers.filter((c) => c.status === 'in-yard');
  const inTransit = dummyContainers.filter((c) => c.status === 'in-transit');
  const longDwell = dummyContainers.filter((c) => (c.dwellTime ?? 0) > 5);
  const damaged = dummyContainers.filter((c) => c.damaged);

  return (
    <DashboardLayout navItems={managerNavItems} pageTitle="Container Monitoring">
      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Containers in Yard"
          value={inYard.length}
          icon={ContainerIcon}
          variant="primary"
        />
        <KPICard
          title="In Transit"
          value={inTransit.length}
          icon={MapPin}
        />
        <KPICard
          title="Long Dwell (>5 days)"
          value={longDwell.length}
          icon={Clock}
          variant="warning"
        />
        <KPICard
          title="Damaged Containers"
          value={damaged.length}
          icon={AlertTriangle}
          variant="danger"
        />
      </div>

      {/* Yard Block Summary */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Yard Block Occupancy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {dummyYardBlocks.map((block) => {
              const percentage = Math.round((block.occupied / block.capacity) * 100);
              return (
                <div key={block.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{block.name}</span>
                    <span className={`text-sm font-medium ${percentage > 80 ? 'text-destructive' : percentage > 60 ? 'text-warning' : 'text-primary'}`}>
                      {percentage}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${percentage > 80 ? 'bg-destructive' : percentage > 60 ? 'bg-warning' : 'bg-primary'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {block.occupied} / {block.capacity} slots
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Container Table with Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Containers ({dummyContainers.length})</TabsTrigger>
          <TabsTrigger value="in-yard">In Yard ({inYard.length})</TabsTrigger>
          <TabsTrigger value="long-dwell">Long Dwell ({longDwell.length})</TabsTrigger>
          <TabsTrigger value="damaged">Damaged ({damaged.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <DataTable
            data={dummyContainers}
            columns={columns}
            searchPlaceholder="Search containers..."
          />
        </TabsContent>

        <TabsContent value="in-yard">
          <DataTable
            data={inYard}
            columns={columns}
            searchPlaceholder="Search containers in yard..."
          />
        </TabsContent>

        <TabsContent value="long-dwell">
          <DataTable
            data={longDwell}
            columns={columns}
            searchPlaceholder="Search long dwell containers..."
            emptyMessage="No containers exceeding dwell time threshold."
          />
        </TabsContent>

        <TabsContent value="damaged">
          <DataTable
            data={damaged}
            columns={columns}
            searchPlaceholder="Search damaged containers..."
            emptyMessage="No damaged containers found."
          />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
