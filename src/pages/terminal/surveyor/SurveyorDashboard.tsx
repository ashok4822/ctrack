import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KPICard } from '@/components/common/KPICard';
import { surveyorNavItems } from '@/config/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import {
  ClipboardCheck,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  MapPin,
} from 'lucide-react';
import { dummySurveys } from '@/data/dummyData';
import { Link } from 'react-router-dom';

export default function SurveyorDashboard() {
  const pendingSurveys = dummySurveys.filter(s => s.status === 'pending');
  const completedToday = dummySurveys.filter(s => s.status === 'completed').length;
  const damageHold = dummySurveys.filter(s => s.findings?.recommendation === 'hold').length;

  return (
    <DashboardLayout navItems={surveyorNavItems} pageTitle="Surveyor Dashboard">
      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <KPICard
          title="Pending Surveys"
          value={pendingSurveys.length}
          icon={ClipboardCheck}
          variant="warning"
        />
        <KPICard
          title="Completed Today"
          value={completedToday}
          icon={CheckCircle}
          variant="success"
        />
        <KPICard
          title="Containers Under Hold"
          value={damageHold}
          icon={AlertTriangle}
          variant="danger"
        />
      </div>

      {/* Assigned Surveys */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold">Assigned Inspection Tasks</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/terminal/surveyor/assigned">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dummySurveys.map((survey) => (
              <div
                key={survey.id}
                className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${survey.priority === 'urgent' ? 'bg-destructive/10' : 'bg-primary/10'}`}>
                  <ClipboardCheck className={`h-6 w-6 ${survey.priority === 'urgent' ? 'text-destructive' : 'text-primary'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground">{survey.containerNumber}</p>
                    <StatusBadge status={survey.priority} />
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {survey.location}
                    </span>
                    <span>•</span>
                    <StatusBadge status={survey.status} />
                  </div>
                </div>
                <Button size="sm" disabled={survey.status === 'completed'}>
                  {survey.status === 'pending' ? 'Start Inspection' : survey.status === 'in-progress' ? 'Continue' : 'View Report'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
