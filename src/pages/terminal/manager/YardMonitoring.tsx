import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KPICard } from '@/components/common/KPICard';
import { managerNavItems } from '@/config/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { dummyYardBlocks, dummyContainers } from '@/data/dummyData';
import { MapPin, Container, Layers, AlertTriangle } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export default function YardMonitoring() {
  const totalCapacity = dummyYardBlocks.reduce((sum, b) => sum + b.capacity, 0);
  const totalOccupied = dummyYardBlocks.reduce((sum, b) => sum + b.occupied, 0);
  const utilizationPercent = Math.round((totalOccupied / totalCapacity) * 100);
  const blocksNearCapacity = dummyYardBlocks.filter(
    (b) => (b.occupied / b.capacity) * 100 > 80
  ).length;

  const chartData = dummyYardBlocks.map((block) => ({
    name: block.name,
    occupied: block.occupied,
    available: block.capacity - block.occupied,
    percentage: Math.round((block.occupied / block.capacity) * 100),
  }));

  const containersByBlock = dummyYardBlocks.map((block) => {
    const containers = dummyContainers.filter(
      (c) => c.yardLocation?.block === block.name.replace('Block ', '')
    );
    return {
      ...block,
      containers: containers.length,
      reefers: containers.filter((c) => c.type === 'reefer').length,
      hazardous: 0,
    };
  });

  return (
    <DashboardLayout navItems={managerNavItems} pageTitle="Yard Monitoring">
      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Capacity"
          value={totalCapacity}
          subtitle="Total yard slots"
          icon={MapPin}
        />
        <KPICard
          title="Current Occupancy"
          value={totalOccupied}
          subtitle={`${utilizationPercent}% utilized`}
          icon={Container}
          variant="primary"
        />
        <KPICard
          title="Available Slots"
          value={totalCapacity - totalOccupied}
          icon={Layers}
          variant="success"
        />
        <KPICard
          title="Blocks Near Capacity"
          value={blocksNearCapacity}
          subtitle=">80% full"
          icon={AlertTriangle}
          variant={blocksNearCapacity > 0 ? 'warning' : 'default'}
        />
      </div>

      {/* Charts Row */}
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        {/* Block Utilization Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Block Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="name" type="category" className="text-xs" width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="occupied" stackId="a" name="Occupied">
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.percentage > 80
                            ? 'hsl(0, 84%, 60%)'
                            : entry.percentage > 60
                            ? 'hsl(45, 93%, 47%)'
                            : 'hsl(142, 76%, 36%)'
                        }
                      />
                    ))}
                  </Bar>
                  <Bar dataKey="available" stackId="a" fill="hsl(var(--muted))" name="Available" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Yard Map Visualization */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Yard Map Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {containersByBlock.map((block) => {
                const percentage = Math.round((block.occupied / block.capacity) * 100);
                return (
                  <div
                    key={block.id}
                    className={`p-4 rounded-lg border-2 ${
                      percentage > 80
                        ? 'border-destructive bg-destructive/10'
                        : percentage > 60
                        ? 'border-warning bg-warning/10'
                        : 'border-primary bg-primary/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-foreground">{block.name}</h4>
                      <Badge
                        variant={
                          percentage > 80
                            ? 'destructive'
                            : percentage > 60
                            ? 'secondary'
                            : 'default'
                        }
                      >
                        {percentage}%
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="text-muted-foreground">
                        Slots: {block.occupied}/{block.capacity}
                      </p>
                      <p className="text-muted-foreground">
                        Rows: {block.rows} | Bays: {block.bays} | Tiers: {block.tiers}
                      </p>
                      {block.reefers > 0 && (
                        <p className="text-primary">Reefers: {block.reefers}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Block Details Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Block Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Block</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Capacity</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Occupied</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Available</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Utilization</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Configuration</th>
                </tr>
              </thead>
              <tbody>
                {dummyYardBlocks.map((block) => {
                  const percentage = Math.round((block.occupied / block.capacity) * 100);
                  return (
                    <tr key={block.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{block.name}</td>
                      <td className="py-3 px-4">{block.capacity}</td>
                      <td className="py-3 px-4">{block.occupied}</td>
                      <td className="py-3 px-4">{block.capacity - block.occupied}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                percentage > 80
                                  ? 'bg-destructive'
                                  : percentage > 60
                                  ? 'bg-warning'
                                  : 'bg-primary'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm">{percentage}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {block.rows}R × {block.bays}B × {block.tiers}T
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
