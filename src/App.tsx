import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Landing and Login Pages
import LandingPage from "./pages/LandingPage";
import TerminalLogin from "./pages/terminal/TerminalLogin";
import ShippingLineLogin from "./pages/shipping-line/ShippingLineLogin";
import CustomerLogin from "./pages/customer/CustomerLogin";

// Terminal Admin Pages
import AdminDashboard from "./pages/terminal/admin/AdminDashboard";
import ContainerList from "./pages/terminal/admin/ContainerList";
import YardConfiguration from "./pages/terminal/admin/YardConfiguration";
import GateOperations from "./pages/terminal/admin/GateOperations";
import Approvals from "./pages/terminal/admin/Approvals";
import VehiclesEquipment from "./pages/terminal/admin/VehiclesEquipment";
import AuditLogs from "./pages/terminal/admin/AuditLogs";
import UserManagement from "./pages/terminal/admin/UserManagement";
import StuffingDestuffing from "./pages/terminal/admin/StuffingDestuffing";
import SurveysDamage from "./pages/terminal/admin/SurveysDamage";
import ActivitiesCharges from "./pages/terminal/admin/ActivitiesCharges";
import ReportsAnalytics from "./pages/terminal/admin/ReportsAnalytics";
import SystemConfiguration from "./pages/terminal/admin/SystemConfiguration";

// Terminal Other Role Pages
import ManagerDashboard from "./pages/terminal/manager/ManagerDashboard";
import OperatorDashboard from "./pages/terminal/operator/OperatorDashboard";
import SurveyorDashboard from "./pages/terminal/surveyor/SurveyorDashboard";

// External User Pages
import ShippingLineDashboard from "./pages/shipping-line/ShippingLineDashboard";
import CustomerDashboard from "./pages/customer/CustomerDashboard";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Landing */}
            <Route path="/" element={<LandingPage />} />

            {/* Terminal Login */}
            <Route path="/terminal/login" element={<TerminalLogin />} />

            {/* Terminal Admin Routes */}
            <Route path="/terminal/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/terminal/admin/containers" element={<ContainerList />} />
            <Route path="/terminal/admin/yard" element={<YardConfiguration />} />
            <Route path="/terminal/admin/gate" element={<GateOperations />} />
            <Route path="/terminal/admin/approvals" element={<Approvals />} />
            <Route path="/terminal/admin/vehicles" element={<VehiclesEquipment />} />
            <Route path="/terminal/admin/audit" element={<AuditLogs />} />
            <Route path="/terminal/admin/users" element={<UserManagement />} />
            <Route path="/terminal/admin/stuffing" element={<StuffingDestuffing />} />
            <Route path="/terminal/admin/surveys" element={<SurveysDamage />} />
            <Route path="/terminal/admin/charges" element={<ActivitiesCharges />} />
            <Route path="/terminal/admin/reports" element={<ReportsAnalytics />} />
            <Route path="/terminal/admin/settings" element={<SystemConfiguration />} />

            {/* Terminal Manager Routes */}
            <Route path="/terminal/manager/dashboard" element={<ManagerDashboard />} />
            <Route path="/terminal/manager/*" element={<ManagerDashboard />} />

            {/* Terminal Operator Routes */}
            <Route path="/terminal/operator/dashboard" element={<OperatorDashboard />} />
            <Route path="/terminal/operator/*" element={<OperatorDashboard />} />

            {/* Terminal Surveyor Routes */}
            <Route path="/terminal/surveyor/dashboard" element={<SurveyorDashboard />} />
            <Route path="/terminal/surveyor/*" element={<SurveyorDashboard />} />

            {/* Shipping Line Routes */}
            <Route path="/shipping-line/login" element={<ShippingLineLogin />} />
            <Route path="/shipping-line/dashboard" element={<ShippingLineDashboard />} />
            <Route path="/shipping-line/*" element={<ShippingLineDashboard />} />

            {/* Customer Routes */}
            <Route path="/customer/login" element={<CustomerLogin />} />
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/*" element={<CustomerDashboard />} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
