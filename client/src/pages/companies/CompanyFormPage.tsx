import { useState, FormEvent, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { InputField, TextareaField } from '@/components/ui/FormField';
import { Button } from '@/components/ui/button';
import { useData } from '@/context/DataContext';
import { validateCompanyForm } from '@/utils/validation';
import { ValidationError } from '@/types';

export default function CompanyFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getCompany, addCompany, updateCompany } = useData();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    companyName: '',
  });
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const company = getCompany(id);
      if (company) {
        setFormData({
          companyName: company.companyName,
        });
      } else {
        navigate('/companies');
      }
    }
  }, [id, isEditing, getCompany, navigate]);

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

    const validationErrors = validateCompanyForm(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    if (isEditing) {
      updateCompany(id, formData);
    } else {
      addCompany(formData);
    }

    setIsSubmitting(false);
    navigate('/companies');
  };

  return (
    <MainLayout>
      <PageHeader
        title={isEditing ? 'Edit Company' : 'Create Company'}
        description={isEditing ? 'Update company information' : 'Add a new company to your organization'}
        action={
          <Button variant="outline" onClick={() => navigate('/companies')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        }
      />

      <div className="mx-auto max-w-2xl">
        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="space-y-5">
            <InputField
              label="Company Name"
              placeholder="Enter company name"
              value={formData.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              error={getFieldError('companyName')}
              required
            />


          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate('/companies')}>
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
                  {isEditing ? 'Update Company' : 'Create Company'}
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
