import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  EMPLOYEE = 'employee'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  @IsNotEmpty()
  firstName: string;

  @Column({ length: 100 })
  @IsNotEmpty()
  lastName: string;

  @Column({ unique: true, length: 100 })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column({ length: 255 })
  @IsNotEmpty()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.EMPLOYEE
  })
  @IsEnum(UserRole)
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}