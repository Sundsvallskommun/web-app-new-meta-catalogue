import { PATeamAndManager as _PATeamAndManager, PATeamSearchResult as _PATeamSearchResult } from '@/data-contracts/mdbuilder/data-contracts';
import ApiResponse from '@/interfaces/api-service.interface';
import { IsNullable } from '@/utils/custom-validation-classes';
import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';

export class PATeamSearchResult implements _PATeamSearchResult {
  @IsString()
  @IsOptional()
  /** @format uuid */
  managerId?: string;
  @IsString()
  @IsOptional()
  @IsNullable()
  paTeam?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  paTeamName?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  managerName?: string | null;
}

export class PATeamSearchResultsApiResponse implements ApiResponse<PATeamSearchResult[]> {
  @ValidateNested({ each: true })
  @Type(() => PATeamSearchResult)
  data: PATeamSearchResult[];
  @IsString()
  message: string;
}

export class PATeamAndManager implements _PATeamAndManager {
  @IsOptional()
  @IsString()
  /** @format uuid */
  managerId?: string;
  @IsString()
  @IsOptional()
  @IsNullable()
  paTeam?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  paTeamName?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  managerName?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  employeeImage?: string | null;
}

export class PATeamAndManagersApiResponse implements ApiResponse<PATeamAndManager[]> {
  @ValidateNested({ each: true })
  @Type(() => PATeamAndManager)
  data: PATeamAndManager[];
  @IsString()
  message: string;
}
