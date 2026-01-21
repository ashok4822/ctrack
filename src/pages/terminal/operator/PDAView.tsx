import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KPICard } from '@/components/common/KPICard';
import { DataTable, Column } from '@/components/common/DataTable';
import { operatorNavItems } from '@/config/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  Search,
  Building2,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { dummyPDAs, dummyShippingLines } from '@/data/dummyData';
import type { PreDepositAccount, PDATransaction } from '@/types';
import { useState } from 'react';

export default function OperatorPDAView() {
  const [selectedPDA, setSelectedPDA] = useState<PreDepositAccount | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const totalBalance = dummyPDAs.reduce((sum, pda) => sum + pda.balance, 0);
  const lowBalanceAccounts = dummyPDAs.filter(pda => pda.balance < 50000);

  const filteredPDAs = dummyPDAs.filter(pda =>
    pda.shippingLine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: Column<PreDepositAccount>[] = [
    { key: 'shippingLine', header: 'Shipping Line', sortable: true },
    {
      key: 'balance',
      header: 'Balance',
      sortable: true,
      render: (item) => (
        <span className={`font-medium ${item.balance < 50000 ? 'text-destructive' : 'text-success'}`}>
          ₹{item.balance.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'lastUpdated',
      header: 'Last Updated',
      render: (item) => new Date(item.lastUpdated).toLocaleString(),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => (
        <StatusBadge status={item.balance < 50000 ? 'warning' : 'active'} />
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" onClick={() => setSelectedPDA(item)}>
              View Details
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Pre-Deposit Account</DialogTitle>
              <DialogDescription>{item.shippingLine}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm text-muted-foreground">Current Balance</p>
                  <p className={`text-3xl font-bold ${item.balance < 50000 ? 'text-destructive' : 'text-success'}`}>
                    ₹{item.balance.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {item.balance < 50000 ? (
                    <TrendingDown className="h-8 w-8 text-destructive" />
                  ) : (
                    <TrendingUp className="h-8 w-8 text-success" />
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-semibold mb-3">Recent Transactions</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {item.transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        {tx.type === 'credit' ? (
                          <ArrowUpCircle className="h-5 w-5 text-success" />
                        ) : (
                          <ArrowDownCircle className="h-5 w-5 text-destructive" />
                        )}
                        <div>
                          <p className="font-medium">{tx.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(tx.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${tx.type === 'credit' ? 'text-success' : 'text-destructive'}`}>
                          {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Bal: ₹{tx.balanceAfter.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ),
    },
  ];

  return (
    <DashboardLayout navItems={operatorNavItems} pageTitle="Pre-Deposit Accounts (PDA)">
      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total PDA Balance"
          value={`₹${totalBalance.toLocaleString()}`}
          icon={Wallet}
          variant="success"
        />
        <KPICard
          title="Shipping Lines"
          value={dummyPDAs.length}
          icon={Building2}
          variant="primary"
        />
        <KPICard
          title="Low Balance Accounts"
          value={lowBalanceAccounts.length}
          icon={TrendingDown}
          variant="warning"
        />
        <KPICard
          title="Active Today"
          value={dummyPDAs.length}
          icon={TrendingUp}
        />
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-3 max-w-md">
            <Input
              placeholder="Search shipping line..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* PDA List */}
      <Card>
        <CardHeader>
          <CardTitle>Shipping Line PDA Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredPDAs}
            columns={columns}
            searchable={false}
            emptyMessage="No PDA accounts found"
          />
        </CardContent>
      </Card>

      {/* Quick Balance Overview */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Balance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dummyPDAs.map((pda) => (
              <div
                key={pda.id}
                className={`rounded-lg border p-4 ${pda.balance < 50000 ? 'border-destructive/50 bg-destructive/5' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold truncate">{pda.shippingLine}</h4>
                  {pda.balance < 50000 && (
                    <span className="text-xs text-destructive font-medium">Low</span>
                  )}
                </div>
                <p className={`text-2xl font-bold ${pda.balance < 50000 ? 'text-destructive' : 'text-foreground'}`}>
                  ₹{pda.balance.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Updated: {new Date(pda.lastUpdated).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
