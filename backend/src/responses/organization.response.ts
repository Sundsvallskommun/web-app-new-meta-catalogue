import ApiResponse from '@/interfaces/api-service.interface';
import { OrganizationModified, OrganizationTreeModified } from '@/interfaces/organization.interface';
import { IsNullable } from '@/utils/custom-validation-classes';
import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class Organization implements OrganizationModified {
  @IsNumber()
  /** @format int32 */
  id?: number;
  @IsString()
  @IsOptional()
  @IsNullable()
  orgName?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  label?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  orgNameShort?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  abbreviation?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  concatAbbreviation?: string | null;
  /** @format int32 */
  @IsNumber()
  @IsOptional()
  @IsNullable()
  parentId?: number | null;
  @IsBoolean()
  @IsOptional()
  isLeafLevel?: boolean;
  @IsNumber()
  @IsOptional()
  @IsNullable()
  /** @format int32 */
  level?: number | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  responsibilityCode?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  responsibilityCodePartList?: string | null;
  @IsNumber()
  @IsOptional()
  @IsNullable()
  /** @format int32 */
  companyId?: number | null;
}

export class OrganizationApiResponse implements ApiResponse<Organization> {
  @ValidateNested()
  @Type(() => Organization)
  data: Organization;
  @IsString()
  message: string;
}

export class OrganizationsApiResponse implements ApiResponse<Organization[]> {
  @ValidateNested({ each: true })
  @Type(() => Organization)
  data: Organization[];
  @IsString()
  message: string;
}

export class OrganizationTree implements OrganizationTreeModified {
  @IsString()
  @IsOptional()
  /** @format uuid */
  organizationId?: string;
  @IsNumber()
  /** @format int32 */
  id: number;
  @IsNumber()
  /** @format int32 */
  level: number;
  @IsString()
  @IsOptional()
  @IsNullable()
  orgName?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  orgNameShort?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  abbreviation?: string | null;
  @IsString()
  @IsNullable()
  label: string | null;
  @IsNumber()
  @IsOptional()
  /** @format int32 */
  parentId?: number;
  @IsBoolean()
  @IsOptional()
  isLeafLevel?: boolean;
  @IsString()
  @IsOptional()
  @IsNullable()
  responsibilityCode?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  responsibilityList?: string | null;
  @IsOptional()
  @IsNullable()
  @ValidateNested({ each: true })
  @Type(() => OrganizationTree)
  subItems?: OrganizationTreeModified[] | [] | null;
}

export class OrganizationTreeApiResponse implements ApiResponse<OrganizationTree[]> {
  @ValidateNested({ each: true })
  @Type(() => OrganizationTree)
  data: OrganizationTree[];
  @IsString()
  message: string;
}
