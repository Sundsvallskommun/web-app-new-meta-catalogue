import {
  Email as _Email,
  Employment as _Employment,
  EmploymentWithChangeIntent as _EmploymentWithChangeIntent,
  Login as _Login,
  PersonEmployeeDetail as _PersonEmployeeDetail,
} from '@/data-contracts/mdbuilder/data-contracts';
import ApiResponse from '@/interfaces/api-service.interface';
import { IsNullable } from '@/utils/custom-validation-classes';
import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class OrgChangeOrganizationEmployee implements _EmploymentWithChangeIntent {
  @IsNumber()
  @IsOptional()
  /** @format int32 */
  orgId?: number;
  @IsOptional()
  @IsString()
  /** @format uuid */
  personId?: string;
  @IsString()
  @IsNullable()
  @IsOptional()
  personNumber?: string | null;
  @IsString()
  @IsNullable()
  @IsOptional()
  givenname?: string | null;
  @IsString()
  @IsNullable()
  @IsOptional()
  lastname?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  loginname?: string | null;
  @IsOptional()
  @IsString()
  @IsNullable()
  title?: string | null;
  @IsOptional()
  @IsString()
  @IsNullable()
  /** @format uuid */
  managerId?: string | null;
  @IsString()
  @IsNullable()
  @IsOptional()
  managerName?: string | null;
  @IsString()
  @IsNullable()
  @IsOptional()
  paTeam?: string | null;
  @IsString()
  @IsNullable()
  @IsOptional()
  paTeamName?: string | null;
  @IsString()
  @IsNullable()
  @IsOptional()
  newPATeam?: string | null;
  @IsString()
  @IsNullable()
  @IsOptional()
  newPATeamName?: string | null;
  @IsString()
  @IsNullable()
  @IsOptional()
  operationCode?: string | null;
  @IsString()
  @IsNullable()
  @IsOptional()
  operationName?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  newOperationCode?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  newOperationName?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  activityCode?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  activityName?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  newActivityCode?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  newActivityName?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  projectCode?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  projectName?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  newProjectCode?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  newProjectName?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  objectCode?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  objectName?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  newObjectCode?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  newObjectName?: string | null;
  @IsOptional()
  @IsNullable()
  @IsNumber()
  /** @format int32 */
  newOrgId?: number | null;
  @IsOptional()
  @IsBoolean()
  movedToNewOrg?: boolean;
  @IsOptional()
  @IsBoolean()
  employmentChangeIntentStarted?: boolean;
  @IsOptional()
  @IsString()
  @IsNullable()
  /** @format uuid */
  employmentChangeIntentId?: string | null;
}

export class OrgChangeOrganizationEmployeesApiResponse implements ApiResponse<OrgChangeOrganizationEmployee[]> {
  @ValidateNested({ each: true })
  @Type(() => OrgChangeOrganizationEmployee)
  data: OrgChangeOrganizationEmployee[];
  @IsString()
  message: string;
}

export class OrgChangeLogin implements _Login {
  @IsString()
  @IsOptional()
  @IsNullable()
  loginname?: string | null;
  @IsString()
  /** @minLength 1 */
  displayname: string;
}

export class OrgChangeEmail implements _Email {
  @IsString()
  @IsOptional()
  @IsNullable()
  smtpAddress?: string | null;
  @IsString()
  /** @minLength 1 */
  emailSystem: string;
}

export class OrgChangeEmployment implements _Employment {
  @IsString()
  @IsOptional()
  @IsNullable()
  title?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  /** @format date-time */
  hireDate?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  /** @format date-time */
  retireDate?: string | null;
  @IsNumber()
  @IsOptional()
  /** @format int32 */
  companyId?: number;
  @IsString()
  @IsOptional()
  @IsNullable()
  company?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  department?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  newDepartment?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  managerName?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  /** @format uuid */
  managerId?: string | null;
  @IsBoolean()
  @IsOptional()
  isMainEmployment?: boolean;
  @IsBoolean()
  @IsOptional()
  isManual?: boolean;
  @IsString()
  @IsOptional()
  @IsNullable()
  employmentId?: string | null;
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
  newPATeam?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  newPATeamName?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  operationCode?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  operationName?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  newOperationCode?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  newOperationName?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  activityCode?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  activityName?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  newActivityCode?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  newActivityName?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  projectCode?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  projectName?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  newProjectCode?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  newProjectName?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  objectCode?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  objectName?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  newObjectCode?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  newObjectName?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  /** @format uuid */
  employmentChangeIntentId?: string | null;
  @IsBoolean()
  @IsOptional()
  @IsNullable()
  movedToNewOrg?: boolean | null;
  @IsBoolean()
  @IsOptional()
  employmentChangeIntentStarted?: boolean;
}

export class OrgChangePersonEmployeeDetail implements _PersonEmployeeDetail {
  @IsString()
  @IsOptional()
  /** @format uuid */
  personId?: string;
  @IsString()
  @IsNullable()
  @IsOptional()
  personNumber?: string | null;
  @IsString()
  @IsNullable()
  @IsOptional()
  givenname?: string | null;
  @IsString()
  @IsNullable()
  @IsOptional()
  middlename?: string | null;
  @IsString()
  @IsNullable()
  @IsOptional()
  lastname?: string | null;
  @IsString()
  @IsNullable()
  @IsOptional()
  friendlyGivenname?: string | null;
  @IsString()
  @IsNullable()
  @IsOptional()
  customFriendlyGivenname?: string | null;
  @IsString()
  @IsNullable()
  @IsOptional()
  workPhone?: string | null;
  @IsString()
  @IsNullable()
  @IsOptional()
  @IsNullable()
  workMobile?: string | null;
  @IsOptional()
  @IsNullable()
  @ValidateNested({ each: true })
  @Type(() => OrgChangeLogin)
  logins?: OrgChangeLogin[] | null;
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OrgChangeEmail)
  @IsNullable()
  emails?: OrgChangeEmail[] | null;
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OrgChangeEmployment)
  @IsNullable()
  employments?: OrgChangeEmployment[] | null;
}

export class OrgChangePersonEmployeeDetailApiResponse implements ApiResponse<OrgChangePersonEmployeeDetail> {
  @ValidateNested()
  @Type(() => OrgChangePersonEmployeeDetail)
  data: OrgChangePersonEmployeeDetail;
  @IsString()
  message: string;
}
