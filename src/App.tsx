import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";
import { ThemeProvider } from "@/context/ThemeContext";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AccountPage from "./pages/AccountPage";

import CompaniesListPage from "./pages/companies/CompaniesListPage";
import CompanyFormPage from "./pages/companies/CompanyFormPage";
import CompanyViewPage from "./pages/companies/CompanyViewPage";

import DepartmentsListPage from "./pages/departments/DepartmentsListPage";
import DepartmentFormPage from "./pages/departments/DepartmentFormPage";
import DepartmentViewPage from "./pages/departments/DepartmentViewPage";

import EmployeesListPage from "./pages/employees/EmployeesListPage";
import EmployeeFormPage from "./pages/employees/EmployeeFormPage";
import EmployeeViewPage from "./pages/employees/EmployeeViewPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/account" element={<AccountPage />} />

                {/* Companies */}
                <Route path="/companies" element={<CompaniesListPage />} />
                <Route path="/companies/create" element={<CompanyFormPage />} />
                <Route path="/companies/:id" element={<CompanyViewPage />} />
                <Route path="/companies/:id/edit" element={<CompanyFormPage />} />

                {/* Departments */}
                <Route path="/departments" element={<DepartmentsListPage />} />
                <Route path="/departments/create" element={<DepartmentFormPage />} />
                <Route path="/departments/:id" element={<DepartmentViewPage />} />
                <Route path="/departments/:id/edit" element={<DepartmentFormPage />} />

                {/* Employees */}
                <Route path="/employees" element={<EmployeesListPage />} />
                <Route path="/employees/create" element={<EmployeeFormPage />} />
                <Route path="/employees/:id" element={<EmployeeViewPage />} />
                <Route path="/employees/:id/edit" element={<EmployeeFormPage />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
