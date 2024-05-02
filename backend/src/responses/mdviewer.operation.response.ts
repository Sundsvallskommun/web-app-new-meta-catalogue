import { OrgOperation as _OrgOperation } from '@/data-contracts/mdviewer/data-contracts';
import ApiResponse from '@/interfaces/api-service.interface';
import { IsNullable } from '@/utils/custom-validation-classes';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class OrgOperation implements _OrgOperation {
  @IsString()
  @IsOptional()
  /** @format uuid */
  orgOperationId?: string;
  @IsNumber()
  @IsOptional()
  /** @format int32 */
  orgId?: number;
  @IsString()
  @IsOptional()
  @IsNullable()
  operationCode?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  operationDescription?: string | null;
}

export class OrgOperationsApiResponse implements ApiResponse<OrgOperation[]> {
  @ValidateNested({ each: true })
  @Type(() => OrgOperation)
  data: OrgOperation[];
  @IsString()
  message: string;
}
