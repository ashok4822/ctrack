import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable, Column } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Package, Clock, CheckCircle, AlertTriangle, MapPin, Calendar, User, FileText } from 'lucide-react';
import type { StuffingOperation } from '@/types';
import { adminNavItems } from '@/config/navigation';

const stuffingOperations: StuffingOperation[] = [
  {
    id: '1',
    type: 'stuffing',
    containerId: 'c1',
    containerNumber: 'MSCU1234567',
    status: 'pending',
    location: 'terminal',
    scheduledDate: '2024-01-15T09:00:00',
    remarks: 'Priority cargo for export',
  },
  {
    id: '2',
    type: 'destuffing',
    containerId: 'c2',
    containerNumber: 'MAEU7654321',
    status: 'in-progress',
    location: 'factory',
    scheduledDate: '2024-01-15T10:30:00',
    remarks: 'Fragile items - handle with care',
  },
  {
    id: '3',
    type: 'stuffing',
    containerId: 'c3',
    containerNumber: 'HLCU9876543',
    status: 'completed',
    location: 'terminal',
    scheduledDate: '2024-01-14T14:00:00',
    completedDate: '2024-01-14T16:30:00',
    remarks: 'Completed ahead of schedule',
  },
  {
    id: '4',
    type: 'destuffing',
    containerId: 'c4',
    containerNumber: 'CMAU5432109',
    status: 'approved',
    location: 'terminal',
    scheduledDate: '2024-01-16T08:00:00',
    remarks: 'Awaiting equipment availability',
  },
  {
    id: '5',
    type: 'stuffing',
    containerId: 'c5',
    containerNumber: 'OOLU1357924',
    status: 'pending',
    location: 'factory',
    scheduledDate: '2024-01-17T11:00:00',
    remarks: 'Customer requested specific time slot',
  },
];

const StuffingDestuffing = () => {
  const [selectedOperation, setSelectedOperation] = useState<StuffingOperation | null>(null);

  const pendingCount = stuffingOperations.filter(op => op.status === 'pending').length;
  const inProgressCount = stuffingOperations.filter(op => op.status === 'in-progress').length;
  const completedCount = stuffingOperations.filter(op => op.status === 'completed').length;
  const approvedCount = stuffingOperations.filter(op => op.status === 'approved').length;

  const columns: Column<StuffingOperation>[] = [
    {
      key: 'containerNumber',
      header: 'Container',
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
        <Badge variant={item.type === 'stuffing' ? 'default' : 'secondary'} className="capitalize">
          {item.type}
        </Badge>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="capitalize">{item.location}</span>
        </div>
      ),
    },
    {
      key: 'scheduledDate',
      header: 'Scheduled',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{new Date(item.scheduledDate).toLocaleDateString()}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedOperation(item)}
            >
              View Details
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Operation Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Container</p>
                  <p className="font-mono font-medium">{item.containerNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="capitalize font-medium">{item.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="capitalize">{item.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <StatusBadge status={item.status} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Scheduled Date</p>
                  <p>{new Date(item.scheduledDate).toLocaleString()}</p>
                </div>
                {item.completedDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Completed Date</p>
                    <p>{new Date(item.completedDate).toLocaleString()}</p>
                  </div>
                )}
              </div>
              {item.remarks && (
                <div>
                  <p className="text-sm text-muted-foreground">Remarks</p>
                  <p className="text-sm">{item.remarks}</p>
                </div>
              )}
              <div className="flex gap-2 pt-4">
                {item.status === 'pending' && (
                  <Button className="flex-1">Approve</Button>
                )}
                {item.status === 'approved' && (
                  <Button className="flex-1">Start Operation</Button>
                )}
                {item.status === 'in-progress' && (
                  <Button className="flex-1">Mark Complete</Button>
                )}
                <Button variant="outline" className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  View History
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ),
    },
  ];

  return (
    <DashboardLayout navItems={adminNavItems}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Stuffing / Destuffing</h1>
            <p className="text-muted-foreground">Manage container stuffing and destuffing operations</p>
          </div>
          <Button>
            <Package className="h-4 w-4 mr-2" />
            New Operation
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/10">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{inProgressCount}</p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{completedCount}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <AlertTriangle className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{approvedCount}</p>
                  <p className="text-sm text-muted-foreground">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Operations Table with Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Operations</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Operations</TabsTrigger>
                <TabsTrigger value="stuffing">Stuffing</TabsTrigger>
                <TabsTrigger value="destuffing">Destuffing</TabsTrigger>
                <TabsTrigger value="pending">Pending Approval</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <DataTable
                  data={stuffingOperations}
                  columns={columns}
                  searchable
                  searchPlaceholder="Search by container number..."
                />
              </TabsContent>
              <TabsContent value="stuffing">
                <DataTable
                  data={stuffingOperations.filter(op => op.type === 'stuffing')}
                  columns={columns}
                  searchable
                  searchPlaceholder="Search stuffing operations..."
                />
              </TabsContent>
              <TabsContent value="destuffing">
                <DataTable
                  data={stuffingOperations.filter(op => op.type === 'destuffing')}
                  columns={columns}
                  searchable
                  searchPlaceholder="Search destuffing operations..."
                />
              </TabsContent>
              <TabsContent value="pending">
                <DataTable
                  data={stuffingOperations.filter(op => op.status === 'pending')}
                  columns={columns}
                  searchable
                  searchPlaceholder="Search pending operations..."
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StuffingDestuffing;
