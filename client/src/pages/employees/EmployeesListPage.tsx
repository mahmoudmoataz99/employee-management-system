import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Pencil, Trash2, Users } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { useData } from '@/context/DataContext';
import { Employee } from '@/types';

export default function EmployeesListPage() {
  const navigate = useNavigate();
  const { employees, companies, departments, deleteEmployee } = useData();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const employeeToDelete = deleteId ? employees.find(e => e.id === deleteId) : null;

  const columns = [
    {
      header: 'Employee',
      accessor: (employee: Employee) => (
        <div className="flex items-center gap-3">
          <div>
            <p className="font-medium text-foreground">{employee.employeeName}</p>
            <p className="text-sm text-muted-foreground">{employee.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Position',
      accessor: 'designation' as keyof Employee,
    },
    {
      header: 'Company',
      accessor: (employee: Employee) => {
        const company = companies.find(c => c.id === employee.companyId);
        return company?.companyName || 'Unknown';
      },
    },
    {
      header: 'Department',
      accessor: (employee: Employee) => {
        const department = departments.find(d => d.id === employee.departmentId);
        return department?.departmentName || 'Unknown';
      },
    },
    {
      header: 'Status',
      accessor: (employee: Employee) => <StatusBadge status={employee.status} />,
    },
    {
      header: 'Actions',
      accessor: (employee: Employee) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/employees/${employee.id}`);
            }}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/employees/${employee.id}/edit`);
            }}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteId(employee.id);
            }}
            className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
      className: 'w-32',
    },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Employees"
        description="Manage all employees in your organization"
        action={
          <Button onClick={() => navigate('/employees/create')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={employees}
        onRowClick={(employee) => navigate(`/employees/${employee.id}`)}
        emptyMessage="No employees found. Create your first employee to get started."
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deleteEmployee(deleteId);
          }
        }}
        title="Delete Employee"
        message={`Are you sure you want to delete "${employeeToDelete?.employeeName} "? This action cannot be undone.`}
        confirmLabel="Delete Employee"
        variant="danger"
      />
    </MainLayout>
  );
}
