import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable, Column } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ClipboardCheck, AlertTriangle, Camera, CheckCircle, Clock, User, MapPin, Calendar, FileText } from 'lucide-react';
import type { Survey } from '@/types';
import { adminNavItems } from '@/config/navigation';

const surveys: Survey[] = [
  {
    id: '1',
    containerId: 'c1',
    containerNumber: 'MSCU1234567',
    surveyorId: 'u1',
    surveyorName: 'John Smith',
    status: 'pending',
    priority: 'urgent',
    location: 'Block A, Row 3, Bay 5',
    createdAt: '2024-01-15T08:00:00',
  },
  {
    id: '2',
    containerId: 'c2',
    containerNumber: 'MAEU7654321',
    surveyorId: 'u2',
    surveyorName: 'Jane Doe',
    status: 'in-progress',
    priority: 'normal',
    location: 'Block B, Row 1, Bay 2',
    createdAt: '2024-01-15T09:30:00',
  },
  {
    id: '3',
    containerId: 'c3',
    containerNumber: 'HLCU9876543',
    surveyorId: 'u1',
    surveyorName: 'John Smith',
    status: 'completed',
    priority: 'normal',
    location: 'Block C, Row 2, Bay 8',
    createdAt: '2024-01-14T14:00:00',
    completedAt: '2024-01-14T16:00:00',
    findings: {
      exteriorCondition: 'good',
      doorCondition: 'fair',
      floorCondition: 'good',
      structuralDamage: false,
      recommendation: 'clear',
    },
  },
  {
    id: '4',
    containerId: 'c4',
    containerNumber: 'CMAU5432109',
    surveyorId: 'u3',
    surveyorName: 'Mike Wilson',
    status: 'completed',
    priority: 'urgent',
    location: 'Gate Entry',
    createdAt: '2024-01-13T10:00:00',
    completedAt: '2024-01-13T12:30:00',
    findings: {
      exteriorCondition: 'poor',
      doorCondition: 'poor',
      floorCondition: 'fair',
      structuralDamage: true,
      damageSeverity: 'moderate',
      description: 'Visible dents on right panel, door hinges need replacement',
      recommendation: 'repair-required',
    },
  },
  {
    id: '5',
    containerId: 'c5',
    containerNumber: 'OOLU1357924',
    surveyorId: 'u2',
    surveyorName: 'Jane Doe',
    status: 'pending',
    priority: 'normal',
    location: 'Block A, Row 5, Bay 1',
    createdAt: '2024-01-15T11:00:00',
  },
];

const damageReports = [
  {
    id: '1',
    containerNumber: 'CMAU5432109',
    severity: 'moderate',
    type: 'Structural',
    description: 'Visible dents on right panel, door hinges need replacement',
    reportedBy: 'Mike Wilson',
    reportedAt: '2024-01-13T12:30:00',
    status: 'pending-clearance',
    photos: 3,
  },
  {
    id: '2',
    containerNumber: 'TRLU8765432',
    severity: 'minor',
    type: 'Cosmetic',
    description: 'Paint scratches on exterior',
    reportedBy: 'John Smith',
    reportedAt: '2024-01-12T15:00:00',
    status: 'cleared',
    photos: 2,
  },
  {
    id: '3',
    containerNumber: 'NYKU3456789',
    severity: 'severe',
    type: 'Structural',
    description: 'Floor damage, requires full replacement',
    reportedBy: 'Jane Doe',
    reportedAt: '2024-01-11T09:00:00',
    status: 'hold',
    photos: 5,
  },
];

