import { ResponsibilityCreate, ResponsibilityType, ResponsibilityRename, ResponsibilityClose } from '@/data-contracts/mdbuilder/data-contracts';
import { IsNullable } from '@/utils/custom-validation-classes';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class ResponsibilityCreateDto implements ResponsibilityCreate {
  @IsNumber()
  orgId?: number;
  @IsString()
  responsibilityCode: string;
  @IsString()
  description: string;
  @IsString()
  responsibilityType: ResponsibilityType;
}

export class RenameResponsibilityDto implements ResponsibilityRename {
  @IsNumber()
  responsibilityId?: number;
  @IsNullable()
  @IsOptional()
  @IsString()
  description?: string | null;
}

export class CloseResponsibilityDto implements ResponsibilityClose {
  @IsNumber()
  responsibilityId?: number;
}
