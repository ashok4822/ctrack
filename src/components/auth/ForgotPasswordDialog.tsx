import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';
import { Mail, KeyRound, CheckCircle2, Eye, EyeOff, ArrowLeft } from 'lucide-react';

type Step = 'email' | 'otp' | 'reset' | 'success';

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accentColor?: string;
}

export function ForgotPasswordDialog({
  open,
  onOpenChange,
  accentColor = 'primary',
}: ForgotPasswordDialogProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const resetDialog = () => {
    setStep('email');
    setEmail('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      resetDialog();
    }
    onOpenChange(open);
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email address.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);

    toast({
      title: 'OTP Sent',
      description: `A verification code has been sent to ${email}`,
    });
    setStep('otp');
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast({
        title: 'Invalid OTP',
        description: 'Please enter the complete 6-digit code.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);

    // Demo: Accept any 6-digit code
    toast({
      title: 'OTP Verified',
      description: 'Please set your new password.',
    });
    setStep('reset');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast({
        title: 'Password Required',
        description: 'Please enter and confirm your new password.',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Passwords Do Not Match',
        description: 'Please ensure both passwords are identical.',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: 'Password Too Short',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);

    setStep('success');
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast({
      title: 'OTP Resent',
      description: `A new verification code has been sent to ${email}`,
    });
  };

  const getAccentClasses = () => {
    switch (accentColor) {
      case 'info':
        return {
          iconBg: 'bg-info/10',
          iconColor: 'text-info',
        };
      case 'success':
        return {
          iconBg: 'bg-success/10',
          iconColor: 'text-success',
        };
      default:
        return {
          iconBg: 'bg-primary/10',
          iconColor: 'text-primary',
        };
    }
  };

  const accent = getAccentClasses();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {/* Email Step */}
        {step === 'email' && (
          <>
            <DialogHeader className="text-center">
              <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${accent.iconBg}`}>
                <Mail className={`h-7 w-7 ${accent.iconColor}`} />
              </div>
              <DialogTitle className="text-xl">Forgot Password?</DialogTitle>
              <DialogDescription>
                Enter your email address and we'll send you a verification code.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSendOTP} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="forgot-email">Email Address</Label>
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Verification Code'}
              </Button>
            </form>
          </>
        )}

        {/* OTP Verification Step */}
        {step === 'otp' && (
          <>
            <DialogHeader className="text-center">
              <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${accent.iconBg}`}>
                <KeyRound className={`h-7 w-7 ${accent.iconColor}`} />
              </div>
              <DialogTitle className="text-xl">Enter Verification Code</DialogTitle>
              <DialogDescription>
                We've sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleVerifyOTP} className="space-y-4 pt-4">
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  disabled={isLoading}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </Button>
              <div className="flex items-center justify-between text-sm">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep('email')}
                  disabled={isLoading}
                  className="gap-1"
                >
                  <ArrowLeft className="h-3 w-3" />
                  Change Email
                </Button>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={handleResendOTP}
                  disabled={isLoading}
                >
                  Resend Code
                </Button>
              </div>
            </form>
          </>
        )}

        {/* Reset Password Step */}
        {step === 'reset' && (
          <>
            <DialogHeader className="text-center">
              <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${accent.iconBg}`}>
                <KeyRound className={`h-7 w-7 ${accent.iconColor}`} />
              </div>
              <DialogTitle className="text-xl">Reset Password</DialogTitle>
              <DialogDescription>
                Create a new password for your account.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleResetPassword} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isLoading}
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
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          </>
        )}

        {/* Success Step */}
        {step === 'success' && (
          <>
            <DialogHeader className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-success/10">
                <CheckCircle2 className="h-7 w-7 text-success" />
              </div>
              <DialogTitle className="text-xl">Password Reset Successful!</DialogTitle>
              <DialogDescription>
                Your password has been updated. You can now sign in with your new password.
              </DialogDescription>
            </DialogHeader>
            <div className="pt-4">
              <Button className="w-full" onClick={() => handleClose(false)}>
                Back to Login
              </Button>
            </div>
          </>
        )}

        {/* Demo Note */}
        {step !== 'success' && (
          <p className="text-center text-xs text-muted-foreground pt-2">
            Demo mode: Any email and OTP will work
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
