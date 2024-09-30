import ApiResponse from '@/interfaces/api-service.interface';
import { Permissions as IPermissions, InternalRoleEnum, UserData } from '@/interfaces/users.interface';
import { IsNullable } from '@/utils/custom-validation-classes';
import { InternalRole } from '@interfaces/users.interface';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsString, ValidateNested } from 'class-validator';

export class Permissions implements IPermissions {
  @IsBoolean()
  canEditSystemMessages: boolean;
  @IsBoolean()
  canViewEmployees: boolean;
  @IsBoolean()
  canViewEmployeeDetails: boolean;
  @IsBoolean()
  canEditEmployeeDetails: boolean;
  @IsBoolean()
  canViewResponsibility: boolean;
  @IsBoolean()
  canEditResponsibility: boolean;
  @IsBoolean()
  canViewOperation: boolean;
  @IsBoolean()
  canEditOperation: boolean;
  @IsBoolean()
  canEditOrganization: boolean;
  @IsBoolean()
  canViewDrafts: boolean;
  @IsBoolean()
  canEditDrafts: boolean;
  @IsBoolean()
  canEditOrganizationStructure: boolean;
  @IsBoolean()
  canCommentDraft: boolean;
}

export class User implements UserData {
  @IsString()
  name: string;
  @IsString()
  username: string;
  @IsEnum(InternalRoleEnum)
  role: InternalRole;
  @ValidateNested()
  @Type(() => Permissions)
  permissions: Permissions;
  @IsString()
  @IsNullable()
  /**
   * @format date
   * @example "2023-01-01"
   */
  readCommentsClearedDate: string | null;
}

export class UserApiResponse implements ApiResponse<User> {
  @ValidateNested()
  @Type(() => User)
  data: User;
  @IsString()
  message: string;
}
