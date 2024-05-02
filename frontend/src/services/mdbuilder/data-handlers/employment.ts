import {
  OrgChangeEmail,
  OrgChangeEmployment,
  OrgChangeLogin,
  OrgChangeOrganizationEmployee,
  OrgChangePersonEmployeeDetail,
} from '@data-contracts/backend/data-contracts';
import { ApiResponse } from '@services/api-service';

export const handleGetAllEmployees: (
  res: ApiResponse<OrgChangeOrganizationEmployee[]>
) => OrgChangeOrganizationEmployee[] = (res) => {
  return res.data.map((data) => ({
    personId: data.personId || '',
    personNumber: data.personNumber || '',
    givenname: data.givenname || '',
    lastname: data.lastname || '',
    orgId: data.orgId || null,
    managerName: data.managerName || '',
    managerId: data.managerId || '',
    loginname: data.loginname || '',
    title: data.title || '',
    // orgChange
    employmentChangeIntentId: data.employmentChangeIntentId || '',
    employmentChangeIntentStarted: data.employmentChangeIntentStarted || false,
    movedToNewOrg: data.movedToNewOrg || false,
    newOrgId: data.newOrgId || null,
    paTeam: data.paTeam || '',
    newPATeam: data.newPATeam || '',
    paTeamName: data.paTeamName || '',
    newPATeamName: data.newPATeamName || '',
    operationName: data.operationName || null,
    operationCode: data.operationCode || null,
    newOperationCode: data.newOperationCode || null,
    newOperationName: data.newOperationName || null,
    activityCode: data.activityCode || null,
    activityName: data.activityName || null,
    newActivityCode: data.newActivityCode || null,
    newActivityName: data.newActivityName || null,
    projectCode: data.projectCode || null,
    projectName: data.projectName || null,
    newProjectCode: data.newProjectCode || null,
    newProjectName: data.newProjectName || null,
    objectCode: data.objectCode || null,
    objectName: data.objectName || null,
    newObjectCode: data.newObjectCode || null,
    newObjectName: data.newObjectName || null,
  }));
};

export const handleGetEmployeeDetails: (
  res: ApiResponse<OrgChangePersonEmployeeDetail>
) => OrgChangePersonEmployeeDetail = ({ data }) => ({
  personId: data.personId || '',
  personNumber: data.personNumber || '',
  givenname: data.givenname || '',
  middlename: data.middlename || '',
  lastname: data.lastname || '',
  friendlyGivenname: data.friendlyGivenname || '',
  customFriendlyGivenname: data.customFriendlyGivenname || '',
  workPhone: data.workPhone || '',
  workMobile: data.workMobile || '',

  logins:
    data.logins?.map((login: OrgChangeLogin) => ({
      loginname: login.loginname || null,
      displayname: login.displayname,
    })) || null,
  emails:
    data.emails?.map((email: OrgChangeEmail) => ({
      smtpAddress: email.smtpAddress || null,
      emailSystem: email.emailSystem,
    })) || null,
  employments:
    data.employments?.map((employment: OrgChangeEmployment) => ({
      title: employment.title || null,
      company: employment.company || null,
      department: employment.department || null,
      managerName: employment.managerName || null,
      isMainEmployment: employment.isMainEmployment || false,
      employmentId: employment.employmentId || null,
      hireDate: employment.hireDate || null,
      retireDate: employment.retireDate || null,
      // orgChange
      paTeam: employment.paTeam || '',
      paTeamName: employment.paTeamName || '',
      newPATeam: employment.newPATeam || '',
      newPATeamName: employment.newPATeamName || '',
      operationName: employment.operationName || '',
      operationCode: employment.operationCode || '',
      newOperationName: employment.newOperationName || '',
      newOperationCode: employment.newOperationCode || '',
      activityCode: employment.activityCode || '',
      activityName: employment.activityName || '',
      newActivityCode: employment.newActivityCode || '',
      newActivityName: employment.newActivityName || '',
      projectCode: employment.projectCode || '',
      projectName: employment.projectName || '',
      newProjectCode: employment.newProjectCode || '',
      newProjectName: employment.newProjectName || '',
      objectCode: employment.objectCode || '',
      objectName: employment.objectName || '',
      newObjectCode: employment.newObjectCode || '',
      newObjectName: employment.newObjectName || '',
      managerId: employment.managerId || '',
      newDepartment: employment.newDepartment || '',
      employmentChangeIntentId: employment.employmentChangeIntentId || '',
      employmentChangeIntentStarted: employment.employmentChangeIntentStarted || false,
      movedToNewOrg: employment.movedToNewOrg || false,
    })) || null,
});
