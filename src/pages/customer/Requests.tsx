import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { customerNavItems } from '@/config/navigation';
import { DataTable, Column } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { KPICard } from '@/components/common/KPICard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { SupportChatbot } from '@/components/customer/SupportChatbot';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FileText, Clock, CheckCircle, XCircle, Eye, Container, Package, AlertTriangle } from 'lucide-react';
import { dummyCustomerRequests } from '@/data/dummyData';
import type { ContainerRequest } from '@/types';
import { useState } from 'react';

export default function CustomerRequests() {
  const [selectedRequest, setSelectedRequest] = useState<ContainerRequest | null>(null);

  const requests = dummyCustomerRequests.filter(r => r.customerName === 'ABC Manufacturing');

  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const approvedRequests = requests.filter(r => r.status === 'approved').length;
  const inProgressRequests = requests.filter(r => r.status === 'in-progress').length;
  const completedRequests = requests.filter(r => r.status === 'completed').length;

  const columns: Column<ContainerRequest>[] = [
    {
      key: 'id',
      header: 'Request No.',
      sortable: true,
      render: (item) => (
        <span className="font-mono font-medium text-primary">REQ-{item.id.slice(0, 6)}</span>
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
      key: 'cargoDescription',
      header: 'Cargo Description',
      render: (item) => (
        <div className="max-w-[200px] truncate" title={item.cargoDescription}>
          {item.cargoDescription}
        </div>
      ),
    },
    {
      key: 'cargoWeight',
      header: 'Weight (kg)',
      sortable: true,
      render: (item) => (
        <span className="font-medium">{item.cargoWeight.toLocaleString()}</span>
      ),
    },
    {
      key: 'isHazardous',
      header: 'Hazardous',
      render: (item) => item.isHazardous ? (
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          Yes
        </Badge>
      ) : (
        <span className="text-muted-foreground">No</span>
      ),
    },
    {
      key: 'containerNumber',
      header: 'Allocated Container',
      render: (item) => item.containerNumber ? (
        <div className="flex items-center gap-2">
          <Container className="h-4 w-4 text-success" />
          <span className="font-mono text-sm">{item.containerNumber}</span>
        </div>
      ) : (
        <span className="text-muted-foreground text-sm">Not allocated</span>
      ),
    },
    {
      key: 'preferredDate',
      header: 'Preferred Date',
      sortable: true,
      render: (item) => new Date(item.preferredDate).toLocaleDateString(),
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
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedRequest(item);
          }}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <DashboardLayout
      navItems={customerNavItems}
      pageTitle="Container Requests Listing"
    >
      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KPICard
          title="Total Requests"
          value={requests.length}
          icon={FileText}
          variant="primary"
        />
        <KPICard
          title="Pending"
          value={pendingRequests}
          icon={Clock}
          variant="warning"
        />
        <KPICard
          title="Approved"
          value={approvedRequests}
          icon={CheckCircle}
          variant="success"
        />
        <KPICard
          title="In Progress"
          value={inProgressRequests}
          icon={Package}
        />
        <KPICard
          title="Completed"
          value={completedRequests}
          icon={CheckCircle}
        />
      </div>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>My Container Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingRequests})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({approvedRequests})</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress ({inProgressRequests})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <DataTable
                data={requests}
                columns={columns}
                searchable
                searchPlaceholder="Search by cargo description..."
                onRowClick={setSelectedRequest}
                emptyMessage="No requests found"
              />
            </TabsContent>

            <TabsContent value="pending">
              <DataTable
                data={requests.filter(r => r.status === 'pending')}
                columns={columns}
                onRowClick={setSelectedRequest}
                emptyMessage="No pending requests"
              />
            </TabsContent>

            <TabsContent value="approved">
              <DataTable
                data={requests.filter(r => r.status === 'approved')}
                columns={columns}
                onRowClick={setSelectedRequest}
                emptyMessage="No approved requests"
              />
            </TabsContent>

            <TabsContent value="in-progress">
              <DataTable
                data={requests.filter(r => r.status === 'in-progress')}
                columns={columns}
                onRowClick={setSelectedRequest}
                emptyMessage="No in-progress requests"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Request Details Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Request ID</p>
                  <p className="font-mono font-medium text-primary">REQ-{selectedRequest.id.slice(0, 6)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <StatusBadge status={selectedRequest.status} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <Badge variant={selectedRequest.type === 'stuffing' ? 'default' : 'secondary'} className="capitalize">
                    {selectedRequest.type}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Preferred Date</p>
                  <p className="font-medium">{new Date(selectedRequest.preferredDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Cargo Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="font-medium">{selectedRequest.cargoDescription}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Weight</p>
                    <p className="font-medium">{selectedRequest.cargoWeight.toLocaleString()} kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Hazardous</p>
                    {selectedRequest.isHazardous ? (
                      <Badge variant="destructive" className="gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Yes - {selectedRequest.hazardClass}
                      </Badge>
                    ) : (
                      <p className="font-medium">No</p>
                    )}
                  </div>
                </div>
              </div>

              {selectedRequest.containerNumber && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Container Allocation</h4>
                  <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
                    <Container className="h-5 w-5 text-success" />
                    <div>
                      <p className="font-mono font-medium">{selectedRequest.containerNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedRequest.containerSize} • {selectedRequest.containerType}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground">Requested On</p>
                <p className="font-medium">{new Date(selectedRequest.createdAt).toLocaleString()}</p>
              </div>

              {selectedRequest.remarks && (
                <div>
                  <p className="text-sm text-muted-foreground">Remarks</p>
                  <p className="font-medium">{selectedRequest.remarks}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Support Chatbot */}
      <SupportChatbot />
    </DashboardLayout>
  );
}
