import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Employee, EmployeeStatus } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CompaniesService } from 'src/companies/companies.service';
import { DepartmentsService } from '../departments/departments.service';

@Injectable()
export class EmployeesService {
    constructor(
        @InjectRepository(Employee)
        private employeesRepository: Repository<Employee>,
        private companiesService: CompaniesService,
        private departmentsService: DepartmentsService,
    ) { }

    async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
        const { companyId, departmentId, email } = createEmployeeDto;

        // Check if email exists
        const existingEmployee = await this.employeesRepository.findOne({
            where: { email }
        });

        if (existingEmployee) {
            throw new BadRequestException('Employee with this email already exists');
        }

        // Verify company exists
        const company = await this.companiesService.findOne(companyId);

        // Verify department exists and belongs to company
        const department = await this.departmentsService.findOne(departmentId);

        if (department.companyId !== companyId) {
            throw new BadRequestException('Department does not belong to the selected company');
        }

        const employee = this.employeesRepository.create({
            ...createEmployeeDto,
            company,
            department,
        });

        employee.calculateDaysEmployed();

        const savedEmployee = await this.employeesRepository.save(employee);

        return savedEmployee;
    }

    async findAll(search?: string): Promise<Employee[]> {
        const where: any[] = [];
        const baseFilter: any = {};

        if (search) {
            where.push(
                { ...baseFilter, employeeName: Like(`%${search}%`) },
                { ...baseFilter, email: Like(`%${search}%`) },
                { ...baseFilter, designation: Like(`%${search}%`) },
                { ...baseFilter, mobileNumber: Like(`%${search}%`) },
            );
        } else if (Object.keys(baseFilter).length > 0) {
            where.push(baseFilter);
        }

        const employees = await this.employeesRepository.find({
            where: where.length > 0 ? where : undefined,
            relations: ['company', 'department'],
        });

        employees.forEach(employee => {
            employee.calculateDaysEmployed();
        });

        return employees;
    }

    async findOne(id: string): Promise<Employee> {
        const employee = await this.employeesRepository.findOne({
            where: { id },
            relations: ['company', 'department'],
        });

        if (!employee) {
            throw new NotFoundException(`Employee with ID ${id} not found`);
        }

        employee.calculateDaysEmployed();
        await this.employeesRepository.save(employee);

        return employee;
    }

    async update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
        const employee = await this.findOne(id);

        if (updateEmployeeDto.email && updateEmployeeDto.email !== employee.email) {
            const existingEmployee = await this.employeesRepository.findOne({
                where: { email: updateEmployeeDto.email }
            });

            if (existingEmployee) {
                throw new BadRequestException('Employee with this email already exists');
            }
        }

        if (updateEmployeeDto.departmentId && updateEmployeeDto.departmentId !== employee.departmentId) {
            const newDepartment = await this.departmentsService.findOne(updateEmployeeDto.departmentId);

            if (newDepartment.companyId !== employee.companyId) {
                throw new BadRequestException('New department does not belong to the employee\'s company');
            }

            employee.departmentId = updateEmployeeDto.departmentId;
        }

        Object.assign(employee, updateEmployeeDto);

        employee.calculateDaysEmployed();

        return this.employeesRepository.save(employee);
    }

    async remove(id: string): Promise<void> {
        const employee = await this.findOne(id);
        await this.employeesRepository.remove(employee);
    }

    async updateStatus(id: string, status: EmployeeStatus): Promise<Employee> {
        const employee = await this.findOne(id);
        employee.status = status;

        if (status === EmployeeStatus.ACTIVE && !employee.hiredOn) {
            employee.hiredOn = new Date();
        }

        employee.calculateDaysEmployed();

        return this.employeesRepository.save(employee);
    }
}