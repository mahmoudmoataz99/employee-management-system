import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Company } from '../../companies/entities/company.entity';
import { Employee } from 'src/employees/entities/employee.entity';

@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Company, company => company.departments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column({ type: 'varchar', length: 36 })
  companyId: string;

  @Column({ length: 100 })
  departmentName: string;

  @Column({ default: 0 })
  numberOfEmployees: number;

  @OneToMany(() => Employee, employee => employee.department, { cascade: true })
  employees: Employee[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  updateEmployeeCount() {
    this.numberOfEmployees = this.employees?.length || 0;
  }
}