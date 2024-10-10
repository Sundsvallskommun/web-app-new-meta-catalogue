import { user } from '../../fixtures/mockUser';

describe('Login', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/me', user).as('getUser');
  });

  it('main and h1 exists when logged out (otherwise autologin)', () => {
    cy.visit('/login?loggedout');
    cy.wait('@getUser');
    cy.get('main').should('exist');
    cy.get('h1').should('exist');
  });

  it('failMessage shows', () => {
    cy.visit('/login?failMessage=SAML_MISSING_ATTRIBUTES');
    cy.wait('@getUser');
    cy.get('.form-error-message').contains('Användaren saknar rätt attribut').should('be.visible');
  });
});
