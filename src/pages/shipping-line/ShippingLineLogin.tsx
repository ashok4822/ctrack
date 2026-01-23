import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { ForgotPasswordDialog } from '@/components/auth/ForgotPasswordDialog';
import { Ship, ChevronLeft, Eye, EyeOff } from 'lucide-react';

export default function ShippingLineLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login('shipping-line');
    navigate('/shipping-line/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-info/5 via-background to-primary/5">
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
        <Card className="w-full max-w-md animate-fade-in">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-info/10">
              <Ship className="h-8 w-8 text-info" />
            </div>
            <CardTitle className="text-2xl">Shipping Line Portal</CardTitle>
            <CardDescription>
              Sign in to track and manage your containers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Shipping Line Name (Read-only demo) */}
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
                    <Ship className="h-5 w-5 text-info" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Maersk Line</p>
                    <p className="text-sm text-muted-foreground">85 containers in system</p>
                  </div>
                </div>
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
                  className="h-auto p-0 text-sm text-muted-foreground hover:text-info"
                  onClick={() => setForgotPasswordOpen(true)}
                >
                  Forgot Password?
                </Button>
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full" size="lg">
                Sign In
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
        accentColor="info"
      />
    </div>
  );
}
