import type {
  Container,
  Vehicle,
  Equipment,
  Survey,
  GateOperation,
  StuffingOperation,
  Bill,
  PreDepositAccount,
  Approval,
  AuditLog,
  Notification,
  KPIData,
  ChartDataPoint,
  YardBlock,
  User,
} from '@/types';

// Users
export const dummyUsers: User[] = [
  { id: '1', name: 'John Admin', email: 'admin@ctrack.com', type: 'terminal', role: 'admin', avatar: '' },
  { id: '2', name: 'Sarah Manager', email: 'manager@ctrack.com', type: 'terminal', role: 'manager', avatar: '' },
  { id: '3', name: 'Mike Operator', email: 'operator@ctrack.com', type: 'terminal', role: 'operator', avatar: '' },
  { id: '4', name: 'Lisa Surveyor', email: 'surveyor@ctrack.com', type: 'terminal', role: 'surveyor', avatar: '' },
  { id: '5', name: 'Maersk User', email: 'user@maersk.com', type: 'shipping-line', organization: 'Maersk Line', avatar: '' },
  { id: '6', name: 'ABC Factory', email: 'user@abcfactory.com', type: 'customer', organization: 'ABC Manufacturing', avatar: '' },
];

// Containers
export const dummyContainers: Container[] = [
  {
    id: '1',
    containerNumber: 'MSCU1234567',
    size: '40ft',
    type: 'standard',
    movementType: 'import',
    status: 'in-yard',
    shippingLine: 'Maersk Line',
    customer: 'ABC Manufacturing',
    yardLocation: { block: 'A', row: '01', bay: '05', tier: '2' },
    gateInTime: '2024-01-20T08:30:00Z',
    dwellTime: 3,
    weight: 25000,
    sealNumber: 'SEAL123456',
  },
  {
    id: '2',
    containerNumber: 'HLCU7654321',
    size: '20ft',
    type: 'reefer',
    movementType: 'export',
    status: 'in-transit',
    shippingLine: 'Hapag-Lloyd',
    customer: 'XYZ Foods',
    gateInTime: '2024-01-19T14:00:00Z',
    dwellTime: 2,
    weight: 18000,
    sealNumber: 'SEAL789012',
  },
  {
    id: '3',
    containerNumber: 'CMAU9876543',
    size: '40ft',
    type: 'standard',
    movementType: 'domestic',
    status: 'at-port',
    shippingLine: 'CMA CGM',
    yardLocation: { block: 'B', row: '03', bay: '12', tier: '1' },
    gateInTime: '2024-01-18T10:15:00Z',
    dwellTime: 5,
    weight: 22000,
  },
  {
    id: '4',
    containerNumber: 'EITU5432109',
    size: '45ft',
    type: 'open-top',
    movementType: 'import',
    status: 'damaged',
    shippingLine: 'Evergreen',
    customer: 'Heavy Industries Ltd',
    yardLocation: { block: 'C', row: '02', bay: '08', tier: '1' },
    gateInTime: '2024-01-17T16:45:00Z',
    dwellTime: 6,
    damaged: true,
    damageDetails: 'Roof panel dented, needs inspection',
  },
  {
    id: '5',
    containerNumber: 'OOLU3210987',
    size: '20ft',
    type: 'tank',
    movementType: 'export',
    status: 'at-factory',
    shippingLine: 'OOCL',
    customer: 'Chemical Corp',
    weight: 30000,
    sealNumber: 'SEAL345678',
  },
  {
    id: '6',
    containerNumber: 'NYKU8765432',
    size: '40ft',
    type: 'standard',
    movementType: 'import',
    status: 'pending',
    shippingLine: 'NYK Line',
    customer: 'Global Traders',
  },
  {
    id: '7',
    containerNumber: 'KKFU1122334',
    size: '40ft',
    type: 'reefer',
    movementType: 'export',
    status: 'in-yard',
    shippingLine: 'K Line',
    customer: 'Fresh Produce Inc',
    yardLocation: { block: 'R', row: '01', bay: '03', tier: '1' },
    gateInTime: '2024-01-21T07:00:00Z',
    dwellTime: 1,
    weight: 20000,
  },
  {
    id: '8',
    containerNumber: 'YMLU4455667',
    size: '20ft',
    type: 'flat-rack',
    movementType: 'domestic',
    status: 'gate-in',
    shippingLine: 'Yang Ming',
    customer: 'Machinery World',
    weight: 35000,
  },
];

