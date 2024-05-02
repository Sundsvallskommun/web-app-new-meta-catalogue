import { Activity as _Activity } from '@/data-contracts/mdbuilder/data-contracts';
import ApiResponse from '@/interfaces/api-service.interface';
import { IsNullable } from '@/utils/custom-validation-classes';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class OrgChangeActivity implements _Activity {
  @IsNumber()
  @IsOptional()
  /** @format int32 */
  activityId?: number;
  @IsString()
  @IsOptional()
  @IsNullable()
  activityCode?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  description?: string | null;
  @IsNumber()
  @IsOptional()
  /** @format int32 */
  companyId?: number;
}

export class CompanyActivitysApiResponse implements ApiResponse<OrgChangeActivity[]> {
  @ValidateNested({ each: true })
  @Type(() => OrgChangeActivity)
  data: OrgChangeActivity[];
  @IsString()
  message: string;
}
