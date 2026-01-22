import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable, Column } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { KPICard } from '@/components/common/KPICard';
import { managerNavItems } from '@/config/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { dummyApprovals } from '@/data/dummyData';
import type { Approval } from '@/types';
import { CheckSquare, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function ManagerApprovals() {
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  const [remarks, setRemarks] = useState('');

  const pending = dummyApprovals.filter((a) => a.status === 'pending');
  const approved = dummyApprovals.filter((a) => a.status === 'approved');
  const rejected = dummyApprovals.filter((a) => a.status === 'rejected');

  const handleApprove = () => {
    toast.success(`Request ${selectedApproval?.requestId} approved successfully`);
    setSelectedApproval(null);
    setRemarks('');
  };

  const handleReject = () => {
    if (!remarks.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    toast.success(`Request ${selectedApproval?.requestId} rejected`);
    setSelectedApproval(null);
    setRemarks('');
  };

  const columns: Column<Approval>[] = [
    {
      key: 'requestId',
      header: 'Request ID',
      sortable: true,
      render: (item) => (
        <span className="font-medium text-foreground">{item.requestId}</span>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      sortable: true,
      render: (item) => (
        <span className="capitalize">{item.type.replace('-', ' ')}</span>
      ),
    },
    {
      key: 'details',
      header: 'Details',
      render: (item) => (
        <span className="text-sm text-muted-foreground">
          {item.details.containerNumber || item.details.description || '-'}
        </span>
      ),
    },
    { key: 'requestedBy', header: 'Requested By', sortable: true },
    {
      key: 'requestedAt',
      header: 'Requested At',
      sortable: true,
      render: (item) => new Date(item.requestedAt).toLocaleString(),
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
          onClick={() => setSelectedApproval(item)}
        >
          <Eye className="h-4 w-4 mr-1" />
          {item.status === 'pending' ? 'Review' : 'View'}
        </Button>
      ),
    },
  ];

  return (
    <DashboardLayout navItems={managerNavItems} pageTitle="Approvals">
      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Requests"
          value={dummyApprovals.length}
          icon={CheckSquare}
        />
        <KPICard
          title="Pending"
          value={pending.length}
          icon={Clock}
          variant={pending.length > 0 ? 'warning' : 'default'}
        />
        <KPICard
          title="Approved"
          value={approved.length}
          icon={CheckCircle}
          variant="success"
        />
        <KPICard
          title="Rejected"
          value={rejected.length}
          icon={XCircle}
          variant="danger"
        />
      </div>

      {/* Pending Approvals Summary */}
      {pending.length > 0 && (
        <Card className="mb-6 border-warning">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-warning">
              Action Required - {pending.length} Pending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {pending.map((approval) => (
                <Button
                  key={approval.id}
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedApproval(approval)}
                >
                  {approval.type}: {approval.details.containerNumber || approval.requestId}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Approvals Table with Tabs */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approved.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejected.length})</TabsTrigger>
          <TabsTrigger value="all">All ({dummyApprovals.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <DataTable
            data={pending}
            columns={columns}
            searchPlaceholder="Search pending approvals..."
            emptyMessage="No pending approvals."
          />
        </TabsContent>

        <TabsContent value="approved">
          <DataTable
            data={approved}
            columns={columns}
            searchPlaceholder="Search approved requests..."
          />
        </TabsContent>

        <TabsContent value="rejected">
          <DataTable
            data={rejected}
            columns={columns}
            searchPlaceholder="Search rejected requests..."
          />
        </TabsContent>

        <TabsContent value="all">
          <DataTable
            data={dummyApprovals}
            columns={columns}
            searchPlaceholder="Search all approvals..."
          />
        </TabsContent>
      </Tabs>

      {/* Approval Detail Dialog */}
      <Dialog open={!!selectedApproval} onOpenChange={() => setSelectedApproval(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedApproval?.status === 'pending' ? 'Review Request' : 'Request Details'}
            </DialogTitle>
            <DialogDescription>
              {selectedApproval?.type.replace('-', ' ')} request
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Request ID</p>
                <p className="font-medium">{selectedApproval?.requestId}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                {selectedApproval && <StatusBadge status={selectedApproval.status} />}
              </div>
              <div>
                <p className="text-muted-foreground">Requested By</p>
                <p className="font-medium">{selectedApproval?.requestedBy}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Requested At</p>
                <p className="font-medium">
                  {selectedApproval && new Date(selectedApproval.requestedAt).toLocaleString()}
                </p>
              </div>
            </div>

            {selectedApproval?.details && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Request Details</p>
                {Object.entries(selectedApproval.details).map(([key, value]) => (
                  <p key={key} className="text-sm">
                    <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                    <span>{String(value)}</span>
                  </p>
                ))}
              </div>
            )}

            {selectedApproval?.status === 'pending' && (
              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks (required for rejection)</Label>
                <Textarea
                  id="remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Add your comments..."
                />
              </div>
            )}

            {selectedApproval?.remarks && (
              <div>
                <p className="text-sm text-muted-foreground">Previous Remarks</p>
                <p className="text-sm">{selectedApproval.remarks}</p>
              </div>
            )}
          </div>

          <DialogFooter>
            {selectedApproval?.status === 'pending' ? (
              <>
                <Button variant="outline" onClick={() => setSelectedApproval(null)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleReject}>
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                <Button onClick={handleApprove}>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
              </>
            ) : (
              <Button onClick={() => setSelectedApproval(null)}>Close</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
