import { orgChangeEmployeeDetails } from '../../../../../../fixtures/orgchange/employeeDetails';
import { orgChangeEmployees } from '../../../../../../fixtures/orgchange/employees';
import { orgChangeOperations } from '../../../../../../fixtures/orgchange/operations';
import { orgTreeLevel6 } from '../../../../../../fixtures/orgchange/orgTreeLevel6';
import { orgChangeResponsibilities } from '../../../../../../fixtures/orgchange/responsibilities';
import { beforeEachDraft } from '../../../../../../helpers/orgchange/beforeEachDraft';

describe('/hanteraorganisation - main - Tabs - People - Change Operation', () => {
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

  it('Change operation via person detail - operation not in organization', () => {
    cy.intercept('GET', '**/api/orgchange/operation/organization/**', {
      data: orgChangeOperations,
      message: 'success',
    }).as('getOperations');

    cy.get('button[title="Öppna persondetaljer, justeringar behövs"]').first().click();
    cy.get('div[aria-modal="true"]').find('button[title="Redigera anställning, justeringar behövs"]').click();
    cy.get('div[aria-modal="true"]').find('button').contains('Ändra verksamhet').click();

    cy.contains(
      '#orgchange-employment-operation-error',
      'Nuvarande verksamhet "Operation Three - OP3" finns inte tillgänglig i CDE Uslands skola (Nivå 6). Var god välj en i listan.'
    );

    cy.get('div[aria-modal="true"]').contains('select', 'Test Description 63 - 87');
    cy.get('select').select('Test Description 95 - 25');

    cy.get('div[aria-modal="true"]').find('button').contains('Spara').click();

    cy.get('div').contains('Ändringar på verksamhet sparas').should('be.visible');
  });

  it('Change operation via person detail', () => {
    cy.get('button').contains('[title]', 'Öppna persondetaljer').first().click();
    cy.get('div[aria-modal="true"]').find('button').contains('[title]', 'Redigera anställning').click();

    cy.get('div[aria-modal="true"]').find('button').contains('Ändra verksamhet').click();

    cy.get('div[aria-modal="true"]').contains('select', 'Test Description 63 - 87');
    cy.get('select').select('Test Description 95 - 25');

    cy.get('div[aria-modal="true"]').find('button').contains('Spara').click();

    cy.get('div').contains('Ändringar på verksamhet sparas').should('be.visible');
  });

  it('Change operation via selecting 1 person', () => {
    cy.get('input[aria-label="Bob Miller"]').click({ force: true });
    cy.get('button').contains('Hantera Markerade').click();
    cy.get('button').contains('Ändra verksamhet').click();

    cy.get('div[aria-modal="true"]').contains('select', 'Test Description 63 - 87');
    cy.get('select').select('Test Description 95 - 25');

    cy.get('div[aria-modal="true"]').find('button').contains('Spara').click();

    cy.get('div').contains('Ändringar på verksamhet sparas').should('be.visible');
  });

  it('Change operation via selecting all people', () => {
    cy.get('input[aria-label="Välj alla personer"]').click({ force: true });
    cy.get('button').contains('Hantera Markerade').click();
    cy.get('button').contains('Ändra verksamhet').click();

    cy.get('div[aria-modal="true"]').contains('select', 'Test Description 63 - 87');
    cy.get('select').select('Test Description 95 - 25');

    cy.get('div[aria-modal="true"]').find('button').contains('Spara').click();

    cy.get('div').contains('Ändringar på verksamhet sparas').should('be.visible');
  });
});
