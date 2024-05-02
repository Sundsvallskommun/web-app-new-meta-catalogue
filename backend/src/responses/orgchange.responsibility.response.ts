import { ResponsibilityType, RowChangeStatus, Responsibility as _Responsibility } from '@/data-contracts/mdbuilder/data-contracts';
import ApiResponse from '@/interfaces/api-service.interface';
import { IsNullable } from '@/utils/custom-validation-classes';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class OrgChangeResponsibility implements _Responsibility {
  @IsNumber()
  @IsOptional()
  /** @format int32 */
  responsibilityId?: number;
  @IsString()
  @IsOptional()
  @IsNullable()
  responsibilityCode?: string | null;
  @IsEnum(ResponsibilityType)
  @IsOptional()
  responsibilityTypeId?: ResponsibilityType;
  @IsString()
  @IsOptional()
  @IsNullable()
  responsibilityType?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  description?: string | null;
  @IsNumber()
  @IsOptional()
  /** @format int32 */
  orgId?: number;
  @IsNumber()
  @IsOptional()
  /** @format int32 */
  companyId?: number;
  @IsString()
  @IsOptional()
  /**
   * @format date
   * @example "2023-01-01"
   */
  responsibilityFromDate?: string;
  @IsString()
  @IsOptional()
  /**
   * @format date
   * @example "2023-01-01"
   */
  responsibilityToDate?: string;
  @IsBoolean()
  @IsOptional()
  responsibilityPassive?: boolean;
  @IsString()
  @IsOptional()
  @IsNullable()
  /** @format uuid */
  responsibilityChangeId?: string | null;
  @IsEnum(RowChangeStatus)
  @IsOptional()
  responsibilityChangeStatus?: RowChangeStatus;
  @IsString()
  @IsOptional()
  /**
   * @format date
   * @example "2023-01-01"
   */
  descriptionFromDate?: string;
  @IsString()
  @IsOptional()
  /**
   * @format date
   * @example "2023-01-01"
   */
  descriptionToDate?: string;
  @IsString()
  @IsOptional()
  @IsNullable()
  /** @format uuid */
  descriptionChangeId?: string | null;
  @IsEnum(RowChangeStatus)
  @IsOptional()
  descriptionChangeStatus?: RowChangeStatus;
}

export class OrgChangeResponsibilitiesApiResponse implements ApiResponse<OrgChangeResponsibility[]> {
  @ValidateNested()
  @Type(() => OrgChangeResponsibility)
  data: OrgChangeResponsibility[];
  @IsString()
  message: string;
}

export class OrgChangeResponsibilityNewCodeApiResponse implements ApiResponse<string> {
  @IsString()
  data: string;
  @IsString()
  message: string;
}