const SurveysDamage = () => {
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);

  const pendingCount = surveys.filter(s => s.status === 'pending').length;
  const inProgressCount = surveys.filter(s => s.status === 'in-progress').length;
  const completedCount = surveys.filter(s => s.status === 'completed').length;
  const urgentCount = surveys.filter(s => s.priority === 'urgent').length;

  const surveyColumns: Column<Survey>[] = [
    {
      key: 'containerNumber',
      header: 'Container',
      sortable: true,
      render: (item) => (
        <span className="font-mono font-medium text-foreground">{item.containerNumber}</span>
      ),
    },
    {
      key: 'surveyorName',
      header: 'Surveyor',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{item.surveyorName}</span>
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      render: (item) => (
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm">{item.location}</span>
        </div>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      sortable: true,
      render: (item) => (
        <Badge variant={item.priority === 'urgent' ? 'destructive' : 'secondary'} className="capitalize">
          {item.priority}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: 'createdAt',
      header: 'Created',
      sortable: true,
      render: (item) => (
        <span className="text-sm">{new Date(item.createdAt).toLocaleDateString()}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" onClick={() => setSelectedSurvey(item)}>
              View Details
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Survey Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Container</p>
                  <p className="font-mono font-medium">{item.containerNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Surveyor</p>
                  <p className="font-medium">{item.surveyorName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p>{item.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <StatusBadge status={item.status} />
                </div>
              </div>
              {item.findings && (
                <div className="space-y-3 pt-2 border-t">
                  <h4 className="font-medium">Inspection Findings</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Exterior</p>
                      <Badge variant="outline" className="capitalize">{item.findings.exteriorCondition}</Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Door</p>
                      <Badge variant="outline" className="capitalize">{item.findings.doorCondition}</Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Floor</p>
                      <Badge variant="outline" className="capitalize">{item.findings.floorCondition}</Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Recommendation</p>
                      <Badge 
                        variant={item.findings.recommendation === 'clear' ? 'default' : 'destructive'}
                        className="capitalize"
                      >
                        {item.findings.recommendation}
                      </Badge>
                    </div>
                  </div>
                  {item.findings.description && (
                    <div>
                      <p className="text-sm text-muted-foreground">Description</p>
                      <p className="text-sm">{item.findings.description}</p>
                    </div>
                  )}
                </div>
              )}
              <div className="flex gap-2 pt-4">
                {item.status === 'pending' && (
                  <Button className="flex-1">Assign Surveyor</Button>
                )}
                {item.status === 'completed' && item.findings?.recommendation === 'repair-required' && (
                  <Button className="flex-1">Create Repair Order</Button>
                )}
                <Button variant="outline" className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  View Report
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ),
    },
  ];

  const damageColumns: Column<typeof damageReports[0]>[] = [
    {
      key: 'containerNumber',
      header: 'Container',
      sortable: true,
      render: (item) => (
        <span className="font-mono font-medium text-foreground">{item.containerNumber}</span>
      ),
    },
    {
      key: 'type',
      header: 'Damage Type',
      sortable: true,
    },
    {
      key: 'severity',
      header: 'Severity',
      sortable: true,
      render: (item) => (
        <Badge 
          variant={
            item.severity === 'severe' ? 'destructive' : 
            item.severity === 'moderate' ? 'default' : 'secondary'
          }
          className="capitalize"
        >
          {item.severity}
        </Badge>
      ),
    },
    {
      key: 'reportedBy',
      header: 'Reported By',
      render: (item) => (
        <div className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{item.reportedBy}</span>
        </div>
      ),
    },
    {
      key: 'photos',
      header: 'Photos',
      render: (item) => (
        <div className="flex items-center gap-1.5">
          <Camera className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{item.photos} attached</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm">View</Button>
          {item.status === 'pending-clearance' && (
            <Button variant="ghost" size="sm" className="text-green-600">Clear</Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout navItems={adminNavItems}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Surveys & Damage Control</h1>
            <p className="text-muted-foreground">Manage container inspections and damage reports</p>
          </div>
          <Button>
            <ClipboardCheck className="h-4 w-4 mr-2" />
            New Survey Request
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/10">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                  <p className="text-sm text-muted-foreground">Pending Surveys</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <ClipboardCheck className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{inProgressCount}</p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{completedCount}</p>
                  <p className="text-sm text-muted-foreground">Completed Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{urgentCount}</p>
                  <p className="text-sm text-muted-foreground">Urgent</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tables with Tabs */}
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="surveys">
              <TabsList className="mb-4">
                <TabsTrigger value="surveys">Survey Requests</TabsTrigger>
                <TabsTrigger value="damage">Damage Reports</TabsTrigger>
                <TabsTrigger value="clearance">Pending Clearance</TabsTrigger>
              </TabsList>
              <TabsContent value="surveys">
                <DataTable
                  data={surveys}
                  columns={surveyColumns}
                  searchable
                  searchPlaceholder="Search by container or surveyor..."
                />
              </TabsContent>
              <TabsContent value="damage">
                <DataTable
                  data={damageReports}
                  columns={damageColumns}
                  searchable
                  searchPlaceholder="Search damage reports..."
                />
              </TabsContent>
              <TabsContent value="clearance">
                <DataTable
                  data={damageReports.filter(d => d.status === 'pending-clearance')}
                  columns={damageColumns}
                  searchable
                  searchPlaceholder="Search pending clearance..."
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SurveysDamage;