// Vehicles
export const dummyVehicles: Vehicle[] = [
  { id: '1', vehicleNumber: 'TN-01-AB-1234', driverName: 'Ramesh Kumar', driverPhone: '+91 98765 43210', type: 'truck', status: 'active', gpsDeviceId: 'GPS001', currentLocation: 'Gate A' },
  { id: '2', vehicleNumber: 'TN-02-CD-5678', driverName: 'Suresh Patel', driverPhone: '+91 87654 32109', type: 'trailer', status: 'active', gpsDeviceId: 'GPS002', currentLocation: 'Yard Block B' },
  { id: '3', vehicleNumber: 'TN-03-EF-9012', driverName: 'Vijay Singh', driverPhone: '+91 76543 21098', type: 'truck', status: 'inactive' },
  { id: '4', vehicleNumber: 'TN-04-GH-3456', driverName: 'Anil Sharma', driverPhone: '+91 65432 10987', type: 'chassis', status: 'maintenance' },
];

// Equipment
export const dummyEquipment: Equipment[] = [
  { id: '1', name: 'RS-001', type: 'reach-stacker', status: 'operational', lastMaintenance: '2024-01-15', nextMaintenance: '2024-02-15', operator: 'Operator A' },
  { id: '2', name: 'RS-002', type: 'reach-stacker', status: 'operational', lastMaintenance: '2024-01-10', nextMaintenance: '2024-02-10', operator: 'Operator B' },
  { id: '3', name: 'FL-001', type: 'forklift', status: 'maintenance', lastMaintenance: '2024-01-18', nextMaintenance: '2024-01-25' },
  { id: '4', name: 'CR-001', type: 'crane', status: 'operational', lastMaintenance: '2024-01-05', nextMaintenance: '2024-02-05', operator: 'Operator C' },
  { id: '5', name: 'SC-001', type: 'straddle-carrier', status: 'down', lastMaintenance: '2024-01-01' },
];

// Surveys
export const dummySurveys: Survey[] = [
  {
    id: '1',
    containerId: '4',
    containerNumber: 'EITU5432109',
    surveyorId: '4',
    surveyorName: 'Lisa Surveyor',
    status: 'pending',
    priority: 'urgent',
    location: 'Block C',
    createdAt: '2024-01-21T09:00:00Z',
  },
  {
    id: '2',
    containerId: '1',
    containerNumber: 'MSCU1234567',
    surveyorId: '4',
    surveyorName: 'Lisa Surveyor',
    status: 'completed',
    priority: 'normal',
    location: 'Block A',
    createdAt: '2024-01-20T14:00:00Z',
    completedAt: '2024-01-20T15:30:00Z',
    findings: {
      exteriorCondition: 'good',
      doorCondition: 'good',
      floorCondition: 'fair',
      structuralDamage: false,
      recommendation: 'clear',
      description: 'Minor scratches on exterior, overall good condition',
      photos: ['photo1.jpg', 'photo2.jpg'],
    },
  },
  {
    id: '3',
    containerId: '3',
    containerNumber: 'CMAU9876543',
    surveyorId: '4',
    surveyorName: 'Lisa Surveyor',
    status: 'in-progress',
    priority: 'normal',
    location: 'Block B',
    createdAt: '2024-01-21T08:00:00Z',
  },
];

// Gate Operations
export const dummyGateOperations: GateOperation[] = [
  { id: '1', type: 'gate-in', containerId: '8', containerNumber: 'YMLU4455667', vehicleNumber: 'TN-01-AB-1234', driverName: 'Ramesh Kumar', purpose: 'factory', status: 'completed', timestamp: '2024-01-21T08:00:00Z' },
  { id: '2', type: 'gate-out', containerId: '2', containerNumber: 'HLCU7654321', vehicleNumber: 'TN-02-CD-5678', driverName: 'Suresh Patel', purpose: 'port', status: 'pending', timestamp: '2024-01-21T10:30:00Z' },
  { id: '3', type: 'gate-in', containerId: '1', containerNumber: 'MSCU1234567', vehicleNumber: 'TN-01-AB-1234', driverName: 'Ramesh Kumar', purpose: 'port', status: 'completed', timestamp: '2024-01-20T08:30:00Z' },
  { id: '4', type: 'gate-out', containerId: '5', containerNumber: 'OOLU3210987', vehicleNumber: 'TN-03-EF-9012', driverName: 'Vijay Singh', purpose: 'factory', status: 'approved', timestamp: '2024-01-21T11:00:00Z', approvedBy: 'Sarah Manager' },
];

