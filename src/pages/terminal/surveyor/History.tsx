import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { surveyorNavItems } from '@/config/navigation';
import { KPICard } from '@/components/common/KPICard';
import { DataTable, Column } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  History as HistoryIcon, 
  Container, 
  Calendar, 
  CheckCircle, 
  AlertTriangle,
  Eye,
  Filter,
  TrendingUp
} from 'lucide-react';
import { dummySurveys } from '@/data/dummyData';
import type { Survey } from '@/types';

export default function History() {
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // All surveys for history view
  const allSurveys = dummySurveys;
  
  // Filter surveys based on selections
  const filteredSurveys = allSurveys.filter(survey => {
    if (statusFilter !== 'all' && survey.status !== statusFilter) return false;
    // Date filtering would be implemented with actual date logic
    return true;
  });

  const completedCount = allSurveys.filter(s => s.status === 'completed').length;
  const damageFoundCount = allSurveys.filter(s => s.findings?.structuralDamage).length;
  const avgPerDay = Math.round(completedCount / 7); // Mock calculation

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
      sortable: true,
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (survey) => (
        <Badge variant={survey.priority === 'urgent' ? 'destructive' : 'secondary'}>
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
      key: 'completedAt',
      header: 'Completed',
      sortable: true,
      render: (survey) => (
        <span className="text-sm text-muted-foreground">
          {survey.completedAt ? new Date(survey.completedAt).toLocaleDateString() : '-'}
        </span>
      ),
    },
    {
      key: 'findings.recommendation',
      header: 'Result',
      render: (survey) => {
        if (!survey.findings) return <span className="text-muted-foreground">-</span>;
        const rec = survey.findings.recommendation;
        return (
          <Badge variant={rec === 'clear' ? 'default' : rec === 'repair-required' ? 'destructive' : 'secondary'}>
            {rec === 'clear' && <CheckCircle className="h-3 w-3 mr-1" />}
            {rec === 'repair-required' && <AlertTriangle className="h-3 w-3 mr-1" />}
            {rec}
          </Badge>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (survey) => (
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedSurvey(survey);
          }}
        >
          <Eye className="h-3 w-3 mr-1" />
          View
        </Button>
      ),
    },
  ];

  return (
    <DashboardLayout navItems={surveyorNavItems} pageTitle="Survey History">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="Total Surveys"
          value={allSurveys.length}
          icon={HistoryIcon}
          variant="default"
        />
        <KPICard
          title="Completed"
          value={completedCount}
          icon={CheckCircle}
          variant="success"
        />
        <KPICard
          title="Damage Found"
          value={damageFoundCount}
          icon={AlertTriangle}
          variant="danger"
        />
        <KPICard
          title="Avg/Day"
          value={avgPerDay}
          icon={TrendingUp}
          variant="primary"
        />
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Date Range</Label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>From Date</Label>
              <Input type="date" className="mt-1.5" />
            </div>
            <div>
              <Label>To Date</Label>
              <Input type="date" className="mt-1.5" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HistoryIcon className="h-5 w-5" />
            Survey History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredSurveys}
            columns={columns}
            searchable
            searchPlaceholder="Search survey history..."
            onRowClick={(survey) => setSelectedSurvey(survey)}
          />
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
                  <p className="text-sm text-muted-foreground">Assigned</p>
                  <p className="text-sm">{new Date(selectedSurvey.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-sm">
                    {selectedSurvey.completedAt 
                      ? new Date(selectedSurvey.completedAt).toLocaleString() 
                      : '-'}
                  </p>
                </div>
              </div>

              {selectedSurvey.findings && (
                <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                  <h4 className="font-semibold">Findings</h4>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Exterior</p>
                      <p className="capitalize">{selectedSurvey.findings.exteriorCondition}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Doors</p>
                      <p className="capitalize">{selectedSurvey.findings.doorCondition}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Floor</p>
                      <p className="capitalize">{selectedSurvey.findings.floorCondition}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Recommendation</p>
                    <Badge 
                      variant={selectedSurvey.findings.recommendation === 'clear' ? 'default' : 'destructive'}
                    >
                      {selectedSurvey.findings.recommendation}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedSurvey(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
