describe('System', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('displays the correct title', () => {
    cy.contains('span', 'Masterdata').should('exist');
    cy.contains('a', 'Organisation').should('exist');
  });

  it('has a skip to content link', () => {
    cy.get('[data-cy="systemMessage-a"]')
      .should('have.attr', 'accesskey', 's')
      .should('have.attr', 'href', '/#content')
      .contains('Hoppa till innehåll');
  });

  it('has the correct alert banner', () => {
    cy.get('[data-cy="alert-banner"]')
      .should('be.visible')
      .within(() => {
        cy.get('[data-testid="ErrorIcon"]').should('be.visible');
        cy.get('[data-testid="ModeEditOutlinedIcon"]').should('be.visible');
      });
  });

  it('Edits system message', () => {
    // // Add the intercept for PATCH request and assign an alias
    cy.intercept('PATCH', '**/api/alert/*', { data: true, message: 'ok' }).as('patchAlert');

    cy.get('[data-cy="alert-banner-edit"]').should('be.visible').click();

    cy.get('[data-cy="systemMessage-input"]').should('be.visible').type('Test message');

    cy.get('[data-cy="systemMessage-button-spara"]').contains('Spara').should('be.visible').click();

    // Wait for the PATCH request to complete
    cy.wait('@patchAlert').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
    });
  });

  it('Opens and removes system message', () => {
    cy.intercept('DELETE', '**/api/alert/0', { data: true, message: 'success' }).as('deleteAlert');
    // open
    cy.get('[data-cy="alert-banner-edit"]').should('be.visible').click();

    // remove
    cy.get('[data-cy="systemMessage-button-taBort"]').should('be.visible').click();

    // confirm
    cy.get('[aria-modal="true"]').contains('Ta bort meddelande').should('be.visible');
    cy.get('[aria-modal="true"] button').contains('Ja').click();

    // assert
    // feedback message
    cy.get('div').contains('Meddelandet har tagits bort').should('be.visible');
    // form is closed
    cy.get('[data-cy="systemMessage-input"]').should('not.exist');
  });
});
