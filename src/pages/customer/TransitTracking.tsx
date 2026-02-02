import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { customerNavItems } from '@/config/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DataTable, Column } from '@/components/common/DataTable';
import { KPICard } from '@/components/common/KPICard';
import { 
  MapPin, 
  Truck, 
  Clock, 
  CheckCircle, 
  Container,
  Navigation,
  Calendar,
  Eye,
} from 'lucide-react';
import { dummyContainers } from '@/data/dummyData';
import type { TransitCheckpoint } from '@/types';

// Dummy transit data
const dummyTransitCheckpoints: TransitCheckpoint[] = [
  {
    id: '1',
    containerId: '1',
    containerNumber: 'MSCU1234567',
    checkpointName: 'Chennai Port',
    location: 'Chennai, Tamil Nadu',
    arrivedAt: '2024-01-20T08:30:00Z',
    departedAt: '2024-01-20T10:00:00Z',
    status: 'completed',
    remarks: 'Cleared customs inspection',
  },
  {
    id: '2',
    containerId: '1',
    containerNumber: 'MSCU1234567',
    checkpointName: 'Toll Plaza - NH48',
    location: 'Sriperumbudur, Tamil Nadu',
    arrivedAt: '2024-01-20T11:30:00Z',
    departedAt: '2024-01-20T11:45:00Z',
    status: 'completed',
    remarks: 'Toll paid',
  },
  {
    id: '3',
    containerId: '1',
    containerNumber: 'MSCU1234567',
    checkpointName: 'Weighbridge Station',
    location: 'Oragadam, Tamil Nadu',
    arrivedAt: '2024-01-20T12:30:00Z',
    departedAt: '2024-01-20T12:50:00Z',
    status: 'completed',
    remarks: 'Weight verified: 25,000 kg',
  },
  {
    id: '4',
    containerId: '1',
    containerNumber: 'MSCU1234567',
    checkpointName: 'Terminal Gate',
    location: 'ICD Terminal',
    arrivedAt: '2024-01-20T14:00:00Z',
    status: 'completed',
    remarks: 'Gate-in completed',
  },
  {
    id: '5',
    containerId: '2',
    containerNumber: 'HLCU7654321',
    checkpointName: 'Factory Gate',
    location: 'XYZ Foods, Hosur',
    arrivedAt: '2024-01-21T06:00:00Z',
    departedAt: '2024-01-21T06:30:00Z',
    status: 'completed',
    remarks: 'Loading completed',
  },
  {
    id: '6',
    containerId: '2',
    containerNumber: 'HLCU7654321',
    checkpointName: 'Toll Plaza - NH44',
    location: 'Krishnagiri, Tamil Nadu',
    arrivedAt: '2024-01-21T08:00:00Z',
    status: 'in-transit',
    remarks: 'En route to port',
  },
];

const allTransitContainers = [
  { 
    id: '1', 
    containerNumber: 'MSCU1234567', 
    origin: 'Chennai Port', 
    destination: 'ICD Terminal',
    status: 'delivered' as const,
    checkpoints: 4,
    lastUpdate: '2024-01-20T14:00:00Z',
    eta: '2024-01-20T14:00:00Z',
  },
  { 
    id: '2', 
    containerNumber: 'HLCU7654321', 
    origin: 'XYZ Foods, Hosur', 
    destination: 'Chennai Port',
    status: 'in-transit' as const,
    checkpoints: 2,
    lastUpdate: '2024-01-21T08:00:00Z',
    eta: '2024-01-21T12:00:00Z',
  },
  { 
    id: '3', 
    containerNumber: 'OOLU3210987', 
    origin: 'ICD Terminal', 
    destination: 'Chemical Corp, Manali',
    status: 'pending' as const,
    checkpoints: 0,
    lastUpdate: null,
    eta: '2024-01-22T10:00:00Z',
  },
];