// Stuffing Operations
export const dummyStuffingOperations: StuffingOperation[] = [
  { id: '1', type: 'stuffing', containerId: '7', containerNumber: 'KKFU1122334', status: 'pending', location: 'terminal', scheduledDate: '2024-01-22T09:00:00Z' },
  { id: '2', type: 'destuffing', containerId: '1', containerNumber: 'MSCU1234567', status: 'in-progress', location: 'terminal', scheduledDate: '2024-01-21T14:00:00Z' },
  { id: '3', type: 'stuffing', containerId: '5', containerNumber: 'OOLU3210987', status: 'completed', location: 'factory', scheduledDate: '2024-01-20T10:00:00Z', completedDate: '2024-01-20T16:00:00Z' },
];

// Bills
export const dummyBills: Bill[] = [
  {
    id: '1',
    billNumber: 'INV-2024-001',
    containerId: '1',
    containerNumber: 'MSCU1234567',
    shippingLine: 'Maersk Line',
    customer: 'ABC Manufacturing',
    activities: [
      { id: '1', name: 'Handling Charges', quantity: 1, unitPrice: 5000, amount: 5000 },
      { id: '2', name: 'Storage (3 days)', quantity: 3, unitPrice: 1000, amount: 3000 },
      { id: '3', name: 'Lift On/Off', quantity: 2, unitPrice: 1500, amount: 3000 },
    ],
    totalAmount: 11000,
    status: 'pending',
    generatedAt: '2024-01-21T09:00:00Z',
    dueDate: '2024-02-05T00:00:00Z',
  },
  {
    id: '2',
    billNumber: 'INV-2024-002',
    containerId: '3',
    containerNumber: 'CMAU9876543',
    shippingLine: 'CMA CGM',
    activities: [
      { id: '1', name: 'Handling Charges', quantity: 1, unitPrice: 5000, amount: 5000 },
      { id: '2', name: 'Storage (5 days)', quantity: 5, unitPrice: 1000, amount: 5000 },
    ],
    totalAmount: 10000,
    status: 'paid',
    generatedAt: '2024-01-20T10:00:00Z',
    dueDate: '2024-02-04T00:00:00Z',
    paidAt: '2024-01-21T08:00:00Z',
  },
];

// Pre-Deposit Accounts
export const dummyPDAs: PreDepositAccount[] = [
  {
    id: '1',
    shippingLine: 'Maersk Line',
    balance: 500000,
    lastUpdated: '2024-01-21T10:00:00Z',
    transactions: [
      { id: '1', type: 'credit', amount: 100000, description: 'Deposit received', timestamp: '2024-01-21T10:00:00Z', balanceAfter: 500000 },
      { id: '2', type: 'debit', amount: 11000, description: 'Invoice INV-2024-001', timestamp: '2024-01-20T15:00:00Z', balanceAfter: 400000 },
      { id: '3', type: 'credit', amount: 200000, description: 'Deposit received', timestamp: '2024-01-15T09:00:00Z', balanceAfter: 411000 },
    ],
  },
  {
    id: '2',
    shippingLine: 'Hapag-Lloyd',
    balance: 350000,
    lastUpdated: '2024-01-20T14:00:00Z',
    transactions: [
      { id: '1', type: 'debit', amount: 8000, description: 'Invoice INV-2024-003', timestamp: '2024-01-20T14:00:00Z', balanceAfter: 350000 },
      { id: '2', type: 'credit', amount: 150000, description: 'Deposit received', timestamp: '2024-01-10T11:00:00Z', balanceAfter: 358000 },
    ],
  },
  {
    id: '3',
    shippingLine: 'CMA CGM',
    balance: 275000,
    lastUpdated: '2024-01-21T08:00:00Z',
    transactions: [
      { id: '1', type: 'debit', amount: 10000, description: 'Invoice INV-2024-002', timestamp: '2024-01-21T08:00:00Z', balanceAfter: 275000 },
    ],
  },
];

