import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Landing and Login Pages
import LandingPage from "./pages/LandingPage";
import TerminalLogin from "./pages/terminal/TerminalLogin";
import CustomerLogin from "./pages/customer/CustomerLogin";

// Admin Pages
import AdminLogin from "./pages/terminal/admin/AdminLogin";
import AdminDashboard from "./pages/terminal/admin/AdminDashboard";
import ContainerList from "./pages/terminal/admin/ContainerList";
import ContainerDetails from "./pages/terminal/admin/ContainerDetails";
import YardConfiguration from "./pages/terminal/admin/YardConfiguration";
import AdminGateOperations from "./pages/terminal/admin/GateOperations";
import Approvals from "./pages/terminal/admin/Approvals";
import VehiclesEquipment from "./pages/terminal/admin/VehiclesEquipment";
import AuditLogs from "./pages/terminal/admin/AuditLogs";
import UserManagement from "./pages/terminal/admin/UserManagement";
import AdminStuffingDestuffing from "./pages/terminal/admin/StuffingDestuffing";
import SurveysDamage from "./pages/terminal/admin/SurveysDamage";
import ActivitiesCharges from "./pages/terminal/admin/ActivitiesCharges";
import ReportsAnalytics from "./pages/terminal/admin/ReportsAnalytics";
import SystemConfiguration from "./pages/terminal/admin/SystemConfiguration";
import AdminProfile from "./pages/terminal/admin/Profile";

// Operator Pages (formerly Terminal Operator)
import OperatorDashboard from "./pages/terminal/operator/OperatorDashboard";
import OperatorGateOperations from "./pages/terminal/operator/GateOperations";
import OperatorYardOperations from "./pages/terminal/operator/YardOperations";
import OperatorStuffingDestuffing from "./pages/terminal/operator/StuffingDestuffing";
import OperatorEquipmentVehicles from "./pages/terminal/operator/EquipmentVehicles";
import OperatorContainerLookup from "./pages/terminal/operator/ContainerLookup";
import OperatorTasks from "./pages/terminal/operator/Tasks";
import OperatorBilling from "./pages/terminal/operator/Billing";
import OperatorPDAView from "./pages/terminal/operator/PDAView";
import OperatorProfile from "./pages/terminal/operator/Profile";
import OperatorCargoRequests from "./pages/terminal/operator/CargoRequests";

// Customer Pages
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CustomerMyContainers from "./pages/customer/MyContainers";
import CustomerRequestContainer from "./pages/customer/RequestContainer";
import CustomerStuffingDestuffing from "./pages/customer/StuffingDestuffing";
import CustomerTransitTracking from "./pages/customer/TransitTracking";
import CustomerMovements from "./pages/customer/Movements";
import CustomerRequests from "./pages/customer/Requests";
import CustomerBills from "./pages/customer/Bills";
import CustomerPayment from "./pages/customer/Payment";
import CustomerPaymentConfirmation from "./pages/customer/PaymentConfirmation";
import CustomerProfile from "./pages/customer/Profile";

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

            {/* Terminal Operator Login */}
            <Route path="/terminal/login" element={<TerminalLogin />} />

            {/* Admin Login & Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/containers" element={<ContainerList />} />
            <Route path="/admin/containers/:id" element={<ContainerDetails />} />
            <Route path="/admin/yard" element={<YardConfiguration />} />
            <Route path="/admin/gate" element={<AdminGateOperations />} />
            <Route path="/admin/approvals" element={<Approvals />} />
            <Route path="/admin/vehicles" element={<VehiclesEquipment />} />
            <Route path="/admin/audit" element={<AuditLogs />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/stuffing" element={<AdminStuffingDestuffing />} />
            <Route path="/admin/surveys" element={<SurveysDamage />} />
            <Route path="/admin/charges" element={<ActivitiesCharges />} />
            <Route path="/admin/reports" element={<ReportsAnalytics />} />
            <Route path="/admin/settings" element={<SystemConfiguration />} />
            <Route path="/admin/profile" element={<AdminProfile />} />

            {/* Operator Routes */}
            <Route path="/operator/dashboard" element={<OperatorDashboard />} />
            <Route path="/operator/gate" element={<OperatorGateOperations />} />
            <Route path="/operator/yard" element={<OperatorYardOperations />} />
            <Route path="/operator/stuffing" element={<OperatorStuffingDestuffing />} />
            <Route path="/operator/equipment" element={<OperatorEquipmentVehicles />} />
            <Route path="/operator/lookup" element={<OperatorContainerLookup />} />
            <Route path="/operator/tasks" element={<OperatorTasks />} />
            <Route path="/operator/billing" element={<OperatorBilling />} />
            <Route path="/operator/pda" element={<OperatorPDAView />} />
            <Route path="/operator/profile" element={<OperatorProfile />} />
            <Route path="/operator/cargo-requests" element={<OperatorCargoRequests />} />

            {/* Customer Routes */}
            <Route path="/customer/login" element={<CustomerLogin />} />
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/containers" element={<CustomerMyContainers />} />
            <Route path="/customer/request-container" element={<CustomerRequestContainer />} />
            <Route path="/customer/stuffing" element={<CustomerStuffingDestuffing />} />
            <Route path="/customer/transit" element={<CustomerTransitTracking />} />
            <Route path="/customer/movements" element={<CustomerMovements />} />
            <Route path="/customer/requests" element={<CustomerRequests />} />
            <Route path="/customer/bills" element={<CustomerBills />} />
            <Route path="/customer/payment/:billId" element={<CustomerPayment />} />
            <Route path="/customer/payment-confirmation/:billId" element={<CustomerPaymentConfirmation />} />
            <Route path="/customer/profile" element={<CustomerProfile />} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
