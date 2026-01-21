import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { adminNavItems } from '@/config/navigation';
import { 
  FileText, 
  Download, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Calendar,
  Container,
  Clock,
  Truck,
  MapPin,
  Filter
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts';

const gateMovementData = [
  { day: 'Mon', gateIn: 45, gateOut: 38 },
  { day: 'Tue', gateIn: 52, gateOut: 48 },
  { day: 'Wed', gateIn: 38, gateOut: 42 },
  { day: 'Thu', gateIn: 61, gateOut: 55 },
  { day: 'Fri', gateIn: 48, gateOut: 52 },
  { day: 'Sat', gateIn: 32, gateOut: 28 },
  { day: 'Sun', gateIn: 18, gateOut: 22 },
];

const dwellTimeData = [
  { range: '0-3 days', count: 120 },
  { range: '4-7 days', count: 85 },
  { range: '8-14 days', count: 45 },
  { range: '15-30 days', count: 28 },
  { range: '30+ days', count: 12 },
];

const containerTypeData = [
  { name: 'Standard', value: 450, color: '#3b82f6' },
  { name: 'Reefer', value: 120, color: '#10b981' },
  { name: 'Tank', value: 45, color: '#f59e0b' },
  { name: 'Open Top', value: 30, color: '#8b5cf6' },
  { name: 'Flat Rack', value: 15, color: '#ef4444' },
];

const yardUtilizationData = [
  { month: 'Jan', utilization: 72 },
  { month: 'Feb', utilization: 78 },
  { month: 'Mar', utilization: 85 },
  { month: 'Apr', utilization: 82 },
  { month: 'May', utilization: 88 },
  { month: 'Jun', utilization: 91 },
];

const equipmentPerformanceData = [
  { equipment: 'RS-001', hours: 156, utilization: 78 },
  { equipment: 'RS-002', hours: 142, utilization: 71 },
  { equipment: 'FL-001', hours: 168, utilization: 84 },
  { equipment: 'FL-002', hours: 134, utilization: 67 },
  { equipment: 'CR-001', hours: 98, utilization: 49 },
];

const reportTemplates = [
  { id: '1', name: 'Daily Operations Summary', category: 'operational', description: 'Gate movements, yard status, and key metrics', lastGenerated: '2024-01-15' },
  { id: '2', name: 'Yard Utilization Report', category: 'yard', description: 'Block-wise capacity and occupancy analysis', lastGenerated: '2024-01-14' },
  { id: '3', name: 'Container Dwell Time Analysis', category: 'dwell-time', description: 'Average dwell times by shipping line and type', lastGenerated: '2024-01-15' },
  { id: '4', name: 'Equipment Performance Report', category: 'equipment', description: 'Utilization rates and maintenance status', lastGenerated: '2024-01-13' },
  { id: '5', name: 'Revenue Summary', category: 'financial', description: 'Billing summary by activity and customer', lastGenerated: '2024-01-15' },
  { id: '6', name: 'Container Movement Log', category: 'container', description: 'Detailed gate-in/out transaction log', lastGenerated: '2024-01-15' },
];

const ReportsAnalytics = () => {
  return (
    <DashboardLayout navItems={adminNavItems}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground">Generate reports and analyze terminal performance</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Report
            </Button>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        <Tabs defaultValue="dashboard">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="yard">Yard Analytics</TabsTrigger>
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
            <TabsTrigger value="templates">Report Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6 mt-6">
            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gate Movements Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Weekly Gate Movements
                  </CardTitle>
                  <CardDescription>Gate-in vs Gate-out comparison</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={gateMovementData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="day" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="gateIn" name="Gate In" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="gateOut" name="Gate Out" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Container Type Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Container Type Distribution
                  </CardTitle>
                  <CardDescription>Current yard inventory by type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={containerTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {containerTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Yard Utilization Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Yard Utilization Trend
                  </CardTitle>
                  <CardDescription>Monthly utilization percentage</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={yardUtilizationData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" domain={[0, 100]} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Utilization']} />
                      <Area 
                        type="monotone" 
                        dataKey="utilization" 
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary) / 0.2)" 
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Dwell Time Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Dwell Time Distribution
                  </CardTitle>
                  <CardDescription>Containers by dwell time range</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dwellTimeData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" className="text-xs" />
                      <YAxis dataKey="range" type="category" className="text-xs" width={80} />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="operations" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Operational Reports</CardTitle>
                <CardDescription>Generate detailed operational reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Report Type</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily Summary</SelectItem>
                        <SelectItem value="weekly">Weekly Summary</SelectItem>
                        <SelectItem value="monthly">Monthly Summary</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date From</Label>
                    <Input type="date" defaultValue="2024-01-01" />
                  </div>
                  <div className="space-y-2">
                    <Label>Date To</Label>
                    <Input type="date" defaultValue="2024-01-15" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate PDF
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Excel
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Container className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">1,247</p>
                      <p className="text-sm text-muted-foreground">Total Movements</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-8 w-8 text-yellow-600" />
                    <div>
                      <p className="text-2xl font-bold">4.2 days</p>
                      <p className="text-sm text-muted-foreground">Avg Dwell Time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">87%</p>
                      <p className="text-sm text-muted-foreground">Yard Utilization</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Truck className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">156</p>
                      <p className="text-sm text-muted-foreground">Truck Visits Today</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="yard" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Block-wise Utilization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Block A', 'Block B', 'Block C', 'Block D'].map((block, index) => {
                      const utilization = [85, 72, 91, 68][index];
                      return (
                        <div key={block} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{block}</span>
                            <span className="font-medium">{utilization}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                utilization > 85 ? 'bg-red-500' : 
                                utilization > 70 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${utilization}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Container Age Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={dwellTimeData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="range" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="equipment" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Equipment Performance</CardTitle>
                <CardDescription>Utilization hours and efficiency metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Equipment</th>
                        <th className="text-left py-3 px-4 font-medium">Hours This Month</th>
                        <th className="text-left py-3 px-4 font-medium">Utilization</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {equipmentPerformanceData.map((item) => (
                        <tr key={item.equipment} className="border-b">
                          <td className="py-3 px-4 font-mono">{item.equipment}</td>
                          <td className="py-3 px-4">{item.hours} hrs</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${
                                    item.utilization > 75 ? 'bg-green-500' : 
                                    item.utilization > 50 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${item.utilization}%` }}
                                />
                              </div>
                              <span className="text-sm">{item.utilization}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={item.utilization > 50 ? 'default' : 'secondary'}>
                              {item.utilization > 75 ? 'High' : item.utilization > 50 ? 'Normal' : 'Low'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reportTemplates.map((template) => (
                <Card key={template.id} className="hover:border-primary/50 transition-colors cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <Badge variant="outline" className="capitalize text-xs">
                        {template.category}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Last: {new Date(template.lastGenerated).toLocaleDateString()}
                      </span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ReportsAnalytics;
