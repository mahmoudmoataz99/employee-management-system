import { useState, FormEvent, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { InputField, SelectField, TextareaField } from '@/components/ui/FormField';
import { Button } from '@/components/ui/button';
import { useData } from '@/context/DataContext';
import { validateDepartmentForm } from '@/utils/validation';
import { ValidationError } from '@/types';

export default function DepartmentFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { companies, getDepartment, addDepartment, updateDepartment } = useData();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    departmentName: '',
    companyId: '',
    description: '',
  });
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const department = getDepartment(id);
      if (department) {
        setFormData({
          departmentName: department.departmentName,
          companyId: department.companyId,
          description: department.description || '',
        });
      } else {
        navigate('/departments');
      }
    }
  }, [id, isEditing, getDepartment, navigate]);

  const getFieldError = (field: string) => {
    return errors.find(e => e.field === field)?.message;
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => prev.filter(e => e.field !== field));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors([]);

    const validationErrors = validateDepartmentForm(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate brief API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      if (isEditing) {
        await updateDepartment(id, formData);
      } else {
        await addDepartment(formData);
      }
      navigate('/departments');
    } catch (err) {
      console.error('Error saving department:', err);
      // Optional: set a general error message here if UI supports it
    } finally {
      setIsSubmitting(false);
    }
  };

  const companyOptions = companies.map(c => ({ value: c.id, label: c.companyName }));

  return (
    <MainLayout>
      <PageHeader
        title={isEditing ? 'Edit Department' : 'Create Department'}
        description={isEditing ? 'Update department information' : 'Add a new department to a company'}
        action={
          <Button variant="outline" onClick={() => navigate('/departments')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        }
      />

      <div className="mx-auto max-w-2xl">
        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="space-y-5">
            <InputField
              label="Department Name"
              placeholder="Enter department name"
              value={formData.departmentName}
              onChange={(e) => handleChange('departmentName', e.target.value)}
              error={getFieldError('departmentName')}
              required
            />

            <SelectField
              label="Company"
              options={companyOptions}
              placeholder="Select a company"
              value={formData.companyId}
              onChange={(e) => handleChange('companyId', e.target.value)}
              error={getFieldError('companyId')}
              required
              disabled={isEditing}
            />

            <TextareaField
              label="Description"
              placeholder="Enter department description (optional)"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate('/departments')}>
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
                  {isEditing ? 'Update Department' : 'Create Department'}
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
