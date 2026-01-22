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
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Download, 
  Printer, 
  Eye, 
  Container, 
  CheckCircle, 
  AlertTriangle,
  Calendar,
  User,
  MapPin,
  Camera
} from 'lucide-react';
import { dummySurveys } from '@/data/dummyData';
import type { Survey } from '@/types';

export default function SurveyReports() {
  const [selectedReport, setSelectedReport] = useState<Survey | null>(null);

  const completedSurveys = dummySurveys.filter(s => s.status === 'completed');
  const surveysWithDamage = completedSurveys.filter(s => s.findings?.structuralDamage);
  const clearedSurveys = completedSurveys.filter(s => s.findings?.recommendation === 'clear');

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
      key: 'completedAt',
      header: 'Completed',
      sortable: true,
      render: (survey) => (
        <span className="text-sm">
          {survey.completedAt ? new Date(survey.completedAt).toLocaleDateString() : '-'}
        </span>
      ),
    },
    {
      key: 'findings.recommendation',
      header: 'Recommendation',
      render: (survey) => {
        const rec = survey.findings?.recommendation;
        return (
          <Badge variant={rec === 'clear' ? 'default' : rec === 'repair-required' ? 'destructive' : 'secondary'}>
            {rec === 'clear' && <CheckCircle className="h-3 w-3 mr-1" />}
            {rec === 'repair-required' && <AlertTriangle className="h-3 w-3 mr-1" />}
            {rec || 'Pending'}
          </Badge>
        );
      },
    },
    {
      key: 'findings.exteriorCondition',
      header: 'Exterior',
      render: (survey) => (
        <StatusBadge
          status={survey.findings?.exteriorCondition === 'good' ? 'in-yard' : survey.findings?.exteriorCondition === 'fair' ? 'pending' : 'damaged'}
        />
      ),
    },
    {
      key: 'findings.structuralDamage',
      header: 'Damage',
      render: (survey) => (
        survey.findings?.structuralDamage ? (
          <Badge variant="destructive">
            {survey.findings.damageSeverity || 'Yes'}
          </Badge>
        ) : (
          <Badge variant="outline">None</Badge>
        )
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
              setSelectedReport(survey);
            }}
          >
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
          <Button size="sm" variant="ghost">
            <Download className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="ghost">
            <Printer className="h-3 w-3" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout navItems={surveyorNavItems} pageTitle="Survey Reports">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="Total Reports"
          value={completedSurveys.length}
          icon={FileText}
          variant="default"
        />
        <KPICard
          title="Cleared"
          value={clearedSurveys.length}
          icon={CheckCircle}
          variant="success"
        />
        <KPICard
          title="Damage Found"
          value={surveysWithDamage.length}
          icon={AlertTriangle}
          variant="danger"
        />
        <KPICard
          title="This Week"
          value={3}
          icon={Calendar}
          variant="primary"
        />
      </div>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Completed Survey Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={completedSurveys}
            columns={columns}
            searchable
            searchPlaceholder="Search reports..."
            onRowClick={(survey) => setSelectedReport(survey)}
          />
        </CardContent>
      </Card>

      {/* Report View Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Survey Report - {selectedReport?.containerNumber}
            </DialogTitle>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Container className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Container</p>
                    <p className="font-mono font-medium">{selectedReport.containerNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-medium">{selectedReport.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Surveyor</p>
                    <p className="font-medium">{selectedReport.surveyorName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Completed</p>
                    <p className="font-medium">
                      {selectedReport.completedAt 
                        ? new Date(selectedReport.completedAt).toLocaleString() 
                        : '-'}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Findings */}
              {selectedReport.findings && (
                <>
                  <div>
                    <h4 className="font-semibold mb-3">Condition Assessment</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-3 border rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Exterior</p>
                        <StatusBadge
                          status={selectedReport.findings.exteriorCondition === 'good' ? 'in-yard' : selectedReport.findings.exteriorCondition === 'fair' ? 'pending' : 'damaged'}
                        />
                      </div>
                      <div className="p-3 border rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Doors</p>
                        <StatusBadge
                          status={selectedReport.findings.doorCondition === 'good' ? 'in-yard' : selectedReport.findings.doorCondition === 'fair' ? 'pending' : 'damaged'}
                        />
                      </div>
                      <div className="p-3 border rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Floor</p>
                        <StatusBadge
                          status={selectedReport.findings.floorCondition === 'good' ? 'in-yard' : selectedReport.findings.floorCondition === 'fair' ? 'pending' : 'damaged'}
                        />
                      </div>
                    </div>
                  </div>

                  {selectedReport.findings.structuralDamage && (
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                        <h4 className="font-semibold text-destructive">Damage Detected</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Severity</p>
                          <Badge variant="destructive">{selectedReport.findings.damageSeverity}</Badge>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Description</p>
                          <p>{selectedReport.findings.description || 'No description provided'}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Photos */}
                  {selectedReport.findings.photos && selectedReport.findings.photos.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Camera className="h-4 w-4" />
                        Photo Evidence ({selectedReport.findings.photos.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedReport.findings.photos.map((photo, index) => (
                          <div
                            key={index}
                            className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted/80"
                          >
                            <Camera className="h-8 w-8 text-muted-foreground" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Recommendation */}
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Final Recommendation</h4>
                    <Badge 
                      variant={selectedReport.findings.recommendation === 'clear' ? 'default' : 'destructive'}
                      className="text-sm"
                    >
                      {selectedReport.findings.recommendation === 'clear' && <CheckCircle className="h-4 w-4 mr-1" />}
                      {selectedReport.findings.recommendation === 'repair-required' && <AlertTriangle className="h-4 w-4 mr-1" />}
                      {selectedReport.findings.recommendation?.toUpperCase().replace('-', ' ')}
                    </Badge>
                  </div>
                </>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSelectedReport(null)}>
              Close
            </Button>
            <Button variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
