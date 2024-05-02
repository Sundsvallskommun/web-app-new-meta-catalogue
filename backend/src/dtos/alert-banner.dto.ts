import { AlertBannerMessageSeverity } from '@/interfaces/alert-banner.interface';
import { IsNullable } from '@/utils/custom-validation-classes';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class AlertBannerDto {
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
