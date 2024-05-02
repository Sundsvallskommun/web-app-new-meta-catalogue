import { orgChangeEmployeeDetails } from '../../../../../../fixtures/orgchange/employeeDetails';
import { orgChangeEmployees } from '../../../../../../fixtures/orgchange/employees';
import { orgChangeProjects } from '../../../../../../fixtures/orgchange/projects';
import { orgChangeOperations } from '../../../../../../fixtures/orgchange/operations';
import { orgTreeLevel6 } from '../../../../../../fixtures/orgchange/orgTreeLevel6';
import { orgChangeResponsibilities } from '../../../../../../fixtures/orgchange/responsibilities';
import { beforeEachDraft } from '../../../../../../helpers/orgchange/beforeEachDraft';

describe('/hanteraorganisation - main - Tabs - People - Change Project', () => {
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
        cy.intercept('GET', '**/api/orgchange/project/13', {
          data: orgChangeProjects,
          message: 'success',
        }).as('getProjects');
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

  it('Change Project via person detail', () => {
    cy.get('button').contains('[title]', 'Öppna persondetaljer').first().click();
    cy.get('div[aria-modal="true"]').find('button').contains('[title]', 'Redigera anställning').click();

    cy.contains('button', 'Ändra projekt').click();

    cy.wait('@getProjects');

    cy.get('div[aria-modal="true"]').find('#project-edit-dropdown').click();
    cy.get('div[aria-modal="true"]').find('#project-edit-dropdown').clear();
    cy.get('div[aria-modal="true"]').find('#project-edit-dropdown').type('1000100');

    cy.get('.sk-form-combobox-list-option', { timeout: 2000 }).contains('1000100 - PARKPROJECT').click();
    cy.get('div[aria-modal="true"]').find('button').contains('Spara').click();
    cy.get('div').contains('Ändringar på projekt sparas').should('be.visible');
  });

  it('Change Project via selecting 1 person', () => {
    cy.get('input[aria-label="Bob Miller"]').click({ force: true });
    cy.get('button').contains('Hantera Markerade').click();

    cy.contains('button', 'Ändra projekt').click();

    cy.wait('@getProjects');

    cy.get('div[aria-modal="true"]').find('#project-edit-dropdown').click();
    cy.get('div[aria-modal="true"]').find('#project-edit-dropdown').clear();
    cy.get('div[aria-modal="true"]').find('#project-edit-dropdown').type('1000100');

    cy.get('.sk-form-combobox-list-option', { timeout: 2000 }).contains('1000100 - PARKPROJECT').click();
    cy.get('div[aria-modal="true"]').find('button').contains('Spara').click();
    cy.get('div').contains('Ändringar på projekt sparas').should('be.visible');
  });

  it('Change Project via choose all people', () => {
    cy.get('input[aria-label="Välj alla personer"]').click({ force: true });
    cy.get('button').contains('Hantera Markerade').click();

    cy.contains('button', 'Ändra projekt').click();

    cy.wait('@getProjects');

    cy.get('div[aria-modal="true"]').find('#project-edit-dropdown').click();
    cy.get('div[aria-modal="true"]').find('#project-edit-dropdown').clear();
    cy.get('div[aria-modal="true"]').find('#project-edit-dropdown').type('1000100');

    cy.get('.sk-form-combobox-list-option', { timeout: 2000 }).contains('1000100 - PARKPROJECT').click();
    cy.get('div[aria-modal="true"]').find('button').contains('Spara').click();
    cy.get('div').contains('Ändringar på projekt sparas').should('be.visible');
  });
});
