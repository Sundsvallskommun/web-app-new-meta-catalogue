import { employeeDetails } from '../../fixtures/employeeDetails';
import { employees } from '../../fixtures/employees';
import { operations } from '../../fixtures/operation';
import { responsibilities } from '../../fixtures/responsibilities';
import { search } from '../../fixtures/search';

describe('Tab menu', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Tab menu should have two items', () => {
    cy.get('[data-cy="tabMenu"] ul li').should('have.length', 2);
  });

  it('Active tab should be Organisation', () => {
    cy.get('[data-cy="tabMenu"] ul li').contains('Organisation');
  });

  it('Switch to Ansvar tab', () => {
    cy.intercept('GET', '**/api/mdviewer/responsibility/responsibilities', responsibilities).as('responsibilities');
    cy.get('[data-cy="tabMenu"] ul li').contains('Ansvar').click();
    cy.get('[data-cy="tabMenu"] ul li').contains('Ansvar');
  });

  it('Search - should be visible', () => {
    cy.get('.GlobalSearch').should('be.visible');
  });

  it('Search - input should have a placeholder "Sök i all data"', () => {
    cy.get('[data-cy="search"]').should('have.attr', 'placeholder', 'Sök i all data');
  });

  it('Search - input should be empty initially', () => {
    cy.get('[data-cy="search"]').should('have.value', '');
  });

  it('Search - check results and click close button', () => {
    cy.intercept('GET', '**/api/mdviewer/search/Sample%20search/search', search);
    cy.get('[data-cy="search"]').should('not.be.disabled').type('Sample search');
    cy.get('[data-cy="search-results-query"]').contains('Sökord');
    cy.get('[data-cy="search-results-amount"]').contains('3 sökresultat:');

    cy.get('[data-cy="search"] + .form-input-addin-right button').click();
    cy.get('[data-cy="search"]').should('have.attr', 'placeholder', 'Sök i all data');
  });

  it('Search - Navigate search result item - show organization', () => {
    cy.intercept('GET', '**/api/mdviewer/responsibility/**/responsibilities', responsibilities).as('responsibilities');
    cy.intercept('GET', '**/api/mdviewer/operation/**/operation', operations).as('getOperations');
    cy.intercept('GET', '**/api/mdviewer/employment/**/employees', employees);
    cy.intercept('GET', '**/api/mdviewer/search/Sample%20search/search', search);

    cy.get('[data-cy="search"]').should('not.be.disabled').type('Sample search');

    // Navigate search result item - show organization
    cy.get('button').contains('Visa organisation').click();
    cy.get('h1').contains('Bosvedjeskolan');
  });

  it('Search - Navigate search result item - show in organization', () => {
    cy.intercept('GET', '**/api/mdviewer/responsibility/**/responsibilities', responsibilities).as('responsibilities');
    cy.intercept('GET', '**/api/mdviewer/operation/**/operation', operations).as('getOperations');
    cy.intercept('GET', '**/api/mdviewer/employment/**/employees', employees);
    cy.intercept('GET', '**/api/mdviewer/search/Sample%20search/search', search);

    cy.get('[data-cy="search"]').should('not.be.disabled').type('Sample search');

    // Navigate search result item - show in organization
    cy.get('button').contains('Visa i organisation').click();
    cy.get('h1').contains('Bosvedjeskolan');
  });

  it('Search - Navigate search result item - show person', () => {
    cy.intercept('GET', '**/api/mdviewer/responsibility/**/responsibilities', responsibilities).as('responsibilities');
    cy.intercept('GET', '**/api/mdviewer/operation/**/operation', operations).as('getOperations');
    cy.intercept('GET', '**/api/mdviewer/employment/**/employees', employees);
    cy.intercept(
      'GET',
      '**/api/mdviewer/employment/1234aa5b-a123-123a-a12b-1a234bd5eee/employeedetails',
      employeeDetails
    );

    cy.intercept('GET', '**/api/mdviewer/search/Sample%20search/search', search);
    cy.get('[data-cy="search"]').should('not.be.disabled').type('Sample search');

    // Navigate search result item - show person
    cy.get('button').contains('Visa person').click();
    cy.get('.PersonEditor', { timeout: 3000 }).contains('AnnJan Ahsonzi');
  });
});
