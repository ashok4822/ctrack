import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { adminNavItems } from '@/config/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { dummyYardBlocks } from '@/data/dummyData';
import { Plus, Settings, MapPin } from 'lucide-react';

export default function YardConfiguration() {
  return (
    <DashboardLayout
      navItems={adminNavItems}
      pageTitle="Yard Configuration"
      pageActions={
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Block
        </Button>
      }
    >
      {/* Yard Overview */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{dummyYardBlocks.length}</p>
                <p className="text-sm text-muted-foreground">Total Blocks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <MapPin className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {dummyYardBlocks.reduce((acc, b) => acc + b.capacity, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Capacity</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <MapPin className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {dummyYardBlocks.reduce((acc, b) => acc + b.occupied, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Occupied</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
                <MapPin className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {Math.round(
                    (dummyYardBlocks.reduce((acc, b) => acc + b.occupied, 0) /
                      dummyYardBlocks.reduce((acc, b) => acc + b.capacity, 0)) *
                      100
                  )}%
                </p>
                <p className="text-sm text-muted-foreground">Utilization</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Yard Blocks Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dummyYardBlocks.map((block) => {
          const percentage = Math.round((block.occupied / block.capacity) * 100);
          return (
            <Card key={block.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">{block.name}</CardTitle>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Utilization Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Utilization</span>
                      <span
                        className={`text-sm font-medium ${
                          percentage > 80
                            ? 'text-destructive'
                            : percentage > 60
                            ? 'text-warning'
                            : 'text-success'
                        }`}
                      >
                        {percentage}%
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          percentage > 80
                            ? 'bg-destructive'
                            : percentage > 60
                            ? 'bg-warning'
                            : 'bg-success'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Block Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Rows</p>
                      <p className="font-medium text-foreground">{block.rows}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Bays</p>
                      <p className="font-medium text-foreground">{block.bays}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tiers</p>
                      <p className="font-medium text-foreground">{block.tiers}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Capacity</p>
                      <p className="font-medium text-foreground">{block.capacity}</p>
                    </div>
                  </div>

                  {/* Occupancy */}
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm text-muted-foreground">
                      {block.occupied} / {block.capacity} slots used
                    </span>
                    <Button variant="outline" size="sm">
                      View Map
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
