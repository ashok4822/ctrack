import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { surveyorNavItems } from '@/config/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Shield, 
  Bell, 
  Key,
  Camera,
  Save,
  ClipboardCheck,
  Award,
  Calendar
} from 'lucide-react';

export default function Profile() {
  return (
    <DashboardLayout navItems={surveyorNavItems} pageTitle="My Profile">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg" alt="Profile" />
                  <AvatarFallback className="text-2xl">RS</AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <h2 className="mt-4 text-xl font-semibold">Rajesh Sharma</h2>
              <p className="text-muted-foreground">Container Surveyor</p>
              <Badge variant="secondary" className="mt-2">
                <Shield className="h-3 w-3 mr-1" />
                Surveyor
              </Badge>

              <Separator className="my-6" />

              {/* Stats */}
              <div className="w-full space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <ClipboardCheck className="h-4 w-4" />
                    Total Surveys
                  </span>
                  <span className="font-semibold">847</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Certifications
                  </span>
                  <span className="font-semibold">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Member Since
                  </span>
                  <span className="font-semibold">Mar 2022</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details Tabs */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Manage your account settings and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="personal">
              <TabsList className="mb-6">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="work">Work Details</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="relative mt-1.5">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="firstName" defaultValue="Rajesh" className="pl-10" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <div className="relative mt-1.5">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="lastName" defaultValue="Sharma" className="pl-10" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative mt-1.5">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="email" type="email" defaultValue="rajesh.sharma@terminal.com" className="pl-10" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative mt-1.5">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="phone" defaultValue="+91 98765 43210" className="pl-10" />
                    </div>
                  </div>
                </div>
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </TabsContent>

              <TabsContent value="work" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employeeId">Employee ID</Label>
                    <Input id="employeeId" defaultValue="SRV-2022-001" disabled className="mt-1.5 bg-muted" />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <div className="relative mt-1.5">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="department" defaultValue="Survey & Inspection" disabled className="pl-10 bg-muted" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <div className="relative mt-1.5">
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="role" defaultValue="Container Surveyor" disabled className="pl-10 bg-muted" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="supervisor">Supervisor</Label>
                    <Input id="supervisor" defaultValue="Amit Kumar (Manager)" disabled className="mt-1.5 bg-muted" />
                  </div>
                </div>

                <div>
                  <Label>Certifications</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline">ISO Container Inspector</Badge>
                    <Badge variant="outline">Reefer Specialist</Badge>
                    <Badge variant="outline">Damage Assessment Level 2</Badge>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">New Survey Assignments</p>
                        <p className="text-sm text-muted-foreground">Get notified when new surveys are assigned</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Urgent Priority Alerts</p>
                        <p className="text-sm text-muted-foreground">Immediate alerts for urgent surveys</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Report Approvals</p>
                        <p className="text-sm text-muted-foreground">Get notified when reports are reviewed</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive email digests</p>
                      </div>
                    </div>
                    <Switch />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative mt-1.5">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="currentPassword" type="password" className="pl-10" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative mt-1.5">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="newPassword" type="password" className="pl-10" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative mt-1.5">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="confirmPassword" type="password" className="pl-10" />
                    </div>
                  </div>
                </div>
                <Button>
                  <Key className="h-4 w-4 mr-2" />
                  Update Password
                </Button>

                <Separator />

                <div>
                  <h4 className="font-medium mb-4">Two-Factor Authentication</h4>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">2FA Status</p>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
