import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { surveyorNavItems } from '@/config/navigation';
import { KPICard } from '@/components/common/KPICard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  Camera, 
  CheckCircle, 
  ClipboardCheck, 
  Container, 
  FileText, 
  MapPin, 
  Upload,
  X
} from 'lucide-react';
import { dummySurveys } from '@/data/dummyData';
import type { Survey } from '@/types';

const inspectionChecklist = [
  { id: 'exterior-walls', label: 'Exterior Walls', category: 'Exterior' },
  { id: 'exterior-roof', label: 'Roof Panel', category: 'Exterior' },
  { id: 'exterior-floor', label: 'Undercarriage', category: 'Exterior' },
  { id: 'door-hinges', label: 'Door Hinges', category: 'Doors' },
  { id: 'door-seals', label: 'Door Seals/Gaskets', category: 'Doors' },
  { id: 'door-handles', label: 'Locking Mechanisms', category: 'Doors' },
  { id: 'interior-floor', label: 'Interior Floor', category: 'Interior' },
  { id: 'interior-walls', label: 'Interior Walls', category: 'Interior' },
  { id: 'interior-ceiling', label: 'Interior Ceiling', category: 'Interior' },
  { id: 'corner-posts', label: 'Corner Posts', category: 'Structure' },
  { id: 'forklift-pockets', label: 'Forklift Pockets', category: 'Structure' },
  { id: 'ventilation', label: 'Ventilation', category: 'Structure' },
];

export default function DamageInspection() {
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [inspectionMode, setInspectionMode] = useState(false);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [damageNotes, setDamageNotes] = useState('');
  const [severity, setSeverity] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  const inProgressSurveys = dummySurveys.filter(s => s.status === 'in-progress');
  const pendingSurveys = dummySurveys.filter(s => s.status === 'pending');

  const handleCheckItem = (itemId: string) => {
    setCheckedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const inspectionProgress = (checkedItems.length / inspectionChecklist.length) * 100;

  const startInspection = (survey: Survey) => {
    setSelectedSurvey(survey);
    setInspectionMode(true);
    setCheckedItems([]);
    setDamageNotes('');
    setSeverity('');
    setUploadedPhotos([]);
  };

  const handlePhotoUpload = () => {
    // Simulate photo upload
    setUploadedPhotos(prev => [...prev, `photo-${Date.now()}.jpg`]);
  };

  return (
    <DashboardLayout navItems={surveyorNavItems} pageTitle="Damage Inspection">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="In Progress"
          value={inProgressSurveys.length}
          icon={ClipboardCheck}
          variant="primary"
        />
        <KPICard
          title="Awaiting Inspection"
          value={pendingSurveys.length}
          icon={Container}
          variant="warning"
        />
        <KPICard
          title="Damage Found Today"
          value={2}
          icon={AlertTriangle}
          variant="danger"
        />
        <KPICard
          title="Cleared Today"
          value={5}
          icon={CheckCircle}
          variant="success"
        />
      </div>

      {/* Active Inspections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5" />
              Active Inspections
            </CardTitle>
            <CardDescription>Containers currently being inspected</CardDescription>
          </CardHeader>
          <CardContent>
            {inProgressSurveys.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No active inspections</p>
            ) : (
              <div className="space-y-3">
                {inProgressSurveys.map(survey => (
                  <div
                    key={survey.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => startInspection(survey)}
                  >
                    <div className="flex items-center gap-4">
                      <Container className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-mono font-medium">{survey.containerNumber}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {survey.location}
                        </p>
                      </div>
                    </div>
                    <Button size="sm">Continue</Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Container className="h-5 w-5" />
              Pending Inspections
            </CardTitle>
            <CardDescription>Containers awaiting inspection</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingSurveys.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No pending inspections</p>
            ) : (
              <div className="space-y-3">
                {pendingSurveys.slice(0, 5).map(survey => (
                  <div
                    key={survey.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <Container className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-mono font-medium">{survey.containerNumber}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-muted-foreground">{survey.location}</p>
                          {survey.priority === 'urgent' && (
                            <Badge variant="destructive" className="text-xs">Urgent</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => startInspection(survey)}>
                      Start
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Inspection Dialog */}
      <Dialog open={inspectionMode} onOpenChange={setInspectionMode}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5" />
              Damage Inspection - {selectedSurvey?.containerNumber}
            </DialogTitle>
            <DialogDescription>
              Complete the checklist and document any damage found
            </DialogDescription>
          </DialogHeader>

          {selectedSurvey && (
            <div className="space-y-6">
              {/* Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Inspection Progress</span>
                  <span>{checkedItems.length} / {inspectionChecklist.length} items</span>
                </div>
                <Progress value={inspectionProgress} className="h-2" />
              </div>

              {/* Inspection Checklist */}
              <Tabs defaultValue="Exterior">
                <TabsList>
                  <TabsTrigger value="Exterior">Exterior</TabsTrigger>
                  <TabsTrigger value="Doors">Doors</TabsTrigger>
                  <TabsTrigger value="Interior">Interior</TabsTrigger>
                  <TabsTrigger value="Structure">Structure</TabsTrigger>
                </TabsList>

                {['Exterior', 'Doors', 'Interior', 'Structure'].map(category => (
                  <TabsContent key={category} value={category} className="space-y-3">
                    {inspectionChecklist
                      .filter(item => item.category === category)
                      .map(item => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox
                              id={item.id}
                              checked={checkedItems.includes(item.id)}
                              onCheckedChange={() => handleCheckItem(item.id)}
                            />
                            <Label htmlFor={item.id} className="cursor-pointer">
                              {item.label}
                            </Label>
                          </div>
                          <Select>
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Condition" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="good">Good</SelectItem>
                              <SelectItem value="fair">Fair</SelectItem>
                              <SelectItem value="poor">Poor</SelectItem>
                              <SelectItem value="damaged">Damaged</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                  </TabsContent>
                ))}
              </Tabs>

              {/* Damage Documentation */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Damage Documentation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Damage Severity</Label>
                    <Select value={severity} onValueChange={setSeverity}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select severity level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Damage</SelectItem>
                        <SelectItem value="minor">Minor</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="severe">Severe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Damage Description</Label>
                    <Textarea
                      placeholder="Describe any damage found..."
                      value={damageNotes}
                      onChange={(e) => setDamageNotes(e.target.value)}
                      className="mt-1.5"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label>Photo Evidence</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {uploadedPhotos.map((photo, index) => (
                        <div
                          key={index}
                          className="relative w-20 h-20 bg-muted rounded-lg flex items-center justify-center"
                        >
                          <Camera className="h-6 w-6 text-muted-foreground" />
                          <button
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                            onClick={() => setUploadedPhotos(prev => prev.filter((_, i) => i !== index))}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      <button
                        className="w-20 h-20 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                        onClick={handlePhotoUpload}
                      >
                        <Upload className="h-5 w-5" />
                        <span className="text-xs mt-1">Upload</span>
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setInspectionMode(false)}>
              Save & Exit
            </Button>
            <Button disabled={inspectionProgress < 100}>
              <FileText className="h-4 w-4 mr-2" />
              Complete Inspection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
