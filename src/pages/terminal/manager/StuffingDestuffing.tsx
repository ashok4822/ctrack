import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable, Column } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { KPICard } from '@/components/common/KPICard';
import { managerNavItems } from '@/config/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { dummyStuffingOperations } from '@/data/dummyData';
import type { StuffingOperation } from '@/types';
import { Package, Clock, CheckCircle, Loader2, Eye } from 'lucide-react';

export default function ManagerStuffingDestuffing() {
  const [selectedOperation, setSelectedOperation] = useState<StuffingOperation | null>(null);

  const stuffing = dummyStuffingOperations.filter((op) => op.type === 'stuffing');
  const destuffing = dummyStuffingOperations.filter((op) => op.type === 'destuffing');
  const pending = dummyStuffingOperations.filter((op) => op.status === 'pending');
  const inProgress = dummyStuffingOperations.filter((op) => op.status === 'in-progress');
  const completed = dummyStuffingOperations.filter(
    (op) => op.status === 'completed' || op.status === 'approved'
  );

  const columns: Column<StuffingOperation>[] = [
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
        <span className={`capitalize font-medium ${item.type === 'stuffing' ? 'text-primary' : 'text-secondary-foreground'}`}>
          {item.type}
        </span>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      sortable: true,
      render: (item) => <span className="capitalize">{item.location}</span>,
    },
    {
      key: 'scheduledDate',
      header: 'Scheduled Date',
      sortable: true,
      render: (item) => new Date(item.scheduledDate).toLocaleDateString(),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: 'completedDate',
      header: 'Completed',
      render: (item) =>
        item.completedDate ? new Date(item.completedDate).toLocaleDateString() : '-',
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedOperation(item)}
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      ),
    },
  ];

  return (
    <DashboardLayout navItems={managerNavItems} pageTitle="Stuffing / Destuffing">
      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KPICard
          title="Total Operations"
          value={dummyStuffingOperations.length}
          icon={Package}
        />
        <KPICard
          title="Stuffing"
          value={stuffing.length}
          icon={Package}
          variant="primary"
        />
        <KPICard
          title="Destuffing"
          value={destuffing.length}
          icon={Package}
        />
        <KPICard
          title="In Progress"
          value={inProgress.length}
          icon={Loader2}
          variant="warning"
        />
        <KPICard
          title="Completed"
          value={completed.length}
          icon={CheckCircle}
          variant="success"
        />
      </div>

      {/* Status Summary */}
      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-warning">{pending.length}</p>
            <p className="text-sm text-muted-foreground">Awaiting start</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">{inProgress.length}</p>
            <p className="text-sm text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed Today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">{completed.length}</p>
            <p className="text-sm text-muted-foreground">Operations finished</p>
          </CardContent>
        </Card>
      </div>

      {/* Operations Table with Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All ({dummyStuffingOperations.length})</TabsTrigger>
          <TabsTrigger value="stuffing">Stuffing ({stuffing.length})</TabsTrigger>
          <TabsTrigger value="destuffing">Destuffing ({destuffing.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress ({inProgress.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <DataTable
            data={dummyStuffingOperations}
            columns={columns}
            searchPlaceholder="Search operations..."
          />
        </TabsContent>

        <TabsContent value="stuffing">
          <DataTable
            data={stuffing}
            columns={columns}
            searchPlaceholder="Search stuffing operations..."
          />
        </TabsContent>

        <TabsContent value="destuffing">
          <DataTable
            data={destuffing}
            columns={columns}
            searchPlaceholder="Search destuffing operations..."
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

        <TabsContent value="in-progress">
          <DataTable
            data={inProgress}
            columns={columns}
            searchPlaceholder="Search in-progress operations..."
            emptyMessage="No operations in progress."
          />
        </TabsContent>
      </Tabs>

      {/* Operation Detail Dialog */}
      <Dialog open={!!selectedOperation} onOpenChange={() => setSelectedOperation(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Operation Details</DialogTitle>
            <DialogDescription>
              {selectedOperation?.type} operation for {selectedOperation?.containerNumber}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Container</p>
                <p className="font-medium">{selectedOperation?.containerNumber}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Type</p>
                <p className="font-medium capitalize">{selectedOperation?.type}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Location</p>
                <p className="font-medium capitalize">{selectedOperation?.location}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                {selectedOperation && <StatusBadge status={selectedOperation.status} />}
              </div>
              <div>
                <p className="text-muted-foreground">Scheduled Date</p>
                <p className="font-medium">
                  {selectedOperation && new Date(selectedOperation.scheduledDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Completed Date</p>
                <p className="font-medium">
                  {selectedOperation?.completedDate
                    ? new Date(selectedOperation.completedDate).toLocaleDateString()
                    : '-'}
                </p>
              </div>
            </div>

            {selectedOperation?.remarks && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-1">Remarks</p>
                <p className="text-sm text-muted-foreground">{selectedOperation.remarks}</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => setSelectedOperation(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
