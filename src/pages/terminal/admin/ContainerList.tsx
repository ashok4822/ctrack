import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable, Column } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { adminNavItems } from '@/config/navigation';
import { Button } from '@/components/ui/button';
import { dummyContainers } from '@/data/dummyData';
import type { Container } from '@/types';
import { Plus, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AddContainerDialog } from '@/components/containers/AddContainerDialog';

const columns: Column<Container>[] = [
  {
    key: 'containerNumber',
    header: 'Container No.',
    sortable: true,
    render: (item) => (
      <span className="font-medium text-foreground">{item.containerNumber}</span>
    ),
  },
  {
    key: 'size',
    header: 'Size',
    sortable: true,
  },
  {
    key: 'type',
    header: 'Type',
    sortable: true,
    render: (item) => <span className="capitalize">{item.type}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (item) => <StatusBadge status={item.status} />,
  },
  {
    key: 'shippingLine',
    header: 'Shipping Line',
    sortable: true,
  },
  {
    key: 'yardLocation',
    header: 'Location',
    render: (item) =>
      item.yardLocation
        ? item.yardLocation.block
        : '-',
  },
  {
    key: 'dwellTime',
    header: 'Dwell (days)',
    sortable: true,
    render: (item) => item.dwellTime ?? '-',
  },
  {
    key: 'actions',
    header: 'Actions',
    render: (item) => (
      <Button variant="ghost" size="sm">
        <Eye className="h-4 w-4 mr-1" />
        View
      </Button>
    ),
  },
];

export default function ContainerList() {
  const navigate = useNavigate();
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const handleAddContainer = (data: any) => {
    // In a real app, this would add to the database
    console.log('New container:', data);
  };

  return (
    <DashboardLayout
      navItems={adminNavItems}
      pageTitle="Container Management"
      pageActions={
        <Button className="gap-2" onClick={() => setAddDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Container
        </Button>
      }
    >
      <DataTable
        data={dummyContainers}
        columns={columns}
        searchPlaceholder="Search containers..."
        onRowClick={(item) => navigate(`/admin/containers/${item.id}`)}
      />

      <AddContainerDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={handleAddContainer}
      />
    </DashboardLayout>
  );
}
