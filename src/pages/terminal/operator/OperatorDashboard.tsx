import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KPICard } from '@/components/common/KPICard';
import { operatorNavItems } from '@/config/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import {
  DoorOpen,
  Container,
  CheckSquare,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { dummyKPIData, dummyTasks, dummyGateOperations } from '@/data/dummyData';
import { Link } from 'react-router-dom';

export default function OperatorDashboard() {
  const pendingTasks = dummyTasks.filter(t => t.status !== 'completed');
  const pendingGateOps = dummyGateOperations.filter(g => g.status === 'pending');

  return (
    <DashboardLayout navItems={operatorNavItems} pageTitle="Operator Dashboard">
      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Gate-Ins Today"
          value={dummyKPIData.gateInToday}
          icon={DoorOpen}
          variant="success"
        />
        <KPICard
          title="Gate-Outs Today"
          value={dummyKPIData.gateOutToday}
          icon={DoorOpen}
        />
        <KPICard
          title="Containers in Yard"
          value={dummyKPIData.totalContainersInYard}
          icon={Container}
          variant="primary"
        />
        <KPICard
          title="Tasks Pending"
          value={dummyKPIData.tasksToday || 0}
          icon={CheckSquare}
          variant="warning"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
          <Link to="/terminal/operator/gate">
            <DoorOpen className="h-6 w-6 text-success" />
            <span>Process Gate-In</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
          <Link to="/terminal/operator/gate">
            <DoorOpen className="h-6 w-6 text-primary" />
            <span>Process Gate-Out</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
          <Link to="/terminal/operator/yard">
            <Container className="h-6 w-6 text-warning" />
            <span>Yard Operations</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
          <Link to="/terminal/operator/lookup">
            <Container className="h-6 w-6 text-info" />
            <span>Container Lookup</span>
          </Link>
        </Button>
      </div>

      {/* Task Queue and Gate Operations */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Task Queue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Task Queue</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/terminal/operator/tasks">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingTasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-4 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <CheckSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{task.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge status={task.priority} />
                      <span className="text-xs text-muted-foreground">
                        <Clock className="inline h-3 w-3 mr-1" />
                        {task.status}
                      </span>
                    </div>
                  </div>
                  <Button size="sm">Start</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Gate Operations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Pending Gate Operations</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/terminal/operator/gate">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingGateOps.map((op) => (
                <div
                  key={op.id}
                  className="flex items-center gap-4 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${op.type === 'gate-in' ? 'bg-success/10' : 'bg-primary/10'}`}>
                    <DoorOpen className={`h-5 w-5 ${op.type === 'gate-in' ? 'text-success' : 'text-primary'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{op.containerNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {op.vehicleNumber} • {op.driverName}
                    </p>
                  </div>
                  <StatusBadge status={op.type} />
                </div>
              ))}
              {pendingGateOps.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No pending gate operations</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
