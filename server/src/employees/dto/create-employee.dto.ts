import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsUUID, IsDateString, IsEnum, MinLength, MaxLength, Matches } from 'class-validator';
import { EmployeeStatus } from '../entities/employee.entity';

export class CreateEmployeeDto {
  @IsUUID()
  @IsNotEmpty()
  companyId: string;

  @IsUUID()
  @IsNotEmpty()
  departmentId: string;

  @IsEnum(EmployeeStatus)
  @IsOptional()
  status?: EmployeeStatus;

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  employeeName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid mobile number format' })
  mobileNumber: string;

  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(500)
  address: string;

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  designation: string;

  @IsDateString()
  @IsOptional()
  hiredOn?: Date;
}