import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KPICard } from '@/components/common/KPICard';
import { DataTable, Column } from '@/components/common/DataTable';
import { operatorNavItems } from '@/config/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  MapPin,
  Container,
  ArrowRightLeft,
  Package,
  Search,
} from 'lucide-react';
import { dummyContainers, dummyYardBlocks, dummyKPIData } from '@/data/dummyData';
import type { Container as ContainerType } from '@/types';
import { useState } from 'react';

export default function OperatorYardOperations() {
  const [selectedContainer, setSelectedContainer] = useState<ContainerType | null>(null);
  
  const inYardContainers = dummyContainers.filter(c => c.status === 'in-yard');

  const columns: Column<ContainerType>[] = [
    { key: 'containerNumber', header: 'Container No.', sortable: true },
    { key: 'size', header: 'Size' },
    { key: 'type', header: 'Type', render: (item) => <span className="capitalize">{item.type}</span> },
    { key: 'shippingLine', header: 'Shipping Line' },
    {
      key: 'yardLocation',
      header: 'Location',
      render: (item) => item.yardLocation 
        ? `${item.yardLocation.block}-${item.yardLocation.row}-${item.yardLocation.bay}-${item.yardLocation.tier}`
        : 'N/A',
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => <StatusBadge status={item.status} />,
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
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" onClick={() => setSelectedContainer(item)}>
                Move
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Relocate Container</DialogTitle>
                <DialogDescription>
                  Move {item.containerNumber} to a new yard location
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Current Location</Label>
                    <p className="font-medium">
                      {item.yardLocation 
                        ? `${item.yardLocation.block}-${item.yardLocation.row}-${item.yardLocation.bay}-${item.yardLocation.tier}`
                        : 'Not assigned'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Container</Label>
                    <p className="font-medium">{item.containerNumber}</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="space-y-2">
                    <Label>Block</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Block" />
                      </SelectTrigger>
                      <SelectContent>
                        {dummyYardBlocks.map(block => (
                          <SelectItem key={block.id} value={block.name}>{block.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Row</Label>
                    <Input placeholder="Row" />
                  </div>
                  <div className="space-y-2">
                    <Label>Bay</Label>
                    <Input placeholder="Bay" />
                  </div>
                  <div className="space-y-2">
                    <Label>Tier</Label>
                    <Input placeholder="Tier" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Equipment</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select equipment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rs-001">Reach Stacker RS-001</SelectItem>
                      <SelectItem value="rs-002">Reach Stacker RS-002</SelectItem>
                      <SelectItem value="fl-001">Forklift FL-001</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Confirm Move</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout navItems={operatorNavItems} pageTitle="Yard Operations">
      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Containers in Yard"
          value={dummyKPIData.totalContainersInYard}
          icon={Container}
          variant="primary"
        />
        <KPICard
          title="Yard Utilization"
          value={`${dummyKPIData.yardUtilization}%`}
          icon={MapPin}
          variant="success"
        />
        <KPICard
          title="Moves Today"
          value={12}
          icon={ArrowRightLeft}
        />
        <KPICard
          title="Pending Stuffing"
          value={5}
          icon={Package}
          variant="warning"
        />
      </div>

      {/* Yard Block Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Yard Block Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {dummyYardBlocks.map((block) => {
              const utilization = Math.round((block.occupied / block.capacity) * 100);
              return (
                <div key={block.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{block.name}</h4>
                    <span className="text-sm text-muted-foreground">
                      {block.occupied}/{block.capacity}
                    </span>
                  </div>
                  <Progress value={utilization} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {utilization}% utilized
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Container Lookup */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Quick Container Lookup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 max-w-md">
            <Input placeholder="Enter container number..." />
            <Button>
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Containers in Yard */}
      <Card>
        <CardHeader>
          <CardTitle>Containers in Yard</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={inYardContainers}
            columns={columns}
            searchable
            searchPlaceholder="Search containers..."
          />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
