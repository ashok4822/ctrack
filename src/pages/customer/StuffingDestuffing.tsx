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
import { Package, Clock, CheckCircle, Plus, Container, Eye, Edit } from 'lucide-react';
import { dummyStuffingOperations, dummyContainers } from '@/data/dummyData';
import { useState } from 'react';
import type { StuffingOperation } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function CustomerStuffingDestuffing() {
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<StuffingOperation | null>(null);
  const [requestType, setRequestType] = useState<'stuffing' | 'destuffing'>('stuffing');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [statusRemarks, setStatusRemarks] = useState('');
  const { toast } = useToast();
  
  // Filter containers for this customer
  const myContainers = dummyContainers.filter(c => c.customer === 'ABC Manufacturing');
  
  const pendingOps = dummyStuffingOperations.filter(op => op.status === 'pending').length;
  const inProgressOps = dummyStuffingOperations.filter(op => op.status === 'in-progress').length;
  const completedOps = dummyStuffingOperations.filter(op => op.status === 'completed').length;

  const handleViewDetails = (operation: StuffingOperation) => {
    setSelectedOperation(operation);
    setNewStatus(operation.status);
    setStatusRemarks('');
    setIsUpdatingStatus(false);
    setShowDetailsDialog(true);
  };

  const handleUpdateStatus = () => {
    if (!selectedOperation || !newStatus) return;
    
    // Simulate status update
    toast({
      title: "Status Update Requested",
      description: `Request to update ${selectedOperation.containerNumber} status to "${newStatus}" has been submitted for approval.`,
    });
    
    setShowDetailsDialog(false);
    setSelectedOperation(null);
    setIsUpdatingStatus(false);
  };

  const columns: Column<StuffingOperation>[] = [
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
      header: 'Type',
      sortable: true,
      render: (item) => (
        <span className="capitalize font-medium">{item.type}</span>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      sortable: true,
      render: (item) => <span className="capitalize">{item.location}</span>,
    },
    {
      key: 'scheduledDate',
      header: 'Scheduled Date',
      sortable: true,
      render: (item) => new Date(item.scheduledDate).toLocaleDateString(),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: 'completedDate',
      header: 'Completed',
      render: (item) =>
        item.completedDate ? new Date(item.completedDate).toLocaleDateString() : '-',
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleViewDetails(item)}
          className="gap-1"
        >
          <Eye className="h-4 w-4" />
          View
        </Button>
      ),
    },
  ];

  const handleNewRequest = (type: 'stuffing' | 'destuffing') => {
    setRequestType(type);
    setShowRequestDialog(true);
  };

  const customerStatusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'ready-for-operation', label: 'Ready for Operation' },
    { value: 'cargo-arrived', label: 'Cargo Arrived' },
    { value: 'documents-submitted', label: 'Documents Submitted' },
    { value: 'cancelled', label: 'Request Cancellation' },
  ];

  return (
    <DashboardLayout
      navItems={customerNavItems}
      pageTitle="Stuffing / Destuffing"
      pageActions={
        <div className="flex gap-2">
          <Button onClick={() => handleNewRequest('stuffing')} className="gap-2">
            <Plus className="h-4 w-4" />
            Request Stuffing
          </Button>
          <Button variant="outline" onClick={() => handleNewRequest('destuffing')} className="gap-2">
            <Plus className="h-4 w-4" />
            Request Destuffing
          </Button>
        </div>
      }
    >
      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Operations"
          value={dummyStuffingOperations.length}
          icon={Package}
          variant="primary"
        />
        <KPICard
          title="Pending"
          value={pendingOps}
          icon={Clock}
          variant="warning"
        />
        <KPICard
          title="In Progress"
          value={inProgressOps}
          icon={Package}
        />
        <KPICard
          title="Completed"
          value={completedOps}
          icon={CheckCircle}
          variant="success"
        />
      </div>

      {/* Operations Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Operations</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="stuffing">Stuffing</TabsTrigger>
              <TabsTrigger value="destuffing">Destuffing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <DataTable
                data={dummyStuffingOperations}
                columns={columns}
                searchable
                searchPlaceholder="Search operations..."
                emptyMessage="No operations found"
              />
            </TabsContent>
            
            <TabsContent value="stuffing">
              <DataTable
                data={dummyStuffingOperations.filter(op => op.type === 'stuffing')}
                columns={columns}
                searchable
                searchPlaceholder="Search stuffing operations..."
                emptyMessage="No stuffing operations found"
              />
            </TabsContent>
            
            <TabsContent value="destuffing">
              <DataTable
                data={dummyStuffingOperations.filter(op => op.type === 'destuffing')}
                columns={columns}
                searchable
                searchPlaceholder="Search destuffing operations..."
                emptyMessage="No destuffing operations found"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* New Request Dialog */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="capitalize">Request {requestType}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
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
              <Label>Preferred Location</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="terminal">Terminal</SelectItem>
                  <SelectItem value="factory">Factory</SelectItem>
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
            <Button variant="outline" onClick={() => setShowRequestDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowRequestDialog(false)}>
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Operation Details Dialog with Status Update */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Operation Details</DialogTitle>
          </DialogHeader>
          {selectedOperation && (
            <div className="space-y-4">
              {/* Operation Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Container</p>
                  <p className="font-mono font-medium">{selectedOperation.containerNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="capitalize font-medium">{selectedOperation.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="capitalize">{selectedOperation.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Status</p>
                  <StatusBadge status={selectedOperation.status} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Scheduled Date</p>
                  <p>{new Date(selectedOperation.scheduledDate).toLocaleString()}</p>
                </div>
                {selectedOperation.completedDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Completed Date</p>
                    <p>{new Date(selectedOperation.completedDate).toLocaleString()}</p>
                  </div>
                )}
              </div>

              {selectedOperation.remarks && (
                <div>
                  <p className="text-sm text-muted-foreground">Remarks</p>
                  <p className="text-sm">{selectedOperation.remarks}</p>
                </div>
              )}

              {/* Status Update Section */}
              {selectedOperation.status !== 'completed' && (
                <div className="border-t pt-4">
                  {!isUpdatingStatus ? (
                    <Button
                      variant="outline"
                      onClick={() => setIsUpdatingStatus(true)}
                      className="w-full gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Request Status Update
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>New Status</Label>
                        <Select value={newStatus} onValueChange={setNewStatus}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select new status" />
                          </SelectTrigger>
                          <SelectContent>
                            {customerStatusOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Reason / Remarks</Label>
                        <Textarea
                          value={statusRemarks}
                          onChange={(e) => setStatusRemarks(e.target.value)}
                          placeholder="Please provide reason for status change..."
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
            {isUpdatingStatus && (
              <Button onClick={handleUpdateStatus} disabled={!newStatus}>
                Submit Update Request
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
