import { ResponsibilityType, OrganizationResponsibility as _OrganizationResponsibility } from '@/data-contracts/mdviewer/data-contracts';
import ApiResponse from '@/interfaces/api-service.interface';
import { IsNullable } from '@/utils/custom-validation-classes';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class OrganizationResponsibility implements _OrganizationResponsibility {
  @IsString()
  @IsOptional()
  orgResponsibilityId?: string;
  @IsString()
  @IsOptional()
  @IsNullable()
  responsibilityCode?: string | null;
  @IsNumber()
  @IsOptional()
  @IsNullable()
  orgId?: number | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  responsibilityText?: string | null;
  @IsString()
  @IsOptional()
  responsibilityValidFrom?: string;
  @IsNumber()
  @IsOptional()
  companyId?: number;
  @IsEnum(ResponsibilityType)
  @IsOptional()
  typeOfResponsibility?: ResponsibilityType;
  @IsString()
  @IsOptional()
  @IsNullable()
  orgName?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  orgFromName?: string | null;
}

export class ResponsibilityApiResponse implements ApiResponse<OrganizationResponsibility> {
  @ValidateNested()
  @Type(() => OrganizationResponsibility)
  data: OrganizationResponsibility;
  @IsString()
  message: string;
}

export class ResponsibilitiesApiResponse implements ApiResponse<OrganizationResponsibility[]> {
  @ValidateNested({ each: true })
  @Type(() => OrganizationResponsibility)
  data: OrganizationResponsibility[];
  @IsString()
  message: string;
}
