import { user } from '../../fixtures/mockUser';

describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('main and h1 exists when logged out (otherwise autologin)', () => {
    cy.intercept('GET', '**/api/me', {
      statusCode: 401,
      body: {
        ...user.data,
      },
    }).as('getUser');

    cy.visit('/login?loggedout');
    cy.wait('@getUser');
    cy.get('main').should('exist');
    cy.get('h1').should('exist');
  });

  it('failMessage shows', () => {
    cy.visit('/login?failMessage=SAML_MISSING_ATTRIBUTES');

    cy.get('.form-error-message').contains('Användaren saknar rätt attribut').should('be.visible');
  });

  it('redirects correctly with path', () => {
    // notice: autologin is default now
    cy.intercept('**/saml/login?successRedirect=/', (req) => {
      // check if redirected at all
      Cypress.on('fail', () => {
        expect(req.query.path).to.equal('/');
        return false;
      });
    }).as('samlLogin');

    cy.visit('/login?path=/');
  });
});
