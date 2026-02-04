import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { customerNavItems } from '@/config/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  DialogFooter,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Package, Container, ArrowRight, CheckCircle } from 'lucide-react';
import { dummyContainers } from '@/data/dummyData';
import { useToast } from '@/hooks/use-toast';
import type { Container as ContainerType } from '@/types';

const containerSizes = ['20ft', '40ft', '45ft'];
const containerTypes = ['Standard', 'Reefer', 'Open-Top', 'Flat-Rack', 'Tank'];

export default function RequestContainer() {
  const { toast } = useToast();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [requestType, setRequestType] = useState<'stuffing' | 'destuffing'>('stuffing');

  // Stuffing form state
  const [stuffingForm, setStuffingForm] = useState({
    containerSize: '',
    containerType: '',
    cargoDescription: '',
    cargoWeight: '',
    isHazardous: 'non-hazardous',
    hazardClass: '',
    unNumber: '',
    packingGroup: '',
    preferredDate: '',
    specialInstructions: '',
  });

  // Destuffing form state
  const [selectedContainer, setSelectedContainer] = useState<string>('');
  const [destuffingRemarks, setDestuffingRemarks] = useState('');
  const [destuffingDate, setDestuffingDate] = useState('');

  // Filter customer's loaded containers for destuffing
  const myLoadedContainers = dummyContainers.filter(
    c => c.customer === 'ABC Manufacturing' && c.status !== 'pending'
  );

  const selectedContainerDetails = myLoadedContainers.find(c => c.id === selectedContainer);

  const handleStuffingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestType('stuffing');
    setShowSuccessDialog(true);
  };

  const handleDestuffingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestType('destuffing');
    setShowSuccessDialog(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessDialog(false);
    toast({
      title: "Request Submitted",
      description: `Your ${requestType} request has been submitted successfully. You will be notified once it's approved.`,
    });
    // Reset forms
    setStuffingForm({
      containerSize: '',
      containerType: '',
      cargoDescription: '',
      cargoWeight: '',
      isHazardous: 'non-hazardous',
      hazardClass: '',
      unNumber: '',
      packingGroup: '',
      preferredDate: '',
      specialInstructions: '',
    });
    setSelectedContainer('');
    setDestuffingRemarks('');
    setDestuffingDate('');
  };

  return (
    <DashboardLayout
      navItems={customerNavItems}
      pageTitle="Request Container"
    >
      <Tabs defaultValue="stuffing" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="stuffing" className="gap-2">
            <Package className="h-4 w-4" />
            Empty for Stuffing
          </TabsTrigger>
          <TabsTrigger value="destuffing" className="gap-2">
            <Container className="h-4 w-4" />
            Loaded for Destuffing
          </TabsTrigger>
        </TabsList>

        {/* Request Empty Container for Stuffing */}
        <TabsContent value="stuffing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Request Empty Container for Stuffing
              </CardTitle>
              <CardDescription>
                Fill in the cargo details to request an empty container for loading your goods.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStuffingSubmit} className="space-y-6">
                {/* Container Requirements */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">Container Requirements</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Container Size *</Label>
                      <Select
                        value={stuffingForm.containerSize}
                        onValueChange={(value) => setStuffingForm({ ...stuffingForm, containerSize: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          {containerSizes.map((size) => (
                            <SelectItem key={size} value={size}>{size}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Container Type *</Label>
                      <Select
                        value={stuffingForm.containerType}
                        onValueChange={(value) => setStuffingForm({ ...stuffingForm, containerType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {containerTypes.map((type) => (
                            <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Cargo Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">Cargo Details</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Cargo Description *</Label>
                      <Textarea
                        placeholder="Describe the cargo to be loaded..."
                        value={stuffingForm.cargoDescription}
                        onChange={(e) => setStuffingForm({ ...stuffingForm, cargoDescription: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Cargo Weight (kg) *</Label>
                        <Input
                          type="number"
                          placeholder="Enter weight in kg"
                          value={stuffingForm.cargoWeight}
                          onChange={(e) => setStuffingForm({ ...stuffingForm, cargoWeight: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Preferred Stuffing Date *</Label>
                        <Input
                          type="date"
                          value={stuffingForm.preferredDate}
                          onChange={(e) => setStuffingForm({ ...stuffingForm, preferredDate: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hazardous Classification */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">Hazardous Classification</h3>
                  <RadioGroup
                    value={stuffingForm.isHazardous}
                    onValueChange={(value) => setStuffingForm({ ...stuffingForm, isHazardous: value })}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="non-hazardous" id="non-hazardous" />
                      <Label htmlFor="non-hazardous" className="font-normal cursor-pointer">
                        Non-Hazardous
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hazardous" id="hazardous" />
                      <Label htmlFor="hazardous" className="font-normal cursor-pointer">
                        Hazardous
                      </Label>
                    </div>
                  </RadioGroup>

                  {stuffingForm.isHazardous === 'hazardous' && (
                    <div className="grid gap-4 sm:grid-cols-3 p-4 bg-muted/50 rounded-lg border border-destructive/20">
                      <div className="space-y-2">
                        <Label>Hazard Class *</Label>
                        <Select
                          value={stuffingForm.hazardClass}
                          onValueChange={(value) => setStuffingForm({ ...stuffingForm, hazardClass: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Class 1 - Explosives</SelectItem>
                            <SelectItem value="2">Class 2 - Gases</SelectItem>
                            <SelectItem value="3">Class 3 - Flammable Liquids</SelectItem>
                            <SelectItem value="4">Class 4 - Flammable Solids</SelectItem>
                            <SelectItem value="5">Class 5 - Oxidizers</SelectItem>
                            <SelectItem value="6">Class 6 - Toxic Substances</SelectItem>
                            <SelectItem value="7">Class 7 - Radioactive</SelectItem>
                            <SelectItem value="8">Class 8 - Corrosives</SelectItem>
                            <SelectItem value="9">Class 9 - Miscellaneous</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>UN Number *</Label>
                        <Input
                          placeholder="e.g., UN1234"
                          value={stuffingForm.unNumber}
                          onChange={(e) => setStuffingForm({ ...stuffingForm, unNumber: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Packing Group</Label>
                        <Select
                          value={stuffingForm.packingGroup}
                          onValueChange={(value) => setStuffingForm({ ...stuffingForm, packingGroup: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select group" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="I">I - High Danger</SelectItem>
                            <SelectItem value="II">II - Medium Danger</SelectItem>
                            <SelectItem value="III">III - Low Danger</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Special Instructions */}
                <div className="space-y-2">
                  <Label>Special Instructions (Optional)</Label>
                  <Textarea
                    placeholder="Any special handling requirements or instructions..."
                    value={stuffingForm.specialInstructions}
                    onChange={(e) => setStuffingForm({ ...stuffingForm, specialInstructions: e.target.value })}
                  />
                </div>

                <Button type="submit" className="gap-2">
                  Submit Request
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Request Loaded Container for Destuffing */}
        <TabsContent value="destuffing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Container className="h-5 w-5" />
                Request Loaded Container for Destuffing
              </CardTitle>
              <CardDescription>
                Select a loaded container from your inventory to request destuffing services.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDestuffingSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label>Select Container *</Label>
                  <Select
                    value={selectedContainer}
                    onValueChange={setSelectedContainer}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a container" />
                    </SelectTrigger>
                    <SelectContent>
                      {myLoadedContainers.map((container) => (
                        <SelectItem key={container.id} value={container.id}>
                          <div className="flex items-center gap-2">
                            <Container className="h-4 w-4" />
                            {container.containerNumber} - {container.size} {container.type}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Container Details Card */}
                {selectedContainerDetails && (
                  <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Container Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Container Number</p>
                          <p className="font-mono font-medium">{selectedContainerDetails.containerNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Size / Type</p>
                          <p className="font-medium capitalize">{selectedContainerDetails.size} {selectedContainerDetails.type}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <p className="font-medium capitalize">{selectedContainerDetails.status}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Weight</p>
                          <p className="font-medium">{selectedContainerDetails.weight ? `${selectedContainerDetails.weight.toLocaleString()} kg` : '-'}</p>
                        </div>
                      </div>
                      {selectedContainerDetails.yardLocation && (
                        <div>
                          <p className="text-sm text-muted-foreground">Yard Location</p>
                          <p className="font-medium">
                            Block {selectedContainerDetails.yardLocation.block}
                          </p>
                        </div>
                      )}
                      {selectedContainerDetails.sealNumber && (
                        <div>
                          <p className="text-sm text-muted-foreground">Seal Number</p>
                          <p className="font-mono font-medium">{selectedContainerDetails.sealNumber}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Preferred Destuffing Date *</Label>
                    <Input
                      type="date"
                      value={destuffingDate}
                      onChange={(e) => setDestuffingDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Remarks / Special Instructions (Optional)</Label>
                  <Textarea
                    placeholder="Any special requirements for destuffing..."
                    value={destuffingRemarks}
                    onChange={(e) => setDestuffingRemarks(e.target.value)}
                  />
                </div>

                <Button type="submit" className="gap-2" disabled={!selectedContainer}>
                  Submit Request
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-sm text-center">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <DialogTitle>Request Submitted!</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Your {requestType === 'stuffing' ? 'empty container' : 'destuffing'} request has been submitted successfully.
            You will receive a notification once it's processed.
          </p>
          <DialogFooter className="sm:justify-center">
            <Button onClick={handleSuccessClose}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
