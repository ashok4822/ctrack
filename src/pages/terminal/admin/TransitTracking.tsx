import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { adminNavItems } from '@/config/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { dummyTransitCheckpoints, dummyTransitContainers } from '@/data/dummyData';

export default function AdminTransitTracking() {
    const [selectedContainer, setSelectedContainer] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);

    const inTransitCount = dummyTransitContainers.filter(c => c.status === 'in-transit').length;
    const pendingCount = dummyTransitContainers.filter(c => c.status === 'pending').length;
    const deliveredCount = dummyTransitContainers.filter(c => c.status === 'delivered').length;

    const filteredContainers = statusFilter === 'all'
        ? dummyTransitContainers
        : dummyTransitContainers.filter(c => c.status === statusFilter);

    const selectedTransitData = selectedContainer
        ? dummyTransitCheckpoints.filter(c => c.containerId === selectedContainer)
        : [];

    const columns: Column<typeof dummyTransitContainers[0]>[] = [
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
                    'pending': { label: 'Pending Dispatch', variant: 'outline' as const },
                };
                const config = statusConfig[item.status] || { label: item.status, variant: 'outline' as const };
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
            navItems={adminNavItems}
            pageTitle="Transit Tracking (Admin)"
        >
            {/* KPI Cards */}
            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <KPICard
                    title="All Active Shipments"
                    value={dummyTransitContainers.length}
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
                    title="Pending Dispatch"
                    value={pendingCount}
                    icon={Clock}
                />
                <KPICard
                    title="Total Delivered"
                    value={deliveredCount}
                    icon={CheckCircle}
                    variant="success"
                />
            </div>

            {/* Container List */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Global Transit Overview</CardTitle>
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
                        searchPlaceholder="Search all containers..."
                        emptyMessage="No shipments found in transit"
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
                                        {dummyTransitContainers.find(c => c.id === selectedContainer)?.containerNumber}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground">Status</p>
                                    <Badge variant={
                                        dummyTransitContainers.find(c => c.id === selectedContainer)?.status === 'delivered'
                                            ? 'secondary'
                                            : 'default'
                                    }>
                                        {dummyTransitContainers.find(c => c.id === selectedContainer)?.status}
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
