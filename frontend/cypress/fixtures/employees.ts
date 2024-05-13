import { MDVEmployee } from '../../src/data-contracts/backend/data-contracts';
import { ApiResponse } from '../../src/services/api-service';

export const employees: ApiResponse<MDVEmployee[]> = {
  data: [
    {
      personId: '1234aa5b-a123-123a-a12b-1a234bd5eee',
      personNumber: '190001011234',
      givenname: 'NirJan',
      lastname: 'Abson',
      orgId: 199,
      workPhone: 'WorkPhone',
      workMobile: 'WorkMobile',
      loginname: 'PERSONAL\\Nir12Abs',
      title: 'Modersmålslärare (Sundsvalls kommun)',
      isManual: false,
      logins: [
        {
          loginname: 'PERSONAL\\Nir12Abs',
          displayname: 'AnnJan Ahsonzi',
        },
      ],
      emails: [{ smtpAddress: 'förnamn.efternamn@edu.sundsvall.se', emailSystem: 'GS' }],
      employments: [
        {
          title: 'Modersmålslärare (Sundsvalls kommun)',
          hireDate: '2022-04-01T00:00:00',
          retireDate: null,
          paTeam: null,
          department: 'BoU SG Arbetslag IMA',
          managerName: 'Greger Gregersson',
        },
      ],
    },
    {
      personId: '1234aa5b-a123-123a-a12b-1a234bd5eee',
      personNumber: '190001011234',
      givenname: 'SoJan',
      lastname: 'Abasson',
      orgId: 188,
      workPhone: 'WorkPhone',
      workMobile: 'WorkMobile',
      loginname: 'PERSONAL\\SoJ12Aba',
      title: 'Elevassistent (Sundsvalls kommun)',
      isManual: false,
      logins: [
        {
          loginname: 'PERSONAL\\SoJ12Aba',
          displayname: 'SoJan Abasson',
        },
      ],
      emails: [{ smtpAddress: 'förnamn.efternamn@edu.sundsvall.se', emailSystem: 'GS' }],
      employments: [
        {
          title: 'Elevassistent (Sundsvalls kommun)',
          hireDate: '2022-04-01T00:00:00',
          retireDate: null,
          paTeam: null,
          department: 'BoU SG Arbetslag IMA',
          managerName: 'Greger Gregersson',
        },
      ],
    },
    {
      personId: '1234aa5b-a123-123a-a12b-1a234bd5eee',
      personNumber: '200001011234',
      givenname: 'SJan',
      lastname: 'Absona',
      orgId: 188,
      workPhone: 'WorkPhone',
      workMobile: 'WorkMobile',
      loginname: 'PERSONAL\\SJa12Abs',
      title: 'Elevassistent (Sundsvalls kommun)',
      isManual: false,
      logins: [
        {
          loginname: 'PERSONAL\\SJa12Abs',
          displayname: 'SJan Absona',
        },
      ],
      emails: [{ smtpAddress: 'förnamn.efternamn@edu.sundsvall.se', emailSystem: 'GS' }],
      employments: [
        {
          title: 'Elevassistent (Sundsvalls kommun)',
          hireDate: '2022-04-01T00:00:00',
          retireDate: null,
          paTeam: null,
          department: 'BoU SG Arbetslag IMA',
          managerName: 'Greger Gregersson',
        },
      ],
    },
    {
      personId: '1234aa5b-a123-123a-a12b-1a234bd5eee',
      personNumber: '190001011234',
      givenname: 'TJan',
      lastname: 'Adson',
      orgId: 179,
      workPhone: 'WorkPhone',
      workMobile: 'WorkMobile',
      loginname: 'PERSONAL\\TJa12Ads',
      title: 'Lärare grundskola tidigare år (Sundsvalls kommun)',
      isManual: false,
      logins: [
        {
          loginname: 'PERSONAL\\TJa12Ads',
          displayname: 'TJan Adson',
        },
      ],
      emails: [{ smtpAddress: 'förnamn.efternamn@edu.sundsvall.se', emailSystem: 'GS' }],
      employments: [
        {
          title: 'Lärare grundskola tidigare år (Sundsvalls kommun)',
          hireDate: '2022-04-01T00:00:00',
          retireDate: null,
          paTeam: null,
          department: 'BoU SG Arbetslag IMA',
          managerName: 'Greger Gregersson',
        },
      ],
    },
    {
      personId: '1234aa5b-a123-123a-a12b-1a234bd5eee',
      personNumber: '190001011234',
      givenname: 'ArpJan',
      lastname: 'Aesonad',
      orgId: 199,
      workPhone: 'WorkPhone',
      workMobile: 'WorkMobile',
      loginname: 'PERSONAL\\Arp12Aes',
      title: 'Modersmålslärare (Sundsvalls kommun)',
      isManual: false,
      logins: [
        {
          loginname: 'PERSONAL\\Arp12Aes',
          displayname: 'ArpJan Aesonad',
        },
      ],
      emails: [{ smtpAddress: 'förnamn.efternamn@edu.sundsvall.se', emailSystem: 'GS' }],
      employments: [
        {
          title: 'Modersmålslärare (Sundsvalls kommun)',
          hireDate: '2022-04-01T00:00:00',
          retireDate: null,
          paTeam: null,
          department: 'BoU SG Arbetslag IMA',
          managerName: 'Greger Gregersson',
        },
      ],
    },
    {
      personId: '1234aa5b-a123-123a-a12b-1a234bd5eee',
      personNumber: '190001011234',
      givenname: 'LiJan',
      lastname: 'Ahsonn',
      orgId: 183,
      workPhone: 'WorkPhone',
      workMobile: 'WorkMobile',
      loginname: 'PERSONAL\\LiJ12Ahs',
      title: 'Skolkurator (Sundsvalls kommun)',
      isManual: false,
      logins: [
        {
          loginname: 'PERSONAL\\LiJ12Ahs',
          displayname: 'LiJan Ahsonn',
        },
      ],
      emails: [{ smtpAddress: 'förnamn.efternamn@edu.sundsvall.se', emailSystem: 'GS' }],
      employments: [
        {
          title: 'Skolkurator (Sundsvalls kommun)',
          hireDate: '2022-04-01T00:00:00',
          retireDate: null,
          paTeam: null,
          department: 'BoU SG Arbetslag IMA',
          managerName: 'Greger Gregersson',
        },
      ],
    },
    {
      personId: '1234aa5b-a123-123a-a12b-1a234bd5eee',
      personNumber: '190001011234',
      givenname: 'LiJan',
      lastname: 'Ahsontt',
      orgId: 179,
      workPhone: 'WorkPhone',
      workMobile: 'WorkMobile',
      loginname: 'PERSONAL\\LiJ12Ahs',
      title: 'Speciallärare (Sundsvalls kommun)',
      isManual: false,
      logins: [
        {
          loginname: 'PERSONAL\\LiJ12Ahs',
          displayname: 'LiJan Ahsontt',
        },
      ],
      emails: [{ smtpAddress: 'förnamn.efternamn@edu.sundsvall.se', emailSystem: 'GS' }],
      employments: [
        {
          title: 'Speciallärare (Sundsvalls kommun)',
          hireDate: '2022-04-01T00:00:00',
          retireDate: null,
          paTeam: null,
          department: 'BoU SG Arbetslag IMA',
          managerName: 'Greger Gregersson',
        },
      ],
    },
    {
      personId: '1234aa5b-a123-123a-a12b-1a234bd5eee',
      personNumber: '190001011234',
      givenname: 'LJan',
      lastname: 'Ahsontr',
      orgId: 190,
      workPhone: 'WorkPhone',
      workMobile: 'WorkMobile',
      loginname: 'PERSONAL\\LJa12Ahs',
      title: 'Barnskötare (Sundsvalls kommun)',
      isManual: false,
      logins: [
        {
          loginname: 'PERSONAL\\LJa12Ahs',
          displayname: 'LJan Ahsontr',
        },
      ],
      emails: [{ smtpAddress: 'förnamn.efternamn@edu.sundsvall.se', emailSystem: 'GS' }],
      employments: [
        {
          title: 'Barnskötare (Sundsvalls kommun)',
          hireDate: '2022-04-01T00:00:00',
          retireDate: null,
          paTeam: null,
          department: 'BoU SG Arbetslag IMA',
          managerName: 'Greger Gregersson',
        },
      ],
    },
    {
      personId: '1234aa5b-a123-123a-a12b-1a234bd5eee',
      personNumber: '190001011234',
      givenname: 'AnnJan',
      lastname: 'Ahsonzi',
      orgId: 1222,
      workPhone: 'WorkPhone',
      workMobile: 'WorkMobile',
      loginname: 'PERSONAL\\Ann12Ahs',
      title: 'Förstelärare (Sundsvalls kommun)',
      isManual: false,
      logins: [
        {
          loginname: 'PERSONAL\\Ann12Ahs',
          displayname: 'AnnJan Ahsonzi',
        },
      ],
      emails: [{ smtpAddress: 'förnamn.efternamn@edu.sundsvall.se', emailSystem: 'GS' }],
      employments: [
        {
          title: 'Förstelärare (Sundsvalls kommun)',
          hireDate: '2022-04-01T00:00:00',
          retireDate: null,
          paTeam: null,
          department: 'BoU SG Arbetslag IMA',
          managerName: 'Greger Gregersson',
        },
      ],
    },
    {
      personId: '1234aa5b-a123-123a-a12b-1a234bd5eee',
      personNumber: '190001011234',
      givenname: 'FaJan',
      lastname: 'Asony',
      orgId: 183,
      workPhone: 'WorkPhone',
      workMobile: 'WorkMobile',
      loginname: 'PERSONAL\\FaJ12Aso',
      title: 'Elevassistent (Sundsvalls kommun)',
      isManual: false,
      logins: [
        {
          loginname: 'PERSONAL\\FaJ12Aso',
          displayname: 'FaJan Asony',
        },
      ],
      emails: [{ smtpAddress: 'förnamn.efternamn@edu.sundsvall.se', emailSystem: 'GS' }],
      employments: [
        {
          title: 'Elevassistent (Sundsvalls kommun)',
          hireDate: '2022-04-01T00:00:00',
          retireDate: null,
          paTeam: null,
          department: 'BoU SG Arbetslag IMA',
          managerName: 'Greger Gregersson',
        },
      ],
    },
    {
      personId: '1234aa5b-a123-123a-a12b-1a234bd5eee',
      personNumber: '190001011234',
      givenname: 'PeriJan',
      lastname: 'Akson',
      orgId: 180,
      workPhone: 'WorkPhone',
      workMobile: 'WorkMobile',
      loginname: 'PERSONAL\\Per12Aks',
      title: 'Barnskötare (Sundsvalls kommun)',
      isManual: false,
      logins: [
        {
          loginname: 'PERSONAL\\Per12Aks',
          displayname: 'PeriJan Akson',
        },
      ],
      emails: [{ smtpAddress: 'förnamn.efternamn@edu.sundsvall.se', emailSystem: 'GS' }],
      employments: [
        {
          title: 'Barnskötare (Sundsvalls kommun)',
          hireDate: '2022-04-01T00:00:00',
          retireDate: null,
          paTeam: null,
          department: 'BoU SG Arbetslag IMA',
          managerName: 'Greger Gregersson',
        },
      ],
    },
    {
      personId: '1234aa5b-a123-123a-a12b-1a234bd5eee',
      personNumber: '200001011234',
      givenname: 'YoJan',
      lastname: 'Aksonhj',
      orgId: 183,
      workPhone: 'WorkPhone',
      workMobile: 'WorkMobile',
      loginname: 'PERSONAL\\YoJ12Aks',
      title: 'Elevassistent (Sundsvalls kommun)',
      isManual: false,
      logins: [
        {
          loginname: 'PERSONAL\\YoJ12Aks',
          displayname: 'YoJan Aksonhj',
        },
      ],
      emails: [{ smtpAddress: 'förnamn.efternamn@edu.sundsvall.se', emailSystem: 'GS' }],
      employments: [
        {
          title: 'Elevassistent (Sundsvalls kommun)',
          hireDate: '2022-04-01T00:00:00',
          retireDate: null,
          paTeam: null,
          department: 'BoU SG Arbetslag IMA',
          managerName: 'Greger Gregersson',
        },
      ],
    },
    {
      personId: '1234aa5b-a123-123a-a12b-1a234bd5eee',
      personNumber: '190001011234',
      givenname: 'MarJan',
      lastname: 'Aksonr',
      orgId: 199,
      workPhone: 'WorkPhone',
      workMobile: 'WorkMobile',
      loginname: 'PERSONAL\\Mar12Aks',
      title: 'Modersmålslärare (Sundsvalls kommun)',
      isManual: false,
      logins: [
        {
          loginname: 'PERSONAL\\Mar12Aks',
          displayname: 'MarJan Aksonr',
        },
      ],
      emails: [{ smtpAddress: 'förnamn.efternamn@edu.sundsvall.se', emailSystem: 'GS' }],
      employments: [
        {
          title: 'Modersmålslärare (Sundsvalls kommun)',
          hireDate: '2022-04-01T00:00:00',
          retireDate: null,
          paTeam: null,
          department: 'BoU SG Arbetslag IMA',
          managerName: 'Greger Gregersson',
        },
      ],
    },
    {
      personId: '1234aa5b-a123-123a-a12b-1a234bd5eee',
      personNumber: '190001011234',
      givenname: 'RaJan',
      lastname: 'Alsonel',
      orgId: 188,
      workPhone: 'WorkPhone',
      workMobile: 'WorkMobile',
      loginname: 'PERSONAL\\RaJ12Als',
      title: 'Elevassistent (Sundsvalls kommun)',
      isManual: false,
      logins: [
        {
          loginname: 'PERSONAL\\RaJ12Als',
          displayname: 'RaJan Alsonel',
        },
      ],
      emails: [{ smtpAddress: 'förnamn.efternamn@edu.sundsvall.se', emailSystem: 'GS' }],
      employments: [
        {
          title: 'Elevassistent (Sundsvalls kommun)',
          hireDate: '2022-04-01T00:00:00',
          retireDate: null,
          paTeam: null,
          department: 'BoU SG Arbetslag IMA',
          managerName: 'Greger Gregersson',
        },
      ],
    },
    {
      personId: '1234aa5b-a123-123a-a12b-1a234bd5eee',
      personNumber: '190001011234',
      givenname: 'HasJan Abdelhadi',
      lastname: 'Alsonazar',
      orgId: 184,
      workPhone: 'WorkPhone',
      workMobile: 'WorkMobile',
      loginname: 'PERSONAL\\Has12Als',
      title: 'Lärarassistent (Sundsvalls kommun)',
      isManual: false,
      logins: [
        {
          loginname: 'PERSONAL\\Has12Als',
          displayname: 'HasJan Alsonazar',
        },
      ],
      emails: [{ smtpAddress: 'förnamn.efternamn@edu.sundsvall.se', emailSystem: 'GS' }],
      employments: [
        {
          title: 'Lärarassistent (Sundsvalls kommun)',
          hireDate: '2022-04-01T00:00:00',
          retireDate: null,
          paTeam: null,
          department: 'BoU SG Arbetslag IMA',
          managerName: 'Greger Gregersson',
        },
      ],
    },
    {
      personId: '1234aa5b-a123-123a-a12b-1a234bd5eee',
      personNumber: '190001011234',
      givenname: 'Jan Jabbar',
      lastname: 'Alsonehad',
      orgId: 188,
      workPhone: 'WorkPhone',
      workMobile: 'WorkMobile',
      loginname: 'PERSONAL\\Jan12Als',
      title: 'Elevassistent outbildad (Sundsvalls kommun)',
      isManual: false,
      logins: [
        {
          loginname: 'PERSONAL\\Jan12Als',
          displayname: 'Jan Alsonehad',
        },
      ],
      emails: [{ smtpAddress: 'förnamn.efternamn@edu.sundsvall.se', emailSystem: 'GS' }],
      employments: [
        {
          title: 'Elevassistent outbildad (Sundsvalls kommun)',
          hireDate: '2022-04-01T00:00:00',
          retireDate: null,
          paTeam: null,
          department: 'BoU SG Arbetslag IMA',
          managerName: 'Greger Gregersson',
        },
      ],
    },
    {
      personId: '1234aa5b-a123-123a-a12b-1a234bd5eee',
      personNumber: '190001011234',
      givenname: 'RoJan',
      lastname: 'Alson',
      orgId: 199,
      workPhone: 'WorkPhone',
      workMobile: 'WorkMobile',
      loginname: 'PERSONAL\\RoJ12Als',
      title: 'Modersmålslärare (Sundsvalls kommun)',
      isManual: false,
      logins: [
        {
          loginname: 'PERSONAL\\RoJ12Als',
          displayname: 'RoJan Alson',
        },
      ],
      emails: [{ smtpAddress: 'förnamn.efternamn@edu.sundsvall.se', emailSystem: 'GS' }],
      employments: [
        {
          title: 'Modersmålslärare (Sundsvalls kommun)',
          hireDate: '2022-04-01T00:00:00',
          retireDate: null,
          paTeam: null,
          department: 'BoU SG Arbetslag IMA',
          managerName: 'Greger Gregersson',
        },
      ],
    },
    {
      personId: '1234aa5b-a123-123a-a12b-1a234bd5eee',
      personNumber: '190001011234',
      givenname: 'UrJan P O',
      lastname: 'Alsonerg',
      orgId: 1222,
      workPhone: 'WorkPhone',
      workMobile: 'WorkMobile',
      loginname: 'PERSONAL\\UrJ12Als',
      title: 'Lärare Grt SV/SO (Sundsvalls kommun)',
      isManual: false,
      logins: [
        {
          loginname: 'PERSONAL\\UrJ12Als',
          displayname: 'UrJan Alsonerg',
        },
      ],
      emails: [{ smtpAddress: 'förnamn.efternamn@edu.sundsvall.se', emailSystem: 'GS' }],
      employments: [
        {
          title: 'Lärare Grt SV/SO (Sundsvalls kommun)',
          hireDate: '2022-04-01T00:00:00',
          retireDate: null,
          paTeam: null,
          department: 'BoU SG Arbetslag IMA',
          managerName: 'Greger Gregersson',
        },
      ],
    },
    {
      personId: '1234aa5b-a123-123a-a12b-1a234bd5eee',
      personNumber: '190001011234',
      givenname: 'Jan',
      lastname: 'Alsonstad',
      orgId: 190,
      workPhone: 'WorkPhone',
      workMobile: 'WorkMobile',
      loginname: 'PERSONAL\\Jan12Als',
      title: 'Förskollärare (Sundsvalls kommun)',
      isManual: false,
      logins: [
        {
          loginname: 'PERSONAL\\Jan12Als',
          displayname: 'Jan Alsonstad',
        },
      ],
      emails: [{ smtpAddress: 'förnamn.efternamn@edu.sundsvall.se', emailSystem: 'GS' }],
      employments: [
        {
          title: 'Förskollärare (Sundsvalls kommun)',
          hireDate: '2022-04-01T00:00:00',
          retireDate: null,
          paTeam: null,
          department: 'BoU SG Arbetslag IMA',
          managerName: 'Greger Gregersson',
        },
      ],
    },
    {
      personId: '1234aa5b-a123-123a-a12b-1a234bd5eee',
      personNumber: '190001011234',
      givenname: 'SusaJan',
      lastname: 'Masonuss',
      orgId: 1222,
      workPhone: 'WorkPhone',
      workMobile: 'WorkMobile',
      loginname: 'PERSONAL\\Sus12Mas',
      title: 'Rektor Biträdande (Sundsvalls kommun)',
      isManual: false,
      logins: [
        {
          loginname: 'PERSONAL\\Sus12Mas',
          displayname: 'SusaJan Masonuss',
        },
      ],
      emails: [{ smtpAddress: 'förnamn.efternamn@edu.sundsvall.se', emailSystem: 'GS' }],
      employments: [
        {
          title: 'Rektor Biträdande (Sundsvalls kommun)',
          hireDate: '2022-04-01T00:00:00',
          retireDate: null,
          paTeam: null,
          department: 'BoU SG Arbetslag IMA',
          managerName: 'Greger Gregersson',
        },
      ],
    },
    {
      personId: '1234aa5b-a123-123a-a12b-1a234bd5eee',
      personNumber: '190001011234',
      givenname: 'CarJan',
      lastname: 'Hesonans',
      orgId: 182,
      workPhone: 'WorkPhone',
      workMobile: 'WorkMobile',
      loginname: 'PERSONAL\\Car12Hes',
      title: 'Lärare mellanstadiet (Sundsvalls kommun)',
      isManual: false,
      logins: [
        {
          loginname: 'PERSONAL\\Car12Hes',
          displayname: 'CarJan Hesonans',
        },
      ],
      emails: [{ smtpAddress: 'förnamn.efternamn@edu.sundsvall.se', emailSystem: 'GS' }],
      employments: [
        {
          title: 'Lärare mellanstadiet (Sundsvalls kommun)',
          hireDate: '2022-04-01T00:00:00',
          retireDate: null,
          paTeam: null,
          department: 'BoU SG Arbetslag IMA',
          managerName: 'Greger Gregersson',
        },
      ],
    },
  ],
  message: 'success',
};