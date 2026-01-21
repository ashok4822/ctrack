import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { surveyorNavItems } from '@/config/navigation';
import { KPICard } from '@/components/common/KPICard';
import { DataTable, Column } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ClipboardCheck, Clock, AlertTriangle, CheckCircle, MapPin, Container, Play } from 'lucide-react';
import { dummySurveys } from '@/data/dummyData';
import type { Survey } from '@/types';

export default function AssignedSurveys() {
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);

  const pendingSurveys = dummySurveys.filter(s => s.status === 'pending');
  const inProgressSurveys = dummySurveys.filter(s => s.status === 'in-progress');
  const completedSurveys = dummySurveys.filter(s => s.status === 'completed');
  const urgentSurveys = dummySurveys.filter(s => s.priority === 'urgent');

  const columns: Column<Survey>[] = [
    {
      key: 'containerNumber',
      header: 'Container',
      sortable: true,
      render: (survey) => (
        <div className="flex items-center gap-2">
          <Container className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono font-medium">{survey.containerNumber}</span>
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      render: (survey) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{survey.location}</span>
        </div>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      sortable: true,
      render: (survey) => (
        <Badge variant={survey.priority === 'urgent' ? 'destructive' : 'secondary'}>
          {survey.priority === 'urgent' && <AlertTriangle className="h-3 w-3 mr-1" />}
          {survey.priority}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (survey) => (
        <StatusBadge status={survey.status} />
      ),
    },
    {
      key: 'createdAt',
      header: 'Assigned',
      sortable: true,
      render: (survey) => (
        <span className="text-sm text-muted-foreground">
          {new Date(survey.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (survey) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedSurvey(survey);
            }}
          >
            View Details
          </Button>
          {survey.status === 'pending' && (
            <Button size="sm" variant="default">
              <Play className="h-3 w-3 mr-1" />
              Start
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout navItems={surveyorNavItems} pageTitle="Assigned Surveys">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="Pending"
          value={pendingSurveys.length}
          icon={Clock}
          variant="warning"
        />
        <KPICard
          title="In Progress"
          value={inProgressSurveys.length}
          icon={ClipboardCheck}
          variant="primary"
        />
        <KPICard
          title="Completed Today"
          value={completedSurveys.length}
          icon={CheckCircle}
          variant="success"
        />
        <KPICard
          title="Urgent"
          value={urgentSurveys.length}
          icon={AlertTriangle}
          variant="danger"
        />
      </div>

      {/* Surveys Table */}
      <Card>
        <CardHeader>
          <CardTitle>My Survey Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList className="mb-4">
              <TabsTrigger value="pending">
                Pending ({pendingSurveys.length})
              </TabsTrigger>
              <TabsTrigger value="in-progress">
                In Progress ({inProgressSurveys.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({completedSurveys.length})
              </TabsTrigger>
              <TabsTrigger value="all">
                All ({dummySurveys.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <DataTable
                data={pendingSurveys}
                columns={columns}
                searchable
                searchPlaceholder="Search pending surveys..."
                onRowClick={(survey) => setSelectedSurvey(survey)}
              />
            </TabsContent>

            <TabsContent value="in-progress">
              <DataTable
                data={inProgressSurveys}
                columns={columns}
                searchable
                searchPlaceholder="Search in-progress surveys..."
                onRowClick={(survey) => setSelectedSurvey(survey)}
              />
            </TabsContent>

            <TabsContent value="completed">
              <DataTable
                data={completedSurveys}
                columns={columns}
                searchable
                searchPlaceholder="Search completed surveys..."
                onRowClick={(survey) => setSelectedSurvey(survey)}
              />
            </TabsContent>

            <TabsContent value="all">
              <DataTable
                data={dummySurveys}
                columns={columns}
                searchable
                searchPlaceholder="Search all surveys..."
                onRowClick={(survey) => setSelectedSurvey(survey)}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Survey Details Dialog */}
      <Dialog open={!!selectedSurvey} onOpenChange={() => setSelectedSurvey(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Survey Details</DialogTitle>
          </DialogHeader>
          {selectedSurvey && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Container</p>
                  <p className="font-mono font-medium">{selectedSurvey.containerNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{selectedSurvey.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Priority</p>
                  <Badge variant={selectedSurvey.priority === 'urgent' ? 'destructive' : 'secondary'}>
                    {selectedSurvey.priority}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <StatusBadge status={selectedSurvey.status} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Assigned Date</p>
                  <p className="text-sm">{new Date(selectedSurvey.createdAt).toLocaleString()}</p>
                </div>
                {selectedSurvey.completedAt && (
                  <div>
                    <p className="text-sm text-muted-foreground">Completed Date</p>
                    <p className="text-sm">{new Date(selectedSurvey.completedAt).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedSurvey(null)}>
              Close
            </Button>
            {selectedSurvey?.status === 'pending' && (
              <Button>
                <Play className="h-4 w-4 mr-2" />
                Start Survey
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
