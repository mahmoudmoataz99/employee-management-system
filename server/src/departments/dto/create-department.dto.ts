import { IsNotEmpty, IsUUID, MinLength, MaxLength } from 'class-validator';

export class CreateDepartmentDto {
  @IsUUID()
  @IsNotEmpty()
  companyId: string;

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  departmentName: string;
}