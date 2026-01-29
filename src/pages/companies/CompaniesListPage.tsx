import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Pencil, Trash2, Building2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { useData } from '@/context/DataContext';
import { Company } from '@/types';

export default function CompaniesListPage() {
  const navigate = useNavigate();
  const { companies, departments, employees, deleteCompany } = useData();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const companyToDelete = deleteId ? companies.find(c => c.id === deleteId) : null;

  const columns = [
    {
      header: 'Company',
      accessor: (company: Company) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">{company.companyName}</p>
          </div>
        </div>
      ),
    },

    {
      header: 'Departments',
      accessor: (company: Company) => {
        return <span className="font-medium">{company.numberOfDepartments}</span>;
      },
    },
    {
      header: 'Employees',
      accessor: (company: Company) => {
        return <span className="font-medium">{company.numberOfEmployees}</span>;
      },
    },
    {
      header: 'Actions',
      accessor: (company: Company) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/companies/${company.id}`);
            }}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/companies/${company.id}/edit`);
            }}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteId(company.id);
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
        title="Companies"
        description="Manage all companies in your organization"
        action={
          <Button onClick={() => navigate('/companies/create')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Company
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={companies}
        onRowClick={(company) => navigate(`/companies/${company.id}`)}
        emptyMessage="No companies found. Create your first company to get started."
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deleteCompany(deleteId);
          }
        }}
        title="Delete Company"
        message={`Are you sure you want to delete "${companyToDelete?.companyName}"? This will also delete all associated departments and employees. This action cannot be undone.`}
        confirmLabel="Delete Company"
        variant="danger"
      />
    </MainLayout>
  );
}
