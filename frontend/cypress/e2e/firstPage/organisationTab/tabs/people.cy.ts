import { employeeDetails } from '../../../../fixtures/employeeDetails';
import { employees } from '../../../../fixtures/employees';
import { operations } from '../../../../fixtures/operation';
import { responsibilities } from '../../../../fixtures/responsibilities';

describe('/organization - Main - Tabs - People', () => {
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

  it('Filter table columns', () => {
    cy.get('.dropdown-button').filter(':visible').click();

    // Check if the content has changed
    cy.get('.filter-container').should('be.visible');

    // Click the "Dölj alla" button
    cy.get('button[type="button"]').contains('Dölj alla').click();
    // Check if zebratable header and content have disappeared
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Pers.nr').should('not.exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('19000101').should('not.exist');
    // And if the appers again..
    cy.get('button[type="button"]').contains('Visa alla').click();
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Pers.nr').should('exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('19000101').should('exist');

    cy.contains('label', 'Pers.nr').click();
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Pers.nr').should('not.exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('19000101').should('not.exist');
    cy.contains('label', 'Pers.nr').click();
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Pers.nr').should('exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('19000101').should('exist');

    cy.contains('label', 'Anställning').click();
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Anställning').should('not.exist');
    cy.get('.sk-zebratable-tbody td')
      .filter(':visible')
      .contains('Förstelärare (Sundsvalls kommun)')
      .should('not.exist');
    cy.contains('label', 'Anställning').click();
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Anställning').should('exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('Förstelärare (Sundsvalls kommun)').should('exist');

    cy.contains('label', 'Anv. namn').click();
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Anv. namn').should('not.exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('Ann12Ahs').should('not.exist');
    cy.contains('label', 'Anv. namn').click();
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Anv. namn').should('exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('Ann12Ahs').should('exist');
  });

  it('Sort table columns', () => {
    // default sorted by Namn
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('AnnJan Ahsonzi').should('exist');
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Namn').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('YoJan Aksonhj').should('exist');

    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Pers.nr').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('190001011234').should('exist');
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Pers.nr').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('200001011234').should('exist');

    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Anställning').click();
    cy.get('.sk-zebratable-tbody tr')
      .filter(':visible')
      .first()
      .contains('Barnskötare (Sundsvalls kommun)')
      .should('exist');
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Anställning').click();
    cy.get('.sk-zebratable-tbody tr')
      .filter(':visible')
      .first()
      .contains('Speciallärare (Sundsvalls kommun)')
      .should('exist');

    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Anv. namn').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('Ann12Ahs').should('exist');
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Anv. namn').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('YoJ12Aks').should('exist');
  });

  it('Interact with "profile" popup', () => {
    cy.get('button[title="Öppna persondetaljer"]').first().click();

    cy.get('[aria-modal="true"]').contains('19000101').should('exist');

    cy.get('[aria-modal="true"]').contains('Användarinfo').should('exist');
    cy.get('[aria-modal="true"]').contains('E-postadresser').should('exist');
    cy.get('[aria-modal="true"]').contains('Anställning').should('exist');

    cy.get('svg[data-testid="CloseIcon"]').click();
  });

  it('Interact with "profile" popup  ->"Stäng" button', () => {
    cy.get('button[title="Öppna persondetaljer"]').first().click();

    cy.get('button').contains('Stäng').click();
  });
});
