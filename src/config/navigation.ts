import type { NavItem } from '@/types';
import {
  LayoutDashboard,
  Container,
  MapPin,
  DoorOpen,
  Package,
  Truck,
  ClipboardCheck,
  CheckSquare,
  Receipt,
  FileText,
  Users,
  Settings,
  ScrollText,
  UserCircle,
} from 'lucide-react';

export const adminNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/terminal/admin/dashboard', icon: LayoutDashboard },
  { title: 'Container Management', href: '/terminal/admin/containers', icon: Container },
  { title: 'Yard Configuration', href: '/terminal/admin/yard', icon: MapPin },
  { title: 'Gate Operations', href: '/terminal/admin/gate', icon: DoorOpen },
  { title: 'Stuffing / Destuffing', href: '/terminal/admin/stuffing', icon: Package },
  { title: 'Vehicles & Equipment', href: '/terminal/admin/vehicles', icon: Truck },
  { title: 'Surveys & Damage', href: '/terminal/admin/surveys', icon: ClipboardCheck },
  { title: 'Approvals', href: '/terminal/admin/approvals', icon: CheckSquare, badge: 3 },
  { title: 'Activities & Charges', href: '/terminal/admin/charges', icon: Receipt },
  { title: 'Reports & Analytics', href: '/terminal/admin/reports', icon: FileText },
  { title: 'User Management', href: '/terminal/admin/users', icon: Users },
  { title: 'System Configuration', href: '/terminal/admin/settings', icon: Settings },
  { title: 'Audit Logs', href: '/terminal/admin/audit', icon: ScrollText },
  { title: 'Profile', href: '/terminal/admin/profile', icon: UserCircle },
];

export const managerNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/terminal/manager/dashboard', icon: LayoutDashboard },
  { title: 'Container Monitoring', href: '/terminal/manager/containers', icon: Container },
  { title: 'Yard Monitoring', href: '/terminal/manager/yard', icon: MapPin },
  { title: 'Gate Operations', href: '/terminal/manager/gate', icon: DoorOpen },
  { title: 'Approvals', href: '/terminal/manager/approvals', icon: CheckSquare, badge: 3 },
  { title: 'Stuffing / Destuffing', href: '/terminal/manager/stuffing', icon: Package },
  { title: 'Vehicles & Equipment', href: '/terminal/manager/vehicles', icon: Truck },
  { title: 'Reports', href: '/terminal/manager/reports', icon: FileText },
  { title: 'Audit View', href: '/terminal/manager/audit', icon: ScrollText },
  { title: 'Profile', href: '/terminal/manager/profile', icon: UserCircle },
];

export const operatorNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/terminal/operator/dashboard', icon: LayoutDashboard },
  { title: 'Gate Operations', href: '/terminal/operator/gate', icon: DoorOpen },
  { title: 'Yard Operations', href: '/terminal/operator/yard', icon: MapPin },
  { title: 'Stuffing / Destuffing', href: '/terminal/operator/stuffing', icon: Package },
  { title: 'Equipment & Vehicles', href: '/terminal/operator/equipment', icon: Truck },
  { title: 'Container Lookup', href: '/terminal/operator/lookup', icon: Container },
  { title: 'Tasks', href: '/terminal/operator/tasks', icon: CheckSquare, badge: 4 },
  { title: 'Billing', href: '/terminal/operator/billing', icon: Receipt },
  { title: 'PDA View', href: '/terminal/operator/pda', icon: FileText },
  { title: 'Profile', href: '/terminal/operator/profile', icon: UserCircle },
];

export const surveyorNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/terminal/surveyor/dashboard', icon: LayoutDashboard },
  { title: 'Assigned Surveys', href: '/terminal/surveyor/assigned', icon: ClipboardCheck, badge: 3 },
  { title: 'Damage Inspection', href: '/terminal/surveyor/inspection', icon: Container },
  { title: 'Survey Reports', href: '/terminal/surveyor/reports', icon: FileText },
  { title: 'History', href: '/terminal/surveyor/history', icon: ScrollText },
  { title: 'Profile', href: '/terminal/surveyor/profile', icon: UserCircle },
];

export const shippingLineNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/shipping-line/dashboard', icon: LayoutDashboard },
  { title: 'My Containers', href: '/shipping-line/containers', icon: Container },
  { title: 'Container Nomination', href: '/shipping-line/nomination', icon: CheckSquare },
  { title: 'Movements', href: '/shipping-line/movements', icon: Truck },
  { title: 'Bills', href: '/shipping-line/bills', icon: Receipt },
  { title: 'Reports', href: '/shipping-line/reports', icon: FileText },
  { title: 'Profile', href: '/shipping-line/profile', icon: UserCircle },
];

export const customerNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/customer/dashboard', icon: LayoutDashboard },
  { title: 'My Containers', href: '/customer/containers', icon: Container },
  { title: 'Stuffing / Destuffing', href: '/customer/stuffing', icon: Package },
  { title: 'Movements', href: '/customer/movements', icon: Truck },
  { title: 'Requests', href: '/customer/requests', icon: CheckSquare },
  { title: 'Profile', href: '/customer/profile', icon: UserCircle },
];
