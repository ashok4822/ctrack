import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable, Column } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { adminNavItems } from '@/config/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { dummyApprovals } from '@/data/dummyData';
import type { Approval } from '@/types';
import { CheckSquare, XCircle, Clock, CheckCircle } from 'lucide-react';

const columns: Column<Approval>[] = [
  {
    key: 'type',
    header: 'Type',
    sortable: true,
    render: (item) => (
      <span className="capitalize font-medium">{item.type.replace('-', ' ')}</span>
    ),
  },
  {
    key: 'details',
    header: 'Details',
    render: (item) => (
      <div className="text-sm">
        <p className="font-medium">{item.details.containerNumber}</p>
        {item.details.destination && (
          <p className="text-muted-foreground">{item.details.destination}</p>
        )}
      </div>
    ),
  },
  {
    key: 'requestedBy',
    header: 'Requested By',
    sortable: true,
  },
  {
    key: 'requestedAt',
    header: 'Requested At',
    render: (item) => new Date(item.requestedAt).toLocaleString(),
  },
  {
    key: 'status',
    header: 'Status',
    render: (item) => <StatusBadge status={item.status} />,
  },
  {
    key: 'actions',
    header: 'Actions',
    render: (item) =>
      item.status === 'pending' ? (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="default" className="gap-1">
            <CheckCircle className="h-3 w-3" />
            Approve
          </Button>
          <Button size="sm" variant="outline" className="gap-1">
            <XCircle className="h-3 w-3" />
            Reject
          </Button>
        </div>
      ) : (
        <span className="text-sm text-muted-foreground">
          {item.approvedBy ? `By ${item.approvedBy}` : '-'}
        </span>
      ),
  },
];

export default function Approvals() {
  const pending = dummyApprovals.filter((a) => a.status === 'pending');
  const approved = dummyApprovals.filter((a) => a.status === 'approved');
  const rejected = dummyApprovals.filter((a) => a.status === 'rejected');

  return (
    <DashboardLayout navItems={adminNavItems} pageTitle="Approvals & Workflows">
      {/* Summary Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{pending.length}</p>
                <p className="text-sm text-muted-foreground">Pending Approvals</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{approved.length}</p>
                <p className="text-sm text-muted-foreground">Approved Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <XCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{rejected.length}</p>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            Pending
            {pending.length > 0 && (
              <span className="rounded-full bg-warning px-2 py-0.5 text-xs text-warning-foreground">
                {pending.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <DataTable
            data={pending}
            columns={columns}
            searchPlaceholder="Search pending approvals..."
            emptyMessage="No pending approvals"
          />
        </TabsContent>

        <TabsContent value="approved">
          <DataTable
            data={approved}
            columns={columns}
            searchPlaceholder="Search approved items..."
            emptyMessage="No approved items"
          />
        </TabsContent>

        <TabsContent value="rejected">
          <DataTable
            data={rejected}
            columns={columns}
            searchPlaceholder="Search rejected items..."
            emptyMessage="No rejected items"
          />
        </TabsContent>

        <TabsContent value="all">
          <DataTable
            data={dummyApprovals}
            columns={columns}
            searchPlaceholder="Search all approvals..."
          />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
