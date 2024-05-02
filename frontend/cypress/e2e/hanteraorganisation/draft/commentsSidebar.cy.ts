//import { orgChangeCommentNew } from '../../../fixtures/orgchange/commentNew';
import { userPatched } from '../../../fixtures/mockUserPatched';
import { orgChangeComments } from '../../../fixtures/orgchange/comments';
import { beforeEachDraft } from '../../../helpers/orgchange/beforeEachDraft';

describe('/hanteraorganisation - CommentsSidebar', () => {
  beforeEach(() => {
    beforeEachDraft({
      intercepts: () => {
        cy.intercept('GET', '**/api/orgchange/draft/comments/id-hash-Draftname3', {
          data: orgChangeComments,
          message: 'success',
        }).as('getDraftComments');

        cy.intercept('PATCH', '**/api/me', userPatched).as('patchMe');
      },
    });
    cy.wait('@getDraftComments');
    cy.contains('button', 'Kommentarer').click();
  });

  it('Post draft comment', () => {
    cy.intercept('POST', '**/api/orgchange/draft/comment', { data: true, message: 'sucess' }).as('postDraftComment');

    cy.get('.comment-input').within(() => {
      cy.get('input').type('writing a comment');
      cy.get('button').click();
    });
  });

  it('Edit draft comment', () => {
    cy.intercept('PUT', '**/api/orgchange/draft/comment/**', { data: true, message: 'sucess' }).as('editDraftComment');

    cy.get('.context-menu-wrapper button[title="Redigera Kommentar"]').click();
    cy.contains('button', 'Ändra kommentar').click();

    cy.get('.comment-input').within(() => {
      cy.get('input').clear();
      cy.get('input').type('updating a comment');
      cy.get('button').click();
    });
  });
  it('Delete draft comment', () => {
    cy.intercept('DELETE', '**/api/orgchange/draft/comment/**', { data: true, message: 'sucess' }).as(
      'deleteDraftComment'
    );

    cy.get('.context-menu-wrapper button[title="Redigera Kommentar"]').click();
    cy.contains('button', 'Ta bort').click();

    cy.get('div').contains('Din kommentar togs bort').should('be.visible');
  });
});
