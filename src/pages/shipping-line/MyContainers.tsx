import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { shippingLineNavItems } from '@/config/navigation';
import { DataTable, Column } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container, MapPin, Calendar, Truck, Eye, Download, Filter } from 'lucide-react';
import { dummyContainers } from '@/data/dummyData';
import { useState } from 'react';
import type { Container as ContainerType } from '@/types';

export default function MyContainers() {
  const [selectedContainer, setSelectedContainer] = useState<ContainerType | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sizeFilter, setSizeFilter] = useState<string>('all');

  // Filter containers for Maersk Line
  const myContainers = dummyContainers.filter(c => c.shippingLine === 'Maersk Line');
  
  const filteredContainers = myContainers.filter(c => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (sizeFilter !== 'all' && c.size !== sizeFilter) return false;
    return true;
  });

  const columns: Column<ContainerType>[] = [
    {
      key: 'containerNumber',
      header: 'Container No.',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2">
          <Container className="h-4 w-4 text-primary" />
          <span className="font-medium">{item.containerNumber}</span>
        </div>
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
      render: (item) => (
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          {item.yardLocation ? `${item.yardLocation.block}-${item.yardLocation.row}-${item.yardLocation.bay}` : 'N/A'}
        </div>
      ),
    },
    {
      key: 'gateInTime',
      header: 'Gate In',
      render: (item) => item.gateInTime ? new Date(item.gateInTime).toLocaleDateString() : 'N/A',
    },
    {
      key: 'dwellTime',
      header: 'Dwell Time',
      render: (item) => item.dwellTime ? `${item.dwellTime} days` : 'N/A',
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <Button variant="ghost" size="sm" onClick={() => setSelectedContainer(item)}>
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <DashboardLayout navItems={shippingLineNavItems} pageTitle="My Containers">
      {/* Filters */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="in-yard">In Yard</SelectItem>
                  <SelectItem value="in-transit">In Transit</SelectItem>
                  <SelectItem value="at-port">At Port</SelectItem>
                  <SelectItem value="at-factory">At Factory</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-48">
              <Select value={sizeFilter} onValueChange={setSizeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sizes</SelectItem>
                  <SelectItem value="20ft">20ft</SelectItem>
                  <SelectItem value="40ft">40ft</SelectItem>
                  <SelectItem value="40ft HC">40ft HC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="ml-auto">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Container List */}
      <DataTable
        data={filteredContainers}
        columns={columns}
        searchable
        searchPlaceholder="Search containers..."
        onRowClick={setSelectedContainer}
      />

      {/* Container Details Dialog */}
      <Dialog open={!!selectedContainer} onOpenChange={() => setSelectedContainer(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Container className="h-5 w-5" />
              Container Details
            </DialogTitle>
          </DialogHeader>
          {selectedContainer && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Container Number</p>
                  <p className="font-medium">{selectedContainer.containerNumber}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <StatusBadge status={selectedContainer.status} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Size</p>
                  <p className="font-medium">{selectedContainer.size}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium">{selectedContainer.type}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {selectedContainer.yardLocation 
                      ? `${selectedContainer.yardLocation.block}-${selectedContainer.yardLocation.row}-${selectedContainer.yardLocation.bay}-${selectedContainer.yardLocation.tier}` 
                      : 'N/A'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Dwell Time</p>
                  <p className="font-medium">{selectedContainer.dwellTime || 0} days</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Gate In</p>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {selectedContainer.gateInTime ? new Date(selectedContainer.gateInTime).toLocaleString() : 'N/A'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Gate Out</p>
                  <p className="font-medium flex items-center gap-1">
                    <Truck className="h-3 w-3" />
                    {selectedContainer.gateOutTime ? new Date(selectedContainer.gateOutTime).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>
              {selectedContainer.damaged && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm font-medium text-destructive">Damage Reported</p>
                  <p className="text-sm text-muted-foreground">{selectedContainer.damageDetails || 'View survey report for details'}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
