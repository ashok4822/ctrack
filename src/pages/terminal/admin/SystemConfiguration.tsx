import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { adminNavItems } from '@/config/navigation';
import { 
  Settings, 
  Building2, 
  Bell, 
  Clock, 
  Link, 
  Shield, 
  Container,
  Save,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  MapPin
} from 'lucide-react';

const containerStatuses = [
  { id: '1', code: 'IN_YARD', name: 'In Yard', color: '#22c55e', description: 'Container is in the yard', active: true },
  { id: '2', code: 'IN_TRANSIT', name: 'In Transit', color: '#3b82f6', description: 'Container is being transported', active: true },
  { id: '3', code: 'AT_PORT', name: 'At Port', color: '#8b5cf6', description: 'Container is at the port', active: true },
  { id: '4', code: 'AT_FACTORY', name: 'At Factory', color: '#f59e0b', description: 'Container is at factory/CFS', active: true },
  { id: '5', code: 'DAMAGED', name: 'Damaged', color: '#ef4444', description: 'Container has damage', active: true },
  { id: '6', code: 'PENDING', name: 'Pending', color: '#6b7280', description: 'Awaiting processing', active: true },
  { id: '7', code: 'BLOCKED', name: 'Blocked', color: '#dc2626', description: 'Container is blocked', active: false },
];

const notificationRules = [
  { id: '1', event: 'Gate-In Completed', channels: ['email', 'sms'], recipients: 'Shipping Line, Customer', active: true },
  { id: '2', event: 'Gate-Out Completed', channels: ['email'], recipients: 'Shipping Line, Customer', active: true },
  { id: '3', event: 'Damage Reported', channels: ['email', 'sms', 'push'], recipients: 'Admin, Manager', active: true },
  { id: '4', event: 'Dwell Time Exceeded', channels: ['email'], recipients: 'Shipping Line', active: true },
  { id: '5', event: 'Approval Required', channels: ['email', 'push'], recipients: 'Manager', active: true },
  { id: '6', event: 'Survey Completed', channels: ['email'], recipients: 'Admin, Shipping Line', active: false },
];

const integrations = [
  { id: '1', name: 'GPS Tracking System', type: 'gps', status: 'connected', lastSync: '2024-01-15T10:30:00' },
  { id: '2', name: 'Port Authority API', type: 'api', status: 'connected', lastSync: '2024-01-15T10:00:00' },
  { id: '3', name: 'Customs EDI', type: 'edi', status: 'error', lastSync: '2024-01-14T15:00:00' },
  { id: '4', name: 'Billing System', type: 'api', status: 'connected', lastSync: '2024-01-15T11:00:00' },
  { id: '5', name: 'Google Maps API', type: 'maps', status: 'connected', lastSync: '2024-01-15T11:30:00' },
];

