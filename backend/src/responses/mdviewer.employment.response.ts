import {
  Email as _Email,
  Login as _Login,
  MDVEmployee as _MDVEmployee,
  MDVEmployment as _MDVEmployment,
} from '@/data-contracts/mdviewer/data-contracts';
import ApiResponse from '@/interfaces/api-service.interface';
import { IsNullable } from '@/utils/custom-validation-classes';
import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class MDVEmployee implements _MDVEmployee {
  @IsString()
  @IsOptional()
  /** @format uuid */
  personId?: string;
  @IsString()
  @IsOptional()
  @IsNullable()
  personNumber?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  classified?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  givenname?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  lastname?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  friendlyGivenname?: string | null;
  @IsNumber()
  @IsOptional()
  @IsNullable()
  /** @format int32 */
  orgId?: number | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  workPhone?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  workMobile?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  loginname?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  title?: string | null;
  @IsBoolean()
  @IsOptional()
  isManual?: boolean;
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Login)
  @IsNullable()
  logins?: Login[] | null;
  @ValidateNested({ each: true })
  @Type(() => Email)
  @IsNullable()
  emails?: Email[] | null;
  @ValidateNested({ each: true })
  @Type(() => MDVEmployment)
  @IsNullable()
  employments?: MDVEmployment[] | null;
}

export class EmployeeApiResponse implements ApiResponse<MDVEmployee> {
  @ValidateNested()
  @Type(() => MDVEmployee)
  data: MDVEmployee;
  @IsString()
  message: string;
}

export class EmployeesApiResponse implements ApiResponse<MDVEmployee[]> {
  @ValidateNested({ each: true })
  @Type(() => MDVEmployee)
  data: MDVEmployee[];
  @IsString()
  message: string;
}

export class Email implements _Email {
  @IsString()
  @IsOptional()
  @IsNullable()
  smtpAddress?: string | null;
  @IsString()
  /** @minLength 1 */
  emailSystem: string;
}

export class Login implements _Login {
  @IsString()
  @IsOptional()
  @IsNullable()
  loginname?: string | null;
  @IsString()
  /** @minLength 1 */
  displayname: string;
}

export class MDVEmployment implements _MDVEmployment {
  @IsString()
  @IsOptional()
  @IsNullable()
  title?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  /** @format date-time */
  hireDate?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  /** @format date-time */
  retireDate?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  paTeam?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  department?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  managerName?: string | null;
}

export class EmployeeDetailsApiResponse implements ApiResponse<MDVEmployee> {
  @ValidateNested()
  @Type(() => MDVEmployee)
  data: MDVEmployee;
  @IsString()
  message: string;
}
