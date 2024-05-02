import { employeeDetails } from '../../../../fixtures/employeeDetails';
import { employees } from '../../../../fixtures/employees';
import { operations } from '../../../../fixtures/operation';
import { responsibilities } from '../../../../fixtures/responsibilities';

describe('/organization - Main - Tabs - Responsibilities', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/mdviewer/responsibility/**/responsibilitysallleaves', responsibilities).as(
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

    cy.get('.sk-sidemenu-body .sk-sidemenu-item .expand').first().click();
    cy.get('.items .sk-sidemenu-item .sk-sidemenu-item-label').contains('BOU Norra grundskola').should('exist').click();
  });

  it('Interact with Kopplade ansvar view', () => {
    // Click the Kopplade ansvar element
    cy.get('button#sk-tab-1-responsibilities').contains('Kopplade ansvar (3)').click();

    // Check if correct content sample appears
    cy.get('.table-header').contains('Kopplade ansvar (3)').should('be.visible');

    // Check the number of rows before search
    cy.get('.sk-zebratable-tbody-tr').filter(':visible').should('have.length', 3);

    // Interact with the search input
    cy.get('.list-filter .search-bar input[type="text"]').filter(':visible').type('borde visa "Inga ansvar att visa."');

    // Check if the content changes to "Kopplade ansvar (0)"
    cy.get('.table-header').filter(':visible').contains('Kopplade ansvar (0)').should('be.visible');

    cy.contains('div', 'Inga ansvar att visa.').should('be.visible');

    // Clear the search input
    cy.get('.list-filter .search-bar input[type="text"]').filter(':visible').clear();

    // Check if the content changes back to "Kopplade ansvar (3)"
    cy.get('.table-header').filter(':visible').contains('Kopplade ansvar (3)').should('be.visible');
  });

  it('Filter table columns', () => {
    cy.wait('@getResponsibilitiesAllLeaves');

    cy.get('button#sk-tab-1-responsibilities').contains('Kopplade ansvar (3)').click();

    cy.get('.dropdown-button').filter(':visible').click();

    cy.get('.filter-container').should('be.visible');

    // Click the "Dölj alla" button
    cy.get('button[type="button"]').contains('Dölj alla').click();
    // Check if zebratable header and content have disappeared
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Ansvarskod').should('not.exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('69990000').should('not.exist');
    // And if the appers again..
    cy.get('button[type="button"]').contains('Visa alla').click();
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Ansvarskod').should('exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('69990000').should('exist');

    // Uncheck the Ansvarstyp checkbox
    cy.contains('label', 'Ansvarstyp').click();
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Ansvarstyp').should('not.exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('Pseudoansvar').should('not.exist');
    // Check the Ansvarstyp checkbox
    cy.contains('label', 'Ansvarstyp').click();
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Ansvarstyp').should('exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('Pseudoansvar').should('exist');

    // Uncheck the Ansvarskod checkbox
    cy.contains('label', 'Ansvarskod').click();
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Ansvarskod').should('not.exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('69990000').should('not.exist');
    // Check the Ansvarskod checkbox
    cy.contains('label', 'Ansvarskod').click();
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Ansvarskod').should('exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('69990000').should('exist');

    // Uncheck the Giltig från checkbox
    cy.contains('label', 'Giltig från').click();
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Giltig från').should('not.exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('1799-12-31').should('not.exist');
    // Check the Giltig från checkbox
    cy.contains('label', 'Giltig från').click();
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Giltig från').should('exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('1799-12-31').should('exist');
  });

  it('Sort table columns', () => {
    cy.get('button#sk-tab-1-responsibilities').contains('Kopplade ansvar (3)').click();

    // default sorted by Titel
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('BoU Ans').should('exist');
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Titel').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('BoU Pseudo').should('exist');

    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Ansvarstyp').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('Ansvar').should('exist');
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Ansvarstyp').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('Pseudoansvar').should('exist');

    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Ansvarskod').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('69990000').should('exist');
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Ansvarskod').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('69990002').should('exist');

    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Giltig från').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('1799-12-31').should('exist');
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Giltig från').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('9999-12-31').should('exist');
  });
});
