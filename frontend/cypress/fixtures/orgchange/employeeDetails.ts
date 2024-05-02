import { OrgChangePersonEmployeeDetail } from '../../../src/data-contracts/backend/data-contracts';

export const orgChangeEmployeeDetails: OrgChangePersonEmployeeDetail = {
  personId: 'c76e7eb1-418a-4871-8c1d-6c70fe1fa50a',
  personNumber: '206194',
  givenname: 'Bob',
  middlename: 'middlename',
  lastname: 'Miller',
  friendlyGivenname: 'Bobbie',
  customFriendlyGivenname: 'Bobster',
  workPhone: '070-1234567',
  workMobile: '070-7654321',

  logins: [
    {
      loginname: '7069633307',
      displayname: 'Bob middlename Miller',
    },
  ],
  emails: [
    {
      smtpAddress: 'bob@mail.com',
      emailSystem: 'EX',
    },
  ],
  employments: [
    {
      title: 'Analyst',
      company: 'Sundsvalls kommun',
      department: 'Analysts',
      managerName: 'Vera',
      isMainEmployment: true,
      employmentId: null,
      hireDate: '2022-04-01T00:00:00',
      retireDate: null,
      // orgChange
      paTeam: 'PA3',
      paTeamName: 'PA Team Three',
      newPATeam: 'PA1',
      newPATeamName: 'PA Team One',
      operationName: 'Operation Three',
      operationCode: 'OP3',
      newOperationName: null,
      newOperationCode: null,
      managerId: 'bbeb32c0-1998-4ae5-996c-6cbf95a6e91e',
      newDepartment: null,
      employmentChangeIntentId: 'dd3cd53d-545b-4172-b6af-2bb0bebc5393',
      employmentChangeIntentStarted: true,
      movedToNewOrg: false,
    },
  ],
};
