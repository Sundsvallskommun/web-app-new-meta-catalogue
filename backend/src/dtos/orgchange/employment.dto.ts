import { EmploymentChangeIntent } from '@/data-contracts/mdbuilder/data-contracts';
import { IsNullable } from '@/utils/custom-validation-classes';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class EmploymentChange implements EmploymentChangeIntent {
  @IsString()
  personId: string;
  @IsNumber()
  orgId: number;
  @IsNullable()
  @IsOptional()
  @IsNumber()
  newOrgId: number | null;
  @IsNullable()
  @IsOptional()
  @IsString()
  newPATeam: string | null;
  @IsNullable()
  @IsOptional()
  @IsNumber()
  /** @format int32 */
  newOperationId?: number | null;
  @IsNullable()
  @IsOptional()
  @IsNumber()
  /** @format int32 */
  newActivityId?: number | null;
  @IsNullable()
  @IsOptional()
  @IsNumber()
  /** @format int32 */
  newProjectId?: number | null;
  @IsNullable()
  @IsOptional()
  @IsNumber()
  /** @format int32 */
  newObjectId?: number | null;
}

export class EmploymentChangeArrayDto {
  @ValidateNested({ each: true })
  @Type(() => EmploymentChange)
  people: EmploymentChange[];
}

export class EmploymentChangeResetArrayDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => String)
  people: string[];
}
