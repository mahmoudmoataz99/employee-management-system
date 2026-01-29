import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Department } from 'src/departments/entities/department.entity';
import { Employee } from 'src/employees/entities/employee.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 100 })
  companyName: string;

  @Column({ default: 0 })
  numberOfDepartments: number;

  @Column({ default: 0 })
  numberOfEmployees: number;

  @OneToMany(() => Department, department => department.company, { cascade: true })
  departments: Department[];

  @OneToMany(() => Employee, employee => employee.company, { cascade: true })
  employees: Employee[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  updateDepartmentCount() {
    this.numberOfDepartments = this.departments?.length || 0;
  }

  updateEmployeeCount() {
    this.numberOfEmployees = this.employees?.length || 0;
  }
}