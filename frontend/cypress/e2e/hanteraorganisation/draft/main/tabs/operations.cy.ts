import { orgChangeEmployees } from '../../../../../fixtures/orgchange/employees';
import { orgChangeOperations } from '../../../../../fixtures/orgchange/operations';
import { orgChangeOperationsByCompany } from '../../../../../fixtures/orgchange/operationsByCompany';
import { orgTreeLevel6 } from '../../../../../fixtures/orgchange/orgTreeLevel6';
import { orgChangeResponsibilities } from '../../../../../fixtures/orgchange/responsibilities';
import { beforeEachDraft } from '../../../../../helpers/orgchange/beforeEachDraft';

describe('/hanteraorganisation - main - Tabs - Operations', () => {
  beforeEach(() => {
    beforeEachDraft({
      orgTree: orgTreeLevel6,
      intercepts: () => {
        cy.intercept('GET', '**/api/orgchange/operation/organization/**', {
          data: orgChangeOperations,
          message: 'success',
        }).as('getOrgOperations');
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
    cy.wait('@getOrgOperations');
    cy.get('main [role="tablist"]').contains('Verksamheter (4)').click();
  });

  it('Search operations', () => {
    cy.get('#sk-tab-panel-2-operations').find('table tbody tr').should('have.length', 4);

    cy.get('#sk-tab-panel-2-operations').find('input[placeholder="Sök i listan"]');
    cy.get('#sk-tab-panel-2-operations').find('input[placeholder="Sök i listan"]').click();
    cy.get('#sk-tab-panel-2-operations').find('input[placeholder="Sök i listan"]').type('Test Description 63');

    cy.get('#sk-tab-panel-2-operations').find('table tbody tr').should('have.length', 1);
  });

  it('Filter table columns', () => {
    cy.get('#sk-tab-panel-2-operations').contains('Visa/dölj kolumner i verksamheter').click();

    // Click the "Dölj alla" button
    cy.get('button[type="button"]').contains('Dölj alla').click();
    // Check if zebratable header and content have disappeared
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Verksamhetskod').should('not.exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('87').should('not.exist');
    // And if the appers again..
    cy.get('button[type="button"]').contains('Visa alla').click();
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Verksamhetskod').should('exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('87').should('exist');

    // All visible

    cy.get('.dropdown-filter').contains('label', 'Titel').find('input').should('have.attr', 'aria-disabled', 'true');

    // checking Bob Miller
    cy.get('.dropdown-filter').contains('label', 'Verksamhetskod').click();
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Verksamhetskod').should('not.exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('87').should('not.exist');
    cy.get('.dropdown-filter').contains('label', 'Verksamhetskod').click();
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Verksamhetskod').should('exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('87').should('exist');

    cy.get('.dropdown-filter')
      .contains('label', 'Ta bort verksamhet')
      .find('input')
      .should('have.attr', 'aria-disabled', 'true');
  });

  it('Sort table columns', () => {
    // default sorted by Titel
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('Test Description 20').should('exist');
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Titel').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('Test Description 95').should('exist');

    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Verksamhetskod').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('25').should('exist');
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Verksamhetskod').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('87').should('exist');
  });

  it('Connect operation', () => {
    cy.intercept('GET', '**/api/orgchange/operation/1', {
      data: orgChangeOperationsByCompany,
      message: 'success',
    }).as('getOperations');
    cy.intercept('PUT', '**/api/orgchange/operation/connect', {
      data: true,
      message: 'success',
    }).as('putConnect');

    cy.get('button').contains('Koppla på verksamhet').click();

    // should be filtered away since already connected
    cy.get('#operation-searchconnect-dropdown').type('87');
    cy.contains('.sk-form-combobox-list-option', '87').should('not.exist');

    cy.get('#operation-searchconnect-dropdown').clear();

    // should exist
    cy.get('#operation-searchconnect-dropdown').type('99');
    cy.contains('.sk-form-combobox-list-option', '99 - Test Description 99').click();

    cy.get('[aria-modal="true"] button').contains('Spara').click();

    cy.get('div').contains('Verksamheten kopplas till grenen').should('be.visible');
  });

  it('Disconnect operation', () => {
    cy.intercept('GET', '**/api/orgchange/operation/1', {
      data: orgChangeOperationsByCompany,
      message: 'success',
    }).as('getOperations');
    cy.intercept('PUT', '**/api/orgchange/operation/disconnect', {
      data: true,
      message: 'success',
    }).as('putDisconnect');

    cy.get('button').contains('Koppla bort').first().click();

    cy.get('[aria-modal="true"]').contains('Är du säker på att du vill koppla bort verksamheten?').should('be.visible');

    cy.get('[aria-modal="true"] button').contains('Ja, koppla bort').click();

    cy.get('div').contains('Verksamheten har kopplats bort').should('be.visible');
  });
});
