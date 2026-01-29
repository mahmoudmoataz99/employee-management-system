import { Building2, Users, FolderTree, UserCheck, UserX, Clock } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const { companies, departments, employees } = useData();

  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const onLeaveEmployees = employees.filter(e => e.status === 'on_leave').length;
  const terminatedEmployees = employees.filter(e => e.status === 'terminated').length;
  const resignedEmployees = employees.filter(e => e.status === 'resigned').length;
  const pendingEmployees = employees.filter(e => e.status === 'pending').length;

  // Get recent employees (last 5)
  const recentEmployees = [...employees]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <MainLayout>
      <PageHeader
        title={`Welcome back, ${user?.firstName || 'User'}!`}
        description="Here's an overview of your organization"
      />

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Companies"
          value={companies.length}
          icon={Building2}
          color="primary"
        />
        <StatCard
          title="Total Departments"
          value={departments.length}
          icon={FolderTree}
          color="success"
        />
        <StatCard
          title="Total Employees"
          value={employees.length}
          icon={Users}
          color="warning"
        />
        <StatCard
          title="Active Employees"
          value={activeEmployees}
          icon={UserCheck}
          color="success"
        />
      </div>

      {/* Charts and Details */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Employee Status Breakdown */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Employee Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-success" />
                <span className="text-sm text-foreground">Active</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-foreground">{activeEmployees}</span>
                <span className="text-sm text-muted-foreground">
                  ({employees.length ? Math.round((activeEmployees / employees.length) * 100) : 0}%)
                </span>
              </div>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-success transition-all duration-500"
                style={{ width: `${employees.length ? (activeEmployees / employees.length) * 100 : 0}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-warning" />
                <span className="text-sm text-foreground">On Leave</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-foreground">{onLeaveEmployees}</span>
                <span className="text-sm text-muted-foreground">
                  ({employees.length ? Math.round((onLeaveEmployees / employees.length) * 100) : 0}%)
                </span>
              </div>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-warning transition-all duration-500"
                style={{ width: `${employees.length ? (onLeaveEmployees / employees.length) * 100 : 0}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-info" />
                <span className="text-sm text-foreground">Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-foreground">{pendingEmployees}</span>
              </div>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-info transition-all duration-500"
                style={{ width: `${employees.length ? (pendingEmployees / employees.length) * 100 : 0}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-destructive" />
                <span className="text-sm text-foreground">Terminated</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-foreground">{terminatedEmployees}</span>
              </div>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-destructive transition-all duration-500"
                style={{ width: `${employees.length ? (terminatedEmployees / employees.length) * 100 : 0}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-muted-foreground" />
                <span className="text-sm text-foreground">Resigned</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-foreground">{resignedEmployees}</span>
              </div>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-muted-foreground transition-all duration-500"
                style={{ width: `${employees.length ? (resignedEmployees / employees.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Company Overview */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Companies Overview</h3>
          <div className="space-y-3">
            {companies.map(company => {
              const companyEmployees = employees.filter(e => e.companyId === company.id).length;
              const companyDepts = departments.filter(d => d.companyId === company.id).length;
              return (
                <div key={company.id} className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-medium text-foreground">{company.companyName}</p>
                    <p className="text-sm text-muted-foreground">{company.numberOfDepartments} departments</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">{company.numberOfEmployees}</span>
                  </div>
                </div>
              );
            })}
            {companies.length === 0 && (
              <p className="text-center text-muted-foreground py-4">No companies yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Employees */}
      <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Recent Employees</h3>
        <div className="space-y-3">
          {recentEmployees.map(employee => {
            const company = companies.find(c => c.id === employee.companyId);
            const department = departments.find(d => d.id === employee.departmentId);
            return (
              <div key={employee.id} className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                    {employee.employeeName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{employee.employeeName}</p>
                    <p className="text-sm text-muted-foreground">{employee.designation}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-foreground">{company?.companyName}</p>
                  <p className="text-xs text-muted-foreground">{department?.departmentName}</p>
                </div>
              </div>
            );
          })}
          {recentEmployees.length === 0 && (
            <p className="text-center text-muted-foreground py-4">No employees yet</p>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
