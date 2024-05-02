import { IsNullable } from '@/utils/custom-validation-classes';
import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { OrganizationExport, OrganizationLevel2 } from '@/data-contracts/mdbuilder/data-contracts';
import ApiResponse from '@/interfaces/api-service.interface';
import { Type } from 'class-transformer';

export class InitialOrgStructureToExport implements OrganizationExport {
  @IsString()
  @IsOptional()
  @IsNullable()
  nameLvl2?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  shortnameLv2?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  abbreviationLv2?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  responsibilityCodePartLv2?: string | null;
  nameLvl3?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  shortnameLv3?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  abbreviationLv3?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  responsibilityCodePartLv3?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  nameLvl4?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  shortnameLv4?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  abbreviationLv4?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  responsibilityCodePartLv4?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  nameLvl5?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  shortnameLv5?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  abbreviationLv5?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  responsibilityCodePartLv5?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  nameLvl6?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  shortnameLv6?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  abbreviationLv6?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  responsibilityCodePartLv6?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  responsibilityCode?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  responsibilityDescription?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  operations?: string | null;
}

export class InitialOrgStructuresToExporApiResponse implements ApiResponse<InitialOrgStructureToExport[][]> {
  @ValidateNested()
  @Type(() => InitialOrgStructureToExport)
  data: InitialOrgStructureToExport[][];
  @IsString()
  message: string;
}

export class CheckedOutOrganizationLevel2 implements OrganizationLevel2 {
  @IsNumber()
  @IsOptional()
  /** @format int32 */
  orgId?: number;
  @IsString()
  @IsOptional()
  @IsNullable()
  name?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  /** @format uuid */
  draftId?: string;
}

export class CheckedOutOrganizationLevel2ApiResponse implements ApiResponse<CheckedOutOrganizationLevel2> {
  @ValidateNested()
  @Type(() => CheckedOutOrganizationLevel2)
  data: CheckedOutOrganizationLevel2;
  @IsString()
  message: string;
}
