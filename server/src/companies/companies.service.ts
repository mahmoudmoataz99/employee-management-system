import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
  ) { }

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const existingCompany = await this.companiesRepository.findOne({
      where: { companyName: createCompanyDto.companyName }
    });

    if (existingCompany) {
      throw new BadRequestException('Company with this name already exists');
    }

    const company = this.companiesRepository.create(createCompanyDto);
    return this.companiesRepository.save(company);
  }

  async findAll(search?: string): Promise<Company[]> {
    const where: any = {};
    if (search) {
      where.companyName = Like(`%${search}%`);
    }

    const companies = await this.companiesRepository.find({
      where,
      relations: ['departments', 'employees'],
    });

    // Update counts for each company
    companies.forEach(company => {
      company.updateDepartmentCount();
      company.updateEmployeeCount();
    });

    return companies;
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.companiesRepository.findOne({
      where: { id },
      relations: ['departments', 'employees'],
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    // Update counts
    company.updateDepartmentCount();
    company.updateEmployeeCount();
    await this.companiesRepository.save(company);

    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
    const company = await this.findOne(id);

    if (updateCompanyDto.companyName && updateCompanyDto.companyName !== company.companyName) {
      const existingCompany = await this.companiesRepository.findOne({
        where: { companyName: updateCompanyDto.companyName }
      });

      if (existingCompany) {
        throw new BadRequestException('Company with this name already exists');
      }
    }

    Object.assign(company, updateCompanyDto);
    return this.companiesRepository.save(company);
  }

  async remove(id: string): Promise<void> {
    const company = await this.findOne(id);
    await this.companiesRepository.remove(company);
  }
}