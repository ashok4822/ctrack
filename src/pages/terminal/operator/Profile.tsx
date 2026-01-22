import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { operatorNavItems } from '@/config/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  User,
  Mail,
  Phone,
  Shield,
  Bell,
  Key,
  Briefcase,
  Building,
  Clock,
  Save,
} from 'lucide-react';

export default function OperatorProfile() {
  return (
    <DashboardLayout navItems={operatorNavItems} pageTitle="Profile">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="text-2xl">JD</AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left flex-1">
                <h2 className="text-2xl font-bold">John Doe</h2>
                <p className="text-muted-foreground">Terminal Operator</p>
                <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                  <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" /> john.doe@terminal.com
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" /> +91 98765 43210
                  </span>
                </div>
              </div>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs defaultValue="personal">
          <TabsList className="mb-6">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="work">Work Details</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Personal Information */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="john.doe@terminal.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" defaultValue="+91 98765 43210" />
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" defaultValue="123 Terminal Road, Port City" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" defaultValue="Chennai" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" defaultValue="Tamil Nadu" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Work Details */}
          <TabsContent value="work">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Work Details
                </CardTitle>
                <CardDescription>Your employment information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Employee ID</Label>
                    <p className="font-medium">EMP-OP-001</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Role</Label>
                    <p className="font-medium">Terminal Operator</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Department</Label>
                    <p className="font-medium">Operations</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Shift</Label>
                    <p className="font-medium">Day Shift (6:00 AM - 2:00 PM)</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Joined Date</Label>
                    <p className="font-medium">15 March 2023</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Reporting To</Label>
                    <p className="font-medium">Rajesh Kumar (Manager)</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-3">Assigned Areas</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Gate Operations', 'Yard Block A', 'Yard Block B', 'Equipment Handling'].map((area) => (
                      <span
                        key={area}
                        className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Task Assignments</p>
                      <p className="text-sm text-muted-foreground">Get notified when new tasks are assigned</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Gate Operations</p>
                      <p className="text-sm text-muted-foreground">Notifications for gate-in/out activities</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Equipment Alerts</p>
                      <p className="text-sm text-muted-foreground">Maintenance and equipment status updates</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">System Announcements</p>
                      <p className="text-sm text-muted-foreground">Important system updates and notices</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-4">Change Password</h4>
                  <div className="space-y-4 max-w-md">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                    <Button>
                      <Key className="mr-2 h-4 w-4" />
                      Update Password
                    </Button>
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-4">Two-Factor Authentication</h4>
                  <div className="flex items-center justify-between max-w-md">
                    <div>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Switch />
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-4">Recent Activity</h4>
                  <div className="space-y-3 max-w-md">
                    {[
                      { action: 'Login', time: '2 hours ago', device: 'Chrome on Windows' },
                      { action: 'Password Changed', time: '5 days ago', device: 'Chrome on Windows' },
                      { action: 'Login', time: '1 week ago', device: 'Mobile App - Android' },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center gap-3 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-muted-foreground">{activity.device}</p>
                        </div>
                        <span className="text-muted-foreground">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
