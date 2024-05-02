import { NewOrgNode, OrgNodeCheckOut, OrgNodeMove, OrgNodeNameUpdate, OrgNodeRespCodeUpdate } from '@/data-contracts/mdbuilder/data-contracts';
import { IsNullable } from '@/utils/custom-validation-classes';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class OrgnodeAddDto implements OrgNodeCheckOut {
  @IsNumber()
  orgId: number;
  @IsString()
  draftId: string;
}

export class OrgnodeCreateDto implements NewOrgNode {
  @IsNumber()
  parentId: number;
  @IsString()
  @IsOptional()
  @IsNullable()
  name: string;
  @IsString()
  @IsOptional()
  @IsNullable()
  shortName: string;
  @IsString()
  @IsOptional()
  @IsNullable()
  abbreviation: string;
}

export class OrgnodeRenameDto implements OrgNodeNameUpdate {
  @IsNumber()
  orgId: number;
  @IsString()
  @IsOptional()
  @IsNullable()
  name: string;
  @IsString()
  @IsOptional()
  @IsNullable()
  shortName: string;
  @IsString()
  @IsOptional()
  @IsNullable()
  abbreviation: string;
}

export class OrgnodeChangeRespCodeDto implements OrgNodeRespCodeUpdate {
  @IsNumber()
  orgId: number;
  @IsString()
  @IsOptional()
  @IsNullable()
  newRespCodePart: string;
}

export class OrgnodeMoveDto implements OrgNodeMove {
  @IsNumber()
  orgId: number;
  @IsNumber()
  newParentId: number;
}

export class TerminateNodeDto {
  @IsNumber()
  orgId: number;
}
