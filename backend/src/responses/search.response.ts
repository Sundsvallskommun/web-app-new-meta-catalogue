import ApiResponse from '@/interfaces/api-service.interface';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ObjectSearchResult as _SearchResult } from '@/data-contracts/mdviewer/data-contracts';
import { IsNullable } from '@/utils/custom-validation-classes';

export class SearchResult implements _SearchResult {
  @IsString()
  @IsOptional()
  @IsNullable()
  objectType?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  subObjectType?: string | null;
  @IsString()
  @IsOptional()
  id?: string;
  @IsNumber()
  @IsOptional()
  subId?: number;
  @IsString()
  @IsOptional()
  @IsNullable()
  header?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  text?: string | null;
}

export class SearchResultsApiResponse implements ApiResponse<SearchResult[]> {
  @ValidateNested({ each: true })
  @Type(() => SearchResult)
  data: SearchResult[];
  @IsString()
  message: string;
}
