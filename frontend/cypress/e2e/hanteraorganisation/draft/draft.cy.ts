import { drafts } from '../../../fixtures/orgchange/drafts';
import { beforeEachDraft } from '../../../helpers/orgchange/beforeEachDraft';

describe('/hanteraorganisation - Draft', () => {
  beforeEach(() => {
    beforeEachDraft({ orgTree: [] });
    cy.wait('@getDraft');
  });

  it('Has main and h1', () => {
    cy.get('main').should('exist');
    cy.get('h1').should('exist');
  });

  it('Clicking logo goes to /hanteraorganisation', () => {
    cy.intercept('GET', '**/api/orgchange/drafts', drafts).as('getDrafts');

    cy.get('a[aria-label="Masterdata Hantera organisation"]').click();
    cy.get('h1').contains('Organisationsförändringar (5)').should('be.visible');
    cy.location('pathname', { timeout: 10000 }).should('match', /\/hanteraorganisation$/);
  });

  it('Change draft name and date', () => {
    cy.intercept('PUT', '**/api/orgchange/draft/**/proddate', { data: true, message: 'success' }).as(
      'putDraftChangeProdDate'
    );
    cy.intercept('PUT', '**/api/orgchange/draft/**/cutoffdate', { data: true, message: 'success' }).as(
      'putDraftChangeCutOffDate'
    );
    cy.intercept('PUT', '**/api/orgchange/draft/**/rename', { data: true, message: 'success' }).as('putDraftRename');

    cy.get('#orgchange-draft-cutOffDate').type('2099-01-01');
    cy.get('#orgchange-draft-name').clear();
    cy.get('#orgchange-draft-name').type('Draftname33');

    cy.get('button[data-cy="draft-submit"]').click();

    cy.get('div').contains('Utkastet sparas').should('be.visible');
  });
});
