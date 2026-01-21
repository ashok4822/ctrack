import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { shippingLineNavItems } from '@/config/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Ship,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  User,
  Shield,
  Bell,
  Key,
  Save,
  Upload,
} from 'lucide-react';
import { useState } from 'react';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    movements: true,
    billing: true,
    damage: true,
  });

  const companyInfo = {
    name: 'Maersk Line',
    code: 'MAEU',
    email: 'operations@maersk.com',
    phone: '+1 (555) 123-4567',
    address: '50 Esplanade, Jersey City, NJ 07310',
    website: 'www.maersk.com',
    contactPerson: 'John Maritime',
    contactEmail: 'j.maritime@maersk.com',
    contactPhone: '+1 (555) 987-6543',
  };

  return (
    <DashboardLayout navItems={shippingLineNavItems} pageTitle="Company Profile">
      <Tabs defaultValue="company" className="space-y-6">
        <TabsList>
          <TabsTrigger value="company">Company Info</TabsTrigger>
          <TabsTrigger value="users">Users & Access</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Company Info Tab */}
        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/maersk-logo.png" />
                    <AvatarFallback className="bg-primary/10 text-primary text-xl">
                      <Ship className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{companyInfo.name}</CardTitle>
                    <CardDescription>Shipping Line Code: {companyInfo.code}</CardDescription>
                  </div>
                </div>
                <Button variant={isEditing ? 'default' : 'outline'} onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    'Edit Profile'
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Company Name
                  </Label>
                  <Input value={companyInfo.name} disabled={!isEditing} />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Ship className="h-4 w-4" />
                    Shipping Line Code
                  </Label>
                  <Input value={companyInfo.code} disabled />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input value={companyInfo.email} disabled={!isEditing} />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone
                  </Label>
                  <Input value={companyInfo.phone} disabled={!isEditing} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Address
                  </Label>
                  <Textarea value={companyInfo.address} disabled={!isEditing} rows={2} />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Website
                  </Label>
                  <Input value={companyInfo.website} disabled={!isEditing} />
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-4">Primary Contact</h3>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Contact Person</Label>
                    <Input value={companyInfo.contactPerson} disabled={!isEditing} />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Email</Label>
                    <Input value={companyInfo.contactEmail} disabled={!isEditing} />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Phone</Label>
                    <Input value={companyInfo.contactPhone} disabled={!isEditing} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Company Documents</CardTitle>
              <CardDescription>Upload business registration and other documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {['Business License', 'Tax Registration', 'Insurance Certificate'].map((doc) => (
                  <div key={doc} className="border rounded-lg p-4 text-center">
                    <div className="mx-auto w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-3">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="font-medium text-sm">{doc}</p>
                    <p className="text-xs text-muted-foreground mb-3">PDF, max 5MB</p>
                    <Button variant="outline" size="sm" className="w-full">
                      Upload
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users & Access Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Team Members</CardTitle>
                  <CardDescription>Manage users who can access this account</CardDescription>
                </div>
                <Button>
                  <User className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'John Maritime', email: 'j.maritime@maersk.com', role: 'Admin', status: 'Active' },
                  { name: 'Sarah Logistics', email: 's.logistics@maersk.com', role: 'Manager', status: 'Active' },
                  { name: 'Mike Operations', email: 'm.operations@maersk.com', role: 'Viewer', status: 'Active' },
                ].map((user) => (
                  <div
                    key={user.email}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm px-2 py-1 rounded bg-muted">{user.role}</span>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive SMS for urgent updates</p>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                  />
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-4">Notification Types</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Container Movements</p>
                      <p className="text-sm text-muted-foreground">Gate in/out notifications</p>
                    </div>
                    <Switch
                      checked={notifications.movements}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, movements: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Billing Alerts</p>
                      <p className="text-sm text-muted-foreground">New bills and payment reminders</p>
                    </div>
                    <Switch
                      checked={notifications.billing}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, billing: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Damage Reports</p>
                      <p className="text-sm text-muted-foreground">Container damage notifications</p>
                    </div>
                    <Switch
                      checked={notifications.damage}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, damage: checked })}
                    />
                  </div>
                </div>
              </div>

              <Button>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Change Password
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-w-md space-y-4">
                  <div className="space-y-2">
                    <Label>Current Password</Label>
                    <Input type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm New Password</Label>
                    <Input type="password" />
                  </div>
                  <Button>Update Password</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Two-Factor Authentication
                </CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Status: Not Enabled</p>
                    <p className="text-sm text-muted-foreground">Protect your account with 2FA</p>
                  </div>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Login History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { date: '2024-01-20 14:32', location: 'New York, US', device: 'Chrome on Windows' },
                    { date: '2024-01-19 09:15', location: 'New York, US', device: 'Safari on iPhone' },
                    { date: '2024-01-18 16:45', location: 'Newark, US', device: 'Chrome on Windows' },
                  ].map((login, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="font-medium">{login.device}</p>
                        <p className="text-sm text-muted-foreground">{login.location}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{login.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
