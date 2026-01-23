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
import AdminProfile from "./pages/terminal/admin/Profile";

// Terminal Manager Pages
import ManagerDashboard from "./pages/terminal/manager/ManagerDashboard";
import ManagerContainerMonitoring from "./pages/terminal/manager/ContainerMonitoring";
import ManagerYardMonitoring from "./pages/terminal/manager/YardMonitoring";
import ManagerGateOperations from "./pages/terminal/manager/GateOperations";
import ManagerApprovals from "./pages/terminal/manager/Approvals";
import ManagerStuffingDestuffing from "./pages/terminal/manager/StuffingDestuffing";
import ManagerVehiclesEquipment from "./pages/terminal/manager/VehiclesEquipment";
import ManagerReports from "./pages/terminal/manager/Reports";
import ManagerAuditView from "./pages/terminal/manager/AuditView";
import ManagerProfile from "./pages/terminal/manager/Profile";

// Terminal Operator Pages
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

// Terminal Surveyor Pages
import SurveyorDashboard from "./pages/terminal/surveyor/SurveyorDashboard";
import SurveyorAssignedSurveys from "./pages/terminal/surveyor/AssignedSurveys";
import SurveyorDamageInspection from "./pages/terminal/surveyor/DamageInspection";
import SurveyorReports from "./pages/terminal/surveyor/SurveyReports";
import SurveyorHistory from "./pages/terminal/surveyor/History";
import SurveyorProfile from "./pages/terminal/surveyor/Profile";

// External User Pages - Shipping Line
import ShippingLineDashboard from "./pages/shipping-line/ShippingLineDashboard";
import MyContainers from "./pages/shipping-line/MyContainers";
import ContainerNomination from "./pages/shipping-line/ContainerNomination";
import Movements from "./pages/shipping-line/Movements";
import Bills from "./pages/shipping-line/Bills";
import ShippingLinePayment from "./pages/shipping-line/Payment";
import ShippingLineReports from "./pages/shipping-line/Reports";
import ShippingLineProfile from "./pages/shipping-line/Profile";

// External User Pages - Customer
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CustomerMyContainers from "./pages/customer/MyContainers";
import CustomerStuffingDestuffing from "./pages/customer/StuffingDestuffing";
import CustomerMovements from "./pages/customer/Movements";
import CustomerRequests from "./pages/customer/Requests";
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
            <Route path="/terminal/admin/profile" element={<AdminProfile />} />

            {/* Terminal Manager Routes */}
            <Route path="/terminal/manager/dashboard" element={<ManagerDashboard />} />
            <Route path="/terminal/manager/containers" element={<ManagerContainerMonitoring />} />
            <Route path="/terminal/manager/yard" element={<ManagerYardMonitoring />} />
            <Route path="/terminal/manager/gate" element={<ManagerGateOperations />} />
            <Route path="/terminal/manager/approvals" element={<ManagerApprovals />} />
            <Route path="/terminal/manager/stuffing" element={<ManagerStuffingDestuffing />} />
            <Route path="/terminal/manager/vehicles" element={<ManagerVehiclesEquipment />} />
            <Route path="/terminal/manager/reports" element={<ManagerReports />} />
            <Route path="/terminal/manager/audit" element={<ManagerAuditView />} />
            <Route path="/terminal/manager/profile" element={<ManagerProfile />} />

            {/* Terminal Operator Routes */}
            <Route path="/terminal/operator/dashboard" element={<OperatorDashboard />} />
            <Route path="/terminal/operator/gate" element={<OperatorGateOperations />} />
            <Route path="/terminal/operator/yard" element={<OperatorYardOperations />} />
            <Route path="/terminal/operator/stuffing" element={<OperatorStuffingDestuffing />} />
            <Route path="/terminal/operator/equipment" element={<OperatorEquipmentVehicles />} />
            <Route path="/terminal/operator/lookup" element={<OperatorContainerLookup />} />
            <Route path="/terminal/operator/tasks" element={<OperatorTasks />} />
            <Route path="/terminal/operator/billing" element={<OperatorBilling />} />
            <Route path="/terminal/operator/pda" element={<OperatorPDAView />} />
            <Route path="/terminal/operator/profile" element={<OperatorProfile />} />

            {/* Terminal Surveyor Routes */}
            <Route path="/terminal/surveyor/dashboard" element={<SurveyorDashboard />} />
            <Route path="/terminal/surveyor/assigned" element={<SurveyorAssignedSurveys />} />
            <Route path="/terminal/surveyor/inspection" element={<SurveyorDamageInspection />} />
            <Route path="/terminal/surveyor/reports" element={<SurveyorReports />} />
            <Route path="/terminal/surveyor/history" element={<SurveyorHistory />} />
            <Route path="/terminal/surveyor/profile" element={<SurveyorProfile />} />

            {/* Shipping Line Routes */}
            <Route path="/shipping-line/login" element={<ShippingLineLogin />} />
            <Route path="/shipping-line/dashboard" element={<ShippingLineDashboard />} />
            <Route path="/shipping-line/containers" element={<MyContainers />} />
            <Route path="/shipping-line/nomination" element={<ContainerNomination />} />
            <Route path="/shipping-line/movements" element={<Movements />} />
            <Route path="/shipping-line/bills" element={<Bills />} />
            <Route path="/shipping-line/payment" element={<ShippingLinePayment />} />
            <Route path="/shipping-line/reports" element={<ShippingLineReports />} />
            <Route path="/shipping-line/profile" element={<ShippingLineProfile />} />

            {/* Customer Routes */}
            <Route path="/customer/login" element={<CustomerLogin />} />
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/containers" element={<CustomerMyContainers />} />
            <Route path="/customer/stuffing" element={<CustomerStuffingDestuffing />} />
            <Route path="/customer/movements" element={<CustomerMovements />} />
            <Route path="/customer/requests" element={<CustomerRequests />} />
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
