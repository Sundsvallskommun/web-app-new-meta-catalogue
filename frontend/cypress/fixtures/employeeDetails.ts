import { EmployeeDetailsApiResponse } from '../../src/data-contracts/backend/data-contracts';

export const employeeDetails: EmployeeDetailsApiResponse = {
  data: {
    personId: '46ad9ad9-f253-405f-83aa-a5bdf23d6282',
    personNumber: '190001011234',
    givenname: 'AnnJan',
    lastname: 'Ahsonzi',
    friendlyGivenname: 'aloha',
    orgId: -1,
    workPhone: null,
    workMobile: null,
    title: null,
    isManual: false,
    logins: [
      {
        loginname: 'PERSONAL\\abc12acb',
        displayname: 'AnnJan Ahsonzi',
      },
    ],
    emails: [{ smtpAddress: 'förnamn.efternamn@edu.sundsvall.se', emailSystem: 'GS' }],
    employments: [
      {
        title: 'Gymnasielärare',
        hireDate: '2022-04-01T00:00:00',
        retireDate: null,
        paTeam: null,
        department: 'BoU SG Arbetslag IMA',
        managerName: 'Greger Gregersson',
      },
    ],
  },
  message: 'success',
};
