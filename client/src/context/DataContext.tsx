import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Company, Department, Employee } from '@/types';
import api from '@/lib/api';
import { useAuth } from './AuthContext';

interface DataContextType {
  companies: Company[];
  departments: Department[];
  employees: Employee[];
  loading: boolean;
  addCompany: (company: Omit<Company, 'id' | 'createdAt'>) => Promise<Company>;
  updateCompany: (id: string, data: Partial<Company>) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
  getCompany: (id: string) => Company | undefined;
  addDepartment: (department: Omit<Department, 'id' | 'createdAt'>) => Promise<Department>;
  updateDepartment: (id: string, data: Partial<Department>) => Promise<void>;
  deleteDepartment: (id: string) => Promise<void>;
  getDepartment: (id: string) => Department | undefined;
  getDepartmentsByCompany: (companyId: string) => Department[];
  addEmployee: (employee: Omit<Employee, 'id' | 'createdAt'>) => Promise<Employee>;
  updateEmployee: (id: string, data: Partial<Employee>) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  getEmployee: (id: string) => Employee | undefined;
  getEmployeesByCompany: (companyId: string) => Employee[];
  getEmployeesByDepartment: (departmentId: string) => Employee[];
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const [companiesRes, departmentsRes, employeesRes] = await Promise.all([
        api.get('/companies'),
        api.get('/departments'),
        api.get('/employees'),
      ]);
      setCompanies(companiesRes.data);
      setDepartments(departmentsRes.data);
      setEmployees(employeesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [refreshData, isAuthenticated]);

  // Company operations
  const addCompany = useCallback(async (data: Omit<Company, 'id' | 'createdAt'>) => {
    const response = await api.post('/companies', data);
    const newCompany = response.data;
    setCompanies(prev => [...prev, newCompany]);
    return newCompany;
  }, []);

  const updateCompany = useCallback(async (id: string, data: Partial<Company>) => {
    await api.patch(`/companies/${id}`, data);
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  }, []);

  const deleteCompany = useCallback(async (id: string) => {
    await api.delete(`/companies/${id}`);
    setCompanies(prev => prev.filter(c => c.id !== id));
    // Optionally refresh departments and employees since cascading might happen on server
    refreshData();
  }, [refreshData]);

  const getCompany = useCallback((id: string) => {
    return companies.find(c => c.id === id);
  }, [companies]);

  // Department operations
  const addDepartment = useCallback(async (data: Omit<Department, 'id' | 'createdAt'>) => {
    const response = await api.post('/departments', data);
    const newDepartment = response.data;
    setDepartments(prev => [...prev, newDepartment]);
    return newDepartment;
  }, []);

  const updateDepartment = useCallback(async (id: string, data: Partial<Department>) => {
    await api.patch(`/departments/${id}`, data);
    setDepartments(prev => prev.map(d => d.id === id ? { ...d, ...data } : d));
  }, []);

  const deleteDepartment = useCallback(async (id: string) => {
    await api.delete(`/departments/${id}`);
    setDepartments(prev => prev.filter(d => d.id !== id));
    refreshData();
  }, [refreshData]);

  const getDepartment = useCallback((id: string) => {
    return departments.find(d => d.id === id);
  }, [departments]);

  const getDepartmentsByCompany = useCallback((companyId: string) => {
    return departments.filter(d => d.companyId === companyId);
  }, [departments]);

  // Employee operations
  const addEmployee = useCallback(async (data: Omit<Employee, 'id' | 'createdAt'>) => {
    const response = await api.post('/employees', data);
    const newEmployee = response.data;
    setEmployees(prev => [...prev, newEmployee]);
    return newEmployee;
  }, []);

  const updateEmployee = useCallback(async (id: string, data: Partial<Employee>) => {
    await api.patch(`/employees/${id}`, data);
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
  }, []);

  const deleteEmployee = useCallback(async (id: string) => {
    await api.delete(`/employees/${id}`);
    setEmployees(prev => prev.filter(e => e.id !== id));
  }, []);

  const getEmployee = useCallback((id: string) => {
    return employees.find(e => e.id === id);
  }, [employees]);

  const getEmployeesByCompany = useCallback((companyId: string) => {
    return employees.filter(e => e.companyId === companyId);
  }, [employees]);

  const getEmployeesByDepartment = useCallback((departmentId: string) => {
    return employees.filter(e => e.departmentId === departmentId);
  }, [employees]);

  return (
    <DataContext.Provider value={{
      companies,
      departments,
      employees,
      loading,
      addCompany,
      updateCompany,
      deleteCompany,
      getCompany,
      addDepartment,
      updateDepartment,
      deleteDepartment,
      getDepartment,
      getDepartmentsByCompany,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      getEmployee,
      getEmployeesByCompany,
      getEmployeesByDepartment,
      refreshData,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
