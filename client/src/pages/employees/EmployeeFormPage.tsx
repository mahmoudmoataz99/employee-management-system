import { useState, FormEvent, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { InputField, SelectField } from '@/components/ui/FormField';
import { Button } from '@/components/ui/button';
import { useData } from '@/context/DataContext';
import { validateEmployeeForm } from '@/utils/validation';
import { ValidationError } from '@/types';

export default function EmployeeFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { companies, getDepartmentsByCompany, getEmployee, addEmployee, updateEmployee } = useData();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    employeeName: '',
    email: '',
    mobileNumber: '',
    companyId: '',
    departmentId: '',
    designation: '',
    hiredOn: '',
    address: '',
    salary: '',
    status: 'active' as 'pending' | 'active' | 'on_leave' | 'terminated' | 'resigned',
  });
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableDepartments = formData.companyId ? getDepartmentsByCompany(formData.companyId) : [];

  useEffect(() => {
    if (isEditing) {
      const employee = getEmployee(id);
      if (employee) {
        setFormData({
          employeeName: employee.employeeName,
          email: employee.email,
          mobileNumber: employee.mobileNumber,
          companyId: employee.companyId,
          departmentId: employee.departmentId,
          designation: employee.designation,
          hiredOn: employee.hiredOn,
          address: employee.address || '',
          salary: employee.salary?.toString() || '',
          status: employee?.status,
        });
      } else {
        navigate('/employees');
      }
    }
  }, [id, isEditing, getEmployee, navigate]);

  const getFieldError = (field: string) => {
    return errors.find(e => e.field === field)?.message;
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      // Reset department when company changes
      if (field === 'companyId' && value !== prev.companyId) {
        updated.departmentId = '';
      }
      return updated;
    });
    setErrors(prev => prev.filter(e => e.field !== field));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors([]);

    const validationErrors = validateEmployeeForm(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    // Simulate brief API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const employeeData = {
      ...formData,
      mobileNumber: formData.mobileNumber.replace(/[\s\(\)\-\.]/g, ''),
      salary: formData.salary ? parseFloat(formData.salary) : undefined,
    };

    try {
      if (isEditing) {
        await updateEmployee(id!, employeeData);
      } else {
        await addEmployee(employeeData);
      }
      navigate('/employees');
    } catch (err) {
      console.error('Error saving employee:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const companyOptions = companies.map(c => ({ value: c.id, label: c.companyName }));
  const departmentOptions = availableDepartments.map(d => ({ value: d.id, label: d.departmentName }));
  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'active', label: 'Active' },
    { value: 'on_leave', label: 'On Leave' },
    { value: 'terminated', label: 'Terminated' },
    { value: 'resigned', label: 'Resigned' },
  ];

  return (
    <MainLayout>
      <PageHeader
        title={isEditing ? 'Edit Employee' : 'Create Employee'}
        description={isEditing ? 'Update employee information' : 'Add a new employee to your organization'}
        action={
          <Button variant="outline" onClick={() => navigate('/employees')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        }
      />

      <div className="mx-auto max-w-2xl">
        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="space-y-5">
            <InputField
              label="Full Name"
              placeholder="John Doe"
              value={formData.employeeName}
              onChange={(e) => handleChange('employeeName', e.target.value)}
              error={getFieldError('employeeName')}
              required
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <InputField
                label="Email"
                type="email"
                placeholder="john.doe@company.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                error={getFieldError('email')}
                required
              />
              <InputField
                label="Phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.mobileNumber}
                onChange={(e) => handleChange('mobileNumber', e.target.value)}
                error={getFieldError('mobileNumber')}
                required
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <SelectField
                label="Company"
                options={companyOptions}
                placeholder="Select a company"
                value={formData.companyId}
                onChange={(e) => handleChange('companyId', e.target.value)}
                error={getFieldError('companyId')}
                required
              />
              <SelectField
                label="Department"
                options={departmentOptions}
                placeholder={formData.companyId ? 'Select a department' : 'Select a company first'}
                value={formData.departmentId}
                onChange={(e) => handleChange('departmentId', e.target.value)}
                error={getFieldError('departmentId')}
                disabled={!formData.companyId}
                required
              />
            </div>

            <InputField
              label="Designation"
              placeholder="Software Engineer"
              value={formData.designation}
              onChange={(e) => handleChange('designation', e.target.value)}
              error={getFieldError('designation')}
              required
            />

            <InputField
              label="Address"
              placeholder="123 Main St, City, Country"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              error={getFieldError('address')}
              required
            />

            <div className="grid gap-5 sm:grid-cols-3">
              <InputField
                label="Hire Date"
                type="date"
                value={formData.hiredOn}
                onChange={(e) => handleChange('hiredOn', e.target.value)}
                error={getFieldError('hiredOn')}
                required
              />
              <InputField
                label="Salary"
                type="number"
                placeholder="50000"
                value={formData.salary}
                onChange={(e) => handleChange('salary', e.target.value)}
              />
              <SelectField
                label="Status"
                options={statusOptions}
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate('/employees')}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {isEditing ? 'Update Employee' : 'Create Employee'}
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