export default function TransitTracking() {
  const [selectedContainer, setSelectedContainer] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const myContainers = dummyContainers.filter(c => c.customer === 'ABC Manufacturing');
  
  const inTransitCount = allTransitContainers.filter(c => c.status === 'in-transit').length;
  const deliveredCount = allTransitContainers.filter(c => c.status === 'delivered').length;
  const pendingCount = allTransitContainers.filter(c => c.status === 'pending').length;

  const filteredContainers = statusFilter === 'all' 
    ? allTransitContainers 
    : allTransitContainers.filter(c => c.status === statusFilter);

  const selectedTransitData = selectedContainer 
    ? dummyTransitCheckpoints.filter(c => c.containerId === selectedContainer)
    : [];

  const columns: Column<typeof allTransitContainers[0]>[] = [
    {
      key: 'containerNumber',
      header: 'Container No.',
      sortable: true,
      render: (item) => (
        <span className="font-mono font-medium text-foreground">{item.containerNumber}</span>
      ),
    },
    {
      key: 'origin',
      header: 'Origin',
      sortable: true,
    },
    {
      key: 'destination',
      header: 'Destination',
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (item) => {
        const statusConfig = {
          'in-transit': { label: 'In Transit', variant: 'default' as const },
          'delivered': { label: 'Delivered', variant: 'secondary' as const },
          'pending': { label: 'Pending', variant: 'outline' as const },
        };
        const config = statusConfig[item.status];
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
    {
      key: 'checkpoints',
      header: 'Checkpoints',
      render: (item) => (
        <span className="text-muted-foreground">{item.checkpoints} passed</span>
      ),
    },
    {
      key: 'eta',
      header: 'ETA',
      render: (item) => item.eta ? new Date(item.eta).toLocaleString() : '-',
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSelectedContainer(item.id);
            setShowDetailsDialog(true);
          }}
          className="gap-1"
        >
          <Eye className="h-4 w-4" />
          Track
        </Button>
      ),
    },
  ];

  return (
    <DashboardLayout
      navItems={customerNavItems}
      pageTitle="Transit Checkpoints"
    >
      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Shipments"
          value={allTransitContainers.length}
          icon={Container}
          variant="primary"
        />
        <KPICard
          title="In Transit"
          value={inTransitCount}
          icon={Truck}
          variant="warning"
        />
        <KPICard
          title="Delivered"
          value={deliveredCount}
          icon={CheckCircle}
          variant="success"
        />
        <KPICard
          title="Pending Dispatch"
          value={pendingCount}
          icon={Clock}
        />
      </div>

      {/* Container List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Container Shipments</CardTitle>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="in-transit">In Transit</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredContainers}
            columns={columns}
            searchable
            searchPlaceholder="Search containers..."
            emptyMessage="No shipments found"
          />
        </CardContent>
      </Card>

      {/* Transit Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Transit Checkpoints
            </DialogTitle>
          </DialogHeader>
          
          {selectedContainer && (
            <div className="space-y-6">
              {/* Container Info */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Container</p>
                  <p className="font-mono font-medium text-lg">
                    {allTransitContainers.find(c => c.id === selectedContainer)?.containerNumber}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={
                    allTransitContainers.find(c => c.id === selectedContainer)?.status === 'delivered' 
                      ? 'secondary' 
                      : 'default'
                  }>
                    {allTransitContainers.find(c => c.id === selectedContainer)?.status}
                  </Badge>
                </div>
              </div>

              {/* Timeline */}
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                
                {selectedTransitData.length > 0 ? (
                  <div className="space-y-6">
                    {selectedTransitData.map((checkpoint, index) => (
                      <div key={checkpoint.id} className="relative pl-10">
                        <div className={`absolute left-2 top-1 h-5 w-5 rounded-full border-2 flex items-center justify-center
                          ${checkpoint.status === 'completed' 
                            ? 'bg-primary border-primary' 
                            : checkpoint.status === 'in-transit'
                            ? 'bg-warning border-warning'
                            : 'bg-background border-muted-foreground'
                          }`}
                        >
                          {checkpoint.status === 'completed' && (
                            <CheckCircle className="h-3 w-3 text-primary-foreground" />
                          )}
                          {checkpoint.status === 'in-transit' && (
                            <Truck className="h-3 w-3 text-warning-foreground" />
                          )}
                        </div>

                        <Card className={checkpoint.status === 'in-transit' ? 'border-warning' : ''}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold">{checkpoint.checkpointName}</h4>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {checkpoint.location}
                                </p>
                              </div>
                              <Badge variant={checkpoint.status === 'completed' ? 'secondary' : 'default'}>
                                {checkpoint.status === 'completed' ? 'Passed' : 'Current'}
                              </Badge>
                            </div>
                            
                            <div className="grid gap-2 sm:grid-cols-2 text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>Arrived: {new Date(checkpoint.arrivedAt).toLocaleString()}</span>
                              </div>
                              {checkpoint.departedAt && (
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span>Departed: {new Date(checkpoint.departedAt).toLocaleString()}</span>
                                </div>
                              )}
                            </div>
                            
                            {checkpoint.remarks && (
                              <p className="mt-2 text-sm text-muted-foreground border-t pt-2">
                                {checkpoint.remarks}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="pl-10 py-8 text-center text-muted-foreground">
                    <Truck className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No checkpoint data available yet.</p>
                    <p className="text-sm">Tracking will begin once the container is dispatched.</p>
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