// Approvals
export const dummyApprovals: Approval[] = [
  {
    id: '1',
    type: 'gate-out',
    requestId: '2',
    status: 'pending',
    requestedBy: 'Mike Operator',
    requestedAt: '2024-01-21T10:30:00Z',
    details: { containerNumber: 'HLCU7654321', destination: 'Chennai Port', vehicleNumber: 'TN-02-CD-5678' },
  },
  {
    id: '2',
    type: 'damage-clearance',
    requestId: '1',
    status: 'pending',
    requestedBy: 'Lisa Surveyor',
    requestedAt: '2024-01-21T09:15:00Z',
    details: { containerNumber: 'EITU5432109', damageType: 'Roof dent', recommendation: 'Minor repair' },
  },
  {
    id: '3',
    type: 'stuffing',
    requestId: '1',
    status: 'approved',
    requestedBy: 'Mike Operator',
    requestedAt: '2024-01-20T16:00:00Z',
    approvedBy: 'Sarah Manager',
    approvedAt: '2024-01-20T17:00:00Z',
    details: { containerNumber: 'KKFU1122334', operation: 'Stuffing', location: 'Terminal' },
  },
];

// Audit Logs
export const dummyAuditLogs: AuditLog[] = [
  { id: '1', userId: '3', userName: 'Mike Operator', action: 'Gate In', module: 'Gate Operations', details: 'Container YMLU4455667 gate in completed', timestamp: '2024-01-21T08:00:00Z', ipAddress: '192.168.1.100' },
  { id: '2', userId: '2', userName: 'Sarah Manager', action: 'Approval', module: 'Approvals', details: 'Approved stuffing request for KKFU1122334', timestamp: '2024-01-20T17:00:00Z', ipAddress: '192.168.1.101' },
  { id: '3', userId: '4', userName: 'Lisa Surveyor', action: 'Survey Complete', module: 'Surveys', details: 'Completed survey for MSCU1234567', timestamp: '2024-01-20T15:30:00Z', ipAddress: '192.168.1.102' },
  { id: '4', userId: '1', userName: 'John Admin', action: 'User Created', module: 'User Management', details: 'Created new operator account', timestamp: '2024-01-19T10:00:00Z', ipAddress: '192.168.1.103' },
];

// Notifications
export const dummyNotifications: Notification[] = [
  { id: '1', type: 'alert', title: 'Damaged Container', message: 'Container EITU5432109 reported with damage', read: false, timestamp: '2024-01-21T09:00:00Z', link: '/terminal/admin/containers/4' },
  { id: '2', type: 'warning', title: 'Pending Approval', message: '3 gate-out requests pending approval', read: false, timestamp: '2024-01-21T10:30:00Z', link: '/terminal/admin/approvals' },
  { id: '3', type: 'info', title: 'Equipment Maintenance', message: 'Forklift FL-001 scheduled for maintenance', read: true, timestamp: '2024-01-20T16:00:00Z' },
  { id: '4', type: 'success', title: 'Payment Received', message: 'Payment of ₹10,000 received from CMA CGM', read: true, timestamp: '2024-01-21T08:00:00Z' },
];

// Yard Blocks
export const dummyYardBlocks: YardBlock[] = [
  { id: '1', name: 'Block A', capacity: 200, occupied: 156, rows: 10, bays: 10, tiers: 4 },
  { id: '2', name: 'Block B', capacity: 200, occupied: 142, rows: 10, bays: 10, tiers: 4 },
  { id: '3', name: 'Block C', capacity: 150, occupied: 98, rows: 8, bays: 10, tiers: 4 },
  { id: '4', name: 'Block R (Reefer)', capacity: 50, occupied: 35, rows: 5, bays: 5, tiers: 2 },
  { id: '5', name: 'Block D', capacity: 180, occupied: 120, rows: 9, bays: 10, tiers: 4 },
];

// KPI Data
export const dummyKPIData: KPIData = {
  totalContainersInYard: 551,
  containersInTransit: 48,
  gateInToday: 24,
  gateOutToday: 18,
  yardUtilization: 70.6,
  pendingApprovals: 5,
  pendingSurveys: 3,
  tasksToday: 12,
};

// Chart Data
export const dummyGateMovementsData: ChartDataPoint[] = [
  { name: 'Mon', gateIn: 22, gateOut: 18 },
  { name: 'Tue', gateIn: 28, gateOut: 24 },
  { name: 'Wed', gateIn: 25, gateOut: 22 },
  { name: 'Thu', gateIn: 30, gateOut: 26 },
  { name: 'Fri', gateIn: 24, gateOut: 20 },
  { name: 'Sat', gateIn: 18, gateOut: 15 },
  { name: 'Sun', gateIn: 12, gateOut: 10 },
];

