import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { shippingLineNavItems } from '@/config/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  Download,
  Calendar,
  Container,
  Truck,
  DollarSign,
  BarChart3,
  PieChart,
  TrendingUp,
  Clock,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
} from 'recharts';
import { useState } from 'react';

const containerStatusData = [
  { name: 'In Yard', value: 45, color: 'hsl(142, 76%, 36%)' },
  { name: 'In Transit', value: 25, color: 'hsl(217, 91%, 35%)' },
  { name: 'At Port', value: 18, color: 'hsl(45, 93%, 47%)' },
  { name: 'At Factory', value: 12, color: 'hsl(262, 83%, 58%)' },
];

const monthlyMovementData = [
  { name: 'Jul', gateIn: 120, gateOut: 110 },
  { name: 'Aug', gateIn: 145, gateOut: 130 },
  { name: 'Sep', gateIn: 135, gateOut: 140 },
  { name: 'Oct', gateIn: 160, gateOut: 155 },
  { name: 'Nov', gateIn: 150, gateOut: 145 },
  { name: 'Dec', gateIn: 175, gateOut: 160 },
];

const dwellTimeData = [
  { range: '0-7 days', count: 35 },
  { range: '8-14 days', count: 28 },
  { range: '15-21 days', count: 18 },
  { range: '22-30 days', count: 12 },
  { range: '30+ days', count: 7 },
];

const reportTypes = [
  { id: 'inventory', name: 'Container Inventory', description: 'Current status of all containers', icon: Container },
  { id: 'movements', name: 'Movement History', description: 'Gate in/out records', icon: Truck },
  { id: 'billing', name: 'Billing Summary', description: 'Charges and payments', icon: DollarSign },
  { id: 'dwell', name: 'Dwell Time Analysis', description: 'Container storage duration', icon: Clock },
  { id: 'damage', name: 'Damage Reports', description: 'Survey and inspection results', icon: FileText },
];

export default function Reports() {
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [selectedReport, setSelectedReport] = useState<string>('');

  const handleGenerateReport = (reportId: string) => {
    setSelectedReport(reportId);
    // In a real app, this would trigger report generation
  };

  return (
    <DashboardLayout navItems={shippingLineNavItems} pageTitle="Reports & Analytics">
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="generate">Generate Reports</TabsTrigger>
          <TabsTrigger value="history">Report History</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Charts Row 1 */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <PieChart className="h-4 w-4" />
                  Container Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={containerStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {containerStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Monthly Movement Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyMovementData}>
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
                      <Line type="monotone" dataKey="gateIn" stroke="hsl(142, 76%, 36%)" strokeWidth={2} name="Gate In" />
                      <Line type="monotone" dataKey="gateOut" stroke="hsl(217, 91%, 35%)" strokeWidth={2} name="Gate Out" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Dwell Time Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dwellTimeData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="range" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Container className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Containers</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Truck className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">This Month Movements</p>
                  <p className="text-2xl font-bold">335</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/10">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Dwell Time</p>
                  <p className="text-2xl font-bold">12.5 days</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Charges</p>
                  <p className="text-2xl font-bold">$45,230</p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Generate Reports Tab */}
        <TabsContent value="generate" className="space-y-6">
          {/* Date Range Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Report Parameters</CardTitle>
              <CardDescription>Select date range and report type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="space-y-2">
                  <Label>From Date</Label>
                  <Input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                    className="w-48"
                  />
                </div>
                <div className="space-y-2">
                  <Label>To Date</Label>
                  <Input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                    className="w-48"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Container Status</Label>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="in-yard">In Yard</SelectItem>
                      <SelectItem value="in-transit">In Transit</SelectItem>
                      <SelectItem value="at-port">At Port</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Report Types */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reportTypes.map((report) => (
              <Card key={report.id} className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <report.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{report.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleGenerateReport(report.id)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Generate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Report History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Generated Reports</CardTitle>
              <CardDescription>Download previously generated reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Container Inventory Report', date: '2024-01-20', format: 'PDF' },
                  { name: 'Monthly Movement Summary', date: '2024-01-15', format: 'Excel' },
                  { name: 'Billing Statement - December', date: '2024-01-01', format: 'PDF' },
                  { name: 'Dwell Time Analysis Q4', date: '2023-12-28', format: 'PDF' },
                  { name: 'Annual Container Report 2023', date: '2023-12-31', format: 'PDF' },
                ].map((report, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{report.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Generated on {new Date(report.date).toLocaleDateString()} • {report.format}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
