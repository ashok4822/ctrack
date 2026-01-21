import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { customerNavItems } from '@/config/navigation';
import { DataTable, Column } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { KPICard } from '@/components/common/KPICard';
import { Button } from '@/components/ui/button';
import { Container, MapPin, Truck, Factory, Eye } from 'lucide-react';
import { dummyContainers } from '@/data/dummyData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import type { Container as ContainerType } from '@/types';

export default function CustomerMyContainers() {
  const [selectedContainer, setSelectedContainer] = useState<ContainerType | null>(null);
  
  // Filter containers for this customer
  const myContainers = dummyContainers.filter(c => c.customer === 'ABC Manufacturing');
  
  const inYard = myContainers.filter(c => c.status === 'in-yard').length;
  const inTransit = myContainers.filter(c => c.status === 'in-transit').length;
  const atFactory = myContainers.filter(c => c.status === 'at-factory').length;

  const columns: Column<ContainerType>[] = [
    {
      key: 'containerNumber',
      header: 'Container No.',
      sortable: true,
      render: (item) => (
        <span className="font-mono font-medium text-foreground">{item.containerNumber}</span>
      ),
    },
    {
      key: 'size',
      header: 'Size',
      sortable: true,
    },
    {
      key: 'type',
      header: 'Type',
      sortable: true,
      render: (item) => <span className="capitalize">{item.type}</span>,
    },
    {
      key: 'shippingLine',
      header: 'Shipping Line',
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: 'yardLocation',
      header: 'Location',
      render: (item) =>
        item.yardLocation
          ? `${item.yardLocation.block}-${item.yardLocation.row}-${item.yardLocation.bay}-${item.yardLocation.tier}`
          : '-',
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
            setSelectedContainer(item);
          }}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <DashboardLayout navItems={customerNavItems} pageTitle="My Containers">
      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Containers"
          value={myContainers.length}
          icon={Container}
          variant="primary"
        />
        <KPICard
          title="At Factory"
          value={atFactory}
          icon={Factory}
          variant="success"
        />
        <KPICard
          title="In Transit"
          value={inTransit}
          icon={Truck}
        />
        <KPICard
          title="In Yard"
          value={inYard}
          icon={MapPin}
          variant="warning"
        />
      </div>

      {/* Container Table */}
      <DataTable
        data={myContainers}
        columns={columns}
        searchable
        searchPlaceholder="Search containers..."
        onRowClick={setSelectedContainer}
        emptyMessage="No containers found"
      />

      {/* Container Details Dialog */}
      <Dialog open={!!selectedContainer} onOpenChange={() => setSelectedContainer(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Container Details</DialogTitle>
          </DialogHeader>
          {selectedContainer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Container Number</p>
                  <p className="font-mono font-medium">{selectedContainer.containerNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <StatusBadge status={selectedContainer.status} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Size</p>
                  <p className="font-medium">{selectedContainer.size}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium capitalize">{selectedContainer.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Shipping Line</p>
                  <p className="font-medium">{selectedContainer.shippingLine}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Movement Type</p>
                  <p className="font-medium capitalize">{selectedContainer.movementType}</p>
                </div>
                {selectedContainer.yardLocation && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Yard Location</p>
                    <p className="font-medium">
                      Block {selectedContainer.yardLocation.block}, Row {selectedContainer.yardLocation.row}, 
                      Bay {selectedContainer.yardLocation.bay}, Tier {selectedContainer.yardLocation.tier}
                    </p>
                  </div>
                )}
                {selectedContainer.gateInTime && (
                  <div>
                    <p className="text-sm text-muted-foreground">Gate In</p>
                    <p className="font-medium">{new Date(selectedContainer.gateInTime).toLocaleString()}</p>
                  </div>
                )}
                {selectedContainer.dwellTime && (
                  <div>
                    <p className="text-sm text-muted-foreground">Dwell Time</p>
                    <p className="font-medium">{selectedContainer.dwellTime} days</p>
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
