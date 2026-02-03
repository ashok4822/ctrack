import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KPICard } from '@/components/common/KPICard';
import { DataTable, Column } from '@/components/common/DataTable';
import { operatorNavItems } from '@/config/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Progress } from '@/components/ui/progress';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Container,
  ArrowRightLeft,
  Package,
  Search,
  Plus,
  Grid3X3,
} from 'lucide-react';
import { dummyContainers, dummyYardBlocks, dummyKPIData } from '@/data/dummyData';
import type { Container as ContainerType } from '@/types';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function OperatorYardOperations() {
  const { toast } = useToast();
  const [selectedContainer, setSelectedContainer] = useState<ContainerType | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [shiftDialogOpen, setShiftDialogOpen] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState(dummyYardBlocks[0]?.name || 'Block A');
  const [containerSearch, setContainerSearch] = useState('');
  
  // Form states for assign (simplified - only block)
  const [assignForm, setAssignForm] = useState({
    containerNumber: '',
    block: '',
  });
  
  // Form states for shift (simplified - only block)
  const [shiftForm, setShiftForm] = useState({
    containerNumber: '',
    fromBlock: '',
    toBlock: '',
    equipment: '',
  });
  
  const inYardContainers = dummyContainers.filter(c => c.status === 'in-yard');
  
  // Get block info
  const blockInfo = dummyYardBlocks.find(b => b.name === selectedBlock);
  const totalCapacity = dummyYardBlocks.reduce((sum, b) => sum + b.capacity, 0);
  const totalOccupied = dummyYardBlocks.reduce((sum, b) => sum + b.occupied, 0);
  const freeSlots = totalCapacity - totalOccupied;

  const handleAssignContainer = () => {
    if (!assignForm.containerNumber || !assignForm.block) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Container Assigned",
      description: `Container ${assignForm.containerNumber} assigned to ${assignForm.block}`,
    });
    setAssignDialogOpen(false);
    setAssignForm({ containerNumber: '', block: '' });
  };

  const handleShiftContainer = () => {
    if (!shiftForm.containerNumber || !shiftForm.toBlock) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Container Shifted",
      description: `Container ${shiftForm.containerNumber} moved to ${shiftForm.toBlock}`,
    });
    setShiftDialogOpen(false);
    setShiftForm({ containerNumber: '', fromBlock: '', toBlock: '', equipment: '' });
  };

  const columns: Column<ContainerType>[] = [
    { key: 'containerNumber', header: 'Container No.', sortable: true },
    { key: 'size', header: 'Size' },
    { key: 'type', header: 'Type', render: (item) => <span className="capitalize">{item.type}</span> },
    { key: 'shippingLine', header: 'Shipping Line' },
    {
      key: 'yardLocation',
      header: 'Block',
      render: (item) => item.yardLocation?.block || 'N/A',
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
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => {
              setShiftForm({
                containerNumber: item.containerNumber,
                fromBlock: item.yardLocation?.block || '',
                toBlock: '',
                equipment: '',
              });
              setShiftDialogOpen(true);
            }}
          >
            <ArrowRightLeft className="h-3 w-3 mr-1" />
            Shift
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout navItems={operatorNavItems} pageTitle="Yard Operations">
      {/* Action Buttons */}
      <div className="mb-6 flex flex-wrap gap-3">
        <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Assign Container to Block
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Assign Container to Yard Block</DialogTitle>
              <DialogDescription>
                Assign a container to a specific yard block
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Container Number</Label>
                <Input 
                  placeholder="e.g., MSCU1234567"
                  value={assignForm.containerNumber}
                  onChange={(e) => setAssignForm({ ...assignForm, containerNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Block</Label>
                <Select value={assignForm.block} onValueChange={(v) => setAssignForm({ ...assignForm, block: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Block" />
                  </SelectTrigger>
                  <SelectContent>
                    {dummyYardBlocks.map(block => (
                      <SelectItem key={block.id} value={block.name}>
                        {block.name} ({block.capacity - block.occupied} free)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAssignContainer}>Assign Container</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={shiftDialogOpen} onOpenChange={setShiftDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              Shift Container
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Shift Container Between Blocks</DialogTitle>
              <DialogDescription>
                Move a container from one yard block to another
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Container Number</Label>
                <Input 
                  placeholder="e.g., MSCU1234567"
                  value={shiftForm.containerNumber}
                  onChange={(e) => setShiftForm({ ...shiftForm, containerNumber: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>From Block</Label>
                  <Select value={shiftForm.fromBlock} onValueChange={(v) => setShiftForm({ ...shiftForm, fromBlock: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Current Block" />
                    </SelectTrigger>
                    <SelectContent>
                      {dummyYardBlocks.map(block => (
                        <SelectItem key={block.id} value={block.name}>{block.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>To Block</Label>
                  <Select value={shiftForm.toBlock} onValueChange={(v) => setShiftForm({ ...shiftForm, toBlock: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Target Block" />
                    </SelectTrigger>
                    <SelectContent>
                      {dummyYardBlocks.map(block => (
                        <SelectItem key={block.id} value={block.name}>
                          {block.name} ({block.capacity - block.occupied} free)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Equipment</Label>
                <Select value={shiftForm.equipment} onValueChange={(v) => setShiftForm({ ...shiftForm, equipment: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select equipment for move" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rs-001">Reach Stacker RS-001</SelectItem>
                    <SelectItem value="rs-002">Reach Stacker RS-002</SelectItem>
                    <SelectItem value="fl-001">Forklift FL-001</SelectItem>
                    <SelectItem value="sc-001">Straddle Carrier SC-001</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShiftDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleShiftContainer}>Confirm Shift</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

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
          title="Available Slots"
          value={freeSlots}
          icon={Grid3X3}
          variant="success"
        />
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="blocks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="blocks">Block Overview</TabsTrigger>
          <TabsTrigger value="containers">Containers</TabsTrigger>
        </TabsList>

        {/* Block Overview Tab */}
        <TabsContent value="blocks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Yard Block Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {dummyYardBlocks.map((block) => {
                  const utilization = Math.round((block.occupied / block.capacity) * 100);
                  const statusColor = utilization > 80 ? 'text-destructive' : utilization > 60 ? 'text-warning' : 'text-success';
                  return (
                    <div key={block.id} className="rounded-lg border p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{block.name}</h4>
                        <Badge variant={utilization > 80 ? 'destructive' : utilization > 60 ? 'secondary' : 'default'}>
                          {utilization}%
                        </Badge>
                      </div>
                      <Progress value={utilization} className="mb-2" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{block.occupied} occupied</span>
                        <span>{block.capacity - block.occupied} free</span>
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-muted-foreground">
                          Total Capacity: {block.capacity} containers
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Containers Tab */}
        <TabsContent value="containers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Containers in Yard</span>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search containers..."
                      className="pl-9 w-64"
                      value={containerSearch}
                      onChange={(e) => setContainerSearch(e.target.value)}
                    />
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={columns} 
                data={inYardContainers.filter(c => 
                  containerSearch ? c.containerNumber.toLowerCase().includes(containerSearch.toLowerCase()) : true
                )} 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
