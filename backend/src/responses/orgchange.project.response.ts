import { Project as _Project } from '@/data-contracts/mdbuilder/data-contracts';
import ApiResponse from '@/interfaces/api-service.interface';
import { IsNullable } from '@/utils/custom-validation-classes';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class OrgChangeProject implements _Project {
  @IsNumber()
  @IsOptional()
  /** @format int32 */
  projectId?: number;
  @IsString()
  @IsOptional()
  @IsNullable()
  projectCode?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  description?: string | null;
  @IsNumber()
  @IsOptional()
  /** @format int32 */
  companyId?: number;
}

export class CompanyProjectsApiResponse implements ApiResponse<OrgChangeProject[]> {
  @ValidateNested({ each: true })
  @Type(() => OrgChangeProject)
  data: OrgChangeProject[];
  @IsString()
  message: string;
}