export const dummyDwellTimeData: ChartDataPoint[] = [
  { name: '0-2 days', value: 180 },
  { name: '3-5 days', value: 220 },
  { name: '6-10 days', value: 95 },
  { name: '11-15 days', value: 40 },
  { name: '>15 days', value: 16 },
];

export const dummyYardUtilizationData: ChartDataPoint[] = [
  { name: 'Block A', utilization: 78, capacity: 200 },
  { name: 'Block B', utilization: 71, capacity: 200 },
  { name: 'Block C', utilization: 65, capacity: 150 },
  { name: 'Block R', utilization: 70, capacity: 50 },
  { name: 'Block D', utilization: 67, capacity: 180 },
];

// Activity Feed
export const dummyActivityFeed = [
  { id: '1', action: 'Gate In', description: 'Container YMLU4455667 entered via Gate A', time: '10 minutes ago', type: 'gate' },
  { id: '2', action: 'Survey Assigned', description: 'Survey assigned for EITU5432109', time: '25 minutes ago', type: 'survey' },
  { id: '3', action: 'Approval Pending', description: 'Gate-out request for HLCU7654321', time: '1 hour ago', type: 'approval' },
  { id: '4', action: 'Payment Received', description: 'CMA CGM paid invoice INV-2024-002', time: '2 hours ago', type: 'payment' },
  { id: '5', action: 'Container Shifted', description: 'MSCU1234567 moved to Block A, Row 01', time: '3 hours ago', type: 'yard' },
];

// Shipping Lines
export const dummyShippingLines = [
  { id: '1', name: 'Maersk Line', code: 'MAEU', containerCount: 85 },
  { id: '2', name: 'Hapag-Lloyd', code: 'HLCU', containerCount: 62 },
  { id: '3', name: 'CMA CGM', code: 'CMAU', containerCount: 78 },
  { id: '4', name: 'Evergreen', code: 'EITU', containerCount: 45 },
  { id: '5', name: 'OOCL', code: 'OOLU', containerCount: 38 },
  { id: '6', name: 'NYK Line', code: 'NYKU', containerCount: 52 },
  { id: '7', name: 'K Line', code: 'KKFU', containerCount: 41 },
  { id: '8', name: 'Yang Ming', code: 'YMLU', containerCount: 55 },
];

// Customers
export const dummyCustomers = [
  { id: '1', name: 'ABC Manufacturing', type: 'factory', containerCount: 12 },
  { id: '2', name: 'XYZ Foods', type: 'factory', containerCount: 8 },
  { id: '3', name: 'Heavy Industries Ltd', type: 'factory', containerCount: 5 },
  { id: '4', name: 'Chemical Corp', type: 'factory', containerCount: 6 },
  { id: '5', name: 'Global Traders', type: 'forwarder', containerCount: 15 },
  { id: '6', name: 'Fresh Produce Inc', type: 'factory', containerCount: 4 },
  { id: '7', name: 'Machinery World', type: 'customer', containerCount: 3 },
];

// Activity Charges Configuration
export const dummyActivityCharges = [
  { id: '1', activity: 'Handling (20ft)', rate: 3500, unit: 'per container' },
  { id: '2', activity: 'Handling (40ft)', rate: 5000, unit: 'per container' },
  { id: '3', activity: 'Storage (20ft)', rate: 800, unit: 'per day' },
  { id: '4', activity: 'Storage (40ft)', rate: 1000, unit: 'per day' },
  { id: '5', activity: 'Lift On/Off (20ft)', rate: 1200, unit: 'per lift' },
  { id: '6', activity: 'Lift On/Off (40ft)', rate: 1500, unit: 'per lift' },
  { id: '7', activity: 'Stuffing (20ft)', rate: 4000, unit: 'per container' },
  { id: '8', activity: 'Stuffing (40ft)', rate: 6000, unit: 'per container' },
  { id: '9', activity: 'Destuffing (20ft)', rate: 4000, unit: 'per container' },
  { id: '10', activity: 'Destuffing (40ft)', rate: 6000, unit: 'per container' },
  { id: '11', activity: 'Reefer Monitoring', rate: 2000, unit: 'per day' },
  { id: '12', activity: 'Hazmat Handling', rate: 8000, unit: 'per container' },
];

