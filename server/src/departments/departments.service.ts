import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Department } from './entities/department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { CompaniesService } from 'src/companies/companies.service';

@Injectable()
export class DepartmentsService {
    constructor(
        @InjectRepository(Department)
        private departmentsRepository: Repository<Department>,
        private companiesService: CompaniesService,
    ) { }

    async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
        const { companyId } = createDepartmentDto;

        // Verify company exists
        const company = await this.companiesService.findOne(companyId);

        const department = this.departmentsRepository.create({
            ...createDepartmentDto,
            company,
        });

        const savedDepartment = await this.departmentsRepository.save(department);

        return savedDepartment;
    }

    async findAll(search?: string): Promise<Department[]> {
        const where: any = {};
        
        if (search) {
            where.departmentName = Like(`%${search}%`);
        }

        const departments = await this.departmentsRepository.find({
            where,
            relations: ['company', 'employees'],
        });

        // Update employee count for each department
        departments.forEach(dept => {
            dept.updateEmployeeCount();
        });

        return departments;
    }

    async findOne(id: string): Promise<Department> {
        const department = await this.departmentsRepository.findOne({
            where: { id },
            relations: ['company', 'employees'],
        });

        if (!department) {
            throw new NotFoundException(`Department with ID ${id} not found`);
        }

        department.updateEmployeeCount();
        await this.departmentsRepository.save(department);

        return department;
    }

    async findByCompany(companyId: string): Promise<Department[]> {
        await this.companiesService.findOne(companyId); // Verify company exists

        const departments = await this.departmentsRepository.find({
            where: { companyId },
            relations: ['employees'],
        });

        departments.forEach(dept => {
            dept.updateEmployeeCount();
        });

        return departments;
    }

    async update(id: string, updateDepartmentDto: UpdateDepartmentDto): Promise<Department> {
        const department = await this.findOne(id);

        if (updateDepartmentDto.companyId && updateDepartmentDto.companyId !== department.companyId) {
            throw new BadRequestException('Cannot change company of a department');
        }

        Object.assign(department, updateDepartmentDto);
        return this.departmentsRepository.save(department);
    }

    async remove(id: string): Promise<void> {
        const department = await this.findOne(id);
        await this.departmentsRepository.remove(department);
    }
}