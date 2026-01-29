export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'employee';
  avatar?: string;
}

export interface Company {
  id: string;
  companyName: string;
  numberOfDepartments?: number;
  numberOfEmployees?: number;
  createdAt: string;
}

export interface Department {
  id: string;
  departmentName: string;
  companyId: string;
  description?: string;
  numberOfEmployees?: number;
  createdAt: string;
}

export interface Employee {
  id: string;
  employeeName: string;
  email: string;
  mobileNumber: string;
  companyId: string;
  company?: Company;
  departmentId: string;
  department?: Department;
  designation: string;
  hiredOn: string;
  address: string;
  salary?: number;
  status: 'pending' | 'active' | 'on_leave' | 'terminated' | 'resigned';
  avatar?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}