const SystemConfiguration = () => {
  const [orgSettings, setOrgSettings] = useState({
    terminalName: 'cTrack Terminal',
    terminalCode: 'CTK001',
    address: '123 Port Road, Harbor City, HC 12345',
    phone: '+1 (555) 123-4567',
    email: 'admin@ctrack-terminal.com',
    timezone: 'America/New_York',
    currency: 'USD',
  });

  const [slaSettings, setSlaSettings] = useState({
    maxDwellTime: 7,
    gateProcessingTime: 15,
    surveyCompletionTime: 24,
    approvalTimeout: 4,
    yardUtilizationWarning: 85,
    yardUtilizationCritical: 95,
  });

  return (
    <DashboardLayout navItems={adminNavItems}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">System Configuration</h1>
            <p className="text-muted-foreground">Manage terminal settings and system preferences</p>
          </div>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save All Changes
          </Button>
        </div>

        <Tabs defaultValue="organization">
          <TabsList>
            <TabsTrigger value="organization">Organization</TabsTrigger>
            <TabsTrigger value="statuses">Container Statuses</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="sla">SLA & Alerts</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          <TabsContent value="organization" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Organization Details
                </CardTitle>
                <CardDescription>Basic terminal information and settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="terminalName">Terminal Name</Label>
                    <Input 
                      id="terminalName" 
                      value={orgSettings.terminalName}
                      onChange={(e) => setOrgSettings({...orgSettings, terminalName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="terminalCode">Terminal Code</Label>
                    <Input 
                      id="terminalCode" 
                      value={orgSettings.terminalCode}
                      onChange={(e) => setOrgSettings({...orgSettings, terminalCode: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea 
                      id="address" 
                      value={orgSettings.address}
                      onChange={(e) => setOrgSettings({...orgSettings, address: e.target.value})}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      value={orgSettings.phone}
                      onChange={(e) => setOrgSettings({...orgSettings, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={orgSettings.email}
                      onChange={(e) => setOrgSettings({...orgSettings, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={orgSettings.timezone} onValueChange={(v) => setOrgSettings({...orgSettings, timezone: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={orgSettings.currency} onValueChange={(v) => setOrgSettings({...orgSettings, currency: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statuses" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Container className="h-5 w-5" />
                      Container Status Configuration
                    </CardTitle>
                    <CardDescription>Define and manage container statuses</CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Status
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {containerStatuses.map((status) => (
                    <div 
                      key={status.id} 
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: status.color }}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{status.name}</span>
                            <Badge variant="outline" className="font-mono text-xs">{status.code}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{status.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Switch checked={status.active} />
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notification Rules
                    </CardTitle>
                    <CardDescription>Configure automated notification triggers</CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Rule
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notificationRules.map((rule) => (
                    <div 
                      key={rule.id} 
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{rule.event}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Recipients: {rule.recipients}</span>
                          <span>•</span>
                          <div className="flex gap-1">
                            {rule.channels.map((channel) => (
                              <Badge key={channel} variant="secondary" className="text-xs capitalize">
                                {channel}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Switch checked={rule.active} />
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sla" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Time-based SLAs
                  </CardTitle>
                  <CardDescription>Configure service level thresholds</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Maximum Dwell Time (days)</Label>
                      <div className="flex items-center gap-3">
                        <Input 
                          type="number" 
                          value={slaSettings.maxDwellTime}
                          onChange={(e) => setSlaSettings({...slaSettings, maxDwellTime: parseInt(e.target.value)})}
                          className="w-24"
                        />
                        <span className="text-sm text-muted-foreground">Alert when container exceeds this</span>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label>Gate Processing Time (minutes)</Label>
                      <div className="flex items-center gap-3">
                        <Input 
                          type="number" 
                          value={slaSettings.gateProcessingTime}
                          onChange={(e) => setSlaSettings({...slaSettings, gateProcessingTime: parseInt(e.target.value)})}
                          className="w-24"
                        />
                        <span className="text-sm text-muted-foreground">Target time for gate operations</span>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label>Survey Completion Time (hours)</Label>
                      <div className="flex items-center gap-3">
                        <Input 
                          type="number" 
                          value={slaSettings.surveyCompletionTime}
                          onChange={(e) => setSlaSettings({...slaSettings, surveyCompletionTime: parseInt(e.target.value)})}
                          className="w-24"
                        />
                        <span className="text-sm text-muted-foreground">Maximum time for survey completion</span>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label>Approval Timeout (hours)</Label>
                      <div className="flex items-center gap-3">
                        <Input 
                          type="number" 
                          value={slaSettings.approvalTimeout}
                          onChange={(e) => setSlaSettings({...slaSettings, approvalTimeout: parseInt(e.target.value)})}
                          className="w-24"
                        />
                        <span className="text-sm text-muted-foreground">Escalate if not approved within</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Yard Utilization Alerts
                  </CardTitle>
                  <CardDescription>Set capacity warning thresholds</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        Warning Threshold (%)
                      </Label>
                      <div className="flex items-center gap-3">
                        <Input 
                          type="number" 
                          value={slaSettings.yardUtilizationWarning}
                          onChange={(e) => setSlaSettings({...slaSettings, yardUtilizationWarning: parseInt(e.target.value)})}
                          className="w-24"
                        />
                        <span className="text-sm text-muted-foreground">Trigger warning alert</span>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        Critical Threshold (%)
                      </Label>
                      <div className="flex items-center gap-3">
                        <Input 
                          type="number" 
                          value={slaSettings.yardUtilizationCritical}
                          onChange={(e) => setSlaSettings({...slaSettings, yardUtilizationCritical: parseInt(e.target.value)})}
                          className="w-24"
                        />
                        <span className="text-sm text-muted-foreground">Trigger critical alert</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Link className="h-5 w-5" />
                      External Integrations
                    </CardTitle>
                    <CardDescription>Manage third-party system connections</CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Integration
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {integrations.map((integration) => (
                    <div 
                      key={integration.id} 
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${
                          integration.status === 'connected' ? 'bg-green-500/10' : 'bg-red-500/10'
                        }`}>
                          {integration.status === 'connected' ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{integration.name}</span>
                            <Badge variant="outline" className="text-xs uppercase">{integration.type}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Last sync: {new Date(integration.lastSync).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={integration.status === 'connected' ? 'default' : 'destructive'} className="capitalize">
                          {integration.status}
                        </Badge>
                        <Button variant="outline" size="sm">Configure</Button>
                        <Button variant="ghost" size="sm">Test</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SystemConfiguration;
