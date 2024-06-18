import { employeeDetails } from '../../../fixtures/employeeDetails';
import { employees } from '../../../fixtures/employees';
import { operations } from '../../../fixtures/operation';
import { responsibilities } from '../../../fixtures/responsibilities';

describe('/organization - Main', () => {
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
    cy.get('.items .sk-sidemenu-item .sk-sidemenu-item-label').contains('Norra grundskola').should('exist').click();
  });

  it('Interact with Nästa and Föregående', () => {
    // Check that page 1 is initially active and page 2 is not
    cy.get('button[aria-label="sida 1, Nuvarande sida"]').should('have.attr', 'aria-current', 'true');
    cy.get('button[aria-label="Gå till sida 2 av 3."]').should('have.attr', 'aria-current', 'false');

    // Click on the 'Nästa' button
    cy.get('button').contains('Nästa').click();

    // Check that page 2 is initially active and page 1 is not
    cy.get('button[aria-label="Gå till sida 1 av 3."]').should('have.attr', 'aria-current', 'false');
    cy.get('button[aria-label="sida 2, Nuvarande sida"]').should('have.attr', 'aria-current', 'true');

    // Click on the 'Föregående' button
    cy.get('button').contains('Föregående').click();

    // Check that page 1 is active again and page 2 is not
    cy.get('button[aria-label="sida 1, Nuvarande sida"]').should('have.attr', 'aria-current', 'true');
    cy.get('button[aria-label="Gå till sida 2 av 3."]').should('have.attr', 'aria-current', 'false');
  });
});
