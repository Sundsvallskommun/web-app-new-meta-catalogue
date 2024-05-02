import { DraftPhase, DraftTriggerCommand, NewDraft, NewDraftComment } from '@/data-contracts/mdbuilder/data-contracts';
import { IsNullable } from '@/utils/custom-validation-classes';
import { IsEnum, IsISO8601, IsNumber, IsOptional, IsString } from 'class-validator';

export class NewDraftDto implements NewDraft {
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsNumber()
  companyId: number;
  @IsISO8601()
  cutOffDate: string;
}

export class DraftRenameDto {
  @IsString()
  name: string;
}

export class DraftChangeCutOffDateDto {
  @IsISO8601()
  cutOffDate: string;
}

export class DraftChangePhaseDto {
  @IsString()
  phase: DraftPhase;
}

export class PostDraftCommentDto implements NewDraftComment {
  @IsString()
  draftId?: string;
  @IsNullable()
  @IsOptional()
  @IsString()
  comment?: string | null;
}

export class RunBookActionTriggerDto {
  @IsString()
  draftId: string;
  @IsEnum(DraftTriggerCommand)
  command: DraftTriggerCommand;
}
