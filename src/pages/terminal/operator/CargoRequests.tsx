import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KPICard } from '@/components/common/KPICard';
import { DataTable, Column } from '@/components/common/DataTable';
import { operatorNavItems } from '@/config/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Package,
  Container,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Calendar,
  Weight,
} from 'lucide-react';
import { dummyCustomerRequests, dummyContainers } from '@/data/dummyData';
import type { ContainerRequest } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function CargoRequests() {
  const { toast } = useToast();
  const [requests, setRequests] = useState<ContainerRequest[]>(dummyCustomerRequests);
  const [selectedRequest, setSelectedRequest] = useState<ContainerRequest | null>(null);
  const [allocationDialogOpen, setAllocationDialogOpen] = useState(false);
  const [selectedContainer, setSelectedContainer] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  // Get available containers for allocation (empty for stuffing, loaded for destuffing)
  const getAvailableContainers = (request: ContainerRequest | null) => {
    if (!request) return [];
    if (request.type === 'stuffing') {
      // For stuffing, show empty containers in yard
      return dummyContainers.filter(c => c.status === 'in-yard' && !c.weight);
    }
    // For destuffing, show loaded containers
    return dummyContainers.filter(c => c.status === 'in-yard' && c.weight);
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const approvedRequests = requests.filter(r => r.status === 'approved');
  const inProgressRequests = requests.filter(r => r.status === 'in-progress');
  const completedRequests = requests.filter(r => r.status === 'completed');

  const handleAllocate = () => {
    if (!selectedRequest || !selectedContainer) {
      toast({
        title: 'Error',
        description: 'Please select a container to allocate',
        variant: 'destructive',
      });
      return;
    }

    const container = dummyContainers.find(c => c.id === selectedContainer);
    setRequests(prev =>
      prev.map(r =>
        r.id === selectedRequest.id
          ? {
              ...r,
              status: 'approved' as const,
              containerId: selectedContainer,
              containerNumber: container?.containerNumber,
              containerSize: container?.size,
              containerType: container?.type,
            }
          : r
      )
    );

    toast({
      title: 'Container Allocated',
      description: `Container ${container?.containerNumber} allocated to request ${selectedRequest.id}`,
    });

    setAllocationDialogOpen(false);
    setSelectedRequest(null);
    setSelectedContainer('');
  };

  const handleReject = () => {
    if (!selectedRequest || !rejectionReason.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a rejection reason',
        variant: 'destructive',
      });
      return;
    }

    setRequests(prev =>
      prev.map(r =>
        r.id === selectedRequest.id
          ? { ...r, status: 'rejected' as const, remarks: rejectionReason }
          : r
      )
    );

    toast({
      title: 'Request Rejected',
      description: `Request ${selectedRequest.id} has been rejected`,
      variant: 'destructive',
    });

    setRejectDialogOpen(false);
    setSelectedRequest(null);
    setRejectionReason('');
  };

  const handleStartOperation = (request: ContainerRequest) => {
    setRequests(prev =>
      prev.map(r =>
        r.id === request.id ? { ...r, status: 'in-progress' as const } : r
      )
    );
    toast({
      title: 'Operation Started',
      description: `${request.type} operation started for ${request.containerNumber || 'request'}`,
    });
  };

  const handleCompleteOperation = (request: ContainerRequest) => {
    setRequests(prev =>
      prev.map(r =>
        r.id === request.id ? { ...r, status: 'completed' as const } : r
      )
    );
    toast({
      title: 'Operation Completed',
      description: `${request.type} operation completed successfully`,
    });
  };

  const columns: Column<ContainerRequest>[] = [
    {
      key: 'id',
      header: 'Request ID',
      render: (item) => <span className="font-mono text-xs">REQ-{item.id.slice(0, 6)}</span>,
    },
    {
      key: 'type',
      header: 'Type',
      render: (item) => (
        <Badge variant={item.type === 'stuffing' ? 'default' : 'secondary'} className="capitalize">
          {item.type}
        </Badge>
      ),
    },
    { key: 'customerName', header: 'Customer', sortable: true },
    {
      key: 'cargoDescription',
      header: 'Cargo',
      render: (item) => (
        <div className="max-w-[200px] truncate" title={item.cargoDescription}>
          {item.cargoDescription}
        </div>
      ),
    },
    {
      key: 'cargoWeight',
      header: 'Weight',
      render: (item) => `${item.cargoWeight.toLocaleString()} kg`,
    },
    {
      key: 'containerNumber',
      header: 'Allocated Container',
      render: (item) =>
        item.containerNumber ? (
          <span className="font-mono">{item.containerNumber}</span>
        ) : (
          <span className="text-muted-foreground">Not allocated</span>
        ),
    },
    {
      key: 'isHazardous',
      header: 'Hazardous',
      render: (item) =>
        item.isHazardous ? (
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="h-3 w-3" />
            Yes
          </Badge>
        ) : (
          <span className="text-muted-foreground">No</span>
        ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <div className="flex gap-2">
          {item.status === 'pending' && (
            <>
              <Button
                size="sm"
                onClick={() => {
                  setSelectedRequest(item);
                  setAllocationDialogOpen(true);
                }}
              >
                Allocate
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  setSelectedRequest(item);
                  setRejectDialogOpen(true);
                }}
              >
                Reject
              </Button>
            </>
          )}
          {item.status === 'approved' && (
            <Button size="sm" onClick={() => handleStartOperation(item)}>
              Start
            </Button>
          )}
          {item.status === 'in-progress' && (
            <Button size="sm" variant="default" onClick={() => handleCompleteOperation(item)}>
              Complete
            </Button>
          )}
          {item.status === 'completed' && (
            <span className="text-success text-sm flex items-center gap-1">
              <CheckCircle className="h-4 w-4" /> Done
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout navItems={operatorNavItems} pageTitle="Cargo Requests & Allocation">
      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Pending Requests"
          value={pendingRequests.length}
          icon={Clock}
          variant="warning"
        />
        <KPICard
          title="Allocated (Approved)"
          value={approvedRequests.length}
          icon={Container}
          variant="primary"
        />
        <KPICard
          title="In Progress"
          value={inProgressRequests.length}
          icon={Package}
          variant="success"
        />
        <KPICard
          title="Completed"
          value={completedRequests.length}
          icon={CheckCircle}
        />
      </div>

      {/* Requests Table with Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Customer Cargo Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList>
              <TabsTrigger value="pending">
                Pending ({pendingRequests.length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({approvedRequests.length})
              </TabsTrigger>
              <TabsTrigger value="in-progress">
                In Progress ({inProgressRequests.length})
              </TabsTrigger>
              <TabsTrigger value="all">All Requests</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <DataTable columns={columns} data={pendingRequests} />
            </TabsContent>

            <TabsContent value="approved">
              <DataTable columns={columns} data={approvedRequests} />
            </TabsContent>

            <TabsContent value="in-progress">
              <DataTable columns={columns} data={inProgressRequests} />
            </TabsContent>

            <TabsContent value="all">
              <DataTable columns={columns} data={requests} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Allocation Dialog */}
      <Dialog open={allocationDialogOpen} onOpenChange={setAllocationDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Allocate Container</DialogTitle>
            <DialogDescription>
              Select a container to allocate to this {selectedRequest?.type} request
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              {/* Request Details */}
              <div className="rounded-lg border p-4 bg-muted/30 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground text-xs">Customer</p>
                      <p className="font-medium">{selectedRequest.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground text-xs">Type</p>
                      <p className="font-medium capitalize">{selectedRequest.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Weight className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground text-xs">Cargo Weight</p>
                      <p className="font-medium">{selectedRequest.cargoWeight.toLocaleString()} kg</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground text-xs">Preferred Date</p>
                      <p className="font-medium">
                        {new Date(selectedRequest.preferredDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Cargo Description</p>
                  <p className="text-sm">{selectedRequest.cargoDescription}</p>
                </div>
                {selectedRequest.isHazardous && (
                  <Badge variant="destructive" className="gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Hazardous: {selectedRequest.hazardClass} - UN {selectedRequest.unNumber}
                  </Badge>
                )}
              </div>

              {/* Container Selection */}
              <div className="space-y-2">
                <Label>Select Container</Label>
                <Select value={selectedContainer} onValueChange={setSelectedContainer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a container" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableContainers(selectedRequest).map((container) => (
                      <SelectItem key={container.id} value={container.id}>
                        <div className="flex items-center gap-2">
                          <span className="font-mono">{container.containerNumber}</span>
                          <span className="text-muted-foreground text-xs">
                            {container.size} • {container.type}
                          </span>
                          {container.yardLocation && (
                            <span className="text-muted-foreground text-xs">
                              @ {container.yardLocation.block}
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {selectedRequest.type === 'stuffing'
                    ? 'Showing empty containers available for stuffing'
                    : 'Showing loaded containers available for destuffing'}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setAllocationDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAllocate} disabled={!selectedContainer}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Allocate Container
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this request
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Rejection Reason</Label>
              <Textarea
                placeholder="Enter the reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              <XCircle className="mr-2 h-4 w-4" />
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
