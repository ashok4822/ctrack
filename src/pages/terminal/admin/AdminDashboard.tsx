import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KPICard } from '@/components/common/KPICard';
import { ActivityFeed } from '@/components/common/ActivityFeed';
import { AlertsPanel } from '@/components/common/AlertsPanel';
import { adminNavItems } from '@/config/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Container,
  Truck,
  DoorOpen,
  BarChart3,
  AlertTriangle,
  Wrench,
  Clock,
  Plus,
} from 'lucide-react';
import {
  dummyKPIData,
  dummyActivityFeed,
  dummyGateMovementsData,
  dummyDwellTimeData,
  dummyYardBlocks,
} from '@/data/dummyData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const COLORS = ['hsl(217, 91%, 35%)', 'hsl(199, 89%, 48%)', 'hsl(142, 76%, 36%)', 'hsl(38, 92%, 50%)', 'hsl(280, 68%, 60%)'];

const alerts = [
  { id: '1', type: 'error' as const, title: 'Damaged Container', message: 'EITU5432109 reported with structural damage' },
  { id: '2', type: 'warning' as const, title: 'Pending Approvals', message: '3 gate-out requests awaiting approval' },
  { id: '3', type: 'info' as const, title: 'Equipment Maintenance', message: 'Forklift FL-001 scheduled for maintenance' },
];

export default function AdminDashboard() {
  return (
    <DashboardLayout
      navItems={adminNavItems}
      pageTitle="Admin Dashboard"
      pageActions={
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Quick Actions
        </Button>
      }
    >
      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KPICard
          title="Containers in Yard"
          value={dummyKPIData.totalContainersInYard}
          icon={Container}
          variant="primary"
          trend={{ value: 5.2, isPositive: true }}
        />
        <KPICard
          title="In Transit"
          value={dummyKPIData.containersInTransit}
          icon={Truck}
          variant="default"
        />
        <KPICard
          title="Gate-In Today"
          value={dummyKPIData.gateInToday}
          icon={DoorOpen}
          variant="success"
          trend={{ value: 12, isPositive: true }}
        />
        <KPICard
          title="Gate-Out Today"
          value={dummyKPIData.gateOutToday}
          icon={DoorOpen}
          variant="default"
        />
        <KPICard
          title="Yard Utilization"
          value={`${dummyKPIData.yardUtilization}%`}
          icon={BarChart3}
          variant="warning"
        />
      </div>

      {/* Charts Row */}
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        {/* Gate Movements Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Daily Gate Movements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dummyGateMovementsData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="gateIn" name="Gate In" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="gateOut" name="Gate Out" fill="hsl(217, 91%, 35%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Dwell Time Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Container Dwell Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dummyDwellTimeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {dummyDwellTimeData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Yard Capacity */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Yard Capacity by Block</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {dummyYardBlocks.map((block) => {
              const percentage = Math.round((block.occupied / block.capacity) * 100);
              return (
                <div key={block.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{block.name}</span>
                    <span className={`text-sm font-medium ${percentage > 80 ? 'text-destructive' : percentage > 60 ? 'text-warning' : 'text-success'}`}>
                      {percentage}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${percentage > 80 ? 'bg-destructive' : percentage > 60 ? 'bg-warning' : 'bg-success'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>{block.occupied} occupied</span>
                    <span>{block.capacity} total</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <AlertsPanel alerts={alerts} />
        <ActivityFeed activities={dummyActivityFeed} />
      </div>
    </DashboardLayout>
  );
}
