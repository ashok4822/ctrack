import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable, Column } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { adminNavItems } from '@/config/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { dummyGateOperations } from '@/data/dummyData';
import type { GateOperation } from '@/types';
import { DoorOpen, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';

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
    render: (item) => (
      <div className="flex items-center gap-2">
        {item.type === 'gate-in' ? (
          <ArrowDownToLine className="h-4 w-4 text-success" />
        ) : (
          <ArrowUpFromLine className="h-4 w-4 text-primary" />
        )}
        <span className="capitalize">{item.type.replace('-', ' ')}</span>
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
  },
  {
    key: 'purpose',
    header: 'Purpose',
    render: (item) => <span className="capitalize">{item.purpose}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    render: (item) => <StatusBadge status={item.status} />,
  },
  {
    key: 'timestamp',
    header: 'Time',
    render: (item) => new Date(item.timestamp).toLocaleString(),
  },
];

export default function GateOperations() {
  const gateIns = dummyGateOperations.filter((op) => op.type === 'gate-in');
  const gateOuts = dummyGateOperations.filter((op) => op.type === 'gate-out');
  const pending = dummyGateOperations.filter((op) => op.status === 'pending');

  return (
    <DashboardLayout navItems={adminNavItems} pageTitle="Gate Operations">
      {/* Summary Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <ArrowDownToLine className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{gateIns.length}</p>
                <p className="text-sm text-muted-foreground">Gate-Ins Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <ArrowUpFromLine className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{gateOuts.length}</p>
                <p className="text-sm text-muted-foreground">Gate-Outs Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <DoorOpen className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{pending.length}</p>
                <p className="text-sm text-muted-foreground">Pending Approvals</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Operations</TabsTrigger>
          <TabsTrigger value="gate-in">Gate-In</TabsTrigger>
          <TabsTrigger value="gate-out">Gate-Out</TabsTrigger>
          <TabsTrigger value="pending">Pending Approval</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <DataTable
            data={dummyGateOperations}
            columns={columns}
            searchPlaceholder="Search gate operations..."
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
            emptyMessage="No pending operations"
          />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
