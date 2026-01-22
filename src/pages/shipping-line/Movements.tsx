import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { shippingLineNavItems } from '@/config/navigation';
import { DataTable, Column } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KPICard } from '@/components/common/KPICard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Container,
  Truck,
  ArrowDownToLine,
  ArrowUpFromLine,
  Calendar,
  MapPin,
  Download,
  Filter,
} from 'lucide-react';
import { dummyGateOperations } from '@/data/dummyData';
import { useState } from 'react';
import type { GateOperation } from '@/types';
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
} from 'recharts';

const movementTrendData = [
  { name: 'Mon', gateIn: 12, gateOut: 8 },
  { name: 'Tue', gateIn: 15, gateOut: 12 },
  { name: 'Wed', gateIn: 10, gateOut: 14 },
  { name: 'Thu', gateIn: 18, gateOut: 11 },
  { name: 'Fri', gateIn: 14, gateOut: 16 },
  { name: 'Sat', gateIn: 8, gateOut: 6 },
  { name: 'Sun', gateIn: 5, gateOut: 4 },
];

export default function Movements() {
  const [dateFilter, setDateFilter] = useState<string>('week');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Filter for Maersk containers (simulated)
  const myMovements = dummyGateOperations.slice(0, 8);
  
  const gateInCount = myMovements.filter(m => m.type === 'gate-in').length;
  const gateOutCount = myMovements.filter(m => m.type === 'gate-out').length;

  const columns: Column<GateOperation>[] = [
    {
      key: 'containerNumber',
      header: 'Container No.',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2">
          <Container className="h-4 w-4 text-primary" />
          <span className="font-medium">{item.containerNumber}</span>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2">
          {item.type === 'gate-in' ? (
            <ArrowDownToLine className="h-4 w-4 text-green-600" />
          ) : (
            <ArrowUpFromLine className="h-4 w-4 text-blue-600" />
          )}
          <span className="capitalize">{item.type.replace('-', ' ')}</span>
        </div>
      ),
    },
    {
      key: 'vehicleNumber',
      header: 'Vehicle',
      render: (item) => (
        <div className="flex items-center gap-1">
          <Truck className="h-3 w-3 text-muted-foreground" />
          {item.vehicleNumber}
        </div>
      ),
    },
    {
      key: 'driverName',
      header: 'Driver',
      sortable: true,
    },
    {
      key: 'timestamp',
      header: 'Date & Time',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          {new Date(item.timestamp).toLocaleString()}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => <StatusBadge status={item.status} />,
    },
  ];

  return (
    <DashboardLayout navItems={shippingLineNavItems} pageTitle="Container Movements">
      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Movements"
          value={myMovements.length}
          icon={Truck}
          variant="primary"
        />
        <KPICard
          title="Gate In"
          value={gateInCount}
          icon={ArrowDownToLine}
          variant="success"
        />
        <KPICard
          title="Gate Out"
          value={gateOutCount}
          icon={ArrowUpFromLine}
          variant="warning"
        />
        <KPICard
          title="This Week"
          value={myMovements.length}
          icon={Calendar}
        />
      </div>

      {/* Charts */}
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Movement Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={movementTrendData}>
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

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Daily Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={movementTrendData}>
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
                  <Bar dataKey="gateIn" fill="hsl(142, 76%, 36%)" name="Gate In" />
                  <Bar dataKey="gateOut" fill="hsl(217, 91%, 35%)" name="Gate Out" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-4">
            <div className="w-48">
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Time Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-48">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Movement Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="gate-in">Gate In</SelectItem>
                  <SelectItem value="gate-out">Gate Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input type="date" className="w-48" />
            <Button variant="outline" className="ml-auto">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Movement Table */}
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Movements ({myMovements.length})</TabsTrigger>
          <TabsTrigger value="gate-in">Gate In ({gateInCount})</TabsTrigger>
          <TabsTrigger value="gate-out">Gate Out ({gateOutCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <DataTable
            data={myMovements}
            columns={columns}
            searchable
            searchPlaceholder="Search movements..."
          />
        </TabsContent>
        <TabsContent value="gate-in">
          <DataTable
            data={myMovements.filter(m => m.type === 'gate-in')}
            columns={columns}
            searchable
            searchPlaceholder="Search gate-in movements..."
          />
        </TabsContent>
        <TabsContent value="gate-out">
          <DataTable
            data={myMovements.filter(m => m.type === 'gate-out')}
            columns={columns}
            searchable
            searchPlaceholder="Search gate-out movements..."
          />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
