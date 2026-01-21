import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable, Column } from '@/components/common/DataTable';
import { adminNavItems } from '@/config/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dummyUsers } from '@/data/dummyData';
import type { User } from '@/types';
import { Users, Plus, Shield, Settings } from 'lucide-react';

const columns: Column<User>[] = [
  {
    key: 'name',
    header: 'Name',
    sortable: true,
    render: (item) => (
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
          <span className="text-sm font-medium text-primary">
            {item.name.charAt(0)}
          </span>
        </div>
        <span className="font-medium text-foreground">{item.name}</span>
      </div>
    ),
  },
  {
    key: 'email',
    header: 'Email',
    sortable: true,
  },
  {
    key: 'type',
    header: 'User Type',
    render: (item) => <span className="capitalize">{item.type.replace('-', ' ')}</span>,
  },
  {
    key: 'role',
    header: 'Role',
    render: (item) => (
      <span className="capitalize">{item.role || '-'}</span>
    ),
  },
  {
    key: 'organization',
    header: 'Organization',
    render: (item) => item.organization || '-',
  },
  {
    key: 'actions',
    header: 'Actions',
    render: () => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          Edit
        </Button>
        <Button variant="ghost" size="sm">
          Permissions
        </Button>
      </div>
    ),
  },
];

export default function UserManagement() {
  const terminalUsers = dummyUsers.filter(u => u.type === 'terminal');
  const externalUsers = dummyUsers.filter(u => u.type !== 'terminal');

  return (
    <DashboardLayout
      navItems={adminNavItems}
      pageTitle="User & Role Management"
      pageActions={
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Shield className="h-4 w-4" />
            Manage Roles
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>
      }
    >
      {/* Summary Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{dummyUsers.length}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <Users className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{terminalUsers.length}</p>
                <p className="text-sm text-muted-foreground">Terminal Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <Users className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{externalUsers.length}</p>
                <p className="text-sm text-muted-foreground">External Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
                <Shield className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">4</p>
                <p className="text-sm text-muted-foreground">Roles Defined</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Table */}
      <DataTable
        data={dummyUsers}
        columns={columns}
        searchPlaceholder="Search users..."
      />

      {/* Role Summary */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {['admin', 'manager', 'operator', 'surveyor'].map((role) => (
          <Card key={role} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base capitalize flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                {role}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                {role === 'admin' && 'Full system access and configuration'}
                {role === 'manager' && 'Operations monitoring and approvals'}
                {role === 'operator' && 'Daily operations and task execution'}
                {role === 'surveyor' && 'Container inspection and damage reports'}
              </p>
              <Button variant="outline" size="sm" className="w-full gap-2">
                <Settings className="h-3 w-3" />
                Configure
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
