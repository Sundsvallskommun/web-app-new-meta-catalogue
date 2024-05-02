import { orgChangeEmployeeDetails } from '../../../../../../fixtures/orgchange/employeeDetails';
import { orgChangeEmployees } from '../../../../../../fixtures/orgchange/employees';
import { orgChangeObjects } from '../../../../../../fixtures/orgchange/objects';
import { orgChangeOperations } from '../../../../../../fixtures/orgchange/operations';
import { orgTreeLevel6 } from '../../../../../../fixtures/orgchange/orgTreeLevel6';
import { orgChangeResponsibilities } from '../../../../../../fixtures/orgchange/responsibilities';
import { beforeEachDraft } from '../../../../../../helpers/orgchange/beforeEachDraft';

describe('/hanteraorganisation - main - Tabs - People - Disconnect Object', () => {
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
        cy.intercept('GET', '**/api/orgchange/object/13', {
          data: orgChangeObjects,
          message: 'success',
        }).as('getObjects');
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

  it('Disconnect Object via person detail', () => {
    cy.get('button').contains('[title]', 'Öppna persondetaljer').first().click();
    cy.get('div[aria-modal="true"]').find('button').contains('[title]', 'Redigera anställning').click();

    cy.contains('button', 'Ändra objekt').click();

    cy.wait('@getObjects');

    cy.contains('button', 'Koppla bort nuvarande objekt').click();
    cy.contains('button', 'Ja, koppla bort').click();

    cy.get('div').contains('Ändringar på objekt sparas').should('be.visible');
  });

  it('Disconnect Object via selecting 1 person', () => {
    cy.get('input[aria-label="Bob Miller"]').click({ force: true });
    cy.get('button').contains('Hantera Markerade').click();

    cy.contains('button', 'Ändra objekt').click();

    cy.wait('@getObjects');

    cy.contains('button', 'Koppla bort nuvarande objekt').click();
    cy.contains('button', 'Ja, koppla bort').click();

    cy.get('div').contains('Ändringar på objekt sparas').should('be.visible');
  });

  it('Disconnect Object via choose all people', () => {
    cy.get('input[aria-label="Välj alla personer"]').click({ force: true });
    cy.get('button').contains('Hantera Markerade').click();

    cy.contains('button', 'Ändra objekt').click();

    cy.wait('@getObjects');

    cy.contains('button', 'Koppla bort nuvarande objekt').click();
    cy.contains('button', 'Ja, koppla bort').click();

    cy.get('div').contains('Ändringar på objekt sparas').should('be.visible');
  });
});
