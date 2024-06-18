import { orgChangeEmployeeDetails } from '../../../../../../fixtures/orgchange/employeeDetails';
import { orgChangeEmployees } from '../../../../../../fixtures/orgchange/employees';
import { orgChangeActivities } from '../../../../../../fixtures/orgchange/activities';
import { orgChangeOperations } from '../../../../../../fixtures/orgchange/operations';
import { orgTreeLevel6 } from '../../../../../../fixtures/orgchange/orgTreeLevel6';
import { orgChangeResponsibilities } from '../../../../../../fixtures/orgchange/responsibilities';
import { beforeEachDraft } from '../../../../../../helpers/orgchange/beforeEachDraft';

describe('/hanteraorganisation - main - Tabs - People - Disconnect Activity', () => {
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
        cy.intercept('GET', '**/api/orgchange/activity/1', {
          data: orgChangeActivities,
          message: 'success',
        }).as('getActivities');
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

  it('Disconnect Activity via person detail', () => {
    cy.get('button').contains('[title]', 'Öppna persondetaljer').first().click();
    cy.get('div[aria-modal="true"]').find('button').contains('[title]', 'Redigera anställning').click();

    cy.contains('button', 'Ändra aktivitet').click();

    cy.wait('@getActivities');

    cy.contains('button', 'Koppla bort nuvarande aktivitet').click();
    cy.contains('button', 'Ja, koppla bort').click();

    cy.get('div').contains('Ändringar på aktivitet sparas').should('be.visible');
  });

  it('Disconnect Activity via selecting 1 person', () => {
    cy.get('input[aria-label="Bob Miller"]').click({ force: true });
    cy.get('button').contains('Hantera Markerade').click();

    cy.contains('button', 'Ändra aktivitet').click();

    cy.wait('@getActivities');

    cy.contains('button', 'Koppla bort nuvarande aktivitet').click();
    cy.contains('button', 'Ja, koppla bort').click();

    cy.get('div').contains('Ändringar på aktivitet sparas').should('be.visible');
  });

  it('Disconnect Activity via choose all people', () => {
    cy.get('input[aria-label="Välj alla personer"]').click({ force: true });
    cy.get('button').contains('Hantera Markerade').click();

    cy.contains('button', 'Ändra aktivitet').click();

    cy.wait('@getActivities');

    cy.contains('button', 'Koppla bort nuvarande aktivitet').click();
    cy.contains('button', 'Ja, koppla bort').click();

    cy.get('div').contains('Ändringar på aktivitet sparas').should('be.visible');
  });
});
