import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable, Column } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Receipt, DollarSign, Edit, Plus, Package, Truck, Clock, Settings } from 'lucide-react';
import { adminNavItems } from '@/config/navigation';

interface Activity {
  id: string;
  code: string;
  name: string;
  description: string;
  category: 'handling' | 'storage' | 'stuffing' | 'transport' | 'other';
  unitType: 'per-container' | 'per-day' | 'per-hour' | 'per-teu' | 'fixed';
  active: boolean;
}

interface Charge {
  id: string;
  activityId: string;
  activityName: string;
  containerSize: '20ft' | '40ft' | '45ft' | 'all';
  containerType: 'standard' | 'reefer' | 'tank' | 'all';
  rate: number;
  currency: string;
  effectiveFrom: string;
  effectiveTo?: string;
  active: boolean;
}

const activities: Activity[] = [
  { id: '1', code: 'LIFT', name: 'Container Lift', description: 'Lifting container on/off truck', category: 'handling', unitType: 'per-container', active: true },
  { id: '2', code: 'STOR', name: 'Yard Storage', description: 'Daily storage charge in yard', category: 'storage', unitType: 'per-day', active: true },
  { id: '3', code: 'STUF', name: 'Stuffing', description: 'Container stuffing at terminal', category: 'stuffing', unitType: 'per-container', active: true },
  { id: '4', code: 'DEST', name: 'Destuffing', description: 'Container destuffing at terminal', category: 'stuffing', unitType: 'per-container', active: true },
  { id: '5', code: 'WIGH', name: 'Weighing', description: 'Container weighing service', category: 'handling', unitType: 'per-container', active: true },
  { id: '6', code: 'WASH', name: 'Container Washing', description: 'Container cleaning service', category: 'other', unitType: 'per-container', active: true },
  { id: '7', code: 'REFR', name: 'Reefer Monitoring', description: 'Reefer plug-in and monitoring', category: 'storage', unitType: 'per-day', active: true },
  { id: '8', code: 'REPO', name: 'Repositioning', description: 'Container yard repositioning', category: 'handling', unitType: 'per-container', active: false },
];

const charges: Charge[] = [
  { id: '1', activityId: '1', activityName: 'Container Lift', containerSize: '20ft', containerType: 'all', rate: 75.00, currency: 'USD', effectiveFrom: '2024-01-01', active: true },
  { id: '2', activityId: '1', activityName: 'Container Lift', containerSize: '40ft', containerType: 'all', rate: 120.00, currency: 'USD', effectiveFrom: '2024-01-01', active: true },
  { id: '3', activityId: '2', activityName: 'Yard Storage', containerSize: '20ft', containerType: 'standard', rate: 15.00, currency: 'USD', effectiveFrom: '2024-01-01', active: true },
  { id: '4', activityId: '2', activityName: 'Yard Storage', containerSize: '40ft', containerType: 'standard', rate: 25.00, currency: 'USD', effectiveFrom: '2024-01-01', active: true },
  { id: '5', activityId: '3', activityName: 'Stuffing', containerSize: '20ft', containerType: 'all', rate: 150.00, currency: 'USD', effectiveFrom: '2024-01-01', active: true },
  { id: '6', activityId: '3', activityName: 'Stuffing', containerSize: '40ft', containerType: 'all', rate: 250.00, currency: 'USD', effectiveFrom: '2024-01-01', active: true },
  { id: '7', activityId: '7', activityName: 'Reefer Monitoring', containerSize: 'all', containerType: 'reefer', rate: 50.00, currency: 'USD', effectiveFrom: '2024-01-01', active: true },
  { id: '8', activityId: '5', activityName: 'Weighing', containerSize: 'all', containerType: 'all', rate: 25.00, currency: 'USD', effectiveFrom: '2024-01-01', active: true },
];

