import { user } from '../../fixtures/mockUser';
import { drafts } from '../../fixtures/orgchange/drafts';
import { rapporteraSystemfelFeedback } from '../../fixtures/rapporteraSystemfelFeedback';

describe('Nav header', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/me', user).as('getMe');
    cy.visit('/');
  });

  it('should have a visible header', () => {
    cy.get('[data-cy="nav-header"]').should('be.visible');
  });

  it('should have correct page title', () => {
    cy.get('span#page-title').should('be.visible').and('have.text', 'Masterdata');
  });

  it('should have usermenu showing the name', () => {
    cy.get('.sk-usermenu').contains('Mel Eli').should('be.visible').click();
    cy.get('.sk-usermenu-body').should('be.visible');
    cy.get('.sk-usermenu-body').contains('Rapportera fel').should('be.visible').click();
    cy.get('div[aria-modal="true"]').contains('Rapportera fel').should('be.visible');
  });

  const menuItemLabels = ['Rapportera fel', 'Hantera organisation', 'Logga ut'];

  it('should show usermenu body when opened', () => {
    // Click the button.usermenu-header to open the dropdown menu
    menuItemLabels.forEach((label) => {
      it(`should show the "${label}"`, () => {});
    });
  });

  // Loop through the menuItemLabels array
  menuItemLabels.forEach((label) => {
    // Only perform the test for the 'Rapportera fel' menu item
    if (label === 'Rapportera fel') {
      it(`should show "${label}" popup when clicked`, () => {
        cy.intercept('POST', '**/api/feedback', rapporteraSystemfelFeedback);

        // Click the button.usermenu-header to open the dropdown menu
        cy.get('.sk-usermenu').contains('Mel Eli').should('be.visible').click();

        // Check if the dropdown menu is visible
        cy.get('.sk-usermenu-body').should('be.visible');

        // Find the menu item by its label and click on it
        cy.get('.usermenu-item').contains(label).click();

        // Check if the modal/popup with the title 'Rapportera fel' is visible
        cy.contains('Rapportera fel').should('be.visible');

        cy.contains('select', 'Övrigt (IT)').should('be.visible');

        cy.contains('select', 'Övrigt (IT)').select('Anställd kopplad till fel organisation (HR)');

        cy.contains('select', 'Anställd kopplad till fel organisation (HR)').should('be.visible');

        cy.get('[data-cy="nav-button-avbryt"]').contains('Avbryt').should('be.visible');

        cy.contains('label', 'Detaljbeskrivning').should('be.visible');

        cy.get('[data-cy="nav-textArea"]').type('This is a test value.');

        cy.get('[data-cy="nav-textArea"]')
          .should('have.attr', 'placeholder', 'Beskrivning...')
          .then(($textarea) => {
            const textareaValue = String($textarea.val());
            if (textareaValue.trim() === '') {
              cy.get('[data-cy="nav-button-rapportera"]')
                .contains('Rapportera')
                .should('be.visible')
                .and('be.disabled');
            } else {
              cy.get('[data-cy="nav-button-rapportera"]')
                .contains('Rapportera')
                .should('be.visible')
                .and('not.be.disabled');
            }
          });

        // Click the "Rapportera" button
        cy.get('[data-cy="nav-button-rapportera"]').contains('Rapportera').click();

        // // Ensure the modal/popup is closed
        cy.get('h4[id="headlessui-dialog-title-:r1m:"]').should('not.exist');
      });
    }

    // Perform the test for the 'Hantera organisation' menu item
    if (label === 'Hantera organisation') {
      it(`should navigate to the correct page when "${label}" is clicked`, () => {
        cy.intercept('GET', '**/api/orgchange/drafts', drafts).as('getDrafts');

        // Intercept the network request made when navigating to the desired page
        cy.visit('/');

        // Click the button.usermenu-header to open the dropdown menu
        cy.get('.sk-usermenu').contains('Mel Eli').should('be.visible').click();

        // Check if the dropdown menu is visible
        cy.get('.sk-usermenu-body').should('be.visible');

        // Find the menu item by its label and click on it
        cy.get('.usermenu-item').contains(label).click();

        // // Wait for the URL to change to the expected path
        cy.location('pathname').should('eq', '/hanteraorganisation');
      });
    }

    if (label === 'Logga ut') {
      it(`should navigate to the correct page when "${label}" is clicked`, () => {
        cy.intercept('GET', '**/me', user).as('getMe');
        // Click the button.usermenu-header to open the dropdown menu
        cy.get('.sk-usermenu').contains('Mel Eli').should('be.visible').click();

        // Check if the dropdown menu is visible
        cy.get('.sk-usermenu-body').should('be.visible');

        // Find the menu item by its label and click on it
        cy.get('.usermenu-item').contains(label).click();

        // // // // Wait for the URL to change to the expected path
        cy.wait('@getMe');
        cy.url().should('contain', '/logout');
      });
    }
  });
});
