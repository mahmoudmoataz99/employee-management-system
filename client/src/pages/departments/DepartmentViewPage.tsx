import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Building2, Users } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { DetailRow, DetailSection } from '@/components/ui/DetailRow';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { useData } from '@/context/DataContext';

export default function DepartmentViewPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getDepartment, getCompany, getEmployeesByDepartment } = useData();

  const department = id ? getDepartment(id) : undefined;
  const company = department ? getCompany(department.companyId) : undefined;
  const employees = id ? getEmployeesByDepartment(id) : [];

  if (!department) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-lg text-muted-foreground">Department not found</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/departments')}>
            Back to Departments
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title={department.departmentName}
        description="Department details and information"
        action={
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/departments')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button onClick={() => navigate(`/departments/${id}/edit`)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <DetailSection title="Department Information">
            <DetailRow label="Department Name" value={department.departmentName} />
            <DetailRow
              label="Company"
              value={
                company ? (
                  <button
                    onClick={() => navigate(`/companies/${company.id}`)}
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <Building2 className="h-4 w-4" />
                    {company.companyName}
                  </button>
                ) : 'Unknown'
              }
            />
            <DetailRow label="Description" value={department.description || 'No description'} />
            <DetailRow label="Created" value={new Date(department.createdAt).toLocaleDateString()} />
          </DetailSection>

          {/* Employees List */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Employees</h3>
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-4 shadow-sm">
                <p className="text-2xl font-bold text-foreground">{department.numberOfEmployees}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Employees</p>
              </div>
            </div>
            {employees.length > 0 ? (
              <div className="space-y-2">
                {employees.map(emp => (
                  <div
                    key={emp.id}
                    onClick={() => navigate(`/employees/${emp.id}`)}
                    className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium text-foreground">{emp.employeeName}</p>
                        <p className="text-sm text-muted-foreground">{emp.designation}</p>
                      </div>
                    </div>
                    <StatusBadge status={emp.status} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">No employees in this department</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Stats */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Statistics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Employees</span>
                <span className="text-xl font-bold text-foreground">{employees.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Active</span>
                <span className="text-xl font-bold text-success">
                  {employees.filter(e => e.status === 'active').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">On Leave</span>
                <span className="text-xl font-bold text-warning">
                  {employees.filter(e => e.status === 'on_leave').length}
                </span>
              </div>
            </div>
          </div>

          {/* Company Info */}
          {company && (
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-foreground">Parent Company</h3>
              <div
                onClick={() => navigate(`/companies/${company.id}`)}
                className="rounded-lg border border-border p-4 hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <p className="font-medium text-foreground">{company.companyName}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