const ActivitiesCharges = () => {
  const [editingCharge, setEditingCharge] = useState<Charge | null>(null);
  const [newRate, setNewRate] = useState('');

  const activeActivities = activities.filter(a => a.active).length;
  const totalCharges = charges.length;
  const activeCharges = charges.filter(c => c.active).length;

  const getCategoryColor = (category: Activity['category']) => {
    switch (category) {
      case 'handling': return 'bg-blue-500/10 text-blue-600';
      case 'storage': return 'bg-green-500/10 text-green-600';
      case 'stuffing': return 'bg-purple-500/10 text-purple-600';
      case 'transport': return 'bg-orange-500/10 text-orange-600';
      default: return 'bg-gray-500/10 text-gray-600';
    }
  };

  const activityColumns: Column<Activity>[] = [
    {
      key: 'code',
      header: 'Code',
      sortable: true,
      render: (item) => (
        <span className="font-mono font-medium text-foreground">{item.code}</span>
      ),
    },
    {
      key: 'name',
      header: 'Activity Name',
      sortable: true,
    },
    {
      key: 'description',
      header: 'Description',
      render: (item) => (
        <span className="text-sm text-muted-foreground">{item.description}</span>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      render: (item) => (
        <Badge variant="outline" className={`capitalize ${getCategoryColor(item.category)}`}>
          {item.category}
        </Badge>
      ),
    },
    {
      key: 'unitType',
      header: 'Unit Type',
      render: (item) => (
        <span className="text-sm capitalize">{item.unitType.replace('-', ' ')}</span>
      ),
    },
    {
      key: 'active',
      header: 'Status',
      render: (item) => (
        <div className="flex items-center gap-2">
          <Switch checked={item.active} />
          <span className="text-sm">{item.active ? 'Active' : 'Inactive'}</span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
      ),
    },
  ];

  const chargeColumns: Column<Charge>[] = [
    {
      key: 'activityName',
      header: 'Activity',
      sortable: true,
    },
    {
      key: 'containerSize',
      header: 'Size',
      sortable: true,
      render: (item) => (
        <Badge variant="outline" className="capitalize">
          {item.containerSize === 'all' ? 'All Sizes' : item.containerSize}
        </Badge>
      ),
    },
    {
      key: 'containerType',
      header: 'Type',
      sortable: true,
      render: (item) => (
        <span className="capitalize">{item.containerType === 'all' ? 'All Types' : item.containerType}</span>
      ),
    },
    {
      key: 'rate',
      header: 'Rate',
      sortable: true,
      render: (item) => (
        <span className="font-mono font-medium text-foreground">
          {item.currency} {item.rate.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'effectiveFrom',
      header: 'Effective From',
      sortable: true,
      render: (item) => (
        <span className="text-sm">{new Date(item.effectiveFrom).toLocaleDateString()}</span>
      ),
    },
    {
      key: 'active',
      header: 'Status',
      render: (item) => (
        <Badge variant={item.active ? 'default' : 'secondary'}>
          {item.active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" onClick={() => {
              setEditingCharge(item);
              setNewRate(item.rate.toString());
            }}>
              <Edit className="h-4 w-4 mr-1" />
              Update Rate
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Charge Rate</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Activity</Label>
                  <p className="font-medium">{item.activityName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Container Size</Label>
                  <p className="capitalize">{item.containerSize === 'all' ? 'All Sizes' : item.containerSize}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentRate">Current Rate ({item.currency})</Label>
                <Input id="currentRate" value={item.rate.toFixed(2)} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newRate">New Rate ({item.currency})</Label>
                <Input 
                  id="newRate" 
                  type="number" 
                  step="0.01"
                  value={newRate}
                  onChange={(e) => setNewRate(e.target.value)}
                  placeholder="Enter new rate"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="effectiveDate">Effective From</Label>
                <Input id="effectiveDate" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Update Rate</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ),
    },
  ];

  return (
    <DashboardLayout navItems={adminNavItems}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Activities & Charges</h1>
            <p className="text-muted-foreground">Manage billable activities and their charge rates</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Bulk Update
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Activity
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activities.length}</p>
                  <p className="text-sm text-muted-foreground">Total Activities</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Receipt className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeActivities}</p>
                  <p className="text-sm text-muted-foreground">Active Activities</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalCharges}</p>
                  <p className="text-sm text-muted-foreground">Charge Rates</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeCharges}</p>
                  <p className="text-sm text-muted-foreground">Active Rates</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tables with Tabs */}
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="activities">
              <TabsList className="mb-4">
                <TabsTrigger value="activities">Activities</TabsTrigger>
                <TabsTrigger value="charges">Charge Rates</TabsTrigger>
                <TabsTrigger value="history">Rate History</TabsTrigger>
              </TabsList>
              <TabsContent value="activities">
                <DataTable
                  data={activities}
                  columns={activityColumns}
                  searchable
                  searchPlaceholder="Search activities..."
                />
              </TabsContent>
              <TabsContent value="charges">
                <DataTable
                  data={charges}
                  columns={chargeColumns}
                  searchable
                  searchPlaceholder="Search charge rates..."
                />
              </TabsContent>
              <TabsContent value="history">
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Rate change history will be displayed here</p>
                  <p className="text-sm">Track all modifications to charge rates over time</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ActivitiesCharges;
