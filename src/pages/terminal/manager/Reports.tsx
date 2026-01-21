import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KPICard } from '@/components/common/KPICard';
import { managerNavItems } from '@/config/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  dummyKPIData,
  dummyGateMovementsData,
  dummyDwellTimeData,
  dummyYardBlocks,
} from '@/data/dummyData';
import {
  FileText,
  Download,
  BarChart3,
  TrendingUp,
  Container,
  Clock,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['hsl(142, 76%, 36%)', 'hsl(217, 91%, 60%)', 'hsl(45, 93%, 47%)', 'hsl(0, 84%, 60%)'];

const reportTemplates = [
  { id: '1', name: 'Daily Operations Summary', type: 'operational', lastGenerated: '2024-01-15' },
  { id: '2', name: 'Weekly Yard Utilization', type: 'yard', lastGenerated: '2024-01-14' },
  { id: '3', name: 'Container Dwell Time Analysis', type: 'dwell-time', lastGenerated: '2024-01-13' },
  { id: '4', name: 'Gate Movement Report', type: 'operational', lastGenerated: '2024-01-15' },
  { id: '5', name: 'Equipment Status Report', type: 'equipment', lastGenerated: '2024-01-12' },
];

export default function ManagerReports() {
  const yardUtilizationData = dummyYardBlocks.map((block) => ({
    name: block.name,
    value: block.occupied,
    percentage: Math.round((block.occupied / block.capacity) * 100),
  }));

  return (
    <DashboardLayout navItems={managerNavItems} pageTitle="Reports">
      {/* KPI Summary */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Reports Generated"
          value={12}
          subtitle="This month"
          icon={FileText}
        />
        <KPICard
          title="Avg Yard Utilization"
          value={`${dummyKPIData.yardUtilization}%`}
          icon={BarChart3}
          variant="primary"
        />
        <KPICard
          title="Containers Processed"
          value={dummyKPIData.gateInToday + dummyKPIData.gateOutToday}
          subtitle="Today"
          icon={Container}
          variant="success"
        />
        <KPICard
          title="Avg Dwell Time"
          value="3.2 days"
          icon={Clock}
        />
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="yard">Yard Analysis</TabsTrigger>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Gate Movement Trend */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Gate Movement Trend (7 Days)</CardTitle>
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
                      <Line type="monotone" dataKey="gateIn" name="Gate In" stroke="hsl(142, 76%, 36%)" strokeWidth={2} />
                      <Line type="monotone" dataKey="gateOut" name="Gate Out" stroke="hsl(217, 91%, 60%)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Yard Block Utilization */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Yard Block Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={yardUtilizationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                      >
                        {yardUtilizationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dwell Time Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Container Dwell Time Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dummyDwellTimeData}>
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
                    <Bar dataKey="value" name="Containers" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Operations Tab */}
        <TabsContent value="operations" className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Today's Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Gate-In</span>
                  <span className="font-semibold">{dummyKPIData.gateInToday}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Gate-Out</span>
                  <span className="font-semibold">{dummyKPIData.gateOutToday}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Containers in Yard</span>
                  <span className="font-semibold">{dummyKPIData.totalContainersInYard}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Pending Approvals</span>
                  <span className="font-semibold">{dummyKPIData.pendingApprovals || 0}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start gap-2" variant="outline">
                  <Download className="h-4 w-4" />
                  Download Daily Report (PDF)
                </Button>
                <Button className="w-full justify-start gap-2" variant="outline">
                  <Download className="h-4 w-4" />
                  Export Operations Data (Excel)
                </Button>
                <Button className="w-full justify-start gap-2" variant="outline">
                  <TrendingUp className="h-4 w-4" />
                  Generate Weekly Analysis
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Yard Analysis Tab */}
        <TabsContent value="yard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Block Utilization Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dummyYardBlocks.map((block) => {
                  const percentage = Math.round((block.occupied / block.capacity) * 100);
                  return (
                    <div key={block.id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{block.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {block.occupied}/{block.capacity} ({percentage}%)
                        </span>
                      </div>
                      <div className="h-3 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            percentage > 80 ? 'bg-destructive' : percentage > 60 ? 'bg-warning' : 'bg-primary'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reportTemplates.map((template) => (
              <Card key={template.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <Badge variant="outline">{template.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Last generated: {new Date(template.lastGenerated).toLocaleDateString()}
                  </p>
                  <Button size="sm" className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
