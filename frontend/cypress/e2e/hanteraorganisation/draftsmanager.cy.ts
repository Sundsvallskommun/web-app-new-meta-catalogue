import { companyOrganizations } from '../../fixtures/orgchange/companyOrganizations';
import { draftNew } from '../../fixtures/orgchange/draftNew';
import { drafts } from '../../fixtures/orgchange/drafts';

describe('/hanteraorganisation', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/orgchange/drafts', drafts).as('getDrafts');

    cy.visit('/hanteraorganisation');
  });

  it('Has main and h1', () => {
    cy.wait('@getDrafts').then(() => {
      cy.get('main').should('exist');
      cy.get('h1').should('exist');
    });
  });

  it('Clicking logo goes to /hanteraorganisation', () => {
    cy.get('a[aria-label="Masterdata Hantera organisation"]').click();
    cy.location('pathname').should('match', /\/hanteraorganisation$/);
  });

  it('Lists drafts', () => {
    cy.wait('@getDrafts').then(() => {
      cy.get('.orgchange-cards .card-list').should('exist').find('.card').should('have.length', 5);

      cy.get('button[title="Lista"]').click();
      cy.get('.sk-zebratable-tbody-tr').filter(':visible').should('have.length', 5);
    });
  });

  it('Filter drafts', () => {
    cy.wait('@getDrafts').then(() => {
      cy.get('.orgchange-cards .card-list').should('exist').find('.card').should('have.length', 5);

      // searchfield
      cy.get('input[aria-label="Sök organisationsförändringar"]').type('Draftname-approved');
      cy.get('.orgchange-cards .card-list').should('exist').find('.card').should('have.length', 1);
      cy.get('input[aria-label="Sök organisationsförändringar"]').clear();
      cy.get('.orgchange-cards .card-list').should('exist').find('.card').should('have.length', 5);

      // phase
      cy.get('select[name="phase"]').should('be.visible');
      cy.get('select[name="phase"]').select('Godkänd och väntar på export').wait(1000);
      cy.get('.orgchange-cards .card-list').should('exist').find('.card').should('have.length', 1);
      cy.get('select[name="phase"]').select('Godkänd och exporteras').wait(1000);
      cy.get('.orgchange-cards .card-list').should('exist').find('.card').should('have.length', 1);
      cy.get('select[name="phase"]').select('Export behöver uppmärksamhet').wait(1000);
      cy.get('.orgchange-cards .card-list').should('exist').find('.card').should('have.length', 1);
      cy.get('select[name="phase"]').select('Exporterad och arkiverad').wait(1000);
      cy.get('.orgchange-cards .card-list').should('exist').find('.card').should('have.length', 1);
      cy.get('select[name="phase"]').select('Alla förändringar').wait(1000);
      cy.get('.orgchange-cards .card-list').should('exist').find('.card').should('have.length', 5);

      // timerange
      cy.get('select[name="timeRange"]').should('be.visible');
      cy.get('select[name="timeRange"]').select('Senaste året').wait(1000);
      cy.get('.orgchange-cards .card-list').should('exist').find('.card').should('have.length', 4);
      cy.get('select[name="timeRange"]').should('be.visible');
      cy.get('select[name="timeRange"]').select('Skapad datum (alla)').wait(1000);
      cy.get('.orgchange-cards .card-list').should('exist').find('.card').should('have.length', 5);
    });
  });

  it('Create new draft', () => {
    cy.intercept('POST', '**/api/orgchange/draft', { data: 'id-hash-Draftname3', message: 'success' }).as('postDraft');
    cy.intercept('GET', '**/api/orgchange/draft/id-hash-Draftname3', { data: draftNew, message: 'success' }).as(
      'getDraft'
    );
    cy.intercept('GET', '**/api/orgchange/draft/id-hash-Draftname3/tree', { data: [], message: 'success' }).as(
      'getOrgTree'
    );
    cy.intercept('GET', '**/api/orgchange/draft/comments/id-hash-Draftname3', { data: [], message: 'success' }).as(
      'getOrgTree'
    );
    cy.intercept('GET', '**/api/mdviewer/organization/1/company', {
      data: companyOrganizations,
      message: 'success',
    }).as('getCompanyOrganizations');

    cy.wait('@getDrafts').then(() => {
      cy.get('button[data-cy="orgchange-new-draft"]').should('exist').click();

      cy.get('select[data-cy="orgchange-choose-company"]').should('be.visible');
      cy.get('select[data-cy="orgchange-choose-company"]').select('Sundsvalls kommun');

      cy.get('button[type="submit"]').click();

      // wait for load draft page
      cy.get('input[data-cy="orgchange-draft-name"]').wait(1000).should('exist').type('Draftname3');
      cy.get('input[data-cy="orgchange-draft-cutOffDate"]').should('exist').type('3050-01-01');

      cy.get('button[data-cy="draft-submit"]').click();

      cy.wait('@getDraft').then(() => {
        cy.location('pathname', { timeout: 100 }).should('eq', '/hanteraorganisation/utkast/id-hash-Draftname3');
      });
    });
  });

  it('Remove draft', () => {
    cy.wait('@getDrafts').then(() => {
      cy.intercept('DELETE', '**/api/orgchange/draft/id-hash-1', { data: true, message: 'success' }).as('deleteDraft1');
      cy.intercept('DELETE', '**/api/orgchange/draft/id-hash-2', { data: true, message: 'success' }).as('deleteDraft2');

      cy.get('button[title="Hantera utkast Draftname"]').click();
      cy.get('[role="menuitem"]').contains('Ta bort').click();

      cy.get('[aria-modal="true"]').contains('Är du säker på att du vill ta bort utkastet?').should('be.visible');
      cy.get('button').contains('Ja, ta bort').click();
      cy.get('div').contains('Utkastet Draftname togs bort').should('be.visible');

      cy.get('button[title="Lista"]').click();

      cy.get('button[title="Hantera utkast Draftname2"]').click();
      cy.get('[role="menuitem"]').contains('Ta bort').click();
      cy.get('[aria-modal="true"]').contains('Är du säker på att du vill ta bort utkastet?').should('be.visible');
      cy.get('button').contains('Ja, ta bort').click();
      cy.get('div').contains('Utkastet Draftname2 togs bort').should('be.visible');
    });
  });
});
