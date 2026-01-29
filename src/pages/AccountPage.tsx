import { useState, FormEvent } from 'react';
import { Save, User } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { InputField, SelectField } from '@/components/ui/FormField';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { validateEmail } from '@/utils/validation';

export default function AccountPage() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
    setSuccessMessage('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 300));

    updateUser({
      name: formData.name,
      email: formData.email,
    });

    setIsSubmitting(false);
    setIsEditing(false);
    setSuccessMessage('Account updated successfully!');
  };

  return (
    <MainLayout>
      <PageHeader
        title="My Account"
        description="View and manage your account information"
        action={
          !isEditing && (
            <Button onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )
        }
      />

      <div className="mx-auto max-w-2xl">
        {/* Profile Card */}
        <div className="mb-6 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{user?.name}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
              <span className="mt-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary capitalize">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {successMessage && (
          <div className="mb-6 rounded-lg bg-success/10 border border-success/20 px-4 py-3 text-sm text-success">
            {successMessage}
          </div>
        )}

        {/* Account Form */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Account Information</h3>
          
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <InputField
                label="Full Name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                error={errors.name}
                required
              />

              <InputField
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                error={errors.email}
                required
              />

              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({ name: user?.name || '', email: user?.email || '' });
                    setErrors({});
                  }}
                >
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
                      Save Changes
                    </span>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-sm font-medium text-muted-foreground">Full Name</span>
                <span className="text-sm text-foreground">{user?.name}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-sm font-medium text-muted-foreground">Email Address</span>
                <span className="text-sm text-foreground">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm font-medium text-muted-foreground">Role</span>
                <span className="text-sm text-foreground capitalize">{user?.role}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
