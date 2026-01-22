import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { shippingLineNavItems } from '@/config/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  CreditCard,
  Building2,
  Smartphone,
  ArrowLeft,
  Shield,
  CheckCircle,
  Receipt,
  Lock,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Bill } from '@/types';

type PaymentMethod = 'card' | 'bank' | 'upi';

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const bill = location.state?.bill as Bill | undefined;
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    ifsc: '',
    accountName: '',
  });
  const [upiId, setUpiId] = useState('');

  // Generate transaction ID
  const transactionId = `TXN${Date.now().toString().slice(-8)}`;

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setIsComplete(true);
    
    toast({
      title: "Payment Successful",
      description: `Transaction ID: ${transactionId}`,
    });
  };

  if (!bill) {
    return (
      <DashboardLayout navItems={shippingLineNavItems} pageTitle="Payment">
        <Card className="max-w-lg mx-auto">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">No bill selected for payment.</p>
            <Button onClick={() => navigate('/shipping-line/bills')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Bills
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  if (isComplete) {
    return (
      <DashboardLayout navItems={shippingLineNavItems} pageTitle="Payment Confirmation">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-8 pb-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Payment Successful!</h2>
                <p className="text-muted-foreground">Your payment has been processed successfully.</p>
              </div>

              <Card className="bg-muted/50 mb-6">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Transaction ID</p>
                      <p className="font-mono font-semibold text-primary">{transactionId}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Date & Time</p>
                      <p className="font-medium">{new Date().toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Bill Number</p>
                      <p className="font-medium">{bill.billNumber}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Amount Paid</p>
                      <p className="font-bold text-lg">${bill.totalAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Payment Method</p>
                      <p className="font-medium capitalize">
                        {paymentMethod === 'card' ? 'Credit/Debit Card' : 
                         paymentMethod === 'bank' ? 'Bank Transfer' : 'UPI'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <span className="inline-flex items-center gap-1 text-green-500 font-medium">
                        <CheckCircle className="h-4 w-4" />
                        Completed
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bill Details */}
              <div className="mb-6">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Receipt className="h-4 w-4" />
                  Bill Summary
                </h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Activity</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bill.activities?.map((activity, index) => (
                      <TableRow key={index}>
                        <TableCell>{activity.name}</TableCell>
                        <TableCell>{activity.quantity}</TableCell>
                        <TableCell className="text-right">${activity.amount.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50">
                      <TableCell colSpan={2} className="font-semibold">Total Paid</TableCell>
                      <TableCell className="text-right font-bold">${bill.totalAmount.toLocaleString()}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => window.print()}>
                  <Receipt className="h-4 w-4 mr-2" />
                  Print Receipt
                </Button>
                <Button onClick={() => navigate('/shipping-line/bills')}>
                  Back to Bills
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navItems={shippingLineNavItems} pageTitle="Payment">
      <div className="mb-4">
        <Button variant="ghost" onClick={() => navigate('/shipping-line/bills')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Bills
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Payment Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Method Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Payment Method</CardTitle>
              <CardDescription>Choose how you would like to pay</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                className="grid grid-cols-3 gap-4"
              >
                <Label
                  htmlFor="card"
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 cursor-pointer transition-colors ${
                    paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                >
                  <RadioGroupItem value="card" id="card" className="sr-only" />
                  <CreditCard className={`h-6 w-6 ${paymentMethod === 'card' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="text-sm font-medium">Card</span>
                </Label>
                <Label
                  htmlFor="bank"
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 cursor-pointer transition-colors ${
                    paymentMethod === 'bank' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                >
                  <RadioGroupItem value="bank" id="bank" className="sr-only" />
                  <Building2 className={`h-6 w-6 ${paymentMethod === 'bank' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="text-sm font-medium">Bank Transfer</span>
                </Label>
                <Label
                  htmlFor="upi"
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 cursor-pointer transition-colors ${
                    paymentMethod === 'upi' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                >
                  <RadioGroupItem value="upi" id="upi" className="sr-only" />
                  <Smartphone className={`h-6 w-6 ${paymentMethod === 'upi' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="text-sm font-medium">UPI</span>
                </Label>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        type="password"
                        maxLength={4}
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'bank' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      placeholder="Enter your account number"
                      value={bankDetails.accountNumber}
                      onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ifsc">IFSC Code</Label>
                    <Input
                      id="ifsc"
                      placeholder="BANK0001234"
                      value={bankDetails.ifsc}
                      onChange={(e) => setBankDetails({ ...bankDetails, ifsc: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="accountName">Account Holder Name</Label>
                    <Input
                      id="accountName"
                      placeholder="Enter account holder name"
                      value={bankDetails.accountName}
                      onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="upiId">UPI ID</Label>
                    <Input
                      id="upiId"
                      placeholder="yourname@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Enter your UPI ID to complete the payment. You will receive a payment request on your UPI app.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security Notice */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            <span>Your payment information is encrypted and secure</span>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bill Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bill Number</span>
                  <span className="font-medium">{bill.billNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Container</span>
                  <span className="font-medium">{bill.containerNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer</span>
                  <span className="font-medium">{bill.customer || bill.shippingLine}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Due Date</span>
                  <span className="font-medium">{new Date(bill.dueDate).toLocaleDateString()}</span>
                </div>
              </div>

              <Separator />

              {/* Activities */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Charges</p>
                {bill.activities?.map((activity, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{activity.name} × {activity.quantity}</span>
                    <span>${activity.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${bill.totalAmount.toLocaleString()}</span>
              </div>

              <Button 
                className="w-full" 
                size="lg" 
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Processing...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Pay ${bill.totalAmount.toLocaleString()}
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                By completing this payment, you agree to our terms and conditions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
