import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { adminNavItems } from '@/config/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dummyYardBlocks } from '@/data/dummyData';
import { Plus, Settings, MapPin, Grid3X3, Box } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { YardBlock } from '@/types';

export default function YardConfiguration() {
  const { toast } = useToast();
  const [blocks, setBlocks] = useState<YardBlock[]>(dummyYardBlocks);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<YardBlock | null>(null);
  const [configForm, setConfigForm] = useState({
    name: '',
    rows: 0,
    bays: 0,
    tiers: 0,
  });

  const handleOpenConfig = (block: YardBlock) => {
    setSelectedBlock(block);
    setConfigForm({
      name: block.name,
      rows: block.rows,
      bays: block.bays,
      tiers: block.tiers,
    });
    setConfigDialogOpen(true);
  };

  const handleSaveConfig = () => {
    if (!selectedBlock) return;
    const newCapacity = configForm.rows * configForm.bays * configForm.tiers;
    setBlocks(blocks.map(b => 
      b.id === selectedBlock.id 
        ? { ...b, ...configForm, capacity: newCapacity }
        : b
    ));
    toast({
      title: 'Block Configuration Updated',
      description: `${configForm.name} has been updated successfully.`,
    });
    setConfigDialogOpen(false);
  };

  const handleViewMap = (block: YardBlock) => {
    setSelectedBlock(block);
    setMapDialogOpen(true);
  };

  const generateSlotGrid = (block: YardBlock) => {
    const slots = [];
    for (let row = 1; row <= Math.min(block.rows, 6); row++) {
      for (let bay = 1; bay <= Math.min(block.bays, 8); bay++) {
        const isOccupied = Math.random() < (block.occupied / block.capacity);
        slots.push({ row, bay, isOccupied });
      }
    }
    return slots;
  };

  return (
    <DashboardLayout
      navItems={adminNavItems}
      pageTitle="Yard Configuration"
      pageActions={
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Block
        </Button>
      }
    >
      {/* Yard Overview */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{dummyYardBlocks.length}</p>
                <p className="text-sm text-muted-foreground">Total Blocks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <MapPin className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {dummyYardBlocks.reduce((acc, b) => acc + b.capacity, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Capacity</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <MapPin className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {dummyYardBlocks.reduce((acc, b) => acc + b.occupied, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Occupied</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
                <MapPin className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {Math.round(
                    (dummyYardBlocks.reduce((acc, b) => acc + b.occupied, 0) /
                      dummyYardBlocks.reduce((acc, b) => acc + b.capacity, 0)) *
                      100
                  )}%
                </p>
                <p className="text-sm text-muted-foreground">Utilization</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Yard Blocks Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blocks.map((block) => {
          const percentage = Math.round((block.occupied / block.capacity) * 100);
          return (
            <Card key={block.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">{block.name}</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => handleOpenConfig(block)}>
                  <Settings className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Utilization Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Utilization</span>
                      <span
                        className={`text-sm font-medium ${
                          percentage > 80
                            ? 'text-destructive'
                            : percentage > 60
                            ? 'text-warning'
                            : 'text-success'
                        }`}
                      >
                        {percentage}%
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          percentage > 80
                            ? 'bg-destructive'
                            : percentage > 60
                            ? 'bg-warning'
                            : 'bg-success'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Block Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Rows</p>
                      <p className="font-medium text-foreground">{block.rows}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Bays</p>
                      <p className="font-medium text-foreground">{block.bays}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tiers</p>
                      <p className="font-medium text-foreground">{block.tiers}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Capacity</p>
                      <p className="font-medium text-foreground">{block.capacity}</p>
                    </div>
                  </div>

                  {/* Occupancy */}
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm text-muted-foreground">
                      {block.occupied} / {block.capacity} slots used
                    </span>
                    <Button variant="outline" size="sm" onClick={() => handleViewMap(block)}>
                      View Map
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Block Configuration Dialog */}
      <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configure Block: {selectedBlock?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="blockName">Block Name</Label>
              <Input
                id="blockName"
                value={configForm.name}
                onChange={(e) => setConfigForm({ ...configForm, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rows">Rows</Label>
                <Input
                  id="rows"
                  type="number"
                  min={1}
                  value={configForm.rows}
                  onChange={(e) => setConfigForm({ ...configForm, rows: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bays">Bays</Label>
                <Input
                  id="bays"
                  type="number"
                  min={1}
                  value={configForm.bays}
                  onChange={(e) => setConfigForm({ ...configForm, bays: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tiers">Tiers</Label>
                <Input
                  id="tiers"
                  type="number"
                  min={1}
                  value={configForm.tiers}
                  onChange={(e) => setConfigForm({ ...configForm, tiers: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Calculated Capacity: <span className="font-medium text-foreground">
                  {configForm.rows * configForm.bays * configForm.tiers} slots
                </span>
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfigDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveConfig}>Save Configuration</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Map Dialog */}
      <Dialog open={mapDialogOpen} onOpenChange={setMapDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Grid3X3 className="h-5 w-5" />
              Block Map: {selectedBlock?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-success" />
                <span className="text-sm text-muted-foreground">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-destructive" />
                <span className="text-sm text-muted-foreground">Occupied</span>
              </div>
            </div>
            {selectedBlock && (
              <div className="border rounded-lg p-4 bg-muted/30">
                <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${Math.min(selectedBlock.bays, 8)}, minmax(0, 1fr))` }}>
                  {generateSlotGrid(selectedBlock).map((slot, idx) => (
                    <div
                      key={idx}
                      className={`aspect-square rounded flex items-center justify-center text-xs font-medium ${
                        slot.isOccupied 
                          ? 'bg-destructive/80 text-destructive-foreground' 
                          : 'bg-success/80 text-success-foreground'
                      }`}
                      title={`Row ${slot.row}, Bay ${slot.bay}`}
                    >
                      <Box className="h-3 w-3" />
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  Showing {Math.min(selectedBlock.rows, 6)} rows × {Math.min(selectedBlock.bays, 8)} bays (sample view)
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMapDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
