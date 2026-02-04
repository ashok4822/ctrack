import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KPICard } from "@/components/common/KPICard";
import { operatorNavItems } from "@/config/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DoorOpen,
  Container,
  CheckSquare,
  ArrowRight,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  FileCheck,
  MapPin,
  Package,
  User,
  Phone,
} from "lucide-react";
import { dummyKPIData, dummyTasks, dummyGateOperations, dummyNominations } from "@/data/dummyData";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Nomination {
  id: string;
  containerNumber: string;
  shippingLine: string;
  customer: string;
  factory: string;
  location: string;
  distance: string;
  size: string;
  type: string;
  movementType: string;
  status: string;
  nominatedAt: string;
  truckNumber: string;
  driverName: string;
  driverPhone: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  rejectionReason?: string;
}

export default function OperatorDashboard() {
  const { toast } = useToast();
  const [nominations, setNominations] = useState<Nomination[]>(dummyNominations as Nomination[]);
  const [selectedNomination, setSelectedNomination] = useState<Nomination | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const pendingTasks = dummyTasks.filter((t) => t.status !== "completed");
  const pendingGateOps = dummyGateOperations.filter((g) => g.status === "pending");
  const pendingNominations = nominations.filter((n) => n.status === "pending");

  const handleApproveLoading = (nomination: Nomination) => {
    setNominations((prev) =>
      prev.map((n) =>
        n.id === nomination.id
          ? { ...n, status: "approved", approvedAt: new Date().toISOString(), approvedBy: "Mike Operator" }
          : n,
      ),
    );
    toast({
      title: "Loading Approved",
      description: `Container ${nomination.containerNumber} has been approved for loading to truck ${nomination.truckNumber}`,
    });
    setDialogOpen(false);
    setSelectedNomination(null);
  };

  const handleRejectLoading = (nomination: Nomination) => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Rejection Reason Required",
        description: "Please provide a reason for rejecting the loading request.",
        variant: "destructive",
      });
      return;
    }
    setNominations((prev) =>
      prev.map((n) =>
        n.id === nomination.id
          ? {
            ...n,
            status: "rejected",
            rejectedAt: new Date().toISOString(),
            rejectedBy: "Mike Operator",
            rejectionReason,
          }
          : n,
      ),
    );
    toast({
      title: "Loading Rejected",
      description: `Container ${nomination.containerNumber} loading request has been rejected.`,
      variant: "destructive",
    });
    setDialogOpen(false);
    setSelectedNomination(null);
    setRejectionReason("");
  };

  return (
    <DashboardLayout navItems={operatorNavItems} pageTitle="Operator Dashboard">
      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KPICard title="Gate-Ins Today" value={dummyKPIData.gateInToday} icon={DoorOpen} variant="success" />
        <KPICard title="Gate-Outs Today" value={dummyKPIData.gateOutToday} icon={DoorOpen} />
        <KPICard
          title="Containers in Yard"
          value={dummyKPIData.totalContainersInYard}
          icon={Container}
          variant="primary"
        />
        <KPICard title="Tasks Pending" value={dummyKPIData.tasksToday || 0} icon={CheckSquare} variant="warning" />
        {/* <KPICard title="Nominations Pending" value={pendingNominations.length} icon={FileCheck} variant="primary" /> */}
      </div>

      {/* Quick Actions */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
          <Link to="/operator/gate">
            <DoorOpen className="h-6 w-6 text-success" />
            <span>Process Gate-In</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
          <Link to="/operator/gate">
            <DoorOpen className="h-6 w-6 text-primary" />
            <span>Process Gate-Out</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
          <Link to="/operator/yard">
            <Container className="h-6 w-6 text-warning" />
            <span>Yard Operations</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
          <Link to="/operator/lookup">
            <Container className="h-6 w-6 text-muted-foreground" />
            <span>Container Lookup</span>
          </Link>
        </Button>
      </div>
      {/* 
      Nominated Containers Section
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            Nominated Containers - Pending Loading Approval
          </CardTitle>
          <span className="text-sm text-muted-foreground">{pendingNominations.length} pending</span>
        </CardHeader>
        <CardContent>
          {pendingNominations.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No pending nominations</p>
          ) : (
            <div className="space-y-3">
              {pendingNominations.map((nomination) => (
                <div
                  key={nomination.id}
                  className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-foreground">{nomination.containerNumber}</p>
                      <StatusBadge status={nomination.movementType as any} />
                      <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        {nomination.size} • {nomination.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Truck className="h-3.5 w-3.5" />
                        {nomination.truckNumber}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5" />
                        {nomination.driverName}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {nomination.factory} ({nomination.distance})
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Shipping Line: {nomination.shippingLine} • Customer: {nomination.customer}
                    </p>
                  </div>
                  <Dialog
                    open={dialogOpen && selectedNomination?.id === nomination.id}
                    onOpenChange={(open) => {
                      setDialogOpen(open);
                      if (!open) {
                        setSelectedNomination(null);
                        setRejectionReason("");
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedNomination(nomination);
                          setDialogOpen(true);
                        }}
                      >
                        Review & Approve
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Approve Container Loading</DialogTitle>
                        <DialogDescription>Review nomination details and approve loading to truck</DialogDescription>
                      </DialogHeader>
                      {selectedNomination && (
                        <div className="space-y-4">
                          <div className="rounded-lg border p-4 bg-muted/30">
                            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                              <Package className="h-4 w-4" />
                              Container Details
                            </h4>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <Label className="text-muted-foreground text-xs">Container Number</Label>
                                <p className="font-medium">{selectedNomination.containerNumber}</p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground text-xs">Size / Type</Label>
                                <p className="font-medium">
                                  {selectedNomination.size} • {selectedNomination.type}
                                </p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground text-xs">Movement Type</Label>
                                <p className="font-medium capitalize">{selectedNomination.movementType}</p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground text-xs">Shipping Line</Label>
                                <p className="font-medium">{selectedNomination.shippingLine}</p>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-lg border p-4 bg-muted/30">
                            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              Destination
                            </h4>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <Label className="text-muted-foreground text-xs">Customer</Label>
                                <p className="font-medium">{selectedNomination.customer}</p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground text-xs">Factory</Label>
                                <p className="font-medium">{selectedNomination.factory}</p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground text-xs">Location</Label>
                                <p className="font-medium">{selectedNomination.location}</p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground text-xs">Distance</Label>
                                <p className="font-medium">{selectedNomination.distance}</p>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-lg border p-4 bg-muted/30">
                            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                              <Truck className="h-4 w-4" />
                              Truck & Driver Details
                            </h4>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <Label className="text-muted-foreground text-xs">Truck Number</Label>
                                <p className="font-medium">{selectedNomination.truckNumber}</p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground text-xs">Driver Name</Label>
                                <p className="font-medium">{selectedNomination.driverName}</p>
                              </div>
                              <div className="col-span-2">
                                <Label className="text-muted-foreground text-xs">Driver Phone</Label>
                                <p className="font-medium flex items-center gap-1">
                                  <Phone className="h-3.5 w-3.5" />
                                  {selectedNomination.driverPhone}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="rejection-reason">Rejection Reason (if rejecting)</Label>
                            <Textarea
                              id="rejection-reason"
                              placeholder="Enter reason for rejection..."
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      )}
                      <DialogFooter className="gap-2">
                        <Button
                          variant="destructive"
                          onClick={() => selectedNomination && handleRejectLoading(selectedNomination)}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                        <Button
                          variant="default"
                          onClick={() => selectedNomination && handleApproveLoading(selectedNomination)}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve Loading
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card> 
      */}

      {/* Task Queue and Gate Operations */}
      <div className="grid gap-6 lg:grid-cols-1">
        {/* Task Queue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Task Queue</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/operator/tasks">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingTasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-4 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <CheckSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{task.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge status={task.priority} />
                      <span className="text-xs text-muted-foreground">
                        <Clock className="inline h-3 w-3 mr-1" />
                        {task.status}
                      </span>
                    </div>
                  </div>
                  <Button size="sm">Start</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Gate Operations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Pending Container Gate Operations</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/operator/gate">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingGateOps.map((op) => (
                <div
                  key={op.id}
                  className="flex items-center gap-4 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${op.type === "gate-in" ? "bg-success/10" : "bg-primary/10"}`}
                  >
                    <DoorOpen className={`h-5 w-5 ${op.type === "gate-in" ? "text-success" : "text-primary"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{op.containerNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {op.vehicleNumber} • {op.driverName}
                    </p>
                  </div>
                  <StatusBadge status={op.type} />
                </div>
              ))}
              {pendingGateOps.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No pending gate operations</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
