import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable, Column } from '@/components/common/DataTable';
import { adminNavItems } from '@/config/navigation';
import { dummyAuditLogs } from '@/data/dummyData';
import type { AuditLog } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollText, User, Calendar, Activity } from 'lucide-react';

const columns: Column<AuditLog>[] = [
  {
    key: 'timestamp',
    header: 'Timestamp',
    sortable: true,
    render: (item) => new Date(item.timestamp).toLocaleString(),
  },
  {
    key: 'userName',
    header: 'User',
    sortable: true,
    render: (item) => (
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
          <User className="h-4 w-4 text-primary" />
        </div>
        <span className="font-medium">{item.userName}</span>
      </div>
    ),
  },
  {
    key: 'action',
    header: 'Action',
    sortable: true,
    render: (item) => (
      <span className="font-medium text-foreground">{item.action}</span>
    ),
  },
  {
    key: 'module',
    header: 'Module',
    sortable: true,
  },
  {
    key: 'details',
    header: 'Details',
    render: (item) => (
      <span className="text-sm text-muted-foreground">{item.details}</span>
    ),
  },
  {
    key: 'ipAddress',
    header: 'IP Address',
    render: (item) => (
      <code className="rounded bg-muted px-2 py-1 text-xs">{item.ipAddress}</code>
    ),
  },
];

export default function AuditLogs() {
  return (
    <DashboardLayout navItems={adminNavItems} pageTitle="Audit Logs">
      {/* Summary Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <ScrollText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{dummyAuditLogs.length}</p>
                <p className="text-sm text-muted-foreground">Total Entries</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <Activity className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {new Set(dummyAuditLogs.map(l => l.module)).size}
                </p>
                <p className="text-sm text-muted-foreground">Modules</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <User className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {new Set(dummyAuditLogs.map(l => l.userId)).size}
                </p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
                <Calendar className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">Today</p>
                <p className="text-sm text-muted-foreground">Current View</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Log Table */}
      <DataTable
        data={dummyAuditLogs}
        columns={columns}
        searchPlaceholder="Search audit logs..."
      />
    </DashboardLayout>
  );
}
