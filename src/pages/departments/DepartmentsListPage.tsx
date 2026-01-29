import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Pencil, Trash2, FolderTree, Building2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { useData } from '@/context/DataContext';
import { Department } from '@/types';

export default function DepartmentsListPage() {
  const navigate = useNavigate();
  const { departments, companies, employees, deleteDepartment } = useData();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const departmentToDelete = deleteId ? departments.find(d => d.id === deleteId) : null;

  const columns = [
    {
      header: 'Department',
      accessor: (department: Department) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
            <FolderTree className="h-5 w-5 text-success" />
          </div>
          <div>
            <p className="font-medium text-foreground">{department.departmentName}</p>
            {department.description && (
              <p className="text-sm text-muted-foreground line-clamp-1">{department.description}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'Company',
      accessor: (department: Department) => {
        const company = companies.find(c => c.id === department.companyId);
        return (
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span>{company?.companyName || 'Unknown'}</span>
          </div>
        );
      },
    },
    {
      header: 'Employees',
      accessor: (department: Department) => {
        return <span className="font-medium">{department.numberOfEmployees}</span>;
      },
    },
    {
      header: 'Created',
      accessor: (department: Department) => new Date(department.createdAt).toLocaleDateString(),
    },
    {
      header: 'Actions',
      accessor: (department: Department) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/departments/${department.id}`);
            }}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/departments/${department.id}/edit`);
            }}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteId(department.id);
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
        title="Departments"
        description="Manage all departments across your organization"
        action={
          <Button onClick={() => navigate('/departments/create')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Department
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={departments}
        onRowClick={(department) => navigate(`/departments/${department.id}`)}
        emptyMessage="No departments found. Create your first department to get started."
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (deleteId) {
            try {
              await deleteDepartment(deleteId);
            } catch (err) {
              console.error('Error deleting department:', err);
            } finally {
              setDeleteId(null);
            }
          }
        }}
        title="Delete Department"
        message={`Are you sure you want to delete "${departmentToDelete?.departmentName}"? This will also remove all employees from this department. This action cannot be undone.`}
        confirmLabel="Delete Department"
        variant="danger"
      />
    </MainLayout>
  );
}
