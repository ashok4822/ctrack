import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KPICard } from '@/components/common/KPICard';
import { operatorNavItems } from '@/config/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  CheckSquare,
  Clock,
  AlertTriangle,
  CheckCircle,
  Play,
  Pause,
} from 'lucide-react';
import { dummyTasks } from '@/data/dummyData';
import { useState } from 'react';

interface Task {
  id: string;
  type: string;
  description: string;
  priority: 'normal' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed';
  assignedAt: string;
  containerId?: string;
  containerNumber?: string;
}

export default function OperatorTasks() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const tasks: Task[] = dummyTasks.map(t => ({
    ...t,
    status: t.status as 'pending' | 'in-progress' | 'completed',
    priority: t.priority as 'normal' | 'high' | 'urgent',
    assignedAt: t.createdAt,
  }));

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const urgentTasks = tasks.filter(t => t.priority === 'urgent');

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'high':
        return <Clock className="h-4 w-4 text-warning" />;
      default:
        return <CheckSquare className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'in-progress':
        return <Play className="h-4 w-4 text-primary" />;
      default:
        return <Pause className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const TaskCard = ({ task }: { task: Task }) => (
    <div className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
        {getPriorityIcon(task.priority)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-muted-foreground uppercase">{task.type}</span>
          <StatusBadge status={task.priority} />
        </div>
        <p className="font-medium text-foreground truncate">{task.description}</p>
        {task.containerNumber && (
          <p className="text-sm text-muted-foreground">Container: {task.containerNumber}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Assigned: {new Date(task.assignedAt).toLocaleString()}
        </p>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant={task.status === 'pending' ? 'default' : 'outline'}
            onClick={() => setSelectedTask(task)}
          >
            {task.status === 'pending' ? 'Start' : task.status === 'in-progress' ? 'Complete' : 'View'}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
            <DialogDescription>{task.type}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Type</Label>
                <p className="font-medium capitalize">{task.type}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Priority</Label>
                <div className="flex items-center gap-2">
                  {getPriorityIcon(task.priority)}
                  <span className="font-medium capitalize">{task.priority}</span>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <div className="flex items-center gap-2">
                  {getStatusIcon(task.status)}
                  <span className="font-medium capitalize">{task.status.replace('-', ' ')}</span>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Container</Label>
                <p className="font-medium">{task.containerNumber || 'N/A'}</p>
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground">Description</Label>
              <p className="font-medium">{task.description}</p>
            </div>
            {task.status !== 'completed' && (
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Add notes about this task..." />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline">Close</Button>
            {task.status === 'pending' && <Button>Start Task</Button>}
            {task.status === 'in-progress' && <Button>Mark Complete</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

  return (
    <DashboardLayout navItems={operatorNavItems} pageTitle="Tasks">
      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Pending Tasks"
          value={pendingTasks.length}
          icon={Clock}
          variant="warning"
        />
        <KPICard
          title="In Progress"
          value={inProgressTasks.length}
          icon={Play}
          variant="primary"
        />
        <KPICard
          title="Completed Today"
          value={completedTasks.length}
          icon={CheckCircle}
          variant="success"
        />
        <KPICard
          title="Urgent"
          value={urgentTasks.length}
          icon={AlertTriangle}
          variant="danger"
        />
      </div>

      {/* Tasks List */}
      <Card>
        <CardHeader>
          <CardTitle>My Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList className="mb-4">
              <TabsTrigger value="pending">Pending ({pendingTasks.length})</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress ({inProgressTasks.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
              <TabsTrigger value="all">All ({tasks.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <div className="space-y-3">
                {pendingTasks.length > 0 ? (
                  pendingTasks.map((task) => <TaskCard key={task.id} task={task} />)
                ) : (
                  <p className="text-center text-muted-foreground py-8">No pending tasks</p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="in-progress">
              <div className="space-y-3">
                {inProgressTasks.length > 0 ? (
                  inProgressTasks.map((task) => <TaskCard key={task.id} task={task} />)
                ) : (
                  <p className="text-center text-muted-foreground py-8">No tasks in progress</p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="completed">
              <div className="space-y-3">
                {completedTasks.length > 0 ? (
                  completedTasks.map((task) => <TaskCard key={task.id} task={task} />)
                ) : (
                  <p className="text-center text-muted-foreground py-8">No completed tasks</p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="all">
              <div className="space-y-3">
                {tasks.map((task) => <TaskCard key={task.id} task={task} />)}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
