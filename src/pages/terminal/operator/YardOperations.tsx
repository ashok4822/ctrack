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
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { dummyContainers, dummyYardBlocks, dummyKPIData } from '@/data/dummyData';
import type { Container as ContainerType } from '@/types';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

// Generate slot data for visual grid
const generateSlotData = (block: string, rows: number, bays: number, tiers: number) => {
  const slots: { id: string; block: string; row: string; bay: string; tier: string; occupied: boolean; containerId?: string }[] = [];
  for (let r = 1; r <= rows; r++) {
    for (let b = 1; b <= bays; b++) {
      for (let t = 1; t <= tiers; t++) {
        const isOccupied = Math.random() > 0.6; // Simulate occupancy
        slots.push({
          id: `${block}-${r}-${b}-${t}`,
          block,
          row: r.toString().padStart(2, '0'),
          bay: b.toString().padStart(2, '0'),
          tier: t.toString().padStart(2, '0'),
          occupied: isOccupied,
          containerId: isOccupied ? `CONT${Math.random().toString(36).substr(2, 8).toUpperCase()}` : undefined,
        });
      }
    }
  }
  return slots;
};

export default function OperatorYardOperations() {
  const { toast } = useToast();
  const [selectedContainer, setSelectedContainer] = useState<ContainerType | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [shiftDialogOpen, setShiftDialogOpen] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState(dummyYardBlocks[0]?.name || 'A');
  const [containerSearch, setContainerSearch] = useState('');
  
  // Form states for assign
  const [assignForm, setAssignForm] = useState({
    containerNumber: '',
    block: '',
    row: '',
    bay: '',
    tier: '',
  });
  
  // Form states for shift
  const [shiftForm, setShiftForm] = useState({
    containerNumber: '',
    fromBlock: '',
    fromRow: '',
    fromBay: '',
    fromTier: '',
    toBlock: '',
    toRow: '',
    toBay: '',
    toTier: '',
    equipment: '',
  });
  
  const inYardContainers = dummyContainers.filter(c => c.status === 'in-yard');
  
  // Get slot data for selected block
  const blockInfo = dummyYardBlocks.find(b => b.name === selectedBlock);
  const slotData = blockInfo ? generateSlotData(selectedBlock, blockInfo.rows, blockInfo.bays, blockInfo.tiers) : [];
  const occupiedSlots = slotData.filter(s => s.occupied).length;
  const freeSlots = slotData.filter(s => !s.occupied).length;

  const handleAssignContainer = () => {
    if (!assignForm.containerNumber || !assignForm.block || !assignForm.row || !assignForm.bay || !assignForm.tier) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Container Assigned",
      description: `Container ${assignForm.containerNumber} assigned to ${assignForm.block}-${assignForm.row}-${assignForm.bay}-${assignForm.tier}`,
    });
    setAssignDialogOpen(false);
    setAssignForm({ containerNumber: '', block: '', row: '', bay: '', tier: '' });
  };

  const handleShiftContainer = () => {
    if (!shiftForm.containerNumber || !shiftForm.toBlock || !shiftForm.toRow || !shiftForm.toBay || !shiftForm.toTier) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Container Shifted",
      description: `Container ${shiftForm.containerNumber} moved to ${shiftForm.toBlock}-${shiftForm.toRow}-${shiftForm.toBay}-${shiftForm.toTier}`,
    });
    setShiftDialogOpen(false);
    setShiftForm({
      containerNumber: '', fromBlock: '', fromRow: '', fromBay: '', fromTier: '',
      toBlock: '', toRow: '', toBay: '', toTier: '', equipment: '',
    });
  };

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
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => {
              setShiftForm({
                containerNumber: item.containerNumber,
                fromBlock: item.yardLocation?.block || '',
                fromRow: item.yardLocation?.row || '',
                fromBay: item.yardLocation?.bay || '',
                fromTier: item.yardLocation?.tier || '',
                toBlock: '',
                toRow: '',
                toBay: '',
                toTier: '',
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
              Assign Container to Slot
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Assign Container to Yard Slot</DialogTitle>
              <DialogDescription>
                Assign a container to a specific yard location
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
              <div className="grid grid-cols-4 gap-2">
                <div className="space-y-2">
                  <Label>Block</Label>
                  <Select value={assignForm.block} onValueChange={(v) => setAssignForm({ ...assignForm, block: v })}>
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
                  <Input 
                    placeholder="01" 
                    value={assignForm.row}
                    onChange={(e) => setAssignForm({ ...assignForm, row: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Bay</Label>
                  <Input 
                    placeholder="01" 
                    value={assignForm.bay}
                    onChange={(e) => setAssignForm({ ...assignForm, bay: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tier</Label>
                  <Input 
                    placeholder="01" 
                    value={assignForm.tier}
                    onChange={(e) => setAssignForm({ ...assignForm, tier: e.target.value })}
                  />
                </div>
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
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Shift Container Between Slots</DialogTitle>
              <DialogDescription>
                Move a container from one yard location to another
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
                <div className="space-y-3 p-3 rounded-lg border bg-muted/30">
                  <Label className="text-sm font-medium text-muted-foreground">From Location</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Block</Label>
                      <Input 
                        placeholder="A" 
                        value={shiftForm.fromBlock}
                        onChange={(e) => setShiftForm({ ...shiftForm, fromBlock: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Row</Label>
                      <Input 
                        placeholder="01" 
                        value={shiftForm.fromRow}
                        onChange={(e) => setShiftForm({ ...shiftForm, fromRow: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Bay</Label>
                      <Input 
                        placeholder="01" 
                        value={shiftForm.fromBay}
                        onChange={(e) => setShiftForm({ ...shiftForm, fromBay: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Tier</Label>
                      <Input 
                        placeholder="01" 
                        value={shiftForm.fromTier}
                        onChange={(e) => setShiftForm({ ...shiftForm, fromTier: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 p-3 rounded-lg border bg-primary/5">
                  <Label className="text-sm font-medium text-primary">To Location</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Block</Label>
                      <Select value={shiftForm.toBlock} onValueChange={(v) => setShiftForm({ ...shiftForm, toBlock: v })}>
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
                    <div className="space-y-1">
                      <Label className="text-xs">Row</Label>
                      <Input 
                        placeholder="01" 
                        value={shiftForm.toRow}
                        onChange={(e) => setShiftForm({ ...shiftForm, toRow: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Bay</Label>
                      <Input 
                        placeholder="01" 
                        value={shiftForm.toBay}
                        onChange={(e) => setShiftForm({ ...shiftForm, toBay: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Tier</Label>
                      <Input 
                        placeholder="01" 
                        value={shiftForm.toTier}
                        onChange={(e) => setShiftForm({ ...shiftForm, toTier: e.target.value })}
                      />
                    </div>
                  </div>
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
          <TabsTrigger value="slots">Slot Availability</TabsTrigger>
          <TabsTrigger value="containers">Containers</TabsTrigger>
        </TabsList>

        {/* Block Overview Tab */}
        <TabsContent value="blocks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Yard Block Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {dummyYardBlocks.map((block) => {
                  const utilization = Math.round((block.occupied / block.capacity) * 100);
                  const statusColor = utilization > 80 ? 'text-destructive' : utilization > 60 ? 'text-warning' : 'text-success';
                  return (
                    <div key={block.id} className="rounded-lg border p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-lg">Block {block.name}</h4>
                        <Badge variant={utilization > 80 ? 'destructive' : utilization > 60 ? 'secondary' : 'default'}>
                          {utilization}%
                        </Badge>
                      </div>
                      <Progress value={utilization} className="h-2 mb-2" />
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          <CheckCircle className="inline h-3 w-3 mr-1 text-success" />
                          {block.capacity - block.occupied} free
                        </span>
                        <span className="text-muted-foreground">
                          <XCircle className="inline h-3 w-3 mr-1 text-destructive" />
                          {block.occupied} occupied
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {block.rows} rows × {block.bays} bays × {block.tiers} tiers
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Slot Availability Tab */}
        <TabsContent value="slots" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle className="flex items-center gap-2">
                  <Grid3X3 className="h-5 w-5" />
                  Yard Slot Availability
                </CardTitle>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-success/20 border border-success"></div>
                    <span className="text-sm">Free ({freeSlots})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-destructive/20 border border-destructive"></div>
                    <span className="text-sm">Occupied ({occupiedSlots})</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-wrap gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Select Block</Label>
                  <Select value={selectedBlock} onValueChange={setSelectedBlock}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dummyYardBlocks.map(block => (
                        <SelectItem key={block.id} value={block.name}>Block {block.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Visual Grid for Block */}
              <div className="border rounded-lg p-4 bg-muted/20">
                <h4 className="font-medium mb-3">Block {selectedBlock} - Ground Level View (Tier 1)</h4>
                <div className="overflow-x-auto">
                  <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${blockInfo?.bays || 6}, minmax(40px, 1fr))` }}>
                    {/* Header row with bay numbers */}
                    {Array.from({ length: blockInfo?.bays || 6 }, (_, i) => (
                      <div key={`header-${i}`} className="text-center text-xs text-muted-foreground font-medium py-1">
                        Bay {(i + 1).toString().padStart(2, '0')}
                      </div>
                    ))}
                    
                    {/* Slot grid */}
                    {Array.from({ length: blockInfo?.rows || 4 }, (_, rowIndex) => (
                      Array.from({ length: blockInfo?.bays || 6 }, (_, bayIndex) => {
                        const slot = slotData.find(
                          s => s.row === (rowIndex + 1).toString().padStart(2, '0') && 
                               s.bay === (bayIndex + 1).toString().padStart(2, '0') &&
                               s.tier === '01'
                        );
                        const isOccupied = slot?.occupied || false;
                        
                        return (
                          <div
                            key={`${rowIndex}-${bayIndex}`}
                            className={`
                              aspect-square rounded border-2 flex items-center justify-center text-xs font-medium cursor-pointer
                              transition-all hover:scale-105
                              ${isOccupied 
                                ? 'bg-destructive/20 border-destructive text-destructive' 
                                : 'bg-success/20 border-success text-success hover:bg-success/30'
                              }
                            `}
                            title={isOccupied ? `Occupied: ${slot?.containerId}` : 'Available'}
                          >
                            {bayIndex === 0 && (
                              <span className="absolute -left-8 text-muted-foreground">
                                R{(rowIndex + 1).toString().padStart(2, '0')}
                              </span>
                            )}
                            {isOccupied ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                          </div>
                        );
                      })
                    )).flat()}
                  </div>
                </div>
                
                {/* Summary stats */}
                <div className="mt-4 pt-4 border-t flex flex-wrap gap-6 text-sm">
                  <div>
                    <span className="text-muted-foreground">Total Capacity:</span>
                    <span className="ml-2 font-medium">{blockInfo?.capacity || 0} slots</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Occupied:</span>
                    <span className="ml-2 font-medium text-destructive">{blockInfo?.occupied || 0}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Available:</span>
                    <span className="ml-2 font-medium text-success">{(blockInfo?.capacity || 0) - (blockInfo?.occupied || 0)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Containers Tab */}
        <TabsContent value="containers" className="space-y-4">
          {/* Container Lookup */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Container Lookup</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 max-w-md">
                <Input 
                  placeholder="Enter container number..." 
                  value={containerSearch}
                  onChange={(e) => setContainerSearch(e.target.value)}
                />
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
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}