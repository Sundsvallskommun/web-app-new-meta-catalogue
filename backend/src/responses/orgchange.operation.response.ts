import { RowChangeStatus, Operation as _Operation, OrganizationOperation as _OrganizationOperation } from '@/data-contracts/mdbuilder/data-contracts';
import ApiResponse from '@/interfaces/api-service.interface';
import { IsNullable } from '@/utils/custom-validation-classes';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class OrgChangeOrganizationOperation implements _OrganizationOperation {
  @IsNumber()
  @IsOptional()
  /** @format int32 */
  organizationOperationId?: number;
  @IsNumber()
  @IsOptional()
  /** @format int32 */
  operationId?: number;
  @IsString()
  @IsOptional()
  @IsNullable()
  operationCode?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  description?: string | null;
  @IsNumber()
  @IsOptional()
  /** @format int32 */
  companyId?: number;
  @IsNumber()
  @IsOptional()
  /** @format int32 */
  orgId?: number;
  @IsString()
  @IsOptional()
  /**
   * @format date
   * @example "2023-01-01"
   */
  fromDate?: string;
  @IsString()
  @IsOptional()
  /**
   * @format date
   * @example "2023-01-01"
   */
  toDate?: string;
  @IsString()
  @IsOptional()
  @IsNullable()
  /** @format uuid */
  changeId?: string | null;
  @IsEnum(RowChangeStatus)
  changeStatus?: RowChangeStatus;
}

export class OrgChangeOrganizationOperationsApiResponse implements ApiResponse<OrgChangeOrganizationOperation[]> {
  @ValidateNested({ each: true })
  @Type(() => OrgChangeOrganizationOperation)
  data: OrgChangeOrganizationOperation[];
  @IsString()
  message: string;
}

export class OrgChangeOperation implements _Operation {
  @IsNumber()
  @IsOptional()
  /** @format int32 */
  operationId?: number;
  @IsString()
  @IsOptional()
  @IsNullable()
  operationCode?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  description?: string | null;
  @IsNumber()
  @IsOptional()
  /** @format int32 */
  companyId?: number;
}

export class CompanyOperationsApiResponse implements ApiResponse<OrgChangeOperation[]> {
  @ValidateNested({ each: true })
  @Type(() => OrgChangeOperation)
  data: OrgChangeOperation[];
  @IsString()
  message: string;
}
