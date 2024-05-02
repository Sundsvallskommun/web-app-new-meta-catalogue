import { orgChangeEmployees } from '../../../../../fixtures/orgchange/employees';
import { orgChangeOperations } from '../../../../../fixtures/orgchange/operations';
import { orgTreeLevel6 } from '../../../../../fixtures/orgchange/orgTreeLevel6';
import { orgChangeResponsibilities } from '../../../../../fixtures/orgchange/responsibilities';
import { beforeEachDraft } from '../../../../../helpers/orgchange/beforeEachDraft';
import { orgTreeMovePeople } from '../../../../../fixtures/orgchange/orgTreeMovePeople';

describe('/hanteraorganisation - main - Tabs - People', () => {
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
      },
    });
    cy.get('aside button').contains('Uslands skola').click();
    cy.wait('@getEmployees');
    cy.get('main [role="tablist"]').contains('Personer (13)').click();
  });

  it('Search person', () => {
    cy.get('#sk-tab-panel-0-employees').find('table tbody tr').should('have.length', 10);

    cy.get('#sk-tab-panel-0-employees').find('input[placeholder="Sök i listan"]');
    cy.get('#sk-tab-panel-0-employees').find('input[placeholder="Sök i listan"]').click();
    cy.get('#sk-tab-panel-0-employees').find('input[placeholder="Sök i listan"]').type('Bob Miller');

    cy.get('#sk-tab-panel-0-employees').find('table tbody tr').should('have.length', 1);
  });

  it('Filter table columns', () => {
    cy.get('#sk-tab-panel-0-employees').contains('Visa/dölj kolumner i personer').click();

    // Click the "Dölj alla" button
    cy.get('button[type="button"]').contains('Dölj alla').click();
    // Check if zebratable header and content have disappeared
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Pers.nr').should('not.exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('206194').should('not.exist');
    // And if the appers again..
    cy.get('button[type="button"]').contains('Visa alla').click();
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Pers.nr').should('exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('206194').should('exist');

    // All visible

    cy.get('.dropdown-filter').contains('label', 'Namn').find('input').should('have.attr', 'aria-disabled', 'true');

    // checking Bob Miller
    cy.get('.dropdown-filter').contains('label', 'Pers.nr').click();
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Pers.nr').should('not.exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('206194').should('not.exist');
    cy.get('.dropdown-filter').contains('label', 'Pers.nr').click();
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Pers.nr').should('exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('206194').should('exist');

    cy.get('.dropdown-filter').contains('label', 'Anställning').click();
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Anställning').should('not.exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('Analyst').should('not.exist');
    cy.get('.dropdown-filter').contains('label', 'Anställning').click();
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Anställning').should('exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('Analyst').should('exist');

    cy.get('.dropdown-filter').contains('label', 'Anv. namn').click();
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Anv. namn').should('not.exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('Bob70Mil').should('not.exist');
    cy.get('.dropdown-filter').contains('label', 'Anv. namn').click();
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Anv. namn').should('exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('Bob70Mil').should('exist');

    cy.get('.dropdown-filter').contains('label', 'PA-Team').click();
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('PA-Team').should('not.exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('PA1').should('not.exist');
    cy.get('.dropdown-filter').contains('label', 'PA-Team').click();
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('PA-Team').should('exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('PA1').should('exist');

    cy.get('.dropdown-filter').contains('label', 'Verksamhet').click();
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Verksamhet').should('not.exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('OP3').should('not.exist');
    cy.get('.dropdown-filter').contains('label', 'Verksamhet').click();
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Verksamhet').should('exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('OP3').should('exist');

    cy.get('.dropdown-filter').contains('label', 'Objekt').click();
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Objekt').should('not.exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('ObjP3').should('not.exist');
    cy.get('.dropdown-filter').contains('label', 'Objekt').click();
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Objekt').should('exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('ObjP3').should('exist');

    cy.get('.dropdown-filter').contains('label', 'Aktivitet').click();
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Aktivitet').should('not.exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('ActP3').should('not.exist');
    cy.get('.dropdown-filter').contains('label', 'Aktivitet').click();
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Aktivitet').should('exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('ActP3').should('exist');

    cy.get('.dropdown-filter').contains('label', 'Projekt').click();
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Projekt').should('not.exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('ProP3').should('not.exist');
    cy.get('.dropdown-filter').contains('label', 'Projekt').click();
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Projekt').should('exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('ProP3').should('exist');

    cy.get('.dropdown-filter')
      .contains('label', 'Persondetaljer')
      .find('input')
      .should('have.attr', 'aria-disabled', 'true');

    cy.get('.dropdown-filter')
      .contains('label', 'Välj person')
      .find('input')
      .should('have.attr', 'aria-disabled', 'true');
  });

  it('Sort table columns', () => {
    cy.get('#sk-tab-panel-0-employees').contains('Visa/dölj kolumner i personer').click();
    cy.get('button[type="button"]').contains('Visa alla').click();

    // default sorted by Namn
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('Bob Miller').should('exist');
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Namn').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('Jack Jones').should('exist');

    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Pers.nr').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('012880').should('exist');
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Pers.nr').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('889842').should('exist');

    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Anställning').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('Accountant').should('exist');
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Anställning').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('Salesperson').should('exist');

    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Anv. namn').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('Bob70Mil').should('exist');
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Anv. namn').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('Jac13Jon').should('exist');

    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'PA-Team').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('PA1').should('exist');
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'PA-Team').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('PA4').should('exist');

    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Verksamhet').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('OP1').should('exist');
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Verksamhet').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('OP4').should('exist');

    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Objekt').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('ObjP1').should('exist');
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Objekt').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('ObjP5').should('exist');

    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Aktivitet').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('ActP1').should('exist');
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Aktivitet').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('ActP5').should('exist');

    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Projekt').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('ProP1').should('exist');
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Projekt').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('ProP5').should('exist');
  });

  it('Move 1 person', () => {
    cy.intercept('GET', '**/api/orgchange/draft/id-hash-Draftname3/tree', {
      data: orgTreeMovePeople,
      message: 'success',
    }).as('getOrgTree');
    cy.intercept('PUT', '**/api/orgchange/employment', {
      data: true,
      message: 'success',
    }).as('putEmployment');

    cy.visit('/hanteraorganisation/utkast/id-hash-Draftname3');
    cy.get('aside button').contains('Buslands område').click();

    cy.get('input[aria-label="Bob Miller"]').click({ force: true });
    cy.get('button').contains('Hantera Markerade').click();
    cy.get('button').contains('Flytta markerade till annan gren').click();

    cy.get('div[aria-modal="true"]').contains('label', 'Till gren').click();
    cy.get('div[aria-modal="true"]').contains('label', 'Till gren').type('Uslands skola');

    cy.contains('.sk-form-combobox-list-option', 'Uslands skola').click();

    cy.get('div[aria-modal="true"]').find('button').contains('Spara').click();

    cy.get('div[aria-modal="true"]').contains('Är du säker på att flytta 1 personer?').should('be.visible');

    cy.get('div[aria-modal="true"]').find('button').contains('Ja, Flytta').click();

    cy.get('div')
      .contains('Bob Miller flyttas från gren Buslands område nivå 6 till Uslands skola nivå 6')
      .should('be.visible');
  });

  it('Move all people', () => {
    cy.intercept('GET', '**/api/orgchange/draft/id-hash-Draftname3/tree', {
      data: orgTreeMovePeople,
      message: 'success',
    }).as('getOrgTree');
    cy.intercept('PUT', '**/api/orgchange/employment', {
      data: true,
      message: 'success',
    }).as('putEmployment');

    cy.visit('/hanteraorganisation/utkast/id-hash-Draftname3');
    cy.get('aside button').contains('Buslands område').click();

    cy.get('input[aria-label="Välj alla personer"]').click({ force: true });
    cy.get('button').contains('Hantera Markerade').click();
    cy.get('button').contains('Flytta markerade till annan gren').click();

    cy.get('div[aria-modal="true"]').contains('label', 'Till gren').click();
    cy.get('div[aria-modal="true"]').contains('label', 'Till gren').type('Uslands skola');

    cy.contains('.sk-form-combobox-list-option', 'Uslands skola').click();

    cy.get('div[aria-modal="true"]').find('button').contains('Spara').click();

    cy.get('div[aria-modal="true"]').contains('Är du säker på att flytta 13 personer?').should('be.visible');

    cy.get('div[aria-modal="true"]').find('button').contains('Ja, Flytta').click();

    cy.get('div')
      .contains('13 personer flyttas från gren Buslands område nivå 6 till Uslands skola nivå 6')
      .should('be.visible');
  });
});
