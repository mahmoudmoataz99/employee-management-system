import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Mail, Phone, Calendar, DollarSign, Building2, FolderTree, MapPin } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { DetailRow, DetailSection } from '@/components/ui/DetailRow';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { useData } from '@/context/DataContext';

export default function EmployeeViewPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getEmployee, getCompany, getDepartment } = useData();

  const employee = id ? getEmployee(id) : undefined;
  const company = employee ? getCompany(employee.companyId) : undefined;
  const department = employee ? getDepartment(employee.departmentId) : undefined;

  if (!employee) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-lg text-muted-foreground">Employee not found</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/employees')}>
            Back to Employees
          </Button>
        </div>
      </MainLayout>
    );
  }

  const formatSalary = (salary?: number) => {
    if (!salary) return 'Not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(salary);
  };

  return (
    <MainLayout>
      <PageHeader
        title={employee.employeeName}
        description={employee.designation}
        action={
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/employees')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button onClick={() => navigate(`/employees/${id}/edit`)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <DetailSection title="Personal Information">
            <DetailRow label="Full Name" value={employee.employeeName} />
            <DetailRow
              label="Email"
              value={
                <a href={`mailto:${employee.email}`} className="text-primary hover:underline">
                  {employee.email}
                </a>
              }
            />
            <DetailRow label="Phone" value={employee.mobileNumber} />
            <DetailRow label="Address" value={employee.address} />
            <DetailRow label="Status" value={<StatusBadge status={employee.status} />} />
          </DetailSection>

          <DetailSection title="Employment Details">
            <DetailRow label="Position" value={employee.designation} />
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
            <DetailRow
              label="Department"
              value={
                department ? (
                  <button
                    onClick={() => navigate(`/departments/${department.id}`)}
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <FolderTree className="h-4 w-4" />
                    {department.departmentName}
                  </button>
                ) : 'Unknown'
              }
            />
            <DetailRow label="Hire Date" value={new Date(employee.hiredOn).toLocaleDateString()} />
            <DetailRow label="Salary" value={formatSalary(employee.salary)} />
          </DetailSection>
        </div>

        <div className="space-y-6">
          {/* Employee Card */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm text-center">
            <h3 className="text-lg font-semibold text-foreground">
              {employee.employeeName}
            </h3>
            <p className="text-sm text-muted-foreground">{employee.designation}</p>
            <div className="mt-3">
              <StatusBadge status={employee.status} />
            </div>
          </div>

          {/* Quick Info */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Quick Info</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground truncate">{employee.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{employee.mobileNumber}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground line-clamp-2">{employee.address}</span>
              </div>
              {company && (
                <div className="flex items-center gap-3 text-sm">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{company.companyName}</span>
                </div>
              )}
              {department && (
                <div className="flex items-center gap-3 text-sm">
                  <FolderTree className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{department.departmentName}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">Hired {new Date(employee.hiredOn).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
