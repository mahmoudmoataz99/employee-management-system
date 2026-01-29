import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Building2, Globe, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { DetailRow, DetailSection } from '@/components/ui/DetailRow';
import { Button } from '@/components/ui/button';
import { useData } from '@/context/DataContext';

export default function CompanyViewPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getCompany, getDepartmentsByCompany, getEmployeesByCompany } = useData();

  const company = id ? getCompany(id) : undefined;
  const departments = id ? getDepartmentsByCompany(id) : [];
  const employees = id ? getEmployeesByCompany(id) : [];

  if (!company) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-lg text-muted-foreground">Company not found</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/companies')}>
            Back to Companies
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title={company.companyName}
        description="Company details and management"
        action={
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/companies')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button onClick={() => navigate(`/companies/${id}/edit`)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <DetailSection title="Company Information">
            <DetailRow label="Company Name" value={company.companyName} />
          </DetailSection>

          {/* Departments List */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Departments</h3>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                {departments.length}
              </span>
            </div>
            {departments.length > 0 ? (
              <div className="space-y-2">
                {departments.map(dept => (
                  <div
                    key={dept.id}
                    onClick={() => navigate(`/departments/${dept.id}`)}
                    className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <div>
                      <p className="font-medium text-foreground">{dept.departmentName}</p>
                      {dept.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1">{dept.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">No departments yet</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Stats */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-4 shadow-sm">
                <p className="text-2xl font-bold text-foreground">{company.numberOfDepartments}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Departments</p>
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-4 shadow-sm">
                <p className="text-2xl font-bold text-foreground">{company.numberOfEmployees}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Employees</p>
              </div>
              <div className="flex items-center justify-between col-span-2">
                <span className="text-muted-foreground">Active Employees</span>
                <span className="text-xl font-bold text-success">
                  {employees.filter(e => e.status === 'active').length}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Employees */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Recent Employees</h3>
            {employees.length > 0 ? (
              <div className="space-y-3">
                {employees.slice(0, 5).map(emp => (
                  <div
                    key={emp.id}
                    onClick={() => navigate(`/employees/${emp.id}`)}
                    className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {emp.employeeName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {emp.employeeName}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">{emp.designation}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">No employees yet</p>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
