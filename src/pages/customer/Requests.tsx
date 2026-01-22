import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { customerNavItems } from '@/config/navigation';
import { DataTable, Column } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { KPICard } from '@/components/common/KPICard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, Clock, CheckCircle, XCircle, Plus, Container, Eye } from 'lucide-react';
import { dummyCustomerRequests, dummyContainers } from '@/data/dummyData';
import { useState } from 'react';

interface CustomerRequest {
  id: string;
  type: string;
  containerNumber: string;
  preferredDate: string;
  status: string;
  remarks?: string;
  createdAt: string;
}

export default function CustomerRequests() {
  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<CustomerRequest | null>(null);
  
  // Filter containers for this customer
  const myContainers = dummyContainers.filter(c => c.customer === 'ABC Manufacturing');
  
  const requests = dummyCustomerRequests as CustomerRequest[];
  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const approvedRequests = requests.filter(r => r.status === 'approved').length;
  const rejectedRequests = requests.filter(r => r.status === 'rejected').length;

  const columns: Column<CustomerRequest>[] = [
    {
      key: 'containerNumber',
      header: 'Container No.',
      sortable: true,
      render: (item) => (
        <span className="font-mono font-medium text-foreground">{item.containerNumber}</span>
      ),
    },
    {
      key: 'type',
      header: 'Request Type',
      sortable: true,
      render: (item) => <span className="capitalize font-medium">{item.type}</span>,
    },
    {
      key: 'preferredDate',
      header: 'Preferred Date',
      sortable: true,
      render: (item) => new Date(item.preferredDate).toLocaleDateString(),
    },
    {
      key: 'createdAt',
      header: 'Requested On',
      sortable: true,
      render: (item) => new Date(item.createdAt).toLocaleDateString(),
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
      pageTitle="Requests"
      pageActions={
        <Button onClick={() => setShowNewRequestDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Request
        </Button>
      }
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
          <CardTitle>All Requests</CardTitle>
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
                searchPlaceholder="Search requests..."
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

      {/* New Request Dialog */}
      <Dialog open={showNewRequestDialog} onOpenChange={setShowNewRequestDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Request Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stuffing">Stuffing</SelectItem>
                  <SelectItem value="destuffing">Destuffing</SelectItem>
                  <SelectItem value="movement">Movement</SelectItem>
                  <SelectItem value="inspection">Inspection</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Container</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select container" />
                </SelectTrigger>
                <SelectContent>
                  {myContainers.map((container) => (
                    <SelectItem key={container.id} value={container.id}>
                      <div className="flex items-center gap-2">
                        <Container className="h-4 w-4" />
                        {container.containerNumber}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Preferred Date</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Remarks (Optional)</Label>
              <Textarea placeholder="Any special instructions..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewRequestDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowNewRequestDialog(false)}>
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Details Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Container</p>
                  <p className="font-mono font-medium">{selectedRequest.containerNumber}</p>
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
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Requested On</p>
                  <p className="font-medium">{new Date(selectedRequest.createdAt).toLocaleString()}</p>
                </div>
                {selectedRequest.remarks && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Remarks</p>
                    <p className="font-medium">{selectedRequest.remarks}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
