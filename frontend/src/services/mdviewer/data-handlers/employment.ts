import { MDVEmployee } from '@data-contracts/backend/data-contracts';
import { ApiResponse } from '@services/api-service';

export const getADName = (loginname) => {
  if (loginname?.includes('\\')) {
    const split = loginname.split('\\');
    return split[split.length - 1];
  }
  return loginname;
};

export const handleGetEmployees: (res: ApiResponse<MDVEmployee[]>) => MDVEmployee[] = (res) => {
  return res.data.map((data) => ({
    personId: data.personId || '',
    personNumber: data.personNumber || '',
    givenname: data.givenname || '',
    lastname: data.lastname || '',
    friendlyGivenname: data.friendlyGivenname || '',
    orgId: data.orgId || null,
    workPhone: data.workPhone || '',
    workMobile: data.workMobile || '',
    loginname: data.loginname || '',
    title: data.title || '',
    isManual: data.isManual || false,

    logins:
      data.logins?.map((login) => ({
        loginname: login.loginname || null,
        displayname: login.displayname,
      })) || null,
    emails:
      data.emails?.map((email) => ({
        smtpAddress: email.smtpAddress || null,
        emailSystem: email.emailSystem,
      })) || null,
    employments:
      data.employments?.map((employment) => ({
        title: employment.title || null,
        hireDate: employment.hireDate || null,
        retireDate: employment.retireDate || null,
        paTeam: employment.paTeam || null,
        department: employment.department || null,
        managerName: employment.managerName || null,
      })) || null,
  }));
};

export const handleGetEmployee: (res: ApiResponse<MDVEmployee>) => MDVEmployee = ({ data }) => ({
  personId: data.personId || '',
  personNumber: data.personNumber || '',
  givenname: data.givenname || '',
  lastname: data.lastname || '',
  friendlyGivenname: data.friendlyGivenname || '',
  orgId: data.orgId || null,
  workPhone: data.workPhone || '',
  workMobile: data.workMobile || '',
  loginname: data.loginname || '',
  title: data.title || '',
  isManual: data.isManual || false,

  logins:
    data.logins?.map((login) => ({
      loginname: login.loginname || null,
      displayname: login.displayname,
    })) || null,
  emails:
    data.emails?.map((email) => ({
      smtpAddress: email.smtpAddress || null,
      emailSystem: email.emailSystem,
    })) || null,
  employments:
    data.employments?.map((employment) => ({
      title: employment.title || null,
      hireDate: employment.hireDate || null,
      retireDate: employment.retireDate || null,
      paTeam: employment.paTeam || null,
      department: employment.department || null,
      managerName: employment.managerName || null,
    })) || null,
});
