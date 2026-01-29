import { IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  companyName: string;
}

// update-company.dto.ts
