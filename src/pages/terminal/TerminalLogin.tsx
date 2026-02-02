// Terminal Login Page
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/AuthContext';
import { ForgotPasswordDialog } from '@/components/auth/ForgotPasswordDialog';
import type { UserRole } from '@/types';
import {
  Building2,
  ChevronLeft,
  Eye,
  EyeOff,
  Shield,
  Wrench,
} from 'lucide-react';

const roles: { value: UserRole; label: string; description: string; icon: typeof Shield }[] = [
  {
    value: 'admin',
    label: 'Administrator',
    description: 'Full system access, configuration, and oversight',
    icon: Shield,
  },
  {
    value: 'operator',
    label: 'Operator',
    description: 'Daily operations and task execution',
    icon: Wrench,
  },
];

export default function TerminalLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login('terminal', selectedRole);
    
    // Navigate to appropriate dashboard based on role
    switch (selectedRole) {
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'operator':
        navigate('/operator/dashboard');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="border-b bg-card/95 backdrop-blur">
        <div className="container flex h-16 items-center">
          <Link
            to="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Login Form */}
      <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
        <Card className="w-full max-w-lg animate-fade-in">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Terminal Login</CardTitle>
            <CardDescription>
              Select your role and sign in to access the terminal dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-3">
                <Label className="text-base">Select Role</Label>
                <RadioGroup
                  value={selectedRole}
                  onValueChange={(value) => setSelectedRole(value as UserRole)}
                  className="grid grid-cols-2 gap-3"
                >
                  {roles.map((role) => {
                    const Icon = role.icon;
                    return (
                      <Label
                        key={role.value}
                        htmlFor={role.value}
                        className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-all hover:border-primary/50 ${
                          selectedRole === role.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border'
                        }`}
                      >
                        <RadioGroupItem
                          value={role.value}
                          id={role.value}
                          className="mt-0.5"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-primary" />
                            <span className="font-medium">{role.label}</span>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {role.description}
                          </p>
                        </div>
                      </Label>
                    );
                  })}
                </RadioGroup>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Button
                  type="button"
                  variant="link"
                  className="h-auto p-0 text-sm text-muted-foreground hover:text-primary"
                  onClick={() => setForgotPasswordOpen(true)}
                >
                  Forgot Password?
                </Button>
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full" size="lg">
                Sign In as {roles.find(r => r.value === selectedRole)?.label}
              </Button>

              {/* Demo Note */}
              <p className="text-center text-sm text-muted-foreground">
                Demo mode: Click "Sign In" without entering credentials
              </p>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Forgot Password Dialog */}
      <ForgotPasswordDialog
        open={forgotPasswordOpen}
        onOpenChange={setForgotPasswordOpen}
        accentColor="primary"
      />
    </div>
  );
}
