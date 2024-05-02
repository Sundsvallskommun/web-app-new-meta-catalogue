import { Object as _Object } from '@/data-contracts/mdbuilder/data-contracts';
import ApiResponse from '@/interfaces/api-service.interface';
import { IsNullable } from '@/utils/custom-validation-classes';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class OrgChangeObject implements _Object {
  @IsNumber()
  @IsOptional()
  /** @format int32 */
  objectId?: number;
  @IsString()
  @IsOptional()
  @IsNullable()
  objectCode?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  description?: string | null;
  @IsNumber()
  @IsOptional()
  /** @format int32 */
  companyId?: number;
}

export class CompanyObjectsApiResponse implements ApiResponse<OrgChangeObject[]> {
  @ValidateNested({ each: true })
  @Type(() => OrgChangeObject)
  data: OrgChangeObject[];
  @IsString()
  message: string;
}
