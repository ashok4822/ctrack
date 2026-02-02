import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { customerNavItems } from '@/config/navigation';
import { DataTable, Column } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { KPICard } from '@/components/common/KPICard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FileText, Clock, CheckCircle, XCircle, Eye, Container, Package } from 'lucide-react';
import { dummyCustomerRequests, dummyContainers } from '@/data/dummyData';
import { useState } from 'react';

interface CustomerRequest {
  id: string;
  requestNumber: string;
  type: string;
  containerNumber?: string;
  cargoDescription: string;
  cargoWeight: number;
  isHazardous: boolean;
  preferredDate: string;
  status: string;
  remarks?: string;
  createdAt: string;
  allocatedContainer?: string;
}

export default function CustomerRequests() {
  const [selectedRequest, setSelectedRequest] = useState<CustomerRequest | null>(null);
  
  // Map dummy data to include more details
  const requests: CustomerRequest[] = dummyCustomerRequests.map((r, index) => ({
    ...r,
    requestNumber: `REQ-2024-${String(index + 1).padStart(3, '0')}`,
    cargoDescription: r.type === 'stuffing' ? 'Industrial Machinery Parts' : 'Electronic Components',
    cargoWeight: r.type === 'stuffing' ? 18500 : 12000,
    isHazardous: false,
    allocatedContainer: r.status === 'approved' ? r.containerNumber : undefined,
  }));

  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const approvedRequests = requests.filter(r => r.status === 'approved').length;
  const rejectedRequests = requests.filter(r => r.status === 'rejected').length;

  const columns: Column<CustomerRequest>[] = [
    {
      key: 'requestNumber',
      header: 'Request No.',
      sortable: true,
      render: (item) => (
        <span className="font-mono font-medium text-primary">{item.requestNumber}</span>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span className="capitalize font-medium">{item.type}</span>
        </div>
      ),
    },
    {
      key: 'cargoDescription',
      header: 'Cargo Description',
      sortable: true,
      render: (item) => (
        <span className="text-sm">{item.cargoDescription}</span>
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
      key: 'allocatedContainer',
      header: 'Allocated Container',
      sortable: true,
      render: (item) => item.allocatedContainer ? (
        <div className="flex items-center gap-2">
          <Container className="h-4 w-4 text-success" />
          <span className="font-mono text-sm">{item.allocatedContainer}</span>
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
      pageTitle="Requests Listing"
    >
      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
          title="Rejected"
          value={rejectedRequests}
          icon={XCircle}
          variant="danger"
        />
      </div>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Service Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <DataTable
                data={requests}
                columns={columns}
                searchable
                searchPlaceholder="Search by request number, cargo..."
                onRowClick={setSelectedRequest}
                emptyMessage="No requests found"
              />
            </TabsContent>
            
            <TabsContent value="pending">
              <DataTable
                data={requests.filter(r => r.status === 'pending')}
                columns={columns}
                searchable
                searchPlaceholder="Search pending requests..."
                onRowClick={setSelectedRequest}
                emptyMessage="No pending requests"
              />
            </TabsContent>
            
            <TabsContent value="approved">
              <DataTable
                data={requests.filter(r => r.status === 'approved')}
                columns={columns}
                searchable
                searchPlaceholder="Search approved requests..."
                onRowClick={setSelectedRequest}
                emptyMessage="No approved requests"
              />
            </TabsContent>
            
            <TabsContent value="rejected">
              <DataTable
                data={requests.filter(r => r.status === 'rejected')}
                columns={columns}
                searchable
                searchPlaceholder="Search rejected requests..."
                onRowClick={setSelectedRequest}
                emptyMessage="No rejected requests"
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
                  <p className="text-sm text-muted-foreground">Request Number</p>
                  <p className="font-mono font-medium text-primary">{selectedRequest.requestNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <StatusBadge status={selectedRequest.status} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium capitalize">{selectedRequest.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Preferred Date</p>
                  <p className="font-medium">{new Date(selectedRequest.preferredDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Cargo Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="font-medium">{selectedRequest.cargoDescription}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Weight</p>
                    <p className="font-medium">{selectedRequest.cargoWeight.toLocaleString()} kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Hazardous</p>
                    <p className="font-medium">{selectedRequest.isHazardous ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>

              {selectedRequest.allocatedContainer && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Container Allocation</h4>
                  <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
                    <Container className="h-5 w-5 text-success" />
                    <div>
                      <p className="font-mono font-medium">{selectedRequest.allocatedContainer}</p>
                      <p className="text-sm text-muted-foreground">Container allocated by terminal</p>
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
    </DashboardLayout>
  );
}
