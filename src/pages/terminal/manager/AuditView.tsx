import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable, Column } from '@/components/common/DataTable';
import { KPICard } from '@/components/common/KPICard';
import { managerNavItems } from '@/config/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { dummyAuditLogs } from '@/data/dummyData';
import type { AuditLog } from '@/types';
import { ScrollText, Users, Activity, Calendar } from 'lucide-react';

const columns: Column<AuditLog>[] = [
  {
    key: 'timestamp',
    header: 'Timestamp',
    sortable: true,
    render: (item) => (
      <span className="text-sm">{new Date(item.timestamp).toLocaleString()}</span>
    ),
  },
  {
    key: 'userName',
    header: 'User',
    sortable: true,
    render: (item) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-7 w-7">
          <AvatarFallback className="text-xs">
            {item.userName.split(' ').map((n) => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium">{item.userName}</span>
      </div>
    ),
  },
  {
    key: 'action',
    header: 'Action',
    sortable: true,
    render: (item) => (
      <Badge variant="outline" className="capitalize">
        {item.action}
      </Badge>
    ),
  },
  {
    key: 'module',
    header: 'Module',
    sortable: true,
    render: (item) => <span className="capitalize">{item.module}</span>,
  },
  {
    key: 'details',
    header: 'Details',
    render: (item) => (
      <span className="text-sm text-muted-foreground max-w-xs truncate block">
        {item.details}
      </span>
    ),
  },
  {
    key: 'ipAddress',
    header: 'IP Address',
    render: (item) => (
      <code className="text-xs bg-muted px-2 py-1 rounded">{item.ipAddress || '-'}</code>
    ),
  },
];

export default function AuditView() {
  const uniqueUsers = new Set(dummyAuditLogs.map((log) => log.userName)).size;
  const uniqueModules = new Set(dummyAuditLogs.map((log) => log.module)).size;
  const todayLogs = dummyAuditLogs.filter((log) => {
    const logDate = new Date(log.timestamp).toDateString();
    return logDate === new Date().toDateString();
  });

  // Group by module for summary
  const moduleStats = dummyAuditLogs.reduce((acc, log) => {
    acc[log.module] = (acc[log.module] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Group by action for summary
  const actionStats = dummyAuditLogs.reduce((acc, log) => {
    acc[log.action] = (acc[log.action] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <DashboardLayout navItems={managerNavItems} pageTitle="Audit View">
      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Entries"
          value={dummyAuditLogs.length}
          icon={ScrollText}
        />
        <KPICard
          title="Unique Modules"
          value={uniqueModules}
          icon={Activity}
          variant="primary"
        />
        <KPICard
          title="Active Users"
          value={uniqueUsers}
          icon={Users}
        />
        <KPICard
          title="Today's Activity"
          value={todayLogs.length}
          icon={Calendar}
          variant="success"
        />
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        {/* Activity by Module */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Activity by Module</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(moduleStats)
                .sort(([, a], [, b]) => b - a)
                .map(([module, count]) => (
                  <div key={module} className="flex items-center justify-between">
                    <span className="capitalize text-sm">{module}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${(count / dummyAuditLogs.length) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-8">{count}</span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity by Action */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Activity by Action</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(actionStats)
                .sort(([, a], [, b]) => b - a)
                .map(([action, count]) => (
                  <Badge key={action} variant="secondary" className="gap-1">
                    <span className="capitalize">{action}</span>
                    <span className="text-xs opacity-70">({count})</span>
                  </Badge>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Log Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Audit Log Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={dummyAuditLogs}
            columns={columns}
            searchPlaceholder="Search audit logs..."
          />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
