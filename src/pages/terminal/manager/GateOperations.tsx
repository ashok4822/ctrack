import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable, Column } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { KPICard } from '@/components/common/KPICard';
import { managerNavItems } from '@/config/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { dummyGateOperations, dummyGateMovementsData } from '@/data/dummyData';
import type { GateOperation } from '@/types';
import { DoorOpen, ArrowDownToLine, ArrowUpFromLine, Clock } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const columns: Column<GateOperation>[] = [
  {
    key: 'containerNumber',
    header: 'Container No.',
    sortable: true,
    render: (item) => (
      <span className="font-medium text-foreground">{item.containerNumber}</span>
    ),
  },
  {
    key: 'type',
    header: 'Type',
    sortable: true,
    render: (item) => (
      <div className="flex items-center gap-2">
        {item.type === 'gate-in' ? (
          <ArrowDownToLine className="h-4 w-4 text-primary" />
        ) : (
          <ArrowUpFromLine className="h-4 w-4 text-secondary-foreground" />
        )}
        <span className="capitalize">{item.type.replace('-', ' ')}</span>
      </div>
    ),
  },
  { key: 'vehicleNumber', header: 'Vehicle', sortable: true },
  { key: 'driverName', header: 'Driver', sortable: true },
  {
    key: 'purpose',
    header: 'Purpose',
    sortable: true,
    render: (item) => <span className="capitalize">{item.purpose}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (item) => <StatusBadge status={item.status} />,
  },
  {
    key: 'timestamp',
    header: 'Time',
    sortable: true,
    render: (item) => new Date(item.timestamp).toLocaleString(),
  },
];

export default function ManagerGateOperations() {
  const gateIns = dummyGateOperations.filter((op) => op.type === 'gate-in');
  const gateOuts = dummyGateOperations.filter((op) => op.type === 'gate-out');
  const pending = dummyGateOperations.filter((op) => op.status === 'pending');
  const todayOps = dummyGateOperations.filter((op) => {
    const opDate = new Date(op.timestamp).toDateString();
    return opDate === new Date().toDateString();
  });

  return (
    <DashboardLayout navItems={managerNavItems} pageTitle="Gate Operations">
      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Operations"
          value={dummyGateOperations.length}
          icon={DoorOpen}
        />
        <KPICard
          title="Gate-In Today"
          value={gateIns.length}
          icon={ArrowDownToLine}
          variant="success"
        />
        <KPICard
          title="Gate-Out Today"
          value={gateOuts.length}
          icon={ArrowUpFromLine}
          variant="primary"
        />
        <KPICard
          title="Pending Approval"
          value={pending.length}
          icon={Clock}
          variant={pending.length > 0 ? 'warning' : 'default'}
        />
      </div>

      {/* Chart */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Gate Movement Trend (7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dummyGateMovementsData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="gateIn"
                  name="Gate In"
                  stroke="hsl(142, 76%, 36%)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="gateOut"
                  name="Gate Out"
                  stroke="hsl(217, 91%, 60%)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Operations Table with Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Operations ({dummyGateOperations.length})</TabsTrigger>
          <TabsTrigger value="gate-in">Gate-In ({gateIns.length})</TabsTrigger>
          <TabsTrigger value="gate-out">Gate-Out ({gateOuts.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <DataTable
            data={dummyGateOperations}
            columns={columns}
            searchPlaceholder="Search operations..."
          />
        </TabsContent>

        <TabsContent value="gate-in">
          <DataTable
            data={gateIns}
            columns={columns}
            searchPlaceholder="Search gate-in operations..."
          />
        </TabsContent>

        <TabsContent value="gate-out">
          <DataTable
            data={gateOuts}
            columns={columns}
            searchPlaceholder="Search gate-out operations..."
          />
        </TabsContent>

        <TabsContent value="pending">
          <DataTable
            data={pending}
            columns={columns}
            searchPlaceholder="Search pending operations..."
            emptyMessage="No pending operations."
          />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
