import { ValidationError } from '@/types';

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  // Accepts formats like: +1 (555) 123-4567, 555-123-4567, 5551234567
  const phoneRegex = /^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

export function validateRequired(value: string, fieldName: string): ValidationError | null {
  if (!value || value.trim() === '') {
    return { field: fieldName, message: `${fieldName} is required` };
  }
  return null;
}

export function validateCompanyForm(data: {
  companyName: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  const nameError = validateRequired(data.companyName, 'Company name');
  if (nameError) {
    errors.push({ field: 'companyName', message: 'Company name is required' });
  }

  return errors;
}

export function validateDepartmentForm(data: {
  departmentName: string;
  companyId: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  const nameError = validateRequired(data.departmentName, 'Department name');
  if (nameError) {
    errors.push({ field: 'departmentName', message: 'Department name is required' });
  }

  const companyError = validateRequired(data.companyId, 'Company');
  if (companyError) errors.push({ field: 'companyId', message: 'Please select a company' });

  return errors;
}

export function validateEmployeeForm(data: {
  employeeName: string;
  email: string;
  mobileNumber: string;
  companyId: string;
  departmentId: string;
  designation: string;
  hiredOn: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  const nameError = validateRequired(data.employeeName, 'Full name');
  if (nameError) {
    errors.push({ field: 'employeeName', message: 'Full name is required' });
  }

  const emailError = validateRequired(data.email, 'Email');
  if (emailError) {
    errors.push(emailError);
  } else if (!validateEmail(data.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  const phoneError = validateRequired(data.mobileNumber, 'Phone');
  if (phoneError) {
    errors.push({ field: 'mobileNumber', message: 'Phone number is required' });
  } else if (!/^\+?\d{1,3}[-.\s]?(\(?\d{1,4}\)?)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(data.mobileNumber)) {
    errors.push({ field: 'mobileNumber', message: 'Please enter a valid mobile number (e.g., +1234567890)' });
  }

  const companyError = validateRequired(data.companyId, 'Company');
  if (companyError) errors.push({ field: 'companyId', message: 'Please select a company' });

  const departmentError = validateRequired(data.departmentId, 'Department');
  if (departmentError) errors.push({ field: 'departmentId', message: 'Please select a department' });

  const designationError = validateRequired(data.designation, 'Designation');
  if (designationError) {
    errors.push({ field: 'designation', message: 'Designation is required' });
  }

  const hiredOnError = validateRequired(data.hiredOn, 'Hire date');
  if (hiredOnError) {
    errors.push({ field: 'hiredOn', message: 'Hire date is required' });
  }

  return errors;
}

export function validateLoginForm(data: {
  email: string;
  password: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  const emailError = validateRequired(data.email, 'Email');
  if (emailError) {
    errors.push(emailError);
  } else if (!validateEmail(data.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  const passwordError = validateRequired(data.password, 'Password');
  if (passwordError) errors.push(passwordError);

  return errors;
}
