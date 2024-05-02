import { drafts } from '../../../fixtures/orgchange/drafts';
import { beforeEachDraft } from '../../../helpers/orgchange/beforeEachDraft';
import {
  orgChangeOrgStructureToExport,
  orgChangeOrganizationLevel2,
} from '../../../fixtures/orgchange/initialOrganizationToExport';

describe('/hanteraorganisation - ActionHeaderDeleteDraft', () => {
  beforeEach(() => {
    beforeEachDraft();
  });

  it('Export original checked out branch structure', () => {
    cy.intercept('GET', '**/api/orgchange/organization/organizationlevel2/id-hash-Draftname3', {
      data: orgChangeOrganizationLevel2,
      message: 'success',
    }).as('getOrganizationLevel2');
    cy.intercept('GET', '**/api/orgchange/organization?orgIds=29', {
      data: [orgChangeOrgStructureToExport],
      message: 'sucess',
    });
    cy.get('button').contains('Hantera utkastet').click();
    cy.focused().contains('button', 'Exportera förlaga av organisationer').click();
    cy.get('button').contains('Överförmyndarkontoret').click();
  });

  it('Remove draft', () => {
    cy.intercept('DELETE', '**/api/orgchange/draft/id-hash-Draftname3', { data: true, message: 'success' }).as(
      'deleteDraft'
    );
    cy.intercept('GET', '**/api/orgchange/drafts', drafts).as('getDrafts');

    cy.get('button').contains('Hantera utkastet').click();
    cy.focused().contains('button', 'Ta bort utkast').click();

    cy.get('[aria-modal="true"]').contains('Är du säker på att du vill ta bort utkastet?').should('be.visible');
    cy.get('[aria-modal="true"] button').contains('Ja, ta bort').click();

    cy.get('div').contains('Utkastet Draftname3 togs bort').should('be.visible');

    cy.location('pathname', { timeout: 1000 }).should('eq', '/hanteraorganisation');
  });
});
