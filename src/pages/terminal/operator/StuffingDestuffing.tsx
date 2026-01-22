import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KPICard } from '@/components/common/KPICard';
import { DataTable, Column } from '@/components/common/DataTable';
import { operatorNavItems } from '@/config/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Package,
  PackagePlus,
  PackageMinus,
  Clock,
  CheckCircle,
  Send,
} from 'lucide-react';
import { dummyStuffingOperations } from '@/data/dummyData';
import type { StuffingOperation } from '@/types';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function OperatorStuffingDestuffing() {
  const { toast } = useToast();
  const [selectedOperation, setSelectedOperation] = useState<StuffingOperation | null>(null);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [approvalForm, setApprovalForm] = useState({
    requestType: '',
    priority: 'normal',
    reason: '',
    remarks: '',
  });
  
  const stuffingOps = dummyStuffingOperations.filter(op => op.type === 'stuffing');
  const destuffingOps = dummyStuffingOperations.filter(op => op.type === 'destuffing');
  const pendingOps = dummyStuffingOperations.filter(op => op.status === 'pending');
  const inProgressOps = dummyStuffingOperations.filter(op => op.status === 'in-progress');

  const handleRequestApproval = () => {
    if (!selectedOperation || !approvalForm.requestType || !approvalForm.reason) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Approval Request Submitted",
      description: `Request for ${selectedOperation.containerNumber} has been sent to manager for approval.`,
    });
    setApprovalDialogOpen(false);
    setSelectedOperation(null);
    setApprovalForm({ requestType: '', priority: 'normal', reason: '', remarks: '' });
  };

  const openApprovalDialog = (op: StuffingOperation) => {
    setSelectedOperation(op);
    setApprovalForm({ requestType: '', priority: 'normal', reason: '', remarks: '' });
    setApprovalDialogOpen(true);
  };

  const columns: Column<StuffingOperation>[] = [
    { key: 'containerNumber', header: 'Container No.', sortable: true },
    {
      key: 'type',
      header: 'Type',
      render: (item) => (
        <div className="flex items-center gap-2">
          {item.type === 'stuffing' ? (
            <PackagePlus className="h-4 w-4 text-success" />
          ) : (
            <PackageMinus className="h-4 w-4 text-primary" />
          )}
          <span className="capitalize">{item.type}</span>
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      render: (item) => <span className="capitalize">{item.location}</span>,
    },
    {
      key: 'scheduledDate',
      header: 'Scheduled',
      render: (item) => new Date(item.scheduledDate).toLocaleDateString(),
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
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant={item.status === 'pending' ? 'default' : 'outline'}
                onClick={() => setSelectedOperation(item)}
              >
                {item.status === 'pending' ? 'Start' : item.status === 'in-progress' ? 'Complete' : 'View'}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {item.type === 'stuffing' ? 'Stuffing' : 'Destuffing'} Operation
                </DialogTitle>
                <DialogDescription>
                  {item.containerNumber} - {item.status}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Container</Label>
                    <p className="font-medium">{item.containerNumber}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Type</Label>
                    <p className="font-medium capitalize">{item.type}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Location</Label>
                    <p className="font-medium capitalize">{item.location}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Scheduled</Label>
                    <p className="font-medium">{new Date(item.scheduledDate).toLocaleDateString()}</p>
                  </div>
                </div>
                {item.status !== 'completed' && item.status !== 'approved' && (
                  <div className="space-y-2">
                    <Label htmlFor="remarks">Remarks</Label>
                    <Textarea id="remarks" placeholder="Add operation remarks..." />
                  </div>
                )}
                {item.remarks && (
                  <div>
                    <Label className="text-muted-foreground">Remarks</Label>
                    <p className="text-sm">{item.remarks}</p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline">Close</Button>
                {item.status === 'pending' && <Button>Start Operation</Button>}
                {item.status === 'in-progress' && <Button>Mark Complete</Button>}
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => openApprovalDialog(item)}
          >
            <Send className="h-3 w-3 mr-1" />
            Request Approval
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout navItems={operatorNavItems} pageTitle="Stuffing / Destuffing">
      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Pending"
          value={pendingOps.length}
          icon={Clock}
          variant="warning"
        />
        <KPICard
          title="In Progress"
          value={inProgressOps.length}
          icon={Package}
          variant="primary"
        />
        <KPICard
          title="Stuffing Today"
          value={stuffingOps.length}
          icon={PackagePlus}
          variant="success"
        />
        <KPICard
          title="Destuffing Today"
          value={destuffingOps.length}
          icon={PackageMinus}
        />
      </div>

      {/* Operations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Operations</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All ({dummyStuffingOperations.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingOps.length})</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress ({inProgressOps.length})</TabsTrigger>
              <TabsTrigger value="stuffing">Stuffing ({stuffingOps.length})</TabsTrigger>
              <TabsTrigger value="destuffing">Destuffing ({destuffingOps.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <DataTable
                data={dummyStuffingOperations}
                columns={columns}
                searchable
                searchPlaceholder="Search operations..."
              />
            </TabsContent>
            <TabsContent value="pending">
              <DataTable data={pendingOps} columns={columns} searchable emptyMessage="No pending operations" />
            </TabsContent>
            <TabsContent value="in-progress">
              <DataTable data={inProgressOps} columns={columns} searchable emptyMessage="No operations in progress" />
            </TabsContent>
            <TabsContent value="stuffing">
              <DataTable data={stuffingOps} columns={columns} searchable />
            </TabsContent>
            <TabsContent value="destuffing">
              <DataTable data={destuffingOps} columns={columns} searchable />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Request Approval Dialog */}
      <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request Manager Approval</DialogTitle>
            <DialogDescription>
              {selectedOperation?.containerNumber} - {selectedOperation?.type}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Request Type *</Label>
              <Select value={approvalForm.requestType} onValueChange={(v) => setApprovalForm(prev => ({ ...prev, requestType: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select request type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="schedule-change">Schedule Change</SelectItem>
                  <SelectItem value="location-change">Location Change</SelectItem>
                  <SelectItem value="priority-upgrade">Priority Upgrade</SelectItem>
                  <SelectItem value="equipment-special">Special Equipment Required</SelectItem>
                  <SelectItem value="overtime">Overtime Operation</SelectItem>
                  <SelectItem value="cancellation">Cancellation Request</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={approvalForm.priority} onValueChange={(v) => setApprovalForm(prev => ({ ...prev, priority: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Reason *</Label>
              <Textarea 
                placeholder="Explain why approval is needed..."
                value={approvalForm.reason}
                onChange={(e) => setApprovalForm(prev => ({ ...prev, reason: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Additional Remarks</Label>
              <Textarea 
                placeholder="Any additional information..."
                value={approvalForm.remarks}
                onChange={(e) => setApprovalForm(prev => ({ ...prev, remarks: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApprovalDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRequestApproval}>
              <Send className="h-4 w-4 mr-2" />
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