// Tasks
export const dummyTasks = [
  { id: '1', type: 'gate-in', description: 'Process gate-in for NYKU8765432', status: 'pending', priority: 'normal', assignedTo: 'Mike Operator', createdAt: '2024-01-21T08:00:00Z' },
  { id: '2', type: 'yard-shift', description: 'Shift MSCU1234567 to Block A, Row 02', status: 'in-progress', priority: 'normal', assignedTo: 'Mike Operator', createdAt: '2024-01-21T09:00:00Z' },
  { id: '3', type: 'stuffing', description: 'Complete stuffing for KKFU1122334', status: 'pending', priority: 'urgent', assignedTo: 'Mike Operator', createdAt: '2024-01-21T07:00:00Z' },
  { id: '4', type: 'equipment', description: 'Assign RS-001 to Block B operations', status: 'completed', priority: 'normal', assignedTo: 'Mike Operator', createdAt: '2024-01-21T06:00:00Z' },
];

// Container Nominations (Shipping Line)
export const dummyNominations = [
  { id: '1', containerNumber: 'MSCU1234567', shippingLine: 'MSC', customer: 'ABC Manufacturing', factory: 'ABC Factory Chennai', location: 'Chennai', distance: '45 km', size: '40ft', type: 'standard', movementType: 'export', status: 'pending', nominatedAt: '2024-01-21T08:00:00Z', truckNumber: 'TN-01-AB-1234', driverName: 'Rajesh Kumar', driverPhone: '+91 9876543210' },
  { id: '2', containerNumber: 'HLCU7654321', shippingLine: 'Hapag-Lloyd', customer: 'XYZ Foods', factory: 'XYZ Cold Storage', location: 'Bangalore', distance: '320 km', size: '20ft', type: 'reefer', movementType: 'import', status: 'pending', nominatedAt: '2024-01-20T14:00:00Z', truckNumber: 'KA-01-CD-5678', driverName: 'Suresh Babu', driverPhone: '+91 9876543211' },
  { id: '3', containerNumber: 'NYKU8765432', shippingLine: 'NYK Line', customer: 'Delta Electronics', factory: 'Delta Assembly Unit', location: 'Hosur', distance: '65 km', size: '40ft', type: 'standard', movementType: 'export', status: 'approved', nominatedAt: '2024-01-19T10:00:00Z', truckNumber: 'TN-02-EF-9012', driverName: 'Vinod Sharma', driverPhone: '+91 9876543212', approvedAt: '2024-01-19T11:30:00Z', approvedBy: 'Mike Operator' },
  { id: '4', containerNumber: 'KKFU1122334', shippingLine: 'Evergreen', customer: 'Global Textiles', factory: 'Global Spinning Mill', location: 'Coimbatore', distance: '180 km', size: '20ft', type: 'standard', movementType: 'domestic', status: 'pending', nominatedAt: '2024-01-21T06:30:00Z', truckNumber: 'TN-03-GH-3456', driverName: 'Arun Prasad', driverPhone: '+91 9876543213' },
  { id: '5', containerNumber: 'MSKU5544332', shippingLine: 'Maersk', customer: 'Pharma Solutions', factory: 'Pharma Cold Chain', location: 'Oragadam', distance: '35 km', size: '40ft', type: 'reefer', movementType: 'import', status: 'rejected', nominatedAt: '2024-01-18T09:00:00Z', truckNumber: 'TN-04-IJ-7890', driverName: 'Karthik Raj', driverPhone: '+91 9876543214', rejectedAt: '2024-01-18T10:00:00Z', rejectedBy: 'Mike Operator', rejectionReason: 'Container not cleared by customs' },
];

// Customer Requests
export const dummyCustomerRequests = [
  { id: '1', type: 'stuffing', containerNumber: 'MSCU1234567', location: 'factory', preferredDate: '2024-01-25', status: 'pending', remarks: 'Please schedule in morning hours', createdAt: '2024-01-21T10:00:00Z' },
  { id: '2', type: 'gate-out', containerNumber: 'HLCU7654321', location: 'terminal', preferredDate: '2024-01-22', status: 'approved', remarks: '', createdAt: '2024-01-20T15:00:00Z' },
];
