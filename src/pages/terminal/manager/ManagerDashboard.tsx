import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KPICard } from '@/components/common/KPICard';
import { ActivityFeed } from '@/components/common/ActivityFeed';
import { AlertsPanel } from '@/components/common/AlertsPanel';
import { managerNavItems } from '@/config/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Container,
  Truck,
  DoorOpen,
  BarChart3,
  CheckSquare,
} from 'lucide-react';
import {
  dummyKPIData,
  dummyActivityFeed,
  dummyGateMovementsData,
  dummyYardBlocks,
} from '@/data/dummyData';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const alerts = [
  { id: '1', type: 'warning' as const, title: 'Delayed Container', message: 'CMAU9876543 exceeds 5-day dwell time' },
  { id: '2', type: 'warning' as const, title: 'Pending Approvals', message: '3 gate-out requests awaiting your approval' },
  { id: '3', type: 'info' as const, title: 'Yard Congestion', message: 'Block A approaching 80% capacity' },
];

export default function ManagerDashboard() {
  return (
    <DashboardLayout navItems={managerNavItems} pageTitle="Manager Dashboard">
      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <KPICard
          title="Containers in Yard"
          value={dummyKPIData.totalContainersInYard}
          icon={Container}
          variant="primary"
        />
        <KPICard
          title="In Transit"
          value={dummyKPIData.containersInTransit}
          icon={Truck}
        />
        <KPICard
          title="Gate-In Today"
          value={dummyKPIData.gateInToday}
          icon={DoorOpen}
          variant="success"
        />
        <KPICard
          title="Gate-Out Today"
          value={dummyKPIData.gateOutToday}
          icon={DoorOpen}
        />
        <KPICard
          title="Yard Utilization"
          value={`${dummyKPIData.yardUtilization}%`}
          icon={BarChart3}
          variant="warning"
        />
        <KPICard
          title="Pending Approvals"
          value={dummyKPIData.pendingApprovals || 0}
          icon={CheckSquare}
          variant="danger"
        />
      </div>

      {/* Charts Row */}
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        {/* Gate Movement Trend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Gate Movement Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dummyGateMovementsData}>
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
                  <Legend />
                  <Line type="monotone" dataKey="gateIn" name="Gate In" stroke="hsl(142, 76%, 36%)" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="gateOut" name="Gate Out" stroke="hsl(217, 91%, 35%)" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Yard Block Utilization */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Block Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dummyYardBlocks.map((block) => {
                const percentage = Math.round((block.occupied / block.capacity) * 100);
                return (
                  <div key={block.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{block.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {block.occupied}/{block.capacity} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${percentage > 80 ? 'bg-destructive' : percentage > 60 ? 'bg-warning' : 'bg-primary'}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <AlertsPanel alerts={alerts} />
        <ActivityFeed activities={dummyActivityFeed} />
      </div>
    </DashboardLayout>
  );
}
