import { orgChangeEmployeeDetails } from '../../../../../../fixtures/orgchange/employeeDetails';
import { orgChangeEmployees } from '../../../../../../fixtures/orgchange/employees';
import { orgChangeOperations } from '../../../../../../fixtures/orgchange/operations';
import { orgTreeLevel6 } from '../../../../../../fixtures/orgchange/orgTreeLevel6';
import { paTeamAndManagerSearchResults } from '../../../../../../fixtures/orgchange/paTeamAndManagerSearchResults';
import { paTeamSearchResults } from '../../../../../../fixtures/orgchange/paTeamSearchResults';
import { orgChangeResponsibilities } from '../../../../../../fixtures/orgchange/responsibilities';
import { beforeEachDraft } from '../../../../../../helpers/orgchange/beforeEachDraft';

describe('/hanteraorganisation - main - Tabs - People - Change PA-Team', () => {
  beforeEach(() => {
    beforeEachDraft({
      orgTree: orgTreeLevel6,
      intercepts: () => {
        cy.intercept('GET', '**/api/orgchange/operation/organization/**', {
          data: orgChangeOperations,
          message: 'success',
        }).as('getOperations');
        cy.intercept('GET', '**/api/orgchange/employment/**', { data: orgChangeEmployees, message: 'success' }).as(
          'getEmployees'
        );
        cy.intercept('GET', '**/api/orgchange/responsibility/**', {
          data: orgChangeResponsibilities,
          message: 'success',
        }).as('getResponsibilities');
        cy.intercept('GET', '**/api/orgchange/employment/**/detail', {
          data: orgChangeEmployeeDetails,
          message: 'success',
        }).as('getEmployeeDetail');

        cy.intercept('GET', '**/api/orgchange/pateam/search?query=PA1', {
          data: paTeamSearchResults,
          message: 'success',
        }).as('getPATeamSearchInit');
        cy.intercept('GET', '**/api/orgchange/pateam?managerId=bbeb32c0-1998-4ae5-996c-6cbf95a6e91e', {
          data: paTeamAndManagerSearchResults,
          message: 'success',
        }).as('getPATeamManagerSearchInit');

        cy.intercept('GET', '**/api/orgchange/pateam/search?query=PA3', {
          data: paTeamSearchResults,
          message: 'success',
        }).as('getPATeamSearch');
        cy.intercept('GET', '**/api/orgchange/pateam?managerId=new-guid', {
          data: paTeamAndManagerSearchResults,
          message: 'success',
        }).as('getPATeamManagerSearch');
        cy.intercept('PUT', '**/api/orgchange/employment', {
          data: true,
          message: 'success',
        }).as('putEmployment');
      },
    });
    cy.get('aside button').contains('Uslands skola').click();
    cy.wait('@getEmployees');
    cy.get('main [role="tablist"]').contains('Personer (13)').click();
  });

  it('Change PA-Team via person detail', () => {
    cy.get('button').contains('[title]', 'Öppna persondetaljer').first().click();
    cy.get('div[aria-modal="true"]').find('button').contains('[title]', 'Redigera anställning').click();

    cy.get('div[aria-modal="true"]').find('button').contains('Ändra PA-Team').click();

    cy.get('div[aria-modal="true"]').find('#pateam-edit-dropdown').click();
    cy.get('div[aria-modal="true"]').find('#pateam-edit-dropdown').clear();
    cy.get('div[aria-modal="true"]').find('#pateam-edit-dropdown').type('PA3');

    cy.wait('@getPATeamSearch').then((interception) => {
      expect(interception?.response?.statusCode).to.eq(200);
    });

    cy.get('.sk-form-combobox-list-option', { timeout: 2000 }).contains('PA3').click();

    cy.get('div[aria-modal="true"]').find('button').contains('Spara').click();

    cy.get('div').contains('Ändringar på PA-Team sparas').should('be.visible');
  });

  it('Change PA-Team via selecting 1 person', () => {
    cy.get('input[aria-label="Bob Miller"]').click({ force: true });
    cy.get('button').contains('Hantera Markerade').click();
    cy.get('button').contains('Ändra PA-Team').click();

    cy.get('div[aria-modal="true"]').find('#pateam-edit-dropdown').click();
    cy.get('div[aria-modal="true"]').find('#pateam-edit-dropdown').clear();
    cy.get('div[aria-modal="true"]').find('#pateam-edit-dropdown').type('PA3');

    cy.wait('@getPATeamSearch').then((interception) => {
      expect(interception?.response?.statusCode).to.eq(200);
    });

    cy.get('.sk-form-combobox-list-option', { timeout: 2000 }).contains('PA3').click();

    cy.get('div[aria-modal="true"]').find('button').contains('Spara').click();

    cy.get('div').contains('Ändringar på PA-Team sparas').should('be.visible');
  });

  it('Change PA-Team via choose all people', () => {
    cy.get('input[aria-label="Välj alla personer"]').click({ force: true });
    cy.get('button').contains('Hantera Markerade').click();
    cy.get('button').contains('Ändra PA-Team').click();
    cy.get('div[aria-modal="true"]').find('#pateam-edit-dropdown').click();
    cy.get('div[aria-modal="true"]').find('#pateam-edit-dropdown').clear();
    cy.get('div[aria-modal="true"]').find('#pateam-edit-dropdown').type('PA3');

    cy.wait('@getPATeamSearch').then((interception) => {
      expect(interception?.response?.statusCode).to.eq(200);
    });

    cy.get('.sk-form-combobox-list-option', { timeout: 2000 }).contains('PA3').click();

    cy.get('div[aria-modal="true"]').find('button').contains('Spara').click();

    cy.get('div').contains('Ändringar på PA-Team sparas').should('be.visible');
  });
});
