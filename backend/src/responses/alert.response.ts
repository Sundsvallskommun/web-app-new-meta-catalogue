import { AlertBannerMessageSeverity, AlertBannerMessage as _AlertBannerMessage } from '@/interfaces/alert-banner.interface';
import ApiResponse from '@/interfaces/api-service.interface';
import { IsNullable } from '@/utils/custom-validation-classes';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class AlertBannerMessage implements _AlertBannerMessage {
  @IsNumber()
  @IsOptional()
  id: number;
  @IsString()
  message: string;
  @IsString()
  severity: AlertBannerMessageSeverity;
  @IsDate()
  @IsOptional()
  @IsNullable()
  fromDate?: Date | null;
  @IsDate()
  @IsOptional()
  @IsNullable()
  toDate?: Date | null;
}

export class AlertBannerMessageApiResponse implements ApiResponse<AlertBannerMessage> {
  @ValidateNested()
  @Type(() => AlertBannerMessage)
  data: AlertBannerMessage;
  @IsString()
  message: string;
}

export class AlertBannerMessageDeleteApiResponse implements Partial<ApiResponse<string>> {
  @IsString()
  message: string;
}
