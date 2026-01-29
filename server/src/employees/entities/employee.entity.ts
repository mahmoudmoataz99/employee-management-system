import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Company } from '../../companies/entities/company.entity';
import { Department } from '../../departments/entities/department.entity';
import { IsEmail, IsPhoneNumber, IsDate, IsEnum, IsOptional } from 'class-validator';

export enum EmployeeStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  ON_LEAVE = 'on_leave',
  TERMINATED = 'terminated',
  RESIGNED = 'resigned'
}

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Company, company => company.employees, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column({ type: 'varchar', length: 36 })
  companyId: string;

  @ManyToOne(() => Department, department => department.employees, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  @Column({ type: 'varchar', length: 36, nullable: true })
  departmentId: string;

  @Column({
    type: 'enum',
    enum: EmployeeStatus,
    default: EmployeeStatus.PENDING
  })
  @IsEnum(EmployeeStatus)
  status: EmployeeStatus;

  @Column({ length: 100 })
  employeeName: string;

  @Column({ unique: true, length: 100 })
  @IsEmail()
  email: string;

  @Column({ length: 20 })
  @IsPhoneNumber()
  mobileNumber: string;

  @Column('text')
  address: string;

  @Column({ length: 100 })
  designation: string;

  @Column({ nullable: true })
  @IsDate()
  @IsOptional()
  hiredOn: Date;

  @Column({ default: 0 })
  daysEmployed: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  calculateDaysEmployed() {
    if (this.hiredOn) {
      const today = new Date();
      const hireDate = new Date(this.hiredOn);
      const diffTime = Math.abs(today.getTime() - hireDate.getTime());
      this.daysEmployed = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
  }
}