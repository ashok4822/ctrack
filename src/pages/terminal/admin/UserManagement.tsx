import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable, Column } from '@/components/common/DataTable';
import { adminNavItems } from '@/config/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { dummyUsers } from '@/data/dummyData';
import type { User, UserType, UserRole } from '@/types';
import { Users, Plus, Shield, Settings, Pencil } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Role permissions configuration
const rolePermissions = {
  admin: {
    containers: { view: true, create: true, edit: true, delete: true },
    yard: { view: true, create: true, edit: true, delete: true },
    gate: { view: true, create: true, edit: true, delete: true },
    users: { view: true, create: true, edit: true, delete: true },
    reports: { view: true, create: true, edit: true, delete: true },
    billing: { view: true, create: true, edit: true, delete: true },
  },
  manager: {
    containers: { view: true, create: true, edit: true, delete: false },
    yard: { view: true, create: true, edit: true, delete: false },
    gate: { view: true, create: true, edit: true, delete: false },
    users: { view: true, create: false, edit: false, delete: false },
    reports: { view: true, create: true, edit: true, delete: false },
    billing: { view: true, create: true, edit: false, delete: false },
  },
  operator: {
    containers: { view: true, create: true, edit: true, delete: false },
    yard: { view: true, create: true, edit: true, delete: false },
    gate: { view: true, create: true, edit: true, delete: false },
    users: { view: false, create: false, edit: false, delete: false },
    reports: { view: true, create: false, edit: false, delete: false },
    billing: { view: true, create: true, edit: false, delete: false },
  },
  surveyor: {
    containers: { view: true, create: false, edit: true, delete: false },
    yard: { view: true, create: false, edit: false, delete: false },
    gate: { view: true, create: false, edit: false, delete: false },
    users: { view: false, create: false, edit: false, delete: false },
    reports: { view: true, create: true, edit: true, delete: false },
    billing: { view: false, create: false, edit: false, delete: false },
  },
};

type RoleKey = keyof typeof rolePermissions;
type ModuleKey = keyof typeof rolePermissions.admin;

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(dummyUsers);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [manageRolesOpen, setManageRolesOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRoleForConfig, setSelectedRoleForConfig] = useState<RoleKey>('admin');
  const [permissions, setPermissions] = useState(rolePermissions);

  // New user form state
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    type: 'terminal' as UserType,
    role: 'operator' as UserRole,
    organization: '',
  });

  const terminalUsers = users.filter(u => u.type === 'terminal');
  const externalUsers = users.filter(u => u.type !== 'terminal');

  const handleAddUser = () => {
    const user: User = {
      id: `user-${Date.now()}`,
      ...newUser,
    };
    setUsers([...users, user]);
    setAddUserOpen(false);
    setNewUser({ name: '', email: '', type: 'terminal', role: 'operator', organization: '' });
    toast({
      title: 'User Added',
      description: `${user.name} has been added successfully.`,
    });
  };

  const handleEditUser = () => {
    if (!selectedUser) return;
    setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u));
    setEditUserOpen(false);
    setSelectedUser(null);
    toast({
      title: 'User Updated',
      description: 'User details have been updated successfully.',
    });
  };

  const handlePermissionChange = (role: RoleKey, module: ModuleKey, permission: string, checked: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [module]: {
          ...prev[role][module],
          [permission]: checked,
        },
      },
    }));
  };

  const handleSaveRoles = () => {
    setManageRolesOpen(false);
    toast({
      title: 'Roles Updated',
      description: 'Role permissions have been saved successfully.',
    });
  };

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
      render: (item) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              setSelectedUser(item);
              setEditUserOpen(true);
            }}
          >
            <Pencil className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button variant="ghost" size="sm">
            Permissions
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout
      navItems={adminNavItems}
      pageTitle="User & Role Management"
      pageActions={
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => setManageRolesOpen(true)}>
            <Shield className="h-4 w-4" />
            Manage Roles
          </Button>
          <Button className="gap-2" onClick={() => setAddUserOpen(true)}>
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
                <p className="text-2xl font-bold text-foreground">{users.length}</p>
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
        data={users}
        columns={columns}
        searchPlaceholder="Search users..."
      />

      {/* Role Summary */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {(['admin', 'manager', 'operator', 'surveyor'] as const).map((role) => (
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
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full gap-2"
                onClick={() => {
                  setSelectedRoleForConfig(role);
                  setManageRolesOpen(true);
                }}
              >
                <Settings className="h-3 w-3" />
                Configure
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add User Dialog */}
      <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user account with role assignment.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="Enter full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="Enter email address"
              />
            </div>
            <div className="space-y-2">
              <Label>User Type</Label>
              <Select value={newUser.type} onValueChange={(value: UserType) => setNewUser({ ...newUser, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="terminal">Terminal</SelectItem>
                  <SelectItem value="shipping-line">Shipping Line</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {newUser.type === 'terminal' && (
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={newUser.role} onValueChange={(value: UserRole) => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="operator">Operator</SelectItem>
                    <SelectItem value="surveyor">Surveyor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="organization">Organization (Optional)</Label>
              <Input
                id="organization"
                value={newUser.organization}
                onChange={(e) => setNewUser({ ...newUser, organization: e.target.value })}
                placeholder="Enter organization name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddUserOpen(false)}>Cancel</Button>
            <Button onClick={handleAddUser} disabled={!newUser.name || !newUser.email}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editUserOpen} onOpenChange={setEditUserOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user details and role assignment.</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>User Type</Label>
                <Select 
                  value={selectedUser.type} 
                  onValueChange={(value: UserType) => setSelectedUser({ ...selectedUser, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="terminal">Terminal</SelectItem>
                    <SelectItem value="shipping-line">Shipping Line</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {selectedUser.type === 'terminal' && (
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select 
                    value={selectedUser.role || 'operator'} 
                    onValueChange={(value: UserRole) => setSelectedUser({ ...selectedUser, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="operator">Operator</SelectItem>
                      <SelectItem value="surveyor">Surveyor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="edit-organization">Organization</Label>
                <Input
                  id="edit-organization"
                  value={selectedUser.organization || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, organization: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUserOpen(false)}>Cancel</Button>
            <Button onClick={handleEditUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Roles Dialog */}
      <Dialog open={manageRolesOpen} onOpenChange={setManageRolesOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Role Permissions</DialogTitle>
            <DialogDescription>Configure permissions for each role across different modules.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Role</Label>
              <Select value={selectedRoleForConfig} onValueChange={(value: RoleKey) => setSelectedRoleForConfig(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="operator">Operator</SelectItem>
                  <SelectItem value="surveyor">Surveyor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-medium">Module</th>
                    <th className="text-center p-3 font-medium">View</th>
                    <th className="text-center p-3 font-medium">Create</th>
                    <th className="text-center p-3 font-medium">Edit</th>
                    <th className="text-center p-3 font-medium">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(permissions[selectedRoleForConfig]).map(([module, perms]) => (
                    <tr key={module} className="border-t">
                      <td className="p-3 font-medium capitalize">{module}</td>
                      {['view', 'create', 'edit', 'delete'].map((perm) => (
                        <td key={perm} className="text-center p-3">
                          <Checkbox
                            checked={perms[perm as keyof typeof perms]}
                            onCheckedChange={(checked) => 
                              handlePermissionChange(
                                selectedRoleForConfig, 
                                module as ModuleKey, 
                                perm, 
                                checked as boolean
                              )
                            }
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setManageRolesOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveRoles}>Save Permissions</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
