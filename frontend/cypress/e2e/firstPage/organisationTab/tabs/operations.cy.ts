import { employeeDetails } from '../../../../fixtures/employeeDetails';
import { employees } from '../../../../fixtures/employees';
import { operations } from '../../../../fixtures/operation';
import { responsibilities } from '../../../../fixtures/responsibilities';

describe('/organization - Main - Tabs - Operations', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/responsibility/**/responsibilitysallleaves', responsibilities).as(
      'getResponsibilitiesAllLeaves'
    );
    cy.intercept('GET', '**/api/mdviewer/operation/**/operationallleaves', operations).as('getOperations');
    cy.intercept('GET', '**/api/mdviewer/employment/**/employeesallleaves', employees);
    cy.intercept(
      'GET',
      '**/api/mdviewer/employment/1234aa5b-a123-123a-a12b-1a234bd5eee/employeedetails',
      employeeDetails
    );

    cy.visit('/');

    cy.get('[data-cy="organization-tree"] .sk-menu-vertical-item-submenu-button-expand').first().click();
    cy.get('[data-cy="organization-tree"] ul [role="menuitem"]').contains('Norra grundskola').should('exist').click();
  });

  it('display content in main and test search', () => {
    // Wait for the XHR request to complete
    cy.wait('@getOperations');

    // Click the Verksamheter element
    cy.get('[data-cy="tab-operations"]').contains('Verksamheter (15)').click();

    // Check if correct content sample appears
    cy.get('.table-header').contains('Verksamheter (15)').should('be.visible');

    // Check the number of rows before search
    cy.get('.sk-table-tbody-tr').filter(':visible').should('have.length', 10);

    // Interact with the search input
    cy.get('.sk-search-field input[type="text"]').last().type('grundskola');

    // Check if the content changes to "Verksamheter (1)"
    cy.get('.table-header').contains('Verksamheter (1)').should('be.visible');

    // Check the number of rows after search
    cy.get('.sk-table-tbody-tr').filter(':visible').should('have.length', 1);

    // Check that the remaining row contains the correct data
    cy.get('.sk-table-tbody-tr')
      .filter(':visible')
      .within(() => {
        cy.get('td').eq(0).contains('Grundskola').should('be.visible');
        cy.get('td').eq(1).contains('440000').should('be.visible');
      });

    // Clear the search input
    cy.get('.sk-search-field input[type="text"]').last().clear();

    // Check if the content changes back to "Verksamheter (15)"
    cy.get('.table-header').contains('Verksamheter (15)').should('be.visible');

    // Check the number of rows after clearing the search
    cy.get('.sk-table-tbody-tr').filter(':visible').should('have.length', 10);

    // Check that the table contains the original data
    cy.get('.sk-table-tbody-tr')
      .filter(':visible')
      .eq(1)
      .within(() => {
        cy.get('td').eq(0).contains('Barn och utbildningskontoret').should('be.visible');
        cy.get('td').eq(1).contains('463000').should('be.visible');
      });
  });

  it('Filter table columns', () => {
    // Click the Verksamheter element
    cy.get('[data-cy="tab-operations"]').contains('Verksamheter (15)').click();

    // Click the "Visa/dölj kolumner i verksamheter" button
    cy.get('[data-cy="column-filter"] button[aria-haspopup="dialog"]').filter(':visible').click();

    // Check if the content has changed
    cy.get('[data-cy="column-filter"] button[aria-expanded="true"]').should('be.visible');

    // Click the "Dölj alla" button
    cy.get('button[type="button"]').contains('Dölj alla').click();

    // Check if "Verksamhetskod" header and content have disappeared
    cy.get('.sk-table-thead th').contains('Verksamhetskod').should('not.exist');
    cy.get('.sk-table-tbody td').contains('440000').should('not.exist');

    // Click the "Visa alla" button
    cy.get('button[type="button"]').contains('Visa alla').click();

    // Check if "Verksamhetskod" header and content have appered again
    cy.get('.sk-table-thead th').contains('Verksamhetskod').should('exist');
    cy.get('.sk-table-tbody td').contains('440000').should('exist');
  });

  it('Sort table columns', () => {
    cy.get('[data-cy="tab-operations"]').contains('Verksamheter (15)').click();

    // default sorted by Titel
    cy.get('.sk-table-tbody tr')
      .filter(':visible')
      .first()
      .contains('Asyl, introduktion och interna')
      .should('exist');
    cy.get('.sk-table-thead th').filter(':visible').contains('button', 'Titel').click();
    cy.get('.sk-table-tbody tr').filter(':visible').first().contains('Övergripande funktioner').should('exist');

    cy.get('.sk-table-thead th').filter(':visible').contains('button', 'Verksamhetskod').click();
    cy.get('.sk-table-tbody tr').filter(':visible').first().contains('407000').should('exist');
    cy.get('.sk-table-thead th').filter(':visible').contains('button', 'Verksamhetskod').click();
    cy.get('.sk-table-tbody tr').filter(':visible').first().contains('463000').should('exist');
  });
});
