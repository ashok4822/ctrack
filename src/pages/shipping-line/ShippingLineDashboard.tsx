import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KPICard } from '@/components/common/KPICard';
import { shippingLineNavItems } from '@/config/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import {
  Container,
  Truck,
  MapPin,
  Factory,
  AlertTriangle,
  ArrowRight,
  Ship,
} from 'lucide-react';
import { dummyContainers, dummyGateMovementsData } from '@/data/dummyData';
import { Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function ShippingLineDashboard() {
  // Filter containers for this shipping line (Maersk in demo)
  const myContainers = dummyContainers.filter(c => c.shippingLine === 'Maersk Line');
  const inYard = myContainers.filter(c => c.status === 'in-yard').length;
  const inTransit = myContainers.filter(c => c.status === 'in-transit').length;
  const atPort = myContainers.filter(c => c.status === 'at-port').length;
  const atFactory = myContainers.filter(c => c.status === 'at-factory').length;
  const damaged = myContainers.filter(c => c.damaged).length;

  return (
    <DashboardLayout navItems={shippingLineNavItems} pageTitle="Shipping Line Dashboard">
      {/* Shipping Line Info */}
      <div className="mb-6 rounded-lg border bg-primary/5 p-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
            <Ship className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Maersk Line</h2>
            <p className="text-muted-foreground">{myContainers.length} containers in system</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KPICard
          title="Total Containers"
          value={myContainers.length}
          icon={Container}
          variant="primary"
        />
        <KPICard
          title="In Yard"
          value={inYard}
          icon={MapPin}
          variant="success"
        />
        <KPICard
          title="In Transit"
          value={inTransit}
          icon={Truck}
        />
        <KPICard
          title="At Port"
          value={atPort}
          icon={Ship}
          variant="warning"
        />
        <KPICard
          title="At Factory"
          value={atFactory}
          icon={Factory}
        />
      </div>

      {/* Alerts */}
      {damaged > 0 && (
        <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <div>
              <p className="font-medium text-foreground">{damaged} container(s) with damage reports</p>
              <p className="text-sm text-muted-foreground">Review damage reports and survey findings</p>
            </div>
            <Button variant="outline" size="sm" className="ml-auto">
              View Details
            </Button>
          </div>
        </div>
      )}

      {/* Charts and Container List */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Movement Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Container Movement Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
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
                  <Line type="monotone" dataKey="gateIn" stroke="hsl(142, 76%, 36%)" strokeWidth={2} />
                  <Line type="monotone" dataKey="gateOut" stroke="hsl(217, 91%, 35%)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Containers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Recent Containers</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/shipping-line/containers">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myContainers.slice(0, 4).map((container) => (
                <div
                  key={container.id}
                  className="flex items-center gap-4 rounded-lg border p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Container className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{container.containerNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {container.size} • {container.type}
                    </p>
                  </div>
                  <StatusBadge status={container.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
